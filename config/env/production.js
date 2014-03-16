'use strict';

module.exports = {
	db: 'mongodb://admin:Bl5vcDrcTPEJ@' + process.env.OPENSHIFT_MONGODB_DB_HOST + ':' + process.env.OPENSHIFT_MONGODB_DB_PORT + '/bibliofair',
	facebook: {
		clientID: '1481175278763417',
		clientSecret: '63aa01bfcfbbe032d0ba21ba2db8fc2b',
		callbackURL: 'http://localhost:8080/signin/facebook/callback'
	},
	google: {
		clientID: '19373345252.apps.googleusercontent.com',
		clientSecret: 'nY8AZuGMlZLe8JdDQM2CXTUf',
		callbackURL: 'http://localhost:8080/signin/google/callback'
	}
};
