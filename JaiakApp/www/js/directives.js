'use strict';

/* Directives */
angular.module('com.aiaraldea.jaiak.directives', []).
        directive('dateConverter', ['$filter', function($filter) {
            var dateFilter = $filter('date');
            return {
              require: 'ngModel',
              restrict: 'A',
              link: function(scope, element, attr, ngModel) {
                ngModel.$parsers.push(function(date) {
                  return dateFilter(date, 'yyyy-MM-dd');
                });
              }
            };
          }]).
        directive('appVersion', ['version', function(version) {
            return function(scope, elm, attrs) {
              elm.text(version);
            };
          }]);

