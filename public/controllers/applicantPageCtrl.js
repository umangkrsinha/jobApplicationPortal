var myApp = angular.module('myApplicantPageApp', []);

myApp.controller('ApplicantPageCtrl', ['$scope', '$http', function($scope, $http) {

	$scope.post = {};
var refresh = function() {

	$http.get('/posts/getpostList').then(function(response) {

		const posts = response.data;
		$scope.FileInput = {};
		var postsList = [];
		$http.get('/users/getUser').then(function(response) {

			for (var i = 0; i < posts.length; i++) {

				post = {

					_id: posts[i]._id,
					name: posts[i].name,
					quest: posts[i].quest,
					Lnumber: posts[i].Lnumber,
					applyDisable: false
				};

				for (var j = 0; j < posts[i].subs.length; j++) {

					subs = posts[i].subs;
					if (subs[j].username == response.data.user.username) {

						post.applyDisable = true;
						break;
					}
					else if (subs[j].username != response.data.user.username) {

						post.applyDisable = false;
					}
				}

				postsList.push(post);
			}

			$scope.postList = postsList;
		});
		
	});
};

	$scope.submit = function(id, postName) {

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

			if (response.data.success){
				
				const nameOfFile = response.data.name;
				$http.put('/users/applyForPost/'+nameOfFile+"/"+postName).then(function(response) {

					if (response.data.success) {

						$http.put('/posts/applyForPost/'+id+"/"+nameOfFile).then(function(response) {

							$scope.message = response.data.msg;
							refresh();
						});
					}
				});
			}
		});
	};

refresh();

}]);
