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

(function() {
	'use strict';
	angular.module('app')
	.controller('HomeController', HomeController);

	HomeController.$inject = ['HomeFactory', 'UserFactory', '$state'];

	function HomeController(HomeFactory, UserFactory, $state) {

		// Declarations

		var vm = this;
		vm.logOut = UserFactory.logOut;
		vm.posts = HomeFactory.posts;

		vm.delete = function (post) {
			HomeFactory.deletePost(post).then(function (){
				$state.go('home');
				HomeFactory.getPost();
			});
		};

	}
})();

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

angular.module('app').controller('TestCtrl', ["$scope", "$modal", function ($scope, $modal) {

  $scope.open = function (post) {

    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      resolve: {
        post: function () {
          return post;
        }
      }
    });
  };
}]);

angular.module('app').controller('ModalInstanceCtrl', ["$scope", "$modalInstance", "post", function ($scope, $modalInstance, post) {
  $scope.post = post;

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);

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

angular.module('app').filter('searchFilter', function() {
   return function(items, word) {
    if(!word) return items;
    var filtered = [];

    var pushed;
    angular.forEach(items, function(item) {
      if(item.hasOwnProperty('title'))
        if(item.title.toLowerCase().indexOf(word.toLowerCase()) !== -1){
            filtered.push(item);
            return;
        }
      if(item.hasOwnProperty('hashtag'))
        if(item.hashtag.join().toLowerCase().indexOf(word.toLowerCase()) !== -1) {
          filtered.push(item);
          return;
        }
      if(item.username.toLowerCase().indexOf(word.toLowerCase()) !== -1) {
        filtered.push(item);
      }
    });

    return filtered;
  };
});
