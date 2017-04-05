angular.module('app', [])
    .controller('AppController', function($scope, AppService) {

        // Denna ligger på scopet så går att nå överallt, alltså slipper skriva ctrl. innan
        $scope.hej = 'hej';

        var ctrl = this;

        ctrl.searchForMovies = function (val) {
            AppService.getMovies(val)
                .then(function (result) {
                    console.log(result.data);
                    if (result.data.Response === 'True') {
                        ctrl.searchResult = angular.copy(result.data.Search);
                    } else {
                        ctrl.searchResult = 'hittade nada'
                    }
                }, function () {
                    console.log('attans');
                });
        };
    })

    .service('AppService', function ($http) {
        this.getMovies = function(title) {
            var url = 'http://www.omdbapi.com/?s=' + (title === undefined ? '' : title) + '';

            return $http({
                url : url,
                method : 'GET'
            });
        }
    });