var app = angular.module('ideaApp', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  
  $stateProvider
    .state('home', {
      url: '/',
      controller: 'homeController',
      templateUrl: '/partials/home.html'
    })
    .state('idea', {
      url: '/idea/:id',
      controller: 'ideaController',
      templateUrl: '/partials/idea.html'
    });
});
