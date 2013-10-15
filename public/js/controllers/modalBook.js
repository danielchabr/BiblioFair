var ModalBookCtrl = function ($scope, $modalInstance, $translate, book, APIservice) {
	$scope.details_view = book;
	console.log($scope.details_view);
	if(book.published) {
		$scope.details_view.published = new Date(book.published).getFullYear();
	}
	///// LIBRARY
	$scope.updateActions = function () {
		APIservice.library.update($scope.details_view._id, $scope.details_view.actions, function(data) {
		});
	};
	$scope.remove = function () {
		$modalInstance.close('remove');
	};
	//// HOME
	$scope.report = function () {
		if(!$scope.report_sent) {
			APIservice.users.read(function(data) {
				APIservice.messages.reportBook(data.email, data.username, book, function(data) {
					$scope.report_sent = true;
				});
			});
		}
	};
	$scope.sendRequest = function (owner) {
		APIservice.users.read(function(data) {
			APIservice.messages.send(owner.username, data.email, data.username, book, data.language, function(data) {
				console.log('message sent');
				owner.style = true;
				owner.message = $translate('HOME.MODAL.REQUEST_SENT');
			});
		});
	};
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
	$scope.owners = [];
	$scope.draw_map = function() {
		var map_width = $("#map_row").width();
		$("#map").css("width", map_width);
		var options={
			elt:document.getElementById('map'),       /*ID of element on the page where you want the map added*/ 
			zoom:2,                                  /*initial zoom level of the map*/ 
			latLng:{lat:30, lng:-30},   /*center of map in latitude/longitude */ 
			mtype:'map',                              /*map type (osm)*/ 
			bestFitMargin:0,                          /*margin offset from the map viewport when applying a bestfit on shapes*/ 
			zoomOnDoubleClick:true                    /*zoom in when double-clicking on map*/ 
		};
		$scope.map = new MQA.TileMap(options);
		MQA.withModule('largezoom','viewoptions','insetmapcontrol','mousewheel', function() {
			$scope.map.addControl(
				new MQA.LargeZoom(),
				new MQA.MapCornerPlacement(MQA.MapCorner.TOP_LEFT, new MQA.Size(5,5))
				);
			//$scope.map.enableMouseWheelZoom();
		});
		APIservice.books.readById($scope.details_view._id, function(data) {
			console.log(data.users);
			for(var i = 0; i < data.users.length; i++) {
				var new_user = {username: data.users[i].username, style: false, message : $translate('HOME.MODAL.REQUEST')}
				for(var j = 0; j < data.users[i].library.length; j++) {
					if(data.users[i].library[j].id == $scope.details_view._id) {
						new_user.actions = data.users[i].library[j].actions;
					}
				}
				if(data.users[i].loc.coordinates && data.users[i].loc.coordinates.length == 2 && data.users[i].loc.coordinates != [-30, 30]) {
					var point = new MQA.Poi( {lat: data.users[i].loc.coordinates[1], lng: data.users[i].loc.coordinates[0]} );
					point.setRolloverContent(data.users[i].username);
					$scope.map.addShape(point);
				}
				$scope.owners.push(new_user);
				$scope.map.bestFit(false, 4, 12);
				$scope.map.setZoomLevel($scope.map.zoom-1);
			}
		});
	};
};
