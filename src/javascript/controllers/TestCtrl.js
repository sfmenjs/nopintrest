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
