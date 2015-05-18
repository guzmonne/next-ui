module.exports = function (grunt) {
    // Project configuration.

    var srcFiles = [
        "src/base.js",
        "src/class.js",
	"src/keyword.js",
        "src/Comparable.js",
        "src/Deferrable.js",
        "src/Iterable.js",
        "src/Observable.js",
        "src/Serializable.js",
        "src/data/Counter.js",
        "src/data/Collection.js",
        "src/data/Dictionary.js",
        "src/data/ObservableObject.js",
        "src/data/ObservableCollection.js",
        "src/data/ObservableDictionary.js",
        "src/data/Query.js",
	"src/data/SortedMap.js"
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
            },
            options:{
                jshintrc: ".jshintrc"
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
                    outdir: 'dest/doc'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib');
    var target = grunt.option('target') || 'dev';
    if (target == 'build') {
        grunt.loadNpmTasks('grunt-qunit-junit');
    }
    grunt.registerTask('test', ['clean', 'jshint', 'qunit_junit', 'qunit', 'concat', 'yuidoc', 'uglify']);
    grunt.registerTask('default', ['clean', 'jshint', 'qunit', 'concat', 'yuidoc', 'uglify']);
};
