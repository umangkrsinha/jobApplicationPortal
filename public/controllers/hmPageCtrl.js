var myApp = angular.module('myHMPageApp', []);

myApp.controller('HMPageAppCtrl', ['$scope', '$http', function($scope, $http) {

var refresh = function() {

	$http.get('/posts/getpostList').then(function(response) {

		$scope.showCreateButton = true;
		$scope.postList = response.data;
	});
};
	$scope.post = {};

	$scope.remove = function(id) {

		$http.delete('/posts/remove/' + id).then(function(response) {

			refresh();
		});
	}; 

	$scope.edit = function(id) {

		$http.get('/posts/getPostforEdit/'+id).then(function(response) {

			$scope.post = response.data;
			$scope.showCreateButton = false;
		});
	};

	$scope.update = function() {

		return;
	};

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
			if (response.data.success) {

				var nameOfFile = response.data.name;
				
				if ($scope.post._id == undefined){
					$scope.post.quest = nameOfFile;
					$http.post('/posts/create', $scope.post).then(function(responseNew) {

						$scope.message = responseNew.data.msg;
						$scope.post = {};
						refresh();
					});
				}
				else if ($scope.post._id != undefined) {

					$http.get('/posts/remove/'+$scope.post.quest).then(function(response) {

						if (response.data.success) {

							$scope.post.quest = nameOfFile;
							$http.put('/posts/update/'+$scope.post._id, $scope.post).then(function(response) {

								$scope.message = response.data.msg;
								console.log(response.data.msg);
								refresh();
							});
						}
					});

				}
			}
			else {

				$scope.message = 'File not uploaded check console for more info';
				console.log(response.data.msg);
				refresh();
			}
		});
	};

refresh();

}]);
