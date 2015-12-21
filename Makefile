FILES_SRC_BASE = 

FILES_TEST_BASE = 

FILES_SRC_WEB = 

FILES_TEST_WEB = 

FILES_SRC_TOPOLOGY = 
	src/topology/js/util/util.js \
	src/topology/js/util/query.js \
	src/topology/js/util/Animation.js \
	src/topology/js/ui/ZIndexManager.js \
	src/topology/js/ui/PopupContainer.js \
	src/topology/js/ui/Popup.js \
	src/topology/js/ui/Popover.js \
	src/topology/js/core/DragManager.js \
	src/topology/js/core/Component.js \
	src/topology/js/svg/Group.js \
	src/topology/js/svg/ICON.js \
	src/topology/js/svg/Icons.js \
	src/topology/js/svg/Circle.js \
	src/topology/js/svg/Image.js \
	src/topology/js/svg/Line.js \
	src/topology/js/svg/Path.js \
	src/topology/js/svg/Polygon.js \
	src/topology/js/svg/Rect.js \
	src/topology/js/svg/Stage.js \
	src/topology/js/svg/Text.js \
	src/topology/js/svg/Triangle.js \
	src/topology/js/svg/BezierCurves.js \
	src/topology/js/geometry/MatrixSupport.js \
	src/topology/js/geometry/Matrix.js \
	src/topology/js/geometry/Math.js \
	src/topology/js/geometry/BezierCurve.js \
	src/topology/js/geometry/Vector.js \
	src/topology/js/geometry/Vector.js \
	src/topology/js/geometry/Line.js \
	src/topology/js/data/QuadTree.js \
	src/topology/js/data/NeXtForce.js \
	src/topology/js/data/Force.js \
	src/topology/js/data/Convex.js \
	src/topology/js/data/Vertex.js \
	src/topology/js/data/Edge.js \
	src/topology/js/data/VertexSet.js \
	src/topology/js/data/EdgeSet.js \
	src/topology/js/data/EdgeSetCollection.js \
	src/topology/js/data/Vertices.js \
	src/topology/js/data/VertexSets.js \
	src/topology/js/data/Edges.js \
	src/topology/js/data/EdgeSets.js \
	src/topology/js/data/EdgeSetCollections.js \
	src/topology/js/data/processor/NeXtForce.js \
	src/topology/js/data/processor/Force.js \
	src/topology/js/data/processor/Quick.js \
	src/topology/js/data/processor/Circle.js \
	src/topology/js/data/DataProcessor.js \
	src/topology/js/data/ObservableGraph.js \
	src/topology/js/data/UniqObservableCollection.js \
	src/topology/js/topology/core/Config.js \
	src/topology/js/topology/core/Graph.js \
	src/topology/js/topology/core/Event.js \
	src/topology/js/topology/node/NodeMixin.js \
	src/topology/js/topology/link/LinkMixin.js \
	src/topology/js/topology/layer/LayerMixin.js \
	src/topology/js/topology/core/StageMixin.js \
	src/topology/js/topology/tooltip/TooltipMixin.js \
	src/topology/js/topology/scene/SceneMixin.js \
	src/topology/js/topology/layout/LayoutMixin.js \
	src/topology/js/topology/core/Categories.js \
	src/topology/js/topology/core/Topology.js \
	src/topology/js/topology/layer/Layer.js \
	src/topology/js/topology/layer/TripleLayer.js \
	src/topology/js/topology/node/NodeWatcher.js \
	src/topology/js/topology/node/AbstractNode.js \
	src/topology/js/topology/node/Node.js \
	src/topology/js/topology/node/NodesLayer.js \
	src/topology/js/topology/node/NodeSet.js \
	src/topology/js/topology/node/NodeSetLayer.js \
	src/topology/js/topology/link/AbstractLink.js \
	src/topology/js/topology/link/Link.js \
	src/topology/js/topology/link/LinksLayer.js \
	src/topology/js/topology/link/LinkSet.js \
	src/topology/js/topology/link/LinkSetLayer.js \
	src/topology/js/topology/layout/HierarchicalLayout.js \
	src/topology/js/topology/layout/EnterpriseNetworkLayout.js \
	src/topology/js/topology/layout/NeXtForceLayout.js \
	src/topology/js/topology/layout/USMapLayout.js \
	src/topology/js/topology/layout/WorldMapLayout.js \
	src/topology/js/topology/tooltip/TooltipPolicy.js \
	src/topology/js/topology/tooltip/TopologyTooltip.js \
	src/topology/js/topology/tooltip/NodeTooltip.js \
	src/topology/js/topology/tooltip/LinkTooltip.js \
	src/topology/js/topology/tooltip/LinkSetTooltip.js \
	src/topology/js/topology/tooltip/TooltipManager.js \
	src/topology/js/topology/scene/Scene.js \
	src/topology/js/topology/scene/DefaultScene.js \
	src/topology/js/topology/scene/SelectionScene.js \
	src/topology/js/topology/scene/SelectionNodeScene.js \
	src/topology/js/topology/scene/ZoomBySelection.js \
	src/topology/js/topology/group/GroupsLayer.js \
	src/topology/js/topology/group/GroupItem.js \
	src/topology/js/topology/group/RectGroup.js \
	src/topology/js/topology/group/CircleGroup.js \
	src/topology/js/topology/group/PolygonGroup.js \
	src/topology/js/topology/group/NodeSetPolygonGroup.js \
	src/topology/js/topology/path/Path.js \
	src/topology/js/topology/path/BasePath.js \
	src/topology/js/topology/path/PathLayer.js \
	src/topology/js/topology/plugin/Nav.js \
	src/topology/js/topology/plugin/Thumbnail.js \
	src/topology/js/topology/extension/graphic/OptimizeLabel.js \
	src/topology/js/topology/extension/graphic/FillStage.js

FILES_TEST_TOPOLOGY = 

all: FORCE next-base next-web next-topology

clean: FORCE
	@rm -rf work/dist/* work/test/* work/meta/*

test: FORCE \
	work/dist/next-base-test-report.xml \
	work/dist/next-web-test-report.xml \
	work/dist/next-topology-test-report.xml

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
