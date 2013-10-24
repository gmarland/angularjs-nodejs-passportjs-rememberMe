'use strict';

/* App Module */
var module = angular.module('main', ['exampleApp', 'exampleAppe.services']);

module.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  	$routeProvider.when('/', { templateUrl: '/partials/home.html', controller: "HomeCtrl"});

  	$locationProvider.html5Mode(true);
}]);