(function() {
	'use strict';
	angular.module('app')
	.factory('UserFactory', UserFactory);

	UserFactory.$inject = ['$http', '$q'];

	function UserFactory($http, $q) {

		// UserFactory Operations shortcuts

		var o = {};
		o.status = {};
		if(getToken()) {
			o.status.isLoggedIn = true;
			o.status.firstName = getFirstName();
			o.status.lastName = getLastName();
			o.status.userImg = getUserImg();
			o.status.username = getUserName();
		} else { o.status.firstName = "Sign In"; }
		o.setToken = setToken;
		o.getToken = getToken;
		o.removeToken = removeToken;
		o.register = register;
		o.login = login;
		o.logOut = logOut;
		return o;

		// Functions list

		// Register User and Log them in

		function register(user) {
			var q = $q.defer();
			$http.post('/v1/api/Users/Register', user).success(function(res) {
				setToken(res.token);
				o.status.isLoggedIn = true;
				q.resolve();
			});
			return q.promise;
		}

		// Login User

		function login(user) {
			var u = { username: user.username.toLowerCase(), password: user.password};
			var q = $q.defer();
			$http.post('/v1/api/Users/Login', u).success(function(res) {
				setToken(res.token);
				o.status.isLoggedIn = true;
				q.resolve();
			});
			return q.promise;
		}

		// Logout User

		function logOut() {
			o.status.isLoggedIn = false;
			removeToken();
			o.status.firstName = "Sign In";
		}

		// Put Token in Client Storage

		function setToken(token) {
			localStorage.setItem('token', token);
			o.status.firstName = getFirstName();
			o.status.lastName = getLastName();
			o.status.username = getUserName();
			o.status.userImg = getUserImg();
		}

		// Get token from Client Storage

		function getToken() {
			return localStorage.token;
		}

		// Remove Token from Client

		function removeToken() {
			localStorage.removeItem('token');
			o.status.username = null;
		}

		// Get Actual First Name

		function getFirstName() {
			return JSON.parse(atob(getToken().split('.')[1])).firstName;
		}

		// Get Actual Last Name

		function getLastName() {
			return JSON.parse(atob(getToken().split('.')[1])).lastName;
		}

		// Get User Name

		function getUserName() {
			return JSON.parse(atob(getToken().split('.')[1])).username;
		}


		function getUserImg() {
			return JSON.parse(atob(getToken().split('.')[1])).userImg;
		}
	}
})();
