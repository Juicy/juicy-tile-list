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
                    'tests/*.js',
                    'tests/*.html',
                    'tests/**/*.html'
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
		},

        uglify: {
          options: {
            beautify: {
              ascii_only: true,
            },
            sourceMap: true,
            sourceMapIncludeSources: true,
            preserveComments: "some"
          },
          default: {
            files: [
              {
                expand: true,     // Enable dynamic expansion.
                cwd: 'src/',      // Src matches are relative to this path.
                src: ['*.js'], // Actual pattern(s) to match.
                dest: 'dist/',   // Destination path prefix.
                //ext: '.js',   // Dest filepaths will have this extension.
                extDot: 'first'   // Extensions in filenames begin after the first dot
              },
            ]
          }
        },
        htmlmin: {                                     // Task
            dist: {                                      // Target
              options: {                                 // Target options
                collapseWhitespace: true,
                minifyJS: true,
                minifyCSS: true
              },
              files: {                                   // Dictionary of files
                'dist/juicy-tile-list.html': 'src/juicy-tile-list.html'     // 'destination': 'source'
              }
            }
        },
        bump: {
          options: {
            files: ['package.json', 'bower.json', 'src/*', 'dist/*.html'],
            commit: true,
            commitMessage: '%VERSION%',
            commitFiles: ['package.json', 'bower.json', 'src/*', 'dist/*'],
            createTag: true,
            tagName: '%VERSION%',
            tagMessage: 'Version %VERSION%',
            push: false,
            // pushTo: 'origin',
            globalReplace: false,
            prereleaseName: false,
            regExp: false
          }
        }
    });

    grunt.loadNpmTasks('grunt-text-replace');
    // grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
  	grunt.loadNpmTasks('grunt-mocha');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-bump');

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['replace']);
  	grunt.registerTask('test', ['mocha']);
    grunt.registerTask('minify', ['uglify','htmlmin']);

};
