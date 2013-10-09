function libraryControl($rootScope, $scope, $http, $modal, $location, $filter, APIservice) {
	APIservice.books.read('','', 20, 0, function(data) {
		 $rootScope.books = data;
	});
	APIservice.library.read(function(data) {
		 $rootScope.mybooks = [];
		 console.log(data);
		 for(var i = 0; i < data.library.length; i++) {
			 $rootScope.mybooks.push(data.library[i].id);
		 }
	});
	APIservice.users.read(function(data) {
		if(data.loc.coordinates.length == 0) {
			$scope.disable = true;
		}
	});

	$scope.addbook = function() {
		console.log($scope.newbook.title + " " + $scope.newbook.author);
		if($scope.newbook.title && $scope.newbook.author) {
			if($scope.newbook.isbn) {
				//$scope.newbook.isbn = $scope.newbook.isbn.replace(/-/g, '');
				if($scope.newbook.isbn.length == 10) $scope.newbook.isbn = ISBN10toISBN13($scope.newbook.isbn);
			}
			APIservice.library.create($scope.newbook, function(data, status) {
				console.log(data);
				$rootScope.mybooks.push(data);
				$scope.newbook = {};
			});
		}
	};
	///// EUROPEAN LIBRARY API ////////////
	$scope.selected_books = [];
	// on selection of one of typeaheads checks if it matches only one result and if so, fills the rest of form
	$scope.selectBook = function () {
		var template = {};
		for (var prop in $scope.newbook) {
			template[prop] = $scope.newbook[prop];
		}
		delete template.edition;
		delete template.volume;
		$scope.selected_books = $filter('filter')($scope.selected_books, template);
		if($scope.selected_books.length == 1) {
			$scope.newbook = $scope.selected_books[0];
		}
		for (var prop in $scope.selected_books[0]) {
			var flag = false;
			$scope.selected_books.forEach(function(element) {
				if($scope.selected_books[0][prop] == element[prop]) flag = true;
			});
			if(flag) $scope.newbook[prop] = $scope.selected_books[0][prop];
			console.log($scope.newbook.published);
		}
		if($scope.newbook.published) $scope.newbook.published = new Date($scope.newbook.published).getFullYear();
		console.log($scope.newbook.published);
	};
	// is called on each change of ISBN but gives call after 10th char only
	$scope.searchTel = function (query) {
		if(query == $scope.newbook.isbn && typeof query == 'string') {
			$scope.newbook.isbn = query = query.replace(/-/g, '');
		}
		$scope.tel = [];
		if(query.length >= 10) {
			var processData = function (data) {
				for(var i = 0; i < data.Results.length; i++) {
					if(data.Results[i].TITLE && data.Results[i].CREATOR) {
						var addbook = {title: data.Results[i].TITLE[0], author: data.Results[i].CREATOR[0]};
						if(data.Results[i].SUBTITLE) addbook.subtitle = data.Results[i].SUBTITLE[0];
						if(data.Results[i].YEAR) addbook.published = data.Results[i].YEAR[0];
						if(data.Results[i].LANGUAGE) addbook.language = data.Results[i].LANGUAGE[0];
						addbook.edition = 1;
						addbook.volume = 1;
						if(query.length == 10) addbook.isbn = ISBN10toISBN13(query);
						else addbook.isbn = query;
						$scope.tel.push(addbook);
					}
				}
				var template = {};
				for (var prop in $scope.newbook) {
					template[prop] = $scope.newbook[prop];
				}
				delete template.edition;
				delete template.volume;
				if(template.isbn.length == 10) template.isbn = ISBN10toISBN13(template.isbn);
				console.log(template.isbn);
				$scope.tel =  $filter('filter')($scope.tel, template, true);
				console.log($scope.tel);
				$scope.selected_books = $scope.selected_books.concat($scope.tel);
				if($scope.tel.length == 1) {
					$scope.newbook = $scope.tel[0];
				}
				$scope.selectBook();
			}
			if(/97[89].*/.test(query)) {
				if(query.length == 13) {
					APIservice.tel.read(query, processData);
					APIservice.tel.read(ISBN13toISBN10(query), processData);
				}
			}
			else {
				APIservice.tel.read(query, processData);
				APIservice.tel.read(ISBN10toISBN13(query), processData);
			}
		}
	}
	// retrieves array of wanted property in books, checks for empty slots
	$scope.check = function (data, prop, val) {
		if($scope.selected_books.length == 0) $scope.selected_books = $scope.books;
		var template = {};
		for (var prop in $scope.newbook) {
			template[prop] = $scope.newbook[prop];
		}
		delete template.edition;
		delete template.volume;
		if(template.isbn && template.isbn.length == 10) template.isbn = ISBN10toISBN13(template.isbn);
		var arr = $filter('filter')($scope.selected_books, template);
		/*var arr = [];
		for (var i = 0; i < sel.length;i++) {
			if(sel[i][prop]) {
				arr.push(sel[i][prop].toString());
			}
		}*/
		//console.log($scope.newbook);
		//console.log(arr);
		return arr;
	};
	//////////// BOOK DETAIL MODAL //////////////////
	$scope.open = function (book) {
		var modalInstance = $modal.open({
			templateUrl: '/partials/private/library_detail.html',
			controller: ModalBookCtrl,
			resolve: {
				book: function () {
					return book;
				}
			}
		});

		modalInstance.result.then(function (action) {
			if(action == 'remove') {
				APIservice.library.del(book._id, function(data) {});
				var index = -1; index = $scope.mybooks.indexOf(book);
				if(index >= 0) $scope.mybooks.splice(index, 1);
			}
		});
	};
	$scope.languages = [['eng', 'English'],['cze', 'Čeština'],['slo', 'Slovenčina'],['aar', 'Qafara'],['abk', 'Аҧсуа'],['ave', 'avesta'],['afr', 'Afrikaans'],['aka', 'akana'],['amh', 'አማርኛ'],['arg', 'aragonés'],['ara', 'العربية'],['asm', 'অসমীয়া'],['ava', 'авар мацӀ; магӀарул мацӀ'],['aym', 'aymar aru'],['aze', 'Azərbaycanca'],['bak', 'башҡорт теле'],['bel', 'Беларуская мова'],['bul', 'български език'],
		['bih', 'भोजपुरी'],['bis', 'Bislama'],['bam', 'bamanankan'],['ben', 'বাংলা'],['tib', 'བོད་ཡིག'],['bre', 'brezhoneg'],['bos', 'bosanski jezik'],['cat', 'català; valencià'],['che', 'нохчийн мотт'],['cha', 'Chamoru'],['cos', 'corsu; lingua corsa'],['cre', 'ᓀᐦᐃᔭᐍᐏᐣ'],['chu', 'ѩзыкъ словѣньскъ'],['chv', 'чӑваш чӗлхи'],['wel', 'Cymraeg'],['dan', 'dansk'],['ger', 'Deutsch'],['div', 'ދިވެހިބަސ'],['dzo', 'རྫོང་ཁ'],['ewe', 'Ɛʋɛgbɛ'],['gre', 'Ελληνικά'],['epo', 'Esperanto'],['spa', 'español; castellano'],['est', 'eesti keel'],['baq', 'euskara'],['per', 'فارسی'],['ful', 'Fulfulde; Pulaar; Pular'],
		['fin', 'suomi; suomen kieli'],['fij', 'vosa Vakaviti'],['fao', 'føroyskt'],['fre', 'français; langue française'],['fry', 'frysk'],['gle', 'Gaeilge'],['gla', 'Gàidhlig'],['glg', 'Galego'],['grn', 'Avañe\'ẽ'],['guj', 'ગુજરાતી'],['glv', 'Gaelg; Manninagh'],
		['hau', 'Hausancī; هَوُسَ'],['heb', 'עִבְרִית; עברית'],['hin', 'हिन्दी'],['hmo', 'Hiri Motu'],['hrv', 'hrvatski jezik'],['hat', 'Kreyòl ayisyen'],['hun', 'magyar'],['arm', 'Հայերեն լեզու'],['her', 'Otjiherero'],['ina', 'interlingua'],['ind', 'Bahasa Indonesia'],['ile', 'Interlingue'],['ibo', 'Igbo'],['iii', 'Nuosu'],['ipk', 'Iñupiaq; Iñupiatun'],['ido', 'Ido'],['ice', 'íslenska'],['ita', 'italiano'],['iku', 'ᐃᓄᒃᑎᑐᑦ'],
		['jpn', '日本語'],['jav', 'basa Jawa'],['geo', 'ქართული ენა (kartuli ena)'],['kon', 'Kikongo'],['kik', 'Gĩkũyũ'],['kua', 'kuanyama'],['kaz', 'Қазақ тілі'],['kal', 'kalaallisut; kalaallit oqaasii'],['khm', 'ភាសាខ្មែរ'],['kan', 'ಕನ್ನಡ'],['kor', '한국어 (韓國語); 조선말 (朝鮮語)'],['kau', 'kanuri'],['kas', 'कॉशुर; کٲشُر'],['kur', 'Kurdî; كوردي'],['kom', 'коми кыв'],['cor', 'Kernewek'],['kir', 'кыргыз тили'],
		['lat', 'latine; lingua Latina'],['ltz', 'Lëtzebuergesch'],['lug', 'Luganda'],['lim', 'Limburgs'],['lin', 'lingala'],['lao', 'ພາສາລາວ'],['lit', 'lietuvių kalba'],['lub', 'Luba-Katanga'],['lav', 'latviešu valoda'],['mlg', 'Malagasy fiteny'],['mah', 'Kajin M̧ajeļ'],['mao', 'te reo Māori'],['mac', 'македонски јазик'],['mal', 'മലയാളം'],['mon', 'монгол хэл'],['mar', 'मराठी'],['may', 'bahasa Melayu; بهاس ملايو'],['mlt', 'Malti'],
		['bur', 'မြန်မာစာ'],['nau', 'Ekakairũ Naoero'],['nob', 'bokmål'],['nde', 'isiNdebele'],['nep', 'नेपाली'],['ndo', 'Owambo'],['dut', 'Nederlands'],['nno', 'nynorsk'],['nor', 'norsk'],['nbl', 'isiNdebele'],['nav', 'Diné bizaad; Dinékʼehǰí'],['nya', 'chiCheŵa; chinyanja'],['oci', 'Occitan'],['oji', 'ᐊᓂᔑᓇᐯᒧᐏᐣ (Anishinaabemowin)'],['orm', 'Afaan Oromoo'],['ori', 'ଓଡ଼ିଆ'],['oss', 'ирон ӕвзаг'],['pan', 'ਪੰਜਾਬੀ; پنجابی'],['pli', 'पालि'],
		['pol', 'polski'],['pus', 'پښتو'],['por', 'português'],['que', 'Runa Simi; Kichwa'],['roh', 'rumantsch grischun'],['run', 'Rundi'],['rum', 'română'],['rus', 'русский язык'],['kin', 'Ikinyarwanda'],['san', 'संस्कृतम्'],['srd', 'sardu'],['snd', 'سنڌي، سندھی; सिन्धी'],['sme', 'sámi; sámegiella'],['sag', 'yângâ tî sängö'],['sin', 'සිංහල'],['slv', 'slovenščina'],['smo', 'gagana fa\'a Samoa'],['sna', 'chiShona'],['som', 'Soomaaliga; af Soomaali'],
		['alb', 'Shqip'],['srp', 'српски језик; srpski jezik'],['ssw', 'siSwati'],['sot', 'Sesotho'],['sun', 'basa Sunda'],['swe', 'svenska'],['swa', 'Kiswahili'],['tam', 'தமிழ்'],['tel', 'тоҷикӣ; تاجیکی'],['tgk', 'Tajik'],['tha', 'ภาษาไทย'],['tir', 'ትግርኛ'],['tuk', 'Түркмен'],['tgl', 'Wikang Tagalog'],['tsn', 'Setswana'],['ton', 'faka-Tonga'],['tur', 'Türkçe'],['tso', 'Xitsonga'],['tat', 'татарча; tatarça'],
		['twi', 'Twi'],['tah', 'te reo Tahiti; te reo Māʼohi'],['uig', 'Uyƣurqə; Uyğurçe; ئۇيغۇرچ'],['ukr', 'українська мова'],['urd', 'اردو'],['uzb', 'O\'zbek; Ўзбек; أۇزبېك'],['ven', 'Tshivenḓa'],['vie', 'Tiếng Việt'],['vol', 'Volapük'],['wln', 'walon'],['wol', 'Wolof'],['xho', 'isiXhosa'],['yid', 'ייִדיש'],['yor', 'Yorùbá'],['zha', 'Saɯ cueŋƅ; Saw cuengh'],['chi', '漢語; 汉语; 中文'],['zul', 'isiZulu']];



}
