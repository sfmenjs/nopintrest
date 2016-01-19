(function() {
	'use strict';
	angular.module('app')
	.factory('HomeFactory', HomeFactory);

	HomeFactory.$inject = ['UserFactory', '$http', '$q'];

	function HomeFactory(UserFactory, $http, $q) {

		// UserFactory Operations shortcuts

		var o = {};
		o.posts = [];
		o.addPost = addPost;
		o.deletePost = deletePost;
		o.getPost = getPost;
		getPosts();
		return o;

		// Functions list

		// Add New Post

		function addPost(post) {
			var q = $q.defer();
			$http.post('/v1/api/Post', post).success(function(res){
				post._id = res.id;
				post.dateCreated = new Date();
				o.posts.push(post);
				q.resolve();
			}).error(function(res) {
				q.reject(res);
			});
			return q.promise;
		}

		// Delete Post by ID

		function deletePost(post) {
			var q = $q.defer();
			$http.post('/v1/api/deletePost/' + post._id).success(function(res) {
				o.posts.splice(o.posts.indexOf(post), 1);
				q.resolve();
			});
			return q.promise;
		}

		// Retrieve Post by ID

		function getPost(id) {
			var q = $q.defer();
			$http.get('/v1/api/Post/' + id).success(function(res) {
				q.resolve(res);
			});
			return q.promise;
		}

		// Retrieve all Posts

		function getPosts() {
			$http.get('/v1/api/Post').success(function(res) {
				for (var i = 0; i < res.length; i += 1) {
					res[i].dateCreated = new Date(res[i].dateCreated);
					o.posts.push(res[i]);
				}
			});
		}
	}
})();
