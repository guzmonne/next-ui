module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('files.json'),
        clean: {
            all: {
                src: ['dest']
            }
        },
        jshint: {
            base: {
                src: '<%= pkg.scripts %>'
            },
            options: {
                eqnull: true
            }
        },
        qunit: {
            all: ['test/test.html']
        },
        concat: {
            base: {
                src: '<%= pkg.scripts %>',
                dest: 'dest/js/next-graphic.js'
            }
        },
        uglify: {
            base: {
                src: ['dest/js/next-graphic.js'],
                dest: 'dest/js/next-graphic.min.js'
            }
        },
        yuidoc: {
            compile: {
                options: {
                    paths: ['src/js'],
                    outdir: 'doc'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib');

    grunt.registerTask('default', ['clean', 'jshint', 'concat', 'yuidoc', 'uglify']);
};