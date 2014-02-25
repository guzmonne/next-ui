module.exports = function (grunt) {
    // Project configuration.

    var srcFiles = [
        "src/js/Env.js",
        "src/js/Util.js",
        "src/js/dom/Node.js",
        "src/js/dom/Text.js",
        "src/js/dom/Element.js",
        "src/js/dom/Fragment.js",
        "src/js/dom/Document.js",
        "src/js/ui/AbstractComponent.js",
        "src/js/ui/Component.js",
        "src/js/ui/Application.js"
    ];


    grunt.initConfig({
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
                src: srcFiles
            }
        },
        qunit: {
            all: ['test/test.html']
        },
        concat: {
            base: {
                src: srcFiles,
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
    var target = grunt.option('target') || 'dev';
    if (target == 'build') {
        grunt.loadNpmTasks('grunt-qunit-junit');
    }

    grunt.registerTask('default', ['clean', 'less', 'cssmin', 'copy', 'qunit', 'jshint', 'concat', 'yuidoc', 'uglify']);

};