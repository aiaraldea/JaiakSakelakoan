'use strict';

// Declare app level module which depends on filters, and services
angular.module('com.aiaraldea.jaiak', [
  'firebase',
  'ngRoute',
  'ngSanitize',
  'textAngular',
  'ui.bootstrap',
  'com.aiaraldea.jaiak.filters',
  'com.aiaraldea.jaiak.services',
  'com.aiaraldea.jaiak.directives',
  'com.aiaraldea.jaiak.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/festivals', {templateUrl: 'partials/partial1.html', controller: 'FestivalCtrl as festivalCtrl'});
  $routeProvider.otherwise({redirectTo: '/festivals'});
}]);
