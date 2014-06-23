module.exports = function(grunt) {

    grunt.initConfig({
        watch: {
            all: {
                options: {
                    livereload: true
                },
                files: [
                    '*.html',
                    'src/*.html',
                    'examples/**/*.html',
                    'tests/*.js'
                ],
                // tasks: ['jshint'],
            },
        },
        replace: {
            example: {
                src: ['src/*',".bowerrc"],
                dest: 'dist/',
                replacements: [{
                    from: 'bower_components',
                    to: '..'
                }]
            }
        },
        // Mocha
		mocha: {
		  all: {
		    src: ['tests/index.html'],
		  },
		  options: {
		    run: true
		  }
		}
    });

    grunt.loadNpmTasks('grunt-text-replace');
    // grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
  	grunt.loadNpmTasks('grunt-mocha');


    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['replace']);
  	grunt.registerTask('test', ['mocha']);

};
