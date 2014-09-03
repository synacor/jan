module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		concat: {
			options: {
				separator: '\n'
			},
			main : {
				src: [
					'src/**/*.js'
				],
				dest: 'dist/<%= pkg.name %>.js'
			}
		},

		uglify: {
			main : {
				options: {
					banner: '/*! <%= pkg.name %> <%= pkg.version %> */\n'
				},
				files: {
					'dist/<%= pkg.name %>.min.js': [
						'<%= concat.main.dest %>'
					]
				}
			}
		},

		jshint : {
			options : {
				'browser' : true
			},
			main : {
				options : {
					'-W041' : true,
					'-W030' : true,			// && as guard
					'-W084' : true,			// assignment in expression -> while(a=b())
					'-W093' : true			// assignment in return -> return foo=bar;
				},
				src : ['src/**/*.js']
			},
			test : {
				options : {
					'-W030' : true
				},
				src : [
					'test/**/*.js',
					'!test/js/**/*'
				]
			}
		},

		jsdoc : {
			main : {
				src: [
					'src/*.js',
					'README.md'
				],
				jsdoc : './node_modules/.bin/jsdoc',
				dest : 'docs',
				options : {
					configure : './doctemplate/config.json'
				}
			}
		},

		mocha : {
			test : {
				options : {
					run : true,
					reporter : process.env.MOCHA_REPORTER || (process.env.ENVIRONMENT==='ci' ? 'XUnit' : 'Spec')
				},
				src : ['test/**/*.html'],
				dest : (process.env.ENVIRONMENT==='ci' || process.env.OUTPUT_TESTS) && './test-reports/default.xml'
			}
		},

		watch : {
			options : {
				interrupt : true
			},
			src : {
				files : ['src/**/*.js'],
				tasks : ['default']
			},
			test : {
				files : ['test/**/*'],
				tasks : ['test']
			}
		}
	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('default', [
		'jshint:main',
		'concat:main',
		'uglify:main',
		'jsdoc:main'
	]);

	grunt.registerTask('test', [
		'jshint:test',
		'mocha:test'
	]);

	grunt.registerTask('build-watch', [
		'default',
		'watch'
	]);

};
