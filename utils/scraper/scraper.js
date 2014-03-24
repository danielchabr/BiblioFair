/*
 *	This script scrapes neoluxor website for all links to books 
 *
 *	Script should be launched with the following command
 *	phantomjs --load-images=false ./scraper.js >> links.txt
 *
 */



var webpage = require('webpage');
var page = webpage.create();

var getBookData;
var getLinksToBooks;


/*getCategories = function () {
	var page = webpage.create();
	page.open('http://neoluxor.cz/', function () {
		page.injectJs('./public/js/lib/jquery-2.0.3.min.js');
		var categories = [];
		page.onConsoleMessage = function (msg) { 
			//console.log(msg); 
			//console.log(msg);
			categories.push(msg);
		};
		page.evaluate( function () {
			$("nav .menu:first, nav .products-submenu").find("span a[href]").each(function(i, el) { 
				console.log($(el).attr("href"));
			});
		});
		var func = function (categories, i, func) {
			if(i < categories.length) {
				getPages(categories[i], func, categories, i);
			}
		};
		getPages(categories[0], func, categories, 0);
		page.close();
	});
};
*/

getPages = function (url, callback, categories, j) {

	var page = webpage.create();

	page.open('http://www.neoluxor.cz' + url, function () {

		page.injectJs('./public/js/lib/jquery-2.0.3.min.js');

		page.onConsoleMessage = function (msg) { 

			var count = parseInt(msg);
			var links = [];

			if(count > 0 && count < 10000) {

				for(var k = 0; k < count; k++) {
					links.push(url + "?b.pagenumber=" + k + "&amp;preserveFilter=1");
				}

				var iterator = function (links, i, iterator) {
					if ( i < links.length ) {
						getLinksToBooks(links[i], links, i, iterator);
					}
				};

				getLinksToBooks(links[0], links, 0, iterator);
			}
		};
		
		setTimeout( function () {
			page.evaluate( function () {
				var numPages = $(".pages a").last().html();
					if(typeof numPages !== 'undefined') {
						console.log(numPages);
					}
			});
			page.close();
		}, 100);
	});
};


getLinksToBooks = function (url, linksToPages, i, callback) {

	var page = webpage.create();

	page.open('http://neoluxor.cz' + url, function () {

		page.injectJs('./public/js/lib/jquery-2.0.3.min.js');
		var links = [];

		page.onConsoleMessage = function (msg) { 
			links.push(msg);
		};

		page.evaluate( function () {
			$('.kniha-metadata').each(function(index, book) {
				console.log($(book).find('h1 a').attr('href'));
			});
		});

		page.close();

		var iterator = function (links, m, iterator) {
			if ( m < links.length ) {
				getBookData(links[m], links, m, iterator);
			}
		};

		getBookData(links[0], links, 0, iterator);
		callback(linksToPages, i+1, callback);
	});
};


getBookData = function (url, links, i, callback) {
	console.log('http://neoluxor.cz' + url);
	callback(links, i+1, callback);
};

getPages('/katalog-knih/');

