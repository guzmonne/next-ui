FILES_SRC_BASE = \
        src/base/base.js \
        src/base/class.js \
	src/base/keyword.js \
        src/base/Comparable.js \
        src/base/Deferrable.js \
        src/base/Iterable.js \
        src/base/Observable.js \
        src/base/Serializable.js \
        src/base/data/Counter.js \
        src/base/data/Collection.js \
        src/base/data/Dictionary.js \
        src/base/data/ObservableObject.js \
        src/base/data/ObservableCollection.js \
        src/base/data/ObservableDictionary.js \
        src/base/data/Query.js \
	src/base/data/SortedMap.js

FILES_TEST_BASE = \
	test/base/base.js \
	test/base/class.js \
	test/base/binding.js \
	test/base/Comparable.js \
	test/base/Iterable.js \
	test/base/Observable.js \
	test/base/data/Counter.js \
	test/base/data/Collection.js \
	test/base/data/ObservableCollection.js \
	test/base/data/Dictionary.js \
	test/base/data/ObservableDictionary.js \
	test/base/data/SortedMap.js

FILES_SRC_WEB = 

FILES_TEST_WEB = 

FILES_SRC_TOPOLOGY = 

FILES_TEST_TOPOLOGY = 

all: FORCE next-base next-ui next-graphic

clean: FORCE
	@rm -rf work/dist/* work/test/* work/meta/*

test: FORCE \
	work/dist/next-base-test-report.xml \
	work/dist/next-ui-test-report.xml \
	work/dist/next-graphic-test-report.xml

work/meta:
	@mkdir -p work/meta

meta: FORCE work/meta
	@node work/bin/next-project.js $(shell pwd) work/meta

work/test:
	@mkdir -p work/test

work/dist:
	@mkdir -p work/dist

FORCE:

## base build part

next-base: FORCE \
	work/dist/next-base-test-report.xml \
	work/dist/next-base.js \
	work/dist/next-base.min.js \
	work/dist/next-base-docs

work/dist/next-base.js: FORCE work/dist
	@echo -n "Base: package ... "
	@cat ${FILES_SRC_BASE} > work/dist/next-base.js
	@echo "Done."

work/dist/next-base.min.js: FORCE work/dist/next-base.js
	@echo -n "Base: uglify ... "
	@uglify -s work/dist/next-base.js -o work/dist/next-base.min.js > /dev/null
	@echo "Done."

work/dist/next-base-docs: FORCE work/dist
	@echo -n "Base: generate docs ... "
	@yuidoc next-base/ -q -c work/bin/yuidoc.json -o work/dist/next-base-docs
	@echo "Done."

work/test/next-base.html: FORCE work/test
	@echo -n "Base: renew test page ... "
	@node work/bin/next-template.js work/bin/qunit-template.html -c "${FILES_SRC_BASE}" -t "${FILES_TEST_BASE}" > work/test/next-base.html
	@html-beautify work/test/next-base.html -r > /dev/null
	@echo "Done."

work/dist/next-base-test-report.xml: FORCE work/dist work/test/next-base.html
	@echo -n "Base: test ... "
	@node work/bin/phantom-autotest.js work/test/next-base.html -s work/dist/next-base-test-report.png -r work/dist/next-base-test-report.xml

## web build part

next-web: FORCE \
	work/dist/next-web-test-report.xml \
	work/dist/next-web.js \
	work/dist/next-web.min.js \
	work/dist/next-web-docs

work/dist/next-web.js: FORCE work/dist
	@echo -n "Web: package ... "
	@cat ${FILES_SRC_BASE} ${FILES_SRC_WEB} > work/dist/next-web.js
	@echo "Done."

work/dist/next-web.min.js: FORCE work/dist/next-web.js
	@echo -n "Web: uglify ... "
	@uglify -s work/dist/next-web.js -o work/dist/next-web.min.js > /dev/null
	@echo "Done."

work/dist/next-web-docs: FORCE work/dist
	@echo -n "Web: generate docs ... "
	@yuidoc next-web/ -q -c work/bin/yuidoc.json -o work/dist/next-web-docs
	@echo "Done."

work/test/next-web.html: FORCE work/test
	@echo -n "Web: renew test page ... "
	@node work/bin/next-template.js work/bin/qunit-template.html -c "${FILES_SRC_BASE} ${FILES_SRC_WEB}" -t "${FILES_TEST_WEB}" > work/test/next-web.html
	@html-beautify work/test/next-web.html -r > /dev/null
	@echo "Done."

work/dist/next-web-test-report.xml: FORCE work/dist work/test/next-web.html
	@echo -n "Web: test ... "
	@node work/bin/phantom-autotest.js work/test/next-web.html -s work/dist/next-web-test-report.png -r work/dist/next-web-test-report.xml

## topology build part

next-topology: FORCE \
	work/dist/next-topology-test-report.xml \
	work/dist/next-topology.js \
	work/dist/next-topology.min.js \
	work/dist/next-topology-docs

work/dist/next-topology.js: FORCE work/dist
	@echo -n "Topology: package ... "
	@cat ${FILES_SRC_BASE } ${FILES_SRC_WEB} ${FILES_SRC_TOPOLOGY} > work/dist/next-topology.js
	@echo "Done."

work/dist/next-topology.min.js: FORCE work/dist/next-topology.js
	@echo -n "Topology: uglify ... "
	@uglify -s work/dist/next-topology.js -o work/dist/next-topology.min.js > /dev/null
	@echo "Done."

work/dist/next-topology-docs: FORCE work/dist
	@echo -n "Topology: generate docs ... "
	@yuidoc next-topology/ -q -c work/bin/yuidoc.json -o work/dist/next-topology-docs
	@echo "Done."

work/test/next-topology.html: FORCE work/test
	@echo -n "Topology: renew test page ... "
	@node work/bin/next-template.js work/bin/qunit-template.html -c "${FILES_SRC_BASE} ${FILES_SRC_WEB} ${FILES_SRC_TOPOLOGY}" -t "${FILES_TEST_TOPOLOGY}" > work/test/next-topology.html
	@html-beautify work/test/next-topology.html -r > /dev/null
	@echo "Done."

work/dist/next-topology-test-report.xml: FORCE work/dist work/test/next-topology.html
	@echo -n "Topology: test ... "
	@node work/bin/phantom-autotest.js work/test/next-topology.html -s work/dist/next-topology-test-report.png -r work/dist/next-topology-test-report.xml
