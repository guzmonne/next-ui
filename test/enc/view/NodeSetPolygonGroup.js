(function (nx, global) {

    nx.define('ENC.TW.View.TopologyView.NodeSetPolygonGroup', nx.graphic.Topology.NodeSetPolygonGroup, {
        methods: {
            draw: function () {
                this.inherited();
                this.setTransform(0, 0);

                var topo = this.topology();
                var stageScale = topo.stageScale();
                var translate = {
                    x: topo.matrix().x(),
                    y: topo.matrix().y()
                };

                //set group polygon shape
                var vectorArray = [];
                this.nodes().each(function (node) {
                    if (node.visible()) {
                        vectorArray.push({x: node.model().x(), y: node.model().y()});
                    }
                });
                var shape = this.view('shape');
                shape.nodes(vectorArray);


                var id = this.nodeSet().model().get('root');
                var rootNode = topo.getNode(id);

                if (!rootNode) {
                    return false;
                }


                var bound = topo.getInsideBound(rootNode.getBound(true));
                bound.left -= translate.x;
                bound.top -= translate.y;
                bound.left *= stageScale;
                bound.top *= stageScale;
                bound.width *= stageScale;
                bound.height *= stageScale;

//                this.view('bg').sets({
//                    x: bound.left,
//                    y: bound.top,
//                    width: bound.width,
//                    height: bound.height
//                });

                var minus = this.view('minus');
                var label = this.view('label');
                var nodeIcon = this.view('nodeIcon');
                var nodeIconImg = this.view('nodeIconImg');
                var labelContainer = this.view('labelContainer');


                if (topo.showIcon() && topo.revisionScale() == 1) {

                    shape.dom().setStyle('stroke-width', 60 * stageScale);


                    nodeIconImg.set('iconType', this.nodeSet().iconType());

                    var iconSize = nodeIconImg.size();
                    var nodeSetLabelOffsetY = (rootNode._labelAngle > 225 && rootNode._labelAngle < 315) ? -12 * stageScale : 0;

                    minus.setTransform(bound.left + bound.width / 2 - 6 * stageScale, bound.top - iconSize.height * stageScale / 2 + nodeSetLabelOffsetY, 1 * stageScale);

                    nodeIcon.visible(true);
                    nodeIcon.setTransform(bound.left + bound.width / 2 - 6 * stageScale + iconSize.width * stageScale / 2, bound.top - iconSize.height * stageScale / 2 + nodeSetLabelOffsetY, 0.5 * stageScale);

                    label.sets({
                        x: bound.left + bound.width / 2 - 3 * stageScale + iconSize.width * stageScale,
                        y: bound.top - iconSize.height * stageScale / 2 - 22 * stageScale
                    });
                    label.view().dom().setStyle('font-size', 16 * stageScale);
//                    labelContainer.view().dom().setStyle('fill', this.color());

                } else {

                    shape.dom().setStyle('stroke-width', 30 * stageScale);

                    minus.setTransform(bound.left + bound.width / 2, bound.top - 45 * stageScale / 2, stageScale);
                    nodeIcon.visible(false);

                    label.sets({
                        x: bound.left + bound.width / 2 + 12 * stageScale,
                        y: bound.top - 45 * stageScale / 2
                    });
                    label.view().dom().setStyle('font-size', 16 * stageScale);
//                    labelContainer.view().dom().setStyle('fill', this.color());
                }
            }
        }

    });


})(nx, nx.global);