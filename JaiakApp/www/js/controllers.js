'use strict';

/* Controllers */
angular.module('com.aiaraldea.jaiak.controllers', ['com.aiaraldea.jaiak.services', 'ui.bootstrap', 'dialogs']).
        controller('FestivalCtrl', ['$scope', 'festivalProvider', '$dialogs', function($scope, festivalProvider, $dialogs) {
            $scope.safeApply = function(fn) {
              var phase = this.$root.$$phase;
              if (phase == '$apply' || phase == '$digest') {
                if (fn && (typeof (fn) === 'function')) {
                  fn();
                }
              } else {
                this.$apply(fn);
              }
            };
            festivalProvider.load(function(f) {
              $scope.festivals = f.val();
              $scope.loaded = true;
              $scope.safeApply(function() {
                return;
              });
            });

            $scope.select = function(index) {
              $scope.reset();
              $scope.selectedFestivalContext = {};
              $scope.selectedFestivalContext.index = index;
              $scope.selectedFestivalContext.festival = $scope.festivals[index];
            };

            $scope.reset = function() {
              $scope.selectedFestivalContext = null;
            };
            $scope.styleClass = function() {
              var clazz = '';
              if ($scope.selectedFestivalContext != null) {
                clazz = clazz + ' hidden-xs';
              }
              if ($scope.selectedFestivalContext != null && $scope.selectedFestivalContext.selectedDay != null) {
                clazz = clazz + ' hidden-sm';
              }
              clazz = clazz + ' col-md-4 col-sm-6';
              return clazz;
            };
            $scope.back = function() {
              if ($scope.selectedFestivalContext != null) {
                if ($scope.selectedFestivalContext.selectedDay != null) {
                  $scope.selectedFestivalContext.selectedDay = null;
                } else {
                  $scope.selectedFestivalContext = null;
                }
              }
            };
          }]).
        controller('FestivalSelectedCtrl', ['$scope', '$filter', function($scope, $filter) {
            $scope.reset = function() {
              $scope.selectedFestivalContext.selectedDay = null;
            };
            $scope.select = function(index) {
              $scope.reset();
              $scope.selectedFestivalContext.selectedDay = $scope.selectedFestivalContext.festival.days[index];
            };
            $scope.styleClass = function() {
              var clazz = '';
              if ($scope.selectedFestivalContext != null && $scope.selectedFestivalContext.selectedDay != null) {
                clazz = clazz + ' hidden-xs';
              }
              clazz = clazz + ' col-md-4 col-sm-6';
              return clazz;
            };
          }]).
        controller('DaySelectedCtrl', ['$scope', '$filter', function($scope, $filter) {
            $scope.reset = function() {
            };
          }]);