module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            all: {
                src: ['dest']
            }
        },
        less: {
            themes: {
                files: {
                    "dest/css/next-blue.css": "src/less/themes/blue/next.less",
                    "dest/css/next-green.css": "src/less/themes/green/next.less",
                    "dest/css/next-dark.css": "src/less/themes/dark/next.less",
                    "dest/css/next-slate.css": "src/less/themes/slate/next.less"
                }
            }
        },
        cssmin: {
            themes: {
                expand: true,
                cwd: 'dest/css',
                src: ['*.css', '!*.min.css'],
                dest: 'dest/css',
                ext: '.min.css'
            }
        },
        copy: {
            fonts: {
                files: [
                    {expand: true, cwd: 'src', src: ['fonts/**'], dest: 'dest'},
                    {expand: true, cwd: 'lib/bootstrap/fonts', src: ['**'], dest: 'dest/fonts/glyphicons'}
                ]
            }
        },
        jshint: {
            base: {
                src: '<%= pkg.scripts %>'
            }
        },
        qunit: {
            all: ['test/test.html']
        },
        concat: {
            base: {
                src: '<%= pkg.scripts %>',
                dest: 'dest/js/next-ui.js'
            }
        },
        qunit_junit: {
            options: {
            }
        },
        uglify: {
            base: {
                src: ['dest/js/next-ui.js'],
                dest: 'dest/js/next-ui.min.js'
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
    grunt.loadNpmTasks('grunt-qunit-junit');
    grunt.registerTask('default', ['clean', 'less', 'cssmin', 'copy', 'qunit_junit','qunit', 'jshint', 'concat', 'yuidoc', 'uglify']);
};