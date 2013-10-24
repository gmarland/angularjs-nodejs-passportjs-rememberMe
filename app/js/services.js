'use strict';

/* Services */

var app = angular.module('exampleApp.services', []);

// Creates a cookie that expires in a year

app.factory('$remember', function() {
    return function(name, values) {
        var cookie = name + '=';
        
        cookie += values + ';';

        var date = new Date();
        date.setDate(date.getDate() + 365);

        cookie += 'expires=' + date.toString() + ';';

        document.cookie = cookie;
    }
});

// removes the cookie

app.factory('$forget', function() {
    return function(name) {
        var cookie = name + '=;';
        cookie += 'expires=' + (new Date()).toString() + ';';

        document.cookie = cookie;
    }
});