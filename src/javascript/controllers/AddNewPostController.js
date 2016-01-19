(function() {
	'use strict';
	angular.module('app')
	.controller('AddNewPostController', AddNewPostController);

	AddNewPostController.$inject = ['HomeFactory', 'UserFactory', '$state'];

	function AddNewPostController(HomeFactory, UserFactory, $state) {

		// Declarations

		var vm = this;

		// Functions Lista
		// Add New Post

		vm.addPost = function () {
			vm.post.username = UserFactory.status.username;
			vm.post.userImg = UserFactory.status.userImg;
			HomeFactory.addPost(vm.post).then(function() {
				vm.post = {};
				$state.go('home');
			});
		};
	}})();
