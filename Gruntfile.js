module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            base: {
                src: ['dest', 'doc']
            }
        },
        jshint: {
            base: {
                src: '<%= pkg.scripts %>'
            }
        },
        qunit: {
            all: ['test/index.html']
        },
        concat: {
            base: {
                src: '<%= pkg.scripts %>',
                dest: 'dest/next-core.js'
            }
        },
        uglify: {
            base: {
                src: ['dest/next-core.js'],
                dest: 'dest/next-core.min.js'
            }
        },
        qunit_junit: {
            options: {
            }
        },
        yuidoc: {
            compile: {
                options: {
                    paths: ['src'],
//                themedir: 'path/to/custom/theme/',
                    outdir: 'doc'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib');
    grunt.loadNpmTasks('grunt-qunit-junit');
    grunt.registerTask('default', ['clean', 'jshint', 'qunit_junit', 'qunit', 'concat', 'yuidoc', 'uglify']);
    grunt.registerTask('4test', ['jshint', 'qunit_junit', 'qunit']);
};