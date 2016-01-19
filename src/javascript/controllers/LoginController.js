(function() {
	'use strict';
	angular.module('app')
	.controller('LoginController', LoginController);

	LoginController.$inject = ['UserFactory', '$window', '$state'];

	function LoginController(UserFactory, $window, $state) {

		// Declarations

		var vm = this;
		vm.user = {};
		vm.status = UserFactory.status;
		vm.login = login;
		vm.register = register;
		vm.logOut = UserFactory.logOut;

		// Functions list 

		// Login User from Login.html

		function login() {
			UserFactory.login(vm.user).then(function() {
				$state.go('home');
			});
		}

		// Register New User from Register.html

		function register() {
			var u = vm.user;
			if(!u.username || !u.firstName || !u.lastName || !u.password || !u.cpassword || (u.password !== u.cpassword)) {
				$window.alert("Please complete all fields");
				return false;
			}
			UserFactory.register(u).then(function() {
				vm.user = {};
				$state.go('home');
			});
		}
	}
})();
