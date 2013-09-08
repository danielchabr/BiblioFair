function accountControl($scope, $http, $location, $translate, APIservice) {
	$scope.centerLat = 30;
	$scope.centerLng = -30;
	$scope.save_text = $translate('ACCOUNT.SAVE');
	$scope.save = function() {
		$scope.save_text = $translate('ACCOUNT.SAVING');
		APIservice.users.update({lng: $scope.centerLng, lat: $scope.centerLat}, function (data, stat) {
			$scope.save_text = $translate('ACCOUNT.SAVED');

		});
	};
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
	};
	$scope.draw_map();
	APIservice.users.read(function(data) {
		if(data.loc.coordinates.length == 2) {
			$scope.centerLat = data.loc.coordinates[1];
			$scope.centerLng = data.loc.coordinates[0];
			$scope.map.setCenterAnimate(new MQA.LatLng($scope.centerLat, $scope.centerLng), 11,{totalMs:100,steps:1});
		}
	});
	MQA.withModule('largezoom','viewoptions','geolocationcontrol','insetmapcontrol','mousewheel', function() {
		$scope.map.addControl(
			new MQA.LargeZoom(),
			new MQA.MapCornerPlacement(MQA.MapCorner.TOP_LEFT, new MQA.Size(5,5))
			);
		//$scope.map.addControl(new MQA.ViewOptions());
		$scope.map.addControl(
			new MQA.GeolocationControl(),
			new MQA.MapCornerPlacement(MQA.MapCorner.TOP_RIGHT, new MQA.Size(10,10))
			);
		/*Inset Map Control options*/ 
		$scope.map.enableMouseWheelZoom();
	});
	var update_loc = function (){
		$scope.centerLat = $scope.map.getCenter().lat;
		$scope.centerLng = $scope.map.getCenter().lng;
		$scope.$apply();
	};
	MQA.EventManager.addListener($scope.map, 'move', update_loc);
	MQA.EventManager.addListener($scope.map, 'drag', update_loc);
	MQA.EventManager.addListener($scope.map, 'click', update_loc);
	MQA.EventManager.addListener($scope.map, 'doubleclick', update_loc);
	MQA.EventManager.addListener($scope.map, 'zoomend', update_loc);
}
