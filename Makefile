FILES_SRC_BASE = \
	src/base/base.js \
	src/base/class.js \
	src/base/keyword.js \
	src/base/Comparable.js \
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

FILES_SRC_WEB = \
	src/web/Env.js \
	src/web/Util.js \
	src/web/HttpClient.js \
	src/web/dom/Node.js \
	src/web/dom/Text.js \
	src/web/dom/Element.js \
	src/web/dom/Fragment.js \
	src/web/dom/Document.js \
	src/web/ui/SimpleComponent.js \
	src/web/ui/AbstractComponent.js \
	src/web/ui/Component.js \
	src/web/ui/Application.js

FILES_TEST_WEB = \
	test/web/test.js \
	test/web/ComponentBase.js \
	test/web/UIComponent.js \
	test/web/element.js

FILES_SRC_TOPOLOGY = \
	src/topology/util/util.js \
	src/topology/util/query.js \
	src/topology/util/Animation.js \
	src/topology/ui/ZIndexManager.js \
	src/topology/ui/PopupContainer.js \
	src/topology/ui/Popup.js \
	src/topology/ui/Popover.js \
	src/topology/core/DragManager.js \
	src/topology/core/Component.js \
	src/topology/svg/Group.js \
	src/topology/svg/ICON.js \
	src/topology/svg/Icons.js \
	src/topology/svg/Circle.js \
	src/topology/svg/Image.js \
	src/topology/svg/Line.js \
	src/topology/svg/Path.js \
	src/topology/svg/Polygon.js \
	src/topology/svg/Rect.js \
	src/topology/svg/Stage.js \
	src/topology/svg/Text.js \
	src/topology/svg/Triangle.js \
	src/topology/svg/BezierCurves.js \
	src/topology/geometry/MatrixSupport.js \
	src/topology/geometry/Matrix.js \
	src/topology/geometry/Math.js \
	src/topology/geometry/BezierCurve.js \
	src/topology/geometry/Vector.js \
	src/topology/geometry/Vector.js \
	src/topology/geometry/Line.js \
	src/topology/data/QuadTree.js \
	src/topology/data/NeXtForce.js \
	src/topology/data/Force.js \
	src/topology/data/Convex.js \
	src/topology/data/Vertex.js \
	src/topology/data/Edge.js \
	src/topology/data/VertexSet.js \
	src/topology/data/EdgeSet.js \
	src/topology/data/EdgeSetCollection.js \
	src/topology/data/Vertices.js \
	src/topology/data/VertexSets.js \
	src/topology/data/Edges.js \
	src/topology/data/EdgeSets.js \
	src/topology/data/EdgeSetCollections.js \
	src/topology/data/processor/NeXtForce.js \
	src/topology/data/processor/Force.js \
	src/topology/data/processor/Quick.js \
	src/topology/data/processor/Circle.js \
	src/topology/data/DataProcessor.js \
	src/topology/data/ObservableGraph.js \
	src/topology/data/UniqObservableCollection.js \
	src/topology/topology/core/Config.js \
	src/topology/topology/core/Graph.js \
	src/topology/topology/core/Event.js \
	src/topology/topology/node/NodeMixin.js \
	src/topology/topology/link/LinkMixin.js \
	src/topology/topology/layer/LayerMixin.js \
	src/topology/topology/core/StageMixin.js \
	src/topology/topology/tooltip/TooltipMixin.js \
	src/topology/topology/scene/SceneMixin.js \
	src/topology/topology/layout/LayoutMixin.js \
	src/topology/topology/core/Categories.js \
	src/topology/topology/core/Topology.js \
	src/topology/topology/layer/Layer.js \
	src/topology/topology/node/NodeWatcher.js \
	src/topology/topology/node/AbstractNode.js \
	src/topology/topology/node/Node.js \
	src/topology/topology/node/NodesLayer.js \
	src/topology/topology/node/NodeSet.js \
	src/topology/topology/node/NodeSetLayer.js \
	src/topology/topology/link/AbstractLink.js \
	src/topology/topology/link/Link.js \
	src/topology/topology/link/LinksLayer.js \
	src/topology/topology/link/LinkSet.js \
	src/topology/topology/link/LinkSetLayer.js \
	src/topology/topology/layout/HierarchicalLayout.js \
	src/topology/topology/layout/EnterpriseNetworkLayout.js \
	src/topology/topology/layout/NeXtForceLayout.js \
	src/topology/topology/layout/USMapLayout.js \
	src/topology/topology/layout/WorldMapLayout.js \
	src/topology/topology/tooltip/TooltipPolicy.js \
	src/topology/topology/tooltip/TopologyTooltip.js \
	src/topology/topology/tooltip/NodeTooltip.js \
	src/topology/topology/tooltip/LinkTooltip.js \
	src/topology/topology/tooltip/LinkSetTooltip.js \
	src/topology/topology/tooltip/TooltipManager.js \
	src/topology/topology/scene/Scene.js \
	src/topology/topology/scene/DefaultScene.js \
	src/topology/topology/scene/SelectionScene.js \
	src/topology/topology/scene/SelectionNodeScene.js \
	src/topology/topology/scene/ZoomBySelection.js \
	src/topology/topology/group/GroupsLayer.js \
	src/topology/topology/group/GroupItem.js \
	src/topology/topology/group/RectGroup.js \
	src/topology/topology/group/CircleGroup.js \
	src/topology/topology/group/PolygonGroup.js \
	src/topology/topology/group/NodeSetPolygonGroup.js \
	src/topology/topology/path/Path.js \
	src/topology/topology/path/BasePath.js \
	src/topology/topology/path/PathLayer.js \
	src/topology/topology/plugin/Nav.js \
	src/topology/topology/plugin/Thumbnail.js \
	src/topology/topology/extension/graphic/OptimizeLabel.js \
	src/topology/topology/extension/graphic/FillStage.js

