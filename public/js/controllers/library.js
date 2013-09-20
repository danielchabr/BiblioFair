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
			}
			if(/97[89].*/.test(query)) {
				if(query.length == 13) {
					console.log('check1');
					APIservice.tel.read(query, processData);
					APIservice.tel.read(ISBN13toISBN10(query), processData);
				}
			}
			else {
				console.log('check2');
				APIservice.tel.read(query, processData);
				APIservice.tel.read(ISBN10toISBN13(query), processData);
			}
		}
	}
	// retrieves array of wanted property in books, checks for empty slots
	$scope.check = function (data, prop) {
		var arr = [];
		if($scope.selected_books.length == 0) $scope.selected_books = $scope.books;
		var template = {};
		for (var prop in $scope.newbook) {
			template[prop] = $scope.newbook[prop];
		}
		delete template.edition;
		delete template.volume;
		if(template.isbn && template.isbn.length == 10) template.isbn = ISBN10toISBN13(template.isbn);
		var sel = $filter('filter')($scope.selected_books, template);
		for (var i = 0; i < sel.length;i++) {
			if(sel[i][prop]) {
				arr.push(sel[i][prop].toString());
			}
		}
		console.log($scope.newbook);
		return arr;
	};
	//////////// BOOK DETAIL MODAL //////////////////
	$scope.open = function (book) {
		var modalInstance = $modal.open({
			templateUrl: '/partials/library_detail.html',
			controller: ModalInstanceCtrl,
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
	$scope.languages = ['English', 'Čeština', 'Slovenčina', 'Qafara','Аҧсуа','avesta','Afrikaans','akana','አማርኛ','aragonés','العربية','অসমীয়া','авар мацӀ; магӀарул мацӀ','aymar aru','Azərbaycanca','башҡорт теле','Беларуская мова','български език','भोजपुरी','Bislama','bamanankan','বাংলা','བོད་ཡིག','brezhoneg','bosanski jezik','català; valencià','нохчийн мотт','Chamoru','corsu; lingua corsa','ᓀᐦᐃᔭᐍᐏᐣ','ѩзыкъ словѣньскъ','чӑваш чӗлхи','Cymraeg','dansk','Deutsch','ދިވެހިބަސ','རྫོང་ཁ','Ɛʋɛgbɛ','Ελληνικά','Esperanto','español; castellano','eesti keel','euskara','فارسی','Fulfulde; Pulaar; Pular','suomi; suomen kieli','vosa Vakaviti','føroyskt','français; langue française','frysk','Gaeilge','Gàidhlig','Galego','Avañe\'ẽ','ગુજરાતી','Gaelg; Manninagh','Hausancī; هَوُسَ','עִבְרִית; עברית','हिन्दी','Hiri Motu','hrvatski jezik','Kreyòl ayisyen','magyar','Հայերեն լեզու','Otjiherero','interlingua','Bahasa Indonesia','Interlingue','Igbo', 'Nuosu' ,'Iñupiaq; Iñupiatun','Ido','íslenska','italiano','ᐃᓄᒃᑎᑐᑦ','日本語','basa Jawa','ქართული ენა (kartuli ena)','Kikongo','Gĩkũyũ','kuanyama','Қазақ тілі','kalaallisut; kalaallit oqaasii','ភាសាខ្មែរ','ಕನ್ನಡ','한국어 (韓國語); 조선말 (朝鮮語)','kanuri','कॉशुर; کٲشُر','Kurdî; كوردي','коми кыв','Kernewek','кыргыз тили','latine; lingua Latina','Lëtzebuergesch','Luganda','Limburgs','lingala','ພາສາລາວ','lietuvių kalba', 'Luba-Katanga','latviešu valoda','Malagasy fiteny','Kajin M̧ajeļ','te reo Māori',
		'македонски јазик','മലയാളം','монгол хэл','मराठी','bahasa Melayu; بهاس ملايو','Malti','မြန်မာစာ','Ekakairũ Naoero','bokmål','isiNdebele','नेपाली','Owambo','Nederlands','nynorsk','norsk','isiNdebele','Diné bizaad; Dinékʼehǰí','chiCheŵa; chinyanja','Occitan','ᐊᓂᔑᓇᐯᒧᐏᐣ (Anishinaabemowin)','Afaan Oromoo','ଓଡ଼ିଆ','ирон ӕвзаг','ਪੰਜਾਬੀ; پنجابی','पालि','polski','پښتو','português','Runa Simi; Kichwa','rumantsch grischun','Rundi','română','русский язык','Ikinyarwanda','संस्कृतम्','sardu','سنڌي، سندھی; सिन्धी','sámi; sámegiella','yângâ tî sängö','සිංහල' , 'slovenščina','gagana fa\'a Samoa','chiShona','Soomaaliga; af Soomaali','Shqip','српски језик; srpski jezik','siSwati','Sesotho','basa Sunda','svenska','Kiswahili','தமிழ்','тоҷикӣ; تاجیکی' , 'Tajik', 'ภาษาไทย','ትግርኛ','Түркмен','Wikang Tagalog','Setswana','faka-Tonga','Türkçe','Xitsonga','татарча; tatarça', 'Twi', 'te reo Tahiti; te reo Māʼohi','Uyƣurqə; Uyğurçe; ئۇيغۇرچ','українська мова','اردو','O\'zbek; Ўзбек; أۇزبېك','Tshivenḓa','Tiếng Việt','Volapük','walon','Wolof','isiXhosa','ייִדיש','Yorùbá','Saɯ cueŋƅ; Saw cuengh','漢語; 汉语; 中文','isiZulu'];

	$scope.abbr = ['eng', 'cze', 'slo', 'aar','abk','ave','afr','aka','amh','arg','ara','asm','ava','aym','aze','bak','bel','bul','bih','bis','bam','ben','tib','bre','bos','cat','che','cha','cos','cre','chu','chv','wel','dan','ger','div','dzo','ewe','gre','epo','spa','est','baq','per','ful','fin','fij','fao','fre','fry','gle','gla','glg','grn','guj','glv','hau','heb','hin','hmo','hrv','hat','hun','arm','her','ina','ind','ile','ibo','iii','ipk','ido','ice','ita','iku','jpn','jav','geo','kon','kik','kua','kaz','kal','khm','kan','kor','kau','kas','kur','kom','cor','kir','lat','ltz','lug','lim','lin','lao','lit','lub','lav','mlg','mah','mao','mac','mal','mon','mar','may','mlt','bur','nau','nob','nde','nep','ndo','dut','nno','nor','nbl','nav','nya','oci','oji','orm','ori','oss','pan','pli','pol','pus','por','que','roh','run','rum','rus','kin','san','srd','snd','sme','sag','sin','slv','smo','sna','som','alb','srp','ssw','sot','sun','swe','swa','tam','tel','tgk','tha','tir','tuk','tgl','tsn','ton','tur','tso','tat','twi','tah','uig','ukr','urd','uzb','ven','vie','vol','wln','wol','xho','yid','yor','zha','chi','zul'];
}
