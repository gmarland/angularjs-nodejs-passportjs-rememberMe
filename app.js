var express = require('express');  

var LocalStrategy = require('passport-local').Strategy;

var app = express();

app.configure(function() {
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ secret: 'MYSECRET' }));
  app.use(passport.initialize());
  app.use(passport.session());
});

// Fire up node

var http = require('http').createServer(app).listen(8080);

// Functions for handling users

var users = require('./node_data_access/controllers/users');

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  users.getById(id, function(err, user) {
    done(err, user);
  });
});

// Local strategy for managing user authentication

passport.use(new LocalStrategy({ passReqToCallback: true },
  function(req, username, password, done) {
    // Check if the user is currently logged in and if so, use that user
    if (req.isAuthenticated()) {
      var authenticatedUser = {
        _id: req.user._id, 
        username: req.user.username
      }
      
      return done(null, authenticatedUser);
    }
    // Not logged in? Are you trying to authenticate then? Is there a username and password to try to log in
    else if ((username.trim().length > 0) && (password.trim().length > 0)) {
      users.getByUsername(username, function(err, user) {
        if (err) {
          return done(err, false, { message: 'Incorrect username.' });
        }

        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }

        if (user.password != password) {
          return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user);
      });
    }
    // Ok, is there a cookie available then? seach for the cookie and try to authenticate with the stored user id
    else {
      var cookies = [];

      req.headers.cookie && req.headers.cookie.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
      });

      if(cookies["my_cookie_name"]) {
        users.getById(cookies["my_cookie_name"], function(err, user) {
          if ((err) || (!user)) {
            return done(null, null);
          }
          else {
            return done(null, user);
          }
        });
      }
      else {
        return done(null, null);
      }
    }
  }
));

// Getting the index

app.get('/', function(req,res) { res.sendfile('./app/index.html'); });

// Regular user authentication

app.post('/auth', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return res.send({ status: "failed", message: err.message});
    }
    else if (!user) {
      return res.send({ status: "failed", message: info.message});
    }
    else {
      req.logIn(user, function(err) {
        if (err) return res.send({ status: "failed", message: err.message});
        
        user.password = null;

        return res.send({ status: "success", user: user });
      });
    }
  })(req, res, next);
});

// Log out the current user (cookie removal is done on the client)

app.del('/auth', function(req, res, next) {
  req.logout();
  req.session.destroy();

  return res.send({ status: "success" });
});

// Checking if someone is currrently authenticated, call this at the start of every page to check for the user

app.get('/checkAuthenticated', function(req, res, next) {
  if (req.isAuthenticated()) {
    var authenticatedUser = {
      _id: req.user._id, 
      username: req.user.username
    }
    
    return res.send({ status: "success", user: user });
  }
  else {
    var cookies = [];

    req.headers.cookie && req.headers.cookie.split(';').forEach(function( cookie ) {
      var parts = cookie.split('=');
      cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
    });

    if(cookies["my_cookie_name"]) {
      users.getById(cookies["my_cookie_name"], function(err, user) {
        if (user) {
          req.login(user, function(err) {
            return res.send({ status: "success", user: user });
          });
        }
        else {
          return res.send({ status: "failed" });
        }
      });
    }
    else {
        return res.send({ status: "failed" });
    }
  }
});