FILES_TEST_TOPOLOGY = \
	test/topology/data.js

all: FORCE next-base next-web next-topology next-resources

clean: FORCE
	@rm -rf work/dist/* work/test/*

test: FORCE \
	work/dist/next-base-test-report.xml \
	work/dist/next-web-test-report.xml \
	work/dist/next-topology-test-report.xml

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
	@yuidoc src/base/ -q -c work/bin/yuidoc.json -o work/dist/next-base-docs
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
	@yuidoc src/web/ -q -c work/bin/yuidoc.json -o work/dist/next-web-docs
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
	work/dist/next-topology-docs \
	work/dist/next-topology-example

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
	@yuidoc src/topology/ -q -c work/bin/yuidoc.json -o work/dist/next-topology-docs
	@echo "Done."

work/test/next-topology.html: FORCE work/test
	@echo -n "Topology: renew test page ... "
	@node work/bin/next-template.js work/bin/qunit-template.html -c "${FILES_SRC_BASE} ${FILES_SRC_WEB} ${FILES_SRC_TOPOLOGY}" -t "${FILES_TEST_TOPOLOGY}" > work/test/next-topology.html
	@html-beautify work/test/next-topology.html -r > /dev/null
	@echo "Done."

work/dist/next-topology-test-report.xml: FORCE work/dist work/test/next-topology.html
	@echo -n "Topology: test ... "
	@node work/bin/phantom-autotest.js work/test/next-topology.html -s work/dist/next-topology-test-report.png -r work/dist/next-topology-test-report.xml

work/dist/next-topology-example: FORCE work/dist
	@echo -n "Topology: update example ... "
	@rm -rf work/dist/next-topology-example
	@cp -R src/topology-example work/dist/next-topology-example # TODO more
	@echo "Done."

## resources

next-resources: FORCE work/dist/resources

work/dist/resources: FORCE work/dist
	@echo -n "Resources: update ... "
	@mkdir -p work/dist/resources
	@cp -R resources/fonts work/dist/resources
	@mkdir -p work/dist/resources/web
	@lessc resources/web/themes/blue/next.less > work/dist/resources/web/next-blue.css
	@lessc resources/web/themes/green/next.less > work/dist/resources/web/next-green.css
	@lessc resources/web/themes/dark/next.less > work/dist/resources/web/next-dark.css
	@lessc resources/web/themes/slate/next.less > work/dist/resources/web/next-slate.css
	@lessc resources/web/themes/yellow/next.less > work/dist/resources/web/next-yellow.css
	@lessc resources/web/themes/blue/next-componentlized.less > work/dist/resources/web/next-blue-componentlized.css
	@lessc resources/web/themes/green/next-componentlized.less > work/dist/resources/web/next-green-componentlized.css
	@lessc resources/web/themes/dark/next-componentlized.less > work/dist/resources/web/next-dark-componentlized.css
	@lessc resources/web/themes/slate/next-componentlized.less > work/dist/resources/web/next-slate-componentlized.css
	@lessc resources/web/themes/yellow/next-componentlized.less > work/dist/resources/web/next-yellow-componentlized.css
	@mkdir -p work/dist/resources/topology
	@lessc resources/topology/next-topology.less > work/dist/resources/topology/next-topology.css
	@echo "Done."
