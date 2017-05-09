var myApp = angular.module('postInfoApp', []);
myApp.controller('postInfoAppCtrl', ['$scope', '$http', function($scope, $http) {
	
	var postIdcontroller = false;
	var postcontroller = false;
	$scope.getPostId = function(postId) {

		postIdcontroller = postId.postId;

		$http.get('/posts/getPostforEdit/'+postIdcontroller).then(function(response) {

		postIdcontroller = response.data;
		const subs = response.data.subs;
		$scope.subsList = [];

		for (var key in subs) {

			sub = {
				approvalStatus: 'null',
				name: subs[key].name,
				username: subs[key].username,
				PDFloc: subs[key].PDFloc,
				approveDisable: false, 
				rejectDisable: false
			};

			//console.log(subs[key]);
			$http.get('/users/getUserApprovalStatusHM/'+(subs[key].username)+'/'+ response.data.name).then(function(response) {

				sub.approvalStatus = response.data.status;
				if (sub.approvalStatus == 'approved') {

					sub.approveDisable = true;
					sub.rejectDisable = false;
				}
				else if (sub.approvalStatus == 'rejected') {

					sub.approveDisable = false;
					sub.rejectDisable = true;
				}
			});

			($scope.subsList).push(sub);
		}
	});
	};

	$scope.approveOrReject = function(username, approveOrReject) {

		$http.put('/users/approveOrReject/'+username+"/"+postIdcontroller.name, {approveOrReject}).then(function(response) {

			console.log(response.data.updatedUser.subsmade[0]);
			$http.put('/posts/changeLnumber/'+postIdcontroller.name, {approveOrReject}).then(function(response) {

				console.log(response.data.msg);
				$scope.message = "updated!!! refresh to see approval update on page!";
			});
		});
	};

	
}]);
