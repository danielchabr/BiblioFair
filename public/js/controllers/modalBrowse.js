'use strict';
var ModalBrowseCtrl = function($rootScope, $scope, $modalInstance, $translate, book, Library, Books) {
	$scope.details_view = book;
	//if(book.published){
	//	$scope.details_view.published = new Date(book.published).getFullYear();
	//}
	$scope.report = function() {
		if(!$scope.report_sent){
			Books.report(book._id).success(function(data) {
				$scope.report_sent = true;
				ga('send', 'event', 'Report', 'Book reported');
			});
		}
	};
	$scope.sendRequest = function(owner) {
		console.log($rootScope.user.username + " " + owner.username);
		if ($rootScope.user.username === owner.username) {
			$rootScope.notify($translate.instant('HOME.MODAL.REQUEST_YOURSELF'));
		} else {
			$rootScope.approve(undefined, $translate.instant('HOME.MODAL.REQUEST_APPROVE'), function () {
				Books.request($rootScope.user.username, owner.username, book._id, $rootScope.user.language).success(function(data) {
					owner.style = true;
					owner.message = $translate.instant('HOME.MODAL.REQUEST_SENT');
					console.log(data);

					ga('send', 'event', 'Request', 'Sent request');
				}).error(function(error) {
					$rootScope.notify(error);
					console.log(error);
				});
			});
		}
	};
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
	$scope.owners = [];
	$scope.draw_map = function() {
		var map_width = $("#map_row").width();
		$("#map").css("width", map_width);
		var options = {
			elt: document.getElementById('map'), /*ID of element on the page where you want the map added*/
			zoom: 2, /*initial zoom level of the map*/
			latLng: {lat: 30, lng: -30}, /*center of map in latitude/longitude */
			mtype: 'map', /*map type (osm)*/
			bestFitMargin: 0, /*margin offset from the map viewport when applying a bestfit on shapes*/
			zoomOnDoubleClick: true                    /*zoom in when double-clicking on map*/
		};
		$scope.map = new MQA.TileMap(options);
		MQA.withModule('largezoom', 'viewoptions', 'insetmapcontrol', 'mousewheel', function() {
			$scope.map.addControl(
				new MQA.LargeZoom(),
				new MQA.MapCornerPlacement(MQA.MapCorner.TOP_LEFT, new MQA.Size(5, 5))
				);
//$scope.map.enableMouseWheelZoom();
		});
		Books.get($scope.details_view._id).success(function(data) {
			for (var i = 0; i < data.users.length; i++){
				var new_user = {username: data.users[i].username, style: false, message: $translate.instant('HOME.MODAL.REQUEST')}
				for (var j = 0; j < data.users[i].library.length; j++){
					if(data.users[i].library[j].id === $scope.details_view._id){
						new_user.actions = data.users[i].library[j].actions;
						new_user.note = data.users[i].library[j].note;
					}
				}
				if(data.users[i].loc.coordinates && data.users[i].loc.coordinates.length == 2 && data.users[i].loc.coordinates != [-30, 30]){
					var point = new MQA.Poi({lat: data.users[i].loc.coordinates[1], lng: data.users[i].loc.coordinates[0]});
					var icon = new MQA.Icon("img/poi_small.gif", 21, 32);
					point.setIcon(icon);
					point.setRolloverContent(data.users[i].username);
					$scope.map.addShape(point);
				}
				$scope.owners.push(new_user);
				$scope.map.bestFit(false, 4, 12);
				$scope.map.setZoomLevel($scope.map.zoom - 1);
			}
		});
	};
};
