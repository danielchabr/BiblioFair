module.exports = {
	port: process.env.PORT || 8080,
	mail : {
		key : "key-9q6wmvaf8-8-uyu7n-hd5cwvjqc76jn5",
		server : "bibliofair.com",
		report: "Daniel Chabr <danielchabr@gmail.com>"
	},
	db: 'mongodb://admin:Bl5vcDrcTPEJ@' + process.env.OPENSHIFT_MONGODB_DB_HOST + ':' + process.env.OPENSHIFT_MONGODB_DB_PORT + '/bibliofair',
	facebook: {
		clientID: '482604211852822',
		clientSecret: '478b1a9ee891dfc1622f7d241bda8bcc',
		callbackURL: 'http://www.bibliofair.com/signin/facebook/callback'
	},
	google: {
		clientID: '878960684209-g7mqj5ek21d2vuc15vqvhm75hms679a1.apps.googleusercontent.com',
		clientSecret: 'ba9nditXUbtlIL5QBxzWbUzL',
		callbackURL: 'http://www.bibliofair.com/signin/google/callback'
	}
};