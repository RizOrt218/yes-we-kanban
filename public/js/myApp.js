// this defines module since it is taking 2 arguments
// external dependencies go inside the []
angular.module('myApp', ['ngRoute']);

var myApp = angular.module('myApp');

myApp
.config(['MoviesProvider', '$routeProvider', function(MoviesProvider,$routeProvider) {
  MoviesProvider.setEndPoint('http://localhost:3001/api/movies');

  $routeProvider
    .when('/',{
      templateUrl : 'views/default.html'
    })
    .when('/books', {
      templateUrl  : 'views/books.html',
      controller : 'BooksController'
    })
    .when('/movies', {
      templateUrl  : 'views/movies.html',
      controller : 'MoviesController'
    })
    .when('/other', {
      templateUrl  : 'views/other.html',
      controller : 'OtherController'
    });

}])
.run(['$rootScope', 'APP_VERSION', function($rootScope, APP_VERSION){
  // initialize
  // root scope is like global scope
  $rootScope.APP_VERSION = APP_VERSION;
}]);

