'use strict';
function accountControl($rootScope, $location, $scope, $translate, Users, Utils) {

	//redirect to '/' if not signed in
	if(!$rootScope.authenticated){
		$location.path("/");
	}

	//// Sets width of the map, is needed in IE
	var map_width = $("#map_row").width();
	$("#map").css("width", map_width);
	$("#cross").css("left", map_width / 2 - 18);

	//// set default coordinates
	$scope.centerLat = 30;
	$scope.centerLng = -30;

	//// Save location
	$scope.save_loc_text = $translate.instant('ACCOUNT.SAVE_LOC');
	$scope.saveLoc = function() {
		$scope.save_loc_text = $translate.instant('ACCOUNT.SAVING');
		Users.updateLocation([$scope.centerLng, $scope.centerLat]).success(function(user) {
				$rootScope.user = user;
				//marker to the map
				var point = new MQA.Poi({lat: $scope.centerLat, lng: $scope.centerLng});
				point.setIcon(new MQA.Icon("img/poi_small.gif", 21, 32));
				$scope.map.removeAllShapes();
				$scope.map.addShape(point);
		}).error(function(error){
			console.log(error);
		})['finally'](function(){
			$scope.save_loc_text = $translate.instant('ACCOUNT.SAVED_LOC');
		});
	};

	//// Search location via addresss - geocoding
	$scope.searchLoc = function(address) {
		var addr = address || $scope.searchAddress;
		MQA.withModule('nominatim', function() {
			MQA.Nominatim.processResults = function(results, map) {
				if(results.length === 0){
					//// if address was not found, I try searching without number at the end e.g. Praha instead of Praha 5
					if(/[ ][0-9]+$/.test(addr)){
						addr = addr.replace(/[ ][0-9]$/, "");
						$scope.searchLoc(addr);
					} else{
						$scope.$apply(function() {
							$scope.not_found_message = $translate.instant('ACCOUNT.NOT_FOUND');
						});
					}
				} else{
					$scope.not_found_message = undefined;
					map.setCenter(new MQA.LatLng(results[0].lat, results[0].lon), 11, {totalMs: 100, steps: 1});
				}
			};
			$scope.map.nominatimSearchAndAddLocation(addr, null);
		});
	};

	//// Download MQA script and draw map
	$scope.draw_map = function()
	{
		$.getScript("http://open.mapquestapi.com/sdk/js/v7.0.s/mqa.toolkit.js?key=Fmjtd%7Cluub250r2g%2Caa%3Do5-9u8wl4", function() {
			var options = {
				elt: document.getElementById('map'), /*ID of element on the page where you want the map added*/
				zoom: 2, /*initial zoom level of the map*/
				latLng: {lat: 30, lng: -30}, /*center of map in latitude/longitude */
				mtype: 'map', /*map type (osm)*/
				bestFitMargin: 0, /*margin offset from the map viewport when applying a bestfit on shapes*/
				zoomOnDoubleClick: true                    /*zoom in when double-clicking on map*/
			};
			$scope.map = new MQA.TileMap(options);
			MQA.withModule('largezoom', 'viewoptions', 'geolocationcontrol', 'insetmapcontrol', 'mousewheel', function() {
				$scope.map.addControl(
						new MQA.LargeZoom(),
						new MQA.MapCornerPlacement(MQA.MapCorner.TOP_LEFT, new MQA.Size(5, 5))
						);
				$scope.map.enableMouseWheelZoom();
			});
			MQA.EventManager.addListener($scope.map, 'move', update_loc);
			MQA.EventManager.addListener($scope.map, 'drag', update_loc);
			MQA.EventManager.addListener($scope.map, 'dragend', update_loc);
			MQA.EventManager.addListener($scope.map, 'click', update_loc);
			MQA.EventManager.addListener($scope.map, 'doubleclick', update_loc);
			MQA.EventManager.addListener($scope.map, 'zoomend', update_loc);
			loadLoc();
		});
	};

	//// load location if it is set and redraw map to that location
	var loadLoc = function(callback) {
		$scope.$apply(function() {
			if($rootScope.user.loc.coordinates.length === 2){
				$scope.centerLng = $rootScope.user.loc.coordinates[0];
				$scope.centerLat = $rootScope.user.loc.coordinates[1];

				$scope.map.setCenter(new MQA.LatLng($scope.centerLat, $scope.centerLng), 11, {totalMs: 100, steps: 1});
				$scope.map.setZoomLevel(11);
				var point = new MQA.Poi({lat: $scope.centerLat, lng: $scope.centerLng});
				var icon = new MQA.Icon("img/poi_small.gif", 21, 32);
				point.setIcon(icon);
				$scope.map.addShape(point);
			}
		});
	};

	//// Binding of $scope.center... with map coordinates, called upon any change, might be superfluous now, I can call $scope.map.getCenter only when saving coordinates
	var update_loc = function() {
		if(!$scope.$$phase){
			$scope.$apply(function() {
				$scope.centerLat = $scope.map.getCenter().lat;
				$scope.centerLng = $scope.map.getCenter().lng;
				$scope.save_loc_text = $translate.instant('ACCOUNT.SAVE_LOC');
			});
		} else{
			$scope.centerLat = $scope.map.getCenter().lat;
			$scope.centerLng = $scope.map.getCenter().lng;
			$scope.save_loc_text = $translate.instant('ACCOUNT.SAVE_LOC');
		}
	};

	//// Password changing 
	$scope.save_pass_text = $translate.instant('ACCOUNT.CHANGE.CHANGE');
	$scope.savePass = function() {
		if($scope.new_password !== $scope.new_password_again){
			$scope.change_pass_message = $translate.instant('ACCOUNT.CHANGE.NOTEQUAL');
		}
		else if($scope.new_password && $scope.new_password.length < 6){
			$scope.change_pass_message = $translate.instant('ACCOUNT.CHANGE.SHORT');
		}
		else{
			$scope.save_pass_text = $translate.instant('ACCOUNT.CHANGE.CHANGING');

			Users.updatePassword(Utils.encrypt($scope.new_password)).success(function() {
				$scope.change_pass_message = '';
				$scope.save_pass_text = $translate.instant('ACCOUNT.CHANGE.CHANGED');
			}).error(function() {
				$scope.change_pass_message = $translate.instant('ACCOUNT.CHANGE.INCORRECT');
				$scope.save_pass_text = $translate.instant('ACCOUNT.CHANGE.CHANGE');
			});
		}
	};
	//// Google Analytics
	ga('send', 'pageview', '/account');
}
