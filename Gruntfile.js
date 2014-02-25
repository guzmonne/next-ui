module.exports = function (grunt) {
    // Project configuration.

    var srcFiles = [
        "src/base.js",
        "src/class.js",
        "src/Comparable.js",
        "src/Deferrable.js",
        "src/Iterable.js",
        "src/Observable.js",
        "src/Serializable.js",
        "src/data/Collection.js",
        "src/data/Dictionary.js",
        "src/data/ObservableObject.js",
        "src/data/ObservableCollection.js",
        "src/data/ObservableDictionary.js",
        "src/data/Query.js"
    ];

    grunt.initConfig({
        clean: {
            base: {
                src: ['dest', 'doc']
            }
        },
        jshint: {
            base: {
                src: srcFiles
            }
        },
        qunit: {
            all: ['test/index.html']
        },
        concat: {
            base: {
                src: srcFiles,
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
    var target = grunt.option('target') || 'dev';
    if (target == 'build') {
        grunt.loadNpmTasks('grunt-qunit-junit');
    }

    grunt.registerTask('default', ['clean', 'jshint', 'qunit', 'concat', 'yuidoc', 'uglify']);
};