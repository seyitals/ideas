app.controller('recipesController', function($scope, $http, $location, $cookies, Ideas) {

    $scope.getRecipes = function() {
      Recipes.getApprovedRecipes()
        .success(function(data) {
          console.log(data, 'data');
          $scope.recipes = data;
        })
        .error(function(data) {});
    };

    function isInArray(array, search) {
      return (array.indexOf(search) >= 0) ? true : false;
    }

    $scope.currentPage = 1;
    $scope.pageSize = 6;

    $scope.likeRecipe = function(recipe) {
      var cookie = $cookies.get('user');
      if (cookie) {
        $rootScope.rootUser = JSON.parse(cookie);
      }

      var userId = $rootScope.rootUser.userdetails._id;
      var likesArray = recipe.likes;
      if (isInArray(likesArray, userId)) {
        toastr.warning('You can only like a recipe once');
        return;
      }
      likesArray.push(userId);
      Recipes.like(recipe)
        .success(function(data) {
          this.likes = data.likes.length;
        })
        .error(function(err) {});
    };

    $scope.sort = function() {
      Recipes.getApprovedRecipes(true)
        .success(function(data) {
          $scope.recipes = data;
          console.log($scope.recipes);
        })
        .error(function(data) {});
    };

  })
  .controller('fullRecipeController', function($scope, $http, $location, Recipes, $routeParams) {
    var recipeId = $routeParams.id;
    Recipes.getOneRecipe(recipeId)
      .success(function(res) {
        if ((res.name === 'CastError')) {
          $location.path('/');
          return;
        }
        $scope.recipes = res;
      })
      .error(function(res) {});

      $scope.back = function(){
        $location.path('/recipes');
      }
  })
  .controller('recipeController', function($scope, $http, $rootScope, $location, $cookies, $upload, toastr, Recipes) {
    var cookie = $cookies.get('user');
    if (!cookie) {
      $location.path('/login');
    } else {
      $rootScope.rootUser = JSON.parse(cookie);
    }


    $scope.fileSelected = function(files) {
      if (files && files.length) {
        if (files[0].size <= 102400) {
          $scope.file = files[0];
        } else {
          toastr.warning('File too large, enter an image less than 1MB or continue without an image');
          $scope.file = undefined;
        }
      }
    };

    $scope.createRecipe = function() {
      $scope.formData = {
        name: $scope.formData.name,
        prepTime: $scope.formData.prepTime,
        cookTime: $scope.formData.cookTime,
        ingredients: $scope.formData.ingredients,
        method: ($scope.formData.method).split('.')
      };

      $upload.upload({
        url: '/api/recipes',
        data: {
          data: $scope.formData,
          token: $rootScope.rootUser.tokengen
        },
        file: $scope.file
      }).progress(function(evt) {
        $scope.loading = true;
      }).success(function(data) {
        $scope.loading = false;
        toastr.success('Recipe successfully added and will be visible to others after approval');
        $location.path('/userRecipes');
      });
    };
  })
  .controller('approveController', function($scope, $http, $rootScope, $location, $cookies, Recipes) {

    var cookie = $cookies.get('user');
    if (!cookie) {
      $location.path('/login');
    } else {
      $rootScope.rootUser = JSON.parse(cookie);
    }

    $scope.getRecipes = function() {
      Recipes.getAll()
        .success(function(data) {
          $scope.recipes = data;
        })
        .error(function(data) {});
    };

    $scope.approve = function(recipeId, index) {
      Recipes.approve(recipeId)
        .success(function(res) {
          $scope.recipes[index].approved = true;
          $scope.message = res.message;
        })
        .error(function(res) {});
    }
  })
  .controller('userRecipeCtrl', function($scope, $http, $rootScope, $location, $cookies, Recipes, ModalService, $upload) {
    var cookie = $cookies.get('user');
    if (!cookie) {
      $location.path('/login');
    } else {
      $rootScope.rootUser = JSON.parse(cookie);
    }

    Recipes.getUserRecipes($rootScope.rootUser.userdetails._id)
      .success(function(data) {
        if (data.length === 0) {
          $scope.response = 'You do not have any recipe';
        }
        $scope.recipes = data;
      })
      .error(function(data) {});

    $scope.deleteRecipe = function(recipeId, index) {
      swal({
        title: "Are you sure?",
        text: "You will not be able to recover this recipe!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel plx!",
        closeOnConfirm: false,
        closeOnCancel: false
      }, function(isConfirm) {
        if (isConfirm) {
          Recipes.delete(recipeId)
            .success(function(res) {
              console.log(res.message);
              $scope.recipes.splice(index, 1);
            })
            .error(function(res) {});
          swal("Deleted!", "Your recipe has been deleted.", "success");
        } else {
          swal("Cancelled", "Your recipe is safe :)", "error");
        }
      });

    };

    $scope.editRecipe = function(recipe, index) {
      Recipes.getOneRecipe(recipe._id).then(
        function(response) {
          var edittedRecipe = {
            name: response.data.name,
            prepTime: response.data.prepTime,
            cookTime: response.data.cookTime,
            ingredients: response.data.ingredients,
            method: response.data.method.join(),
            user: response.data.user
          }

          ModalService.showModal({
            templateUrl: "modal.html",
            controller: "edit",
            inputs: {
              'recipe': edittedRecipe
            }
          }).then(function(modal) {

            modal.element.modal();
            modal.close.then(function(result) {
              $scope.recipe = result['result'];
              $scope.newImage = result.file;
              $scope.recipe.method = result.result.method.split('.');

              $upload.upload({
                url: '/api/recipes/' + recipe._id,
                data: {
                  data: $scope.recipe
                },
                file: $scope.newImage
              }).progress(function(evt) {}).success(function(data) {
                $scope.recipes[index] = data.data;
                $scope.message = data.message || data.error;
              });
            });
          });
        });
    };
  })
  .controller('edit', ['$scope', 'ModalService', 'recipe', 'Recipes', 'close', 'toastr', function($scope, ModalService, recipe, Recipes, close, toastr) {

    $scope.fileSelectedForEdit = function(files) {
      if (files && files.length) {
        if (files[0].size <= 102400) {
          $scope.file = files[0];
        } else {
          toastr.warning('File too large, enter an image less than 1MB or continue without an image');
          $scope.file = undefined;
        }
      }
    };

    $scope.newRecipe = angular.copy(recipe); // creates a copy of recipe and assign it to the editted recipe
    // close, but give 500ms for bootstrap to animate
    $scope.save = function() {
      close({
        result: $scope.newRecipe,
        file: $scope.file
      }, 500);
    };

    $scope.cancel = function() {
      close(recipe, 500); // ignore edit and return old recipe
    };
  }]);
