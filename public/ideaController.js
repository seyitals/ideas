app.controller('homeController', function($scope, $http, $state, $stateParams, Ideas) {

  Ideas.getAll().then(function(result) {
    $scope.ideas = result.data;
  }, function(err) {
    console.log(err);
  });

  $scope.formData = {};
  $scope.createIdea = function() {
    if (Object.keys($scope.formData).length > 0) {
      Ideas.addIdea($scope.formData).then(function(res) {
        $state.reload();
      }, function(err){
        console.log(err);
      });
    }
  };

  $scope.deleteIdea = function(ideaId) {
    alert("Are you sure you want to delete this idea?");
    if (confirm("Are you sure you want to delete this idea?")) {
      Ideas.delete(ideaId).then(function(res) {
        $state.reload();
      }, function(err){
        console.log(err);
      });
    }
    else {
      $state.reload();
    }
  };

}).controller('ideaController', function($scope, $http, $location, $state, $stateParams, Ideas) {
  var ideaId = $stateParams.id;
  Ideas.getOneIdea(ideaId).then(function(res) {
    $scope.idea = res.data;
    $scope.editFormData = {
      name: $scope.idea.name,
      kind: $scope.idea.kind
    };
    }, function(err) {
      console.log(err);
  });

  $scope.editIdea = false;
  $scope.showEditForm = function(){
    $scope.editIdea = true;
  }

  $scope.save = function() {
    Ideas.update(ideaId, $scope.editFormData).then(function(res) {
      $state.reload();
    }, function(err){
      console.log(err);
    });
  };

});
