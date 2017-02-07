var app = angular.module('ideaApp', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/home');
  
  $stateProvider
    .state('home', {
      url: '/',
      controller: 'homeController'
      templateUrl: '/partials/home.html'
    })
    .state('idea', {
      url: '/idea',
      controller: 'ideaController'
      templateUrl: '/partials/idea.html'
    });
});
