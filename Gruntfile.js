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
        }
    });

    // Load all the neccessary plugins.
    grunt.loadNpmTasks('grunt-html-snapshot')
    grunt.loadNpmTasks('grunt-contrib-uglify');
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
};
