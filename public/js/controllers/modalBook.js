var ModalBookCtrl = function ($scope, $modalInstance, $compile, $translate, book, APIservice) {
	$scope.details_view = book;
	if(book.published) {
		$scope.details_view.published = new Date(book.published).getFullYear();
	}
	$scope.remove = function () {
		$modalInstance.close('remove');
	};
	$scope.sendRequest = function (owner) {
		//console.log(username);
		APIservice.users.read(function(data) {
			APIservice.messages.send(owner.username, data.email, data.username, book, function(data) {
				console.log('message sent');
				/*for(var i = 0; i < $scope.owners.length; i++ ) {
					if($scope.owners[i].username == owner.username) {
					}
				}*/
				owner.style = true;
				owner.message = $translate('HOME.MODAL.REQUEST_SENT');
			});
		});
	};
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
	$scope.owners = [];
	$scope.draw_map = function()
	{
		var options={
			elt:document.getElementById('map'),       /*ID of element on the page where you want the map added*/ 
			zoom:2,                                  /*initial zoom level of the map*/ 
			latLng:{lat:30, lng:-30},   /*center of map in latitude/longitude */ 
			mtype:'map',                              /*map type (osm)*/ 
			bestFitMargin:0,                          /*margin offset from the map viewport when applying a bestfit on shapes*/ 
			zoomOnDoubleClick:true                    /*zoom in when double-clicking on map*/ 
		};
		$scope.map = new MQA.TileMap(options);
		APIservice.books.readById($scope.details_view._id, function(data) {
			console.log(data.users);
			for(var i = 0; i < data.users.length; i++) {
				if(data.users[i].loc.coordinates && data.users[i].loc.coordinates.length == 2 && data.users[i].loc.coordinates != [-30, 30]) {
					//console.log(data.users[i]);
					//console.log(data.users[i].loc.coordinates[1] + ' ' + data.users[i].loc.coordinates[0]);
					var point = new MQA.Poi( {lat: data.users[i].loc.coordinates[1], lng: data.users[i].loc.coordinates[0]} );
					//point.setRolloverContent('<button class="btn btn-success" ng-click="sendRequest()">' + $translate('HOME.MODAL.REQUEST') + '</button>');
					//point.setInfoContentHTML('<button class="btn btn-success" ng-click="sendRequest()">' + $translate('HOME.MODAL.REQUEST') + '</button>');
					//console.log($compile('<button class="btn" ng-click="sendRequest()">ahoj</button>')($scope)[0].outerHTML);
					point.setRolloverContent(data.users[i].username);
					$scope.owners.push({username: data.users[i].username, style: false, message : $translate('HOME.MODAL.REQUEST')});
					//point.setRolloverContent('<div request=""></div>');
					$scope.map.addShape(point);
				}
				$scope.map.bestFit(false, 4, 12);
			}
		});
	};
};
