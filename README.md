angularjs-nodejs-passportjs-rememberMe
======================================

This is an example of how to do user authentication with "Remember Me" functionality using AngularJS on the client and node and PassportJS on the server.

## Overview

One of the first things I wanted to do when building an app using AngularJS was create a login page which had a "Remember Me" type functionality. I also wanted to use it in conjunction with PassportJS, which I use for all user authentication.

Using AngularJS you are able to use cookies but they expire as soon as the session is over (which was obviously of no use for my purposes). The solution was to manually set the cookie in the document using the service ‘$remember’. On the server side, the Passport authentication looks at the request headers for the cookie then authorizes and creates a user session if one if found.

The code is commented up so hopefully it all makes sense. If not please let me know.

## Additional

The example only uses the $remember service to set the cookie. Wherever you decide you want to put the logout function you will also have to call the $forget service to remove it.

**Disclaimer**

This isn't meant to be a fully functioning app but more an example of how it can be done. Please take the code "as is".
