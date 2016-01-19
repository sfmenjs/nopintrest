(function() {
	'use strict';
	angular.module('app')
	.controller('IndexController', IndexController);

	IndexController.$inject = ['HomeFactory', 'UserFactory'];

	function IndexController(HomeFactory, UserFactory) {

		// Declarations

		var ix = this;
		ix.status = UserFactory.status;

		// Functions list

	}
})();
