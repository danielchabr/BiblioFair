'use strict';
// for IE compatibility
if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
	var msViewportStyle = document.createElement("style");
		msViewportStyle.appendChild(
				document.createTextNode(
					"@-ms-viewport{width:auto!important}"
					)
				);
		document.getElementsByTagName("head")[0].appendChild(msViewportStyle);
}

/**
 * TODO get unique books directly from mongo.
 */

var uniqBooks = function (arr, comparator) {
	var arr = arr.sort(comparator);
	var res = [];
	for(var i = 0; i < arr.length; i++) {
		if(arr[i+1] === undefined || comparator(arr[i], arr[i+1]) !== 0) {
			res.push(arr[i]);
		}
	}
	return res;
};
