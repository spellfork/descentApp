'use strict';
var LIVERELOAD_PORT = 35729;
var SERVER_PORT = 9001;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-less');

    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    // configurable paths
    var appConfig = {
        app: 'app',
        dist: 'dist'
    };
    
    grunt.initConfig({
        pkg: grunt.file.readJSON( 'bower.json' ),
        open: {
            start: {
                path: 'http://localhost:' + SERVER_PORT
            }
        },
        watch: {
            less: {
                files: ['less/*.less'],
                tasks: ['less']
            },
            html: {
                files: ['templates/**/*.html']
            },
            js: {
                files: ['script/**/*.js', 'Gruntfile.js']
            },
            options: {
                livereload: true
            }
        },
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '.',
                        src: ['font/**', 'img/**', 'css/**', 'script/**', 'index.html'],
                        dest: 'dist'
                    },
                    {
                        src: 'node_modules/apache-server-configs/dist/.htaccess',
                        dest: 'dist/.htaccess'
                    }
                ]
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: './script/',
                    name: 'main',
                    out: 'dist/script/main.js',
                    mainConfigFile: 'script/main.js',
                    optimize: 'uglify2',
                    preserveLicenseComments: false,
                    generateSourceMaps: false
                }
            }
        },
        less: {
            options: {
                sourceMap: true,
                sourceMapFilename: 'css/style.css.map',
                sourceMapRootpath: '/'
            },
            compile: {
                files: {
                    'css/style.css': 'less/style.less'
                }
            }
        },
        clean: {
            dist: ['dist']
        },
        connect: {
            server: {
                options: {
                    hostname: '*',
                    port: SERVER_PORT,
                    base: '.',
                    livereload: true
                }
            }
        }
    });

    // load all grunt tasks matching the `grunt-*` patterns
    require('load-grunt-tasks')(grunt, {pattern: ['grunt-*']});

    grunt.registerTask('default', [
        'less:compile',
        'connect',
        'open:start',
        'watch'
    ]);
    
    grunt.registerTask('watching', [
        'connect',
        'watch'
    ]);

    grunt.registerTask('compile', [
        'clean:dist',
        'less:compile',
        'copy:dist'
    ]);

};
