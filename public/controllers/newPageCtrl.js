var myApp = angular.module('myNewPageApp', []);

myApp.controller('NewPageAppCtrl', ['$scope', '$http', function($scope, $http) {

	console.log('This is the newPage controller');

	$scope.post = {};
	$scope.submit = function() {

		var formData = new FormData;

		var file = $('#file')[0].files[0];
		formData.append('uploadedFile', file);
		console.log(file);

		$http.post('/files', formData, {

			transformRequest: angular.identity,
			headers: {
				'Content-Type': undefined
			}
		}).then(function(response) {

			console.log('Controller submitted PDF to server');
			console.log(response.data);
		});
	};
}]);
