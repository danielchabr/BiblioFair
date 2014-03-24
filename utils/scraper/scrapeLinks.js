/*
 * Script reads links to books from file links.txt and writes book metadata to stdout
 *
 *	Launch script with following command
 *	phantomjs --load-images=false ./scrapeLinks.js >> books.txt
 */

var webpage = require('webpage');
var page = webpage.create();
var fs = require('fs');
var file_h = fs.open('links.txt', 'r');

var line = file_h.readLine();
var getBookData;
var links = [];

while(line) {
	links.push(line);
	line = file_h.readLine(); 
}
file_h.close();

var iterator = function (links, m, iterator) {
	if ( m < links.length ) {
		getBookData(links[m], links, m, iterator);
	}
};

var getLinksToBooks;

getBookData = function (url, links, i, callback) {
	var page = webpage.create();
	page.open(url, function () {
		page.injectJs('./public/js/lib/jquery-2.0.3.min.js');
		page.onConsoleMessage = function (msg) { 
			if(msg.indexOf(';') !== -1) {
				console.log(msg);
			} else {
			}
		};
		var book = page.evaluate( function () {
			var title = $("h1[itemprop='name']").html();
			var author = $("span[itemprop='author'] a").html() || $(".detail-author a").html();
			var isbn = $(".detail-metadata span[itemprop='isbn']").html()
			if (isbn === null) {
				var el = $(".detail-metadata strong:contains('EAN:')");
				if (el.length > 0) {
					isbn = el[0].nextSibling.nodeValue;
				}
			}
			var vydavatel = $(".detail-metadata span[itemprop='publisher']").html();
			var rokVydani = null;
			var el = $(".detail-metadata strong:contains('Rok vydání:')");
			if (el.length > 0) {
				rokVydani = el[0].nextSibling.nodeValue;
			}

			if (rokVydani !== null) {
				rokVydani = rokVydani.trim();
			} else {
				rokVydani = "";
			}
			if (vydavatel !== null) {
				vydavatel = vydavatel.trim();
			} else {
				vydavatel = "";
			}
			if (title !== null) {
				title = title.trim();
			} else {
				title = "";
			}
			if (author !== null) {
				author = author.trim();
			} else {
				author = "";
			}
			if (isbn !== null) {
				isbn = isbn.trim();
				isbn = isbn.replace(/-/g, "");
			} else {
				isbn = "";
			}
			return { 'title': title, 'author': author, 'isbn': isbn, 'rokVydani': rokVydani, 'vydavatel': vydavatel };
		});
		console.log(book.title + ";" + book.author + ";" + book.isbn + ";" + book.rokVydani + ";" + book.vydavatel);
		page.close();
		callback(links, i+1, callback);
	});
};

getBookData(links[117804], links, 117804, iterator);

