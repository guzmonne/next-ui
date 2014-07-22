(function (nx, global) {

    var FillStage = nx.define({
        methods: {
            fillStage: function () {
                this.fit(null, null, false);

                var rate;
                var width = this.width();
                var height = this.height();
                var padding = this.padding();
                var graphicBound = this.getBoundByNodes();

                //scale
                var xRate = (width - padding * 2) / graphicBound.width;
                var yRate = (height - padding * 2) / graphicBound.height;

                this.eachNode(function (node) {
                    if (node.visible()) {
                        var absolutePosition = node.absolutePosition();
                        node.absolutePosition({
                            x: (absolutePosition.x - graphicBound.left) * xRate + padding,
                            y: (absolutePosition.y - graphicBound.top) * yRate + padding
                        });
                    }
                });

                this.fit(null, null, false);

            }
        }
    });


    nx.graphic.Topology.registerExtension(FillStage);


})(nx, nx.global);