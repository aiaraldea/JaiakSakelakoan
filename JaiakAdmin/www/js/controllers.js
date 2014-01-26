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
            $scope.inEdition = null;
            $scope.inEditionIndex = null;

            $scope.edit = function(index) {
              $scope.reset();
              $scope.inEditionIndex = index;
              $scope.inEdition = angular.copy($scope.festivals[index]);
            };
            $scope.select = function(index) {
              $scope.reset();
              $scope.selectedFestivalContext = {};
              $scope.selectedFestivalContext.index = index;
              $scope.selectedFestivalContext.festival = $scope.festivals[index];
            };

            $scope.new = function() {
              $scope.reset();
              $scope.inEdition = {};
            };
            $scope.reset = function() {
              $scope.inEdition = null;
              $scope.inEditionIndex = null;
              $scope.selectedFestivalContext = null;
            };
            $scope.export = function() {
              festivalProvider.save(angular.copy($scope.festivals));
            };

            $scope.confirmDelete = function(index) {
              var dayCount, message, dlg;
              if ($scope.inEdition.days != null) {
                dayCount = $scope.inEdition.days.length;
              }
              if (dayCount > 0) {
                message = 'Jai honek ' + dayCount + ' egun dauka. ';
              } else {
                message = '';
              }
              dlg = $dialogs.confirm('Ezabatu', message + 'Benetan ezabatu nahi duzu?');
              dlg.result.then(function(btn) {
                $scope.confirmed = 'You confirmed "Yes."';
                $scope.festivals.splice(index, 1);
                $scope.reset();
              }, function(btn) {
                $scope.confirmed = 'You confirmed "No."';
              });
            };
          }]).
        controller('FestivalEditionCtrl', ['$scope', function($scope) {
            $scope.save = function() {
              if ($scope.inEditionIndex == null) {
                $scope.festivals.push($scope.inEdition);
              } else {
                $scope.festivals[$scope.inEditionIndex] = $scope.inEdition;
              }
              $scope.reset();
            };
          }]).
        controller('FestivalSelectedCtrl', ['$scope', '$filter', function($scope, $filter) {
            $scope.new = function() {
              $scope.reset();
              $scope.selectedFestivalContext.inEdition = {
                date: $filter('date')(new Date(), 'yyyy-MM-dd'),
                name: 'ddd'
              };
            };
            $scope.edit = function(index) {
              $scope.reset();
              $scope.selectedFestivalContext.inEditionIndex = index;
              $scope.selectedFestivalContext.inEdition = angular.copy($scope.selectedFestivalContext.festival.days[index]);
            };
            $scope.save = function() {
              console.log($scope.selectedFestivalContext.inEdition);
              if ($scope.selectedFestivalContext.festival.days == null) {
                $scope.selectedFestivalContext.festival.days = [];
              }
              if ($scope.selectedFestivalContext.inEditionIndex == null) {
                $scope.selectedFestivalContext.festival.days.push($scope.selectedFestivalContext.inEdition);
              } else {
                $scope.selectedFestivalContext.festival.days[$scope.selectedFestivalContext.inEditionIndex] = $scope.selectedFestivalContext.inEdition;
              }
              $scope.reset();
            };
            $scope.reset = function() {
              $scope.selectedFestivalContext.inEdition = null;
              $scope.selectedFestivalContext.inEditionIndex = null;
              $scope.selectedFestivalContext.selectedDay = null;
              $scope.selectedFestivalContext.eventInEdition = null;
              $scope.selectedFestivalContext.eventInEditionIndex = null;
            };
            $scope.select = function(index) {
              $scope.reset();
              $scope.selectedFestivalContext.selectedDay = $scope.selectedFestivalContext.festival.days[index];
//              $scope.selectedFestivalContext.index = index;
//              $scope.selectedFestivalContext.festival = $scope.festivals[index];
            };
          }]).
        controller('DaySelectedCtrl', ['$scope', '$filter', function($scope, $filter) {
            $scope.reset = function() {
              $scope.selectedFestivalContext.eventInEdition = null;
              $scope.selectedFestivalContext.eventInEditionIndex = null;
            };
            $scope.new = function() {
              $scope.reset();
              $scope.selectedFestivalContext.eventInEdition = {
                time: '12:00',
                name: 'event'
              };
            };
            $scope.edit = function(index) {
              $scope.reset();
              $scope.selectedFestivalContext.eventInEditionIndex = index;
              $scope.selectedFestivalContext.eventInEdition = angular.copy($scope.selectedFestivalContext.selectedDay.events[index]);
            };
            $scope.save = function() {
              console.log($scope.selectedFestivalContext.eventInEdition);
              if ($scope.selectedFestivalContext.selectedDay.events == null) {
                $scope.selectedFestivalContext.selectedDay.events = [];
              }
              if ($scope.selectedFestivalContext.eventInEditionIndex == null) {
                $scope.selectedFestivalContext.selectedDay.events.push($scope.selectedFestivalContext.eventInEdition);
              } else {
                $scope.selectedFestivalContext.selectedDay.events[$scope.selectedFestivalContext.eventInEditionIndex] =
                        $scope.selectedFestivalContext.eventInEdition;
              }
              $scope.reset();
            };
          }]);