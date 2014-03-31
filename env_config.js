module.exports = {
	port: process.env.PORT || 8080,
	mail : {
		key : "key-9q6wmvaf8-8-uyu7n-hd5cwvjqc76jn5",
		server : "bibliofair.com",
		report: "Tadeas Petak <tadeaspetak@gmail.com>"
	},
	database : "mongodb://localhost/bibliofair",
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
