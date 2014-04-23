var config = require("../../config/config");

exports.getLanguage = function() {
	var request = this,
	param = this.param('language'),
	language;

	//param from request (params, body, query)
	if(param){
		language = param;
	}
	//user logged in -> use stored information
	else if(request.user && request.user.language){
		language = request.user.language;
	}
	//not logged in and no cookie -> create one
	else if(!request.cookies.lang){
		//in a form of 'lang[-country], lang[-country];q=0.8, lang[-country]...'
		var languages = request.headers['accept-language'];
		if(languages) {
			//get the first language and save it as a cookie
			language = languages.split(",")[0].split("-")[0];
		} else {
			language = request.cookies.lang;
		}
	}
	else{
		language = request.cookies.lang;
	}

	//if this language is not supported, return the first language from the config file
	if(config.languages.indexOf(language) === -1 ){
		language = config.languages[0];
	}
	
	if(request.user){
		request.user.language = language;
	}

	return language;
};

exports.setLanguage = function(language){
	return this.cookie('lang', language, {maxAge: 18000000000});
};
