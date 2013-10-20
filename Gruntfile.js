module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-html-snapshot');

	  // Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
	    uglify: {
			options: {
				banner: ''//'/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
	        build: {
				src: 'public/js/app.js',
				dest: 'public/js/app.min.js'
			}
		},
		htmlSnapshot: {
			all: {
				options: {
				  snapshotPath: 'public/snapshot/',
				  sitePath: 'http://www.bibliofair.com', 
				  urls: ['']
				}
			}
		}
	});

	    // Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');

		  // Default task(s).
	grunt.registerTask('default', ['htmlSnapshot']);

};
