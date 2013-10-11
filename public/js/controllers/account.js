function accountControl($scope, $http, $location, $translate, APIservice) {
	var map_width = $("#map_row").width();
	$("#map").css("width", map_width);
	$("#cross").css("left", map_width/2 -18);
	$scope.centerLat = 30;
	$scope.centerLng = -30;
	$scope.save_loc_text = $translate('ACCOUNT.SAVE_LOC');
	$scope.saveLoc = function() {
		$scope.save_loc_text = $translate('ACCOUNT.SAVING');
		APIservice.users.update({action:'loc', lng: $scope.centerLng, lat: $scope.centerLat}, function (data, stat) {
			$scope.save_loc_text = $translate('ACCOUNT.SAVED_LOC');

		});
	};
	$scope.save_pass_text = $translate('ACCOUNT.CHANGE.CHANGE');
	$scope.savePass = function() {
		if($scope.new_password != $scope.new_password_again) {
			$scope.change_pass_message = $translate('ACCOUNT.CHANGE.NOTEQUAL');
		}
		else if($scope.new_password && $scope.new_password.length < 6) {
			$scope.change_pass_message = $translate('ACCOUNT.CHANGE.SHORT');
		}
		else {
		$scope.save_pass_text = $translate('ACCOUNT.CHANGE.CHANGING');
		APIservice.users.read(function(data) {
			if(data.username && data.email) {
				old_hash_username = CryptoJS.SHA3($scope.old_password + data.username, {outputLength: 256 });
				old_hash_email = CryptoJS.SHA3($scope.old_password + data.email, {outputLength: 256 });
				hash_username = CryptoJS.SHA3($scope.new_password + data.username, {outputLength: 256 });
				hash_email = CryptoJS.SHA3($scope.new_password + data.email, {outputLength: 256 });
				console.log(old_hash_username);
				console.log(hash_username);
				APIservice.users.update({action:'pass', old_password_username: old_hash_username.toString(), old_password_email: old_hash_email.toString(), password_username: hash_username.toString(), password_email: hash_email.toString()}, function (data, stat) {
					if(stat == 404) {
						$scope.change_pass_message = $translate('ACCOUNT.CHANGE.INCORRECT');
						$scope.save_pass_text = $translate('ACCOUNT.CHANGE.CHANGE');
					}
					else {
						$scope.change_pass_message = '';
						$scope.save_pass_text = $translate('ACCOUNT.CHANGE.CHANGED');
					}
				});
			}
		});
		}
	};
	var loadLoc = function (callback) {
		$scope.$apply(function() {
			APIservice.users.read(function(data) {
				if(data.loc.coordinates.length == 2) {
					$scope.centerLat = data.loc.coordinates[1];
					$scope.centerLng = data.loc.coordinates[0];
					console.log(data.loc);
					console.log($scope.centerLat + ' ' + $scope.centerLng);
					console.log(data.loc.coordinates[1] + ' ' + data.loc.coordinates[0]);
					$scope.map.setCenterAnimate(new MQA.LatLng($scope.centerLat, $scope.centerLng), 11,{totalMs:100,steps:1});
				}
			});
		});
	};
	$scope.draw_map = function()
	{
		$.getScript("http://open.mapquestapi.com/sdk/js/v7.0.s/mqa.toolkit.js?key=Fmjtd%7Cluub250r2g%2Caa%3Do5-9u8wl4", function() {
		var options={
			elt:document.getElementById('map'),       /*ID of element on the page where you want the map added*/ 
			zoom:2,                                  /*initial zoom level of the map*/ 
			latLng:{lat:30, lng:-30},   /*center of map in latitude/longitude */ 
			mtype:'map',                              /*map type (osm)*/ 
			bestFitMargin:0,                          /*margin offset from the map viewport when applying a bestfit on shapes*/ 
			zoomOnDoubleClick:true                    /*zoom in when double-clicking on map*/ 
		};
		$scope.map = new MQA.TileMap(options);
		MQA.withModule('largezoom','viewoptions','geolocationcontrol','insetmapcontrol','mousewheel', function() {
			$scope.map.addControl(
				new MQA.LargeZoom(),
				new MQA.MapCornerPlacement(MQA.MapCorner.TOP_LEFT, new MQA.Size(5,5))
				);
			$scope.map.enableMouseWheelZoom();
		});
		MQA.EventManager.addListener($scope.map, 'move', update_loc);
		MQA.EventManager.addListener($scope.map, 'drag', update_loc);
		MQA.EventManager.addListener($scope.map, 'dragend', update_loc);
		MQA.EventManager.addListener($scope.map, 'click', update_loc);
		MQA.EventManager.addListener($scope.map, 'doubleclick', update_loc);
		MQA.EventManager.addListener($scope.map, 'zoomend', update_loc);
		console.log('calling loadLoc()');
		loadLoc();
		console.log('end loadLoc()');
		});
	};
	var update_loc = function (){
		$scope.$apply(function() {
		$scope.centerLat = $scope.map.getCenter().lat;
		$scope.centerLng = $scope.map.getCenter().lng;
		});
	};
}
