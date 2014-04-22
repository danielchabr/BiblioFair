module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg:grunt.file.readJSON('package.json'),
        uglify:{
            options:{
                banner:''//'/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build:{
                src:'public/js/app.js',
                dest:'public/js/app.min.js'
            }
        },
        htmlSnapshot:{
            all:{
                options:{
                    snapshotPath:'public/',
                    sitePath:'http://www.bibliofair.com/',
                    urls:['en', 'cz']
                }
            }
        },
        //tests
        mochaTest:{
            options:{
                reporter:'spec',
                require:'server.js'
            },
            src:['test/mocha/**/**/*.js']
        },
        env:{
            test:{
                NODE_ENV:'test'
            }
        },
		//watch
		watch:{
			files:['public/js/*.js', 'public/js/controllers/*.js', 'public/js/directives/*.js', 'public/js/filters/*.js', 'public/js/services/*.js'],
			tasks:['concat']
		},
		//concat
		concat:{
			dist:{
				src:['public/js/functions.js',
					'public/js/app.js', 
					'public/js/config.js', 
					'public/js/directives/directives.js',
					'public/js/services/Books.js',
					'public/js/services/Global.js',
					'public/js/services/Library.js',
					'public/js/services/Users.js',
					'public/js/services/Utils.js',
					'public/js/controllers/modalBook.js',
					'public/js/controllers/modalBrowse.js',
					'public/js/controllers/modalLibrary.js',
					'public/js/controllers/modalRecovery.js',
					'public/js/controllers/modalBasic.js',
					'public/js/controllers/welcome.js',
					'public/js/controllers/header.js',
					'public/js/controllers/home.js',
					'public/js/controllers/library.js',
					'public/js/controllers/account.js',
					'public/js/filters/filter.js',
					'public/js/init.js',
					],
				dest: 'public/js/dist.js',
				nonull: true
			}
		}
    });

    // Load all the neccessary plugins.
    grunt.loadNpmTasks('grunt-html-snapshot')
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-env');

    //Making grunt default to force in order not to break the project.
    grunt.option('force', true);

    //Create a snapshot.
    grunt.registerTask('snapshot', ['htmlSnapshot']);
    
    //Uglify.
    grunt.registerTask('uglify', ['uglify']);

    //Test task.
    grunt.registerTask('test', ['env:test', 'mochaTest']);

	//Watch for changes and concatenate when needed
    grunt.registerTask('default', ['concat']);

	//Default
    grunt.registerTask('default', ['concat']);
};
