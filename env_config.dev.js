module.exports = {
	port: process.env.PORT || 8080,
	mail : {
		key : "key-9q6wmvaf8-8-uyu7n-hd5cwvjqc76jn5",
		server : "bibliofair.com",
		report: "Daniel Chabr <danielchabr@gmail.com>"
	},
	db: 'mongodb://admin:yfePWAvtyZPr@' + process.env.OPENSHIFT_MONGODB_DB_HOST + ':' + process.env.OPENSHIFT_MONGODB_DB_PORT + '/bibliofair',
	facebook: {
		clientID: '744889775551421',
		clientSecret: '7f7374d1faf72afd76b648b4b889af21',
		callbackURL: 'http://bibliofair-tadeaspetak.rhcloud.com/signin/facebook/callback'
	},
	google: {
		clientID: '920022509897-ad5vcu4bnvkcptm0ki86vp5vibtdc8u0.apps.googleusercontent.com',
		clientSecret: '51xs5SANYKz-xGBwVz3P9vg-',
		callbackURL: 'http://bibliofair-tadeaspetak.rhcloud.com/signin/google/callback'
	}
};