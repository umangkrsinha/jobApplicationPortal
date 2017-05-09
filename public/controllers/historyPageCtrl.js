var myApp = angular.module('historyPageApp', []);

myApp.controller('historyPageAppCtrl', ['$scope', '$http', function($scope, $http) {

	console.log('This is the newPage controller');

	$http.get('/users/getUser').then(function(response) {

		$scope.subList = response.data.user.subsmade;
	});
}]);
