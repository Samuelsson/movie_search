angular.module('app')
    .service('AppService', function ($http) {

        // API Resource for fetching movies from OMDB
        this.getMovies = function(title) {
            var url = 'http://www.omdbapi.com/?s=' + (title === undefined ? '' : title) + '&type=movie';

            return $http({
                url : url,
                method : 'GET'
            });
        }

    });