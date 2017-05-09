var myApp = angular.module('myApp', []);

myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {

	$scope.adminPresence = true;
	$scope.loggedIn = false;
	$scope.userIsAdmin = false;

var refresh = function(){

		$http.get('/users/adminPresence').then(function(response) {
			
			$scope.adminPresence = response.data.success;
		});

		$http.get('/checkLogin').then(function(response) {

			$scope.loggedIn = response.data.success;
		});
		$http.get('/users/adminCheck').then(function(response) {

			$scope.userIsAdmin = response.data.success;
		});
	};

	$scope.userLogin = function() {

		$http.post('/users/authenticate', $scope.loginUser).then(function(response) {

			$scope.message = response.data.msg;
			$scope.loginUser = {};
			console.log(response.data);
			refresh();
		});
	};

	$scope.changePage = function() {

		$http.get('/changePage').then(function(response) {

			console.log('changePage was hit and something was returned from the server');
		});
	};

	$scope.logout = function() {

		$http.get('/logout').then(function(response) {

			$scope.loggedIn = !(response.data.success);
			console.log(response.data.msg);
			refresh();
		});
	};

	$scope.adminCheck = function() {

		$http.get('/users/adminCheck').then(function(response) {

			console.log('Here!');
			console.log(response.data);
		});
	};

	$scope.registerUser = function() {


		$http.post('/users/registerUser', $scope.user).then(function(response) {

			console.log('registerUser after recieving response');
			$scope.user = {};
			$scope.message = response.data.msg;
			if (response.data.success) {

				refresh();
			};
		});
	};

	$scope.registerAdmin = function() {


		$http.post('/users/registerAdmin', $scope.admin).then(function(response) {

			console.log('registerAdmin after recieving response');
			$scope.admin = {};
			$scope.message = response.data.msg;
			if (response.data.success) {

				refresh();
			};
		});
	};

refresh();

}]);
