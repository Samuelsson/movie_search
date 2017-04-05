angular.module('app')
    .controller('AppController', function($window, AppService) {

        // Saving 'this' to a variable making it much easier to use inside functions.
        // Easier transitions away from $scope as well.
        var vm = this;

        // Just a simple variable for disabling the search button while
        // waiting for the API Promise to return a result (or other error message).
        vm.searchDisabled = false;

        // An array storing the last 10 searched titles.
        // Will be flushed when page refreshed because it's just JS ;)
        vm.searchHistory = [];

        // To make it easier to manage strings we put them in an object
        var messageStrings = {
            emptyInput: 'You have to type something!',
            noResult: 'No Result!',
            failedSearch: 'Search failed!'
        };

        // The function for enable/disable the search button.
        // Cleaner to use a function than changing the variable directly.
        function toggleSearchButton() {
            vm.searchDisabled = !vm.searchDisabled;
        }

        // When performing a new search we want to clean all the old values to make it nice and fresh.
        function resetAllValuesToDefault() {
            vm.searchResult = [];
            vm.message = undefined;
            vm.sortBy = 'Title';
            vm.descOrder = false;
        }

        // A simple input validator performed pre API call
        function inputValidator(text) {
            if (text === undefined || text.length < 1) {
                vm.message = messageStrings.emptyInput;
                return false;
            } else {
                return true;
            }
        }

        // The function making the API Call through the service to OMDB
        function performOMDBMovieSearch(movie) {
            AppService.getMovies(movie)
                .then(function (result) {
                    // Let's log a little. You'll never know when you might need it...
                    console.log(result.data);
                    if (result.data.Response === 'True') {
                        vm.searchResult = angular.copy(result.data.Search);
                    } else {
                        vm.message = messageStrings.noResult;
                    }
                    toggleSearchButton();
                }, function () {
                    vm.message = messageStrings.failedSearch;
                    toggleSearchButton();
                });
        }

        // Adding the last searched title to an array.
        // Checking if already is the last one searched for and if the list is to long.
        function addToSearchHistory (searchTerm) {
            var historyLength = vm.searchHistory.length;
            if (vm.searchHistory[historyLength -1] === searchTerm) {
                // We do nothing :) the term is already the latest
            } else if (vm.searchHistory.length >= 10) {
                // If the list is to long we remove the oldest entry before adding the new one.
                vm.searchHistory.shift();
                vm.searchHistory.push(searchTerm);
            } else {
                vm.searchHistory.push(searchTerm);
            }
        }

        // The function run when pressing the search button, hopefully performing the movie search.
        vm.submitSearch = function (val) {
            toggleSearchButton();
            resetAllValuesToDefault();

            // Validating the input before trying to make an API call.
            if (inputValidator(val)) {
                var escapedVal = encodeURIComponent(val);
                performOMDBMovieSearch(escapedVal);
                addToSearchHistory(val);
            } else {
                toggleSearchButton();
            }
        };

        // The function for sorting the list in desc or asc order.
        // Keeping the last order if changing to another column.
        vm.sortList = function (name) {
            if (vm.sortBy === name) {
                vm.descOrder = !vm.descOrder;
            }
            vm.sortBy = name;
        };

        // The requirement spec requested the whole table tr to be a link
        // This opens a new tab linking to the requested movie on iMDB.
        // Beautiful? Nope! - Gets the job done? Yes!
        vm.openImdbLink = function(imdbId){
            $window.open('http://www.imdb.com/title/' + imdbId + '/', '_blank');
        };

        // A function checking the sort order of a column in the result table.
        // Returning CSS classes depending of the state.
        vm.sortOrderArrow = function (name) {
            if (vm.sortBy !== name) {
                return 'hidden';
            }
            return vm.descOrder ? '' : 'rotated';
        };

    });