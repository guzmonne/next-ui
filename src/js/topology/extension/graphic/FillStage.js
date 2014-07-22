(function (nx, global) {

    var FillStage = nx.define({
        methods: {
            fillStage: function () {
                this.fit(null, null, false);

                var width = this.width();
                var height = this.height();
                var padding = this.padding() / 3;
                var graphicBound = this.getBoundByNodes();

                //scale
                var xRate = (width - padding * 2) / graphicBound.width;
                var yRate = (height - padding * 2) / graphicBound.height;


                var topoMatrix = this.matrix();
                var stageScale = topoMatrix.scale();


                this.graph().vertexSets().each(function (item) {
                    var vs = item.value();
                    if (vs.parentVertexSet() == null) {
                        var position = vs.position();
                        var absolutePosition = {
                            x: position.x * stageScale + topoMatrix.x(),
                            y: position.y * stageScale + topoMatrix.y()
                        };

                        vs.position({
                            x: ((absolutePosition.x - graphicBound.left) * xRate + padding - topoMatrix.x()) / stageScale,
                            y: ((absolutePosition.y - graphicBound.top) * yRate + padding - topoMatrix.y()) / stageScale
                        });
                    }
                });


                this.graph().vertices().each(function (item) {
                    var vertex = item.value();
                    if (vertex.parentVertexSet() == null) {
                        var position = vertex.position();
                        var absolutePosition = {
                            x: position.x * stageScale + topoMatrix.x(),
                            y: position.y * stageScale + topoMatrix.y()
                        };

                        vertex.position({
                            x: ((absolutePosition.x - graphicBound.left) * xRate + padding - topoMatrix.x()) / stageScale,
                            y: ((absolutePosition.y - graphicBound.top) * yRate + padding - topoMatrix.y()) / stageScale
                        });
                    }
                });


//                this.eachNode(function (node) {
//                    if (node.visible()) {
//                        var absolutePosition = node.absolutePosition();
//                        node.absolutePosition({
//                            x: (absolutePosition.x - graphicBound.left) * xRate + padding,
//                            y: (absolutePosition.y - graphicBound.top) * yRate + padding
//                        });
//                    }
//                });

                this.fit(null, null, false);

            }
        }
    });


    nx.graphic.Topology.registerExtension(FillStage);


})(nx, nx.global);