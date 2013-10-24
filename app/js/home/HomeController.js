'use strict';

angular.module('exampleApp', []).controller("HomeCtrl", ['$scope', '$http', '$location', '$remember', function($scope, $http, $location, $remember) {
	$scope.stayLoggedIn = true;

    $scope.loginUser = { username: '', password: '' };

	$scope.authenticateUser = function() {
		if (((this.loginUser.username) && (this.loginUser.username.trim().toLowerCase().length > 0)) && ((this.loginUser.password) && (this.loginUser.password.trim().toLowerCase().length > 0))) {
			var that = this;

			// Set up the user for authentication
			var selectedUser = {
			    username: this.loginUser.username.trim(),
			    password: this.loginUser.password
			}

			// authenticate the user
			$http.post('/auth', selectedUser).success(function(response) { 
				if (response.status.trim().toLowerCase() == "success") {
					// Check if the user wants to remain logged in and store a cookie if so
					if (that.stayLoggedIn) {
						$remember('my_cookie_name', response.user._id);
					}

					// Forward on to the authenticated portion of the app
					$location.path("/authenticated")
				}
				else {
					that.loginUser.password = "";
					that.createUser.password = "";
				}	
			});
		}
	}
}]);