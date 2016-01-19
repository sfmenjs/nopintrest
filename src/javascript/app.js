(function() {
	'use strict';
	angular.module('app', ['ui.router', 'ui.bootstrap'])
	.config(Config);
	Config.$inject = ['$stateProvider', '$urlRouterProvider'];
	function Config($stateProvider, $urlRouterProvider) {
		$stateProvider.state('login', {
			url: '/',
			templateUrl: 'views/Login.html'
		})
		.state('home', {
			url: '/home',
			templateUrl: 'views/Home.html'
		})
		.state('CreateAccount', {
			url: '/createaccount',
			templateUrl: 'views/CreateAccount.html'
		})
		.state('addNewPost', {
			url: '/post',
			templateUrl: 'views/AddNewPost.html'
		}).state('profile', {
			url: '/profile',
			templateUrl: 'views/Profile.html'
		});
 
		$urlRouterProvider.otherwise('/');
	}
})();
