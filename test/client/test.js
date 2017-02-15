describe('Testing Languages Service', function(){ 
  var IdeaService, $httpbackend;

  var ideaObj = {
    name: 'fly boat',
    kind: 'personal'
  };

  beforeEach(angular.mock.module('ideaApp'));
  beforeEach(angular.mock.module('ui.router'));

  beforeEach(inject(function(Ideas, $injector){ 
    IdeaService = Ideas;
    $httpBackend = $injector.get('$httpBackend');
  }));

  it('should return all items', function() { 
    expect(IdeaService.getAll).toBeDefined(); 
  }); 

  it('should post idea', function() {
    $httpBackend.expectPOST('/api/ideas', ideaObj).respond(200, 'Successful');
    IdeaService.addIdea(ideaObj);
    $httpBackend.flush();
  });

});

describe('Idea Home Controller', function(){
  var controller, scope;

  beforeEach(angular.mock.module('ideaApp'));
  beforeEach(inject(function($controller){
    scope = {};
    controller = $controller('homeController', {
      $scope: scope
    });
  }));

  it('should be defined', function() {
    expect(controller).toBeDefined();
  });

  it('should have createIdea defined', function() {
    expect(scope.createIdea).toBeDefined();
  });

});
