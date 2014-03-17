(function (nx, util, global) {

    nx.define("nx.graphic.Topology.Categories", {
        events: [],
        properties: {
        },
        methods: {
            /**
             * Fade out all nodes & links
             * @method fadeOut
             * @param force
             */
            fadeOut: function (force) {

                this.eachNode(function (node) {
                    node.fadeOut(force);
                });

                this.eachLink(function (link) {
                    link.fadeOut(force)
                });

            },
            /**
             * Fade in all nodes/links
             * @method fadeIn
             * @param force
             */
            fadeIn: function (force) {

                this.eachNode(function (node) {
                    node.fadeIn(force);
                });

                this.eachLink(function (link) {
                    link.fadeIn(force)
                });

            },
            /**
             * Highlight a certain node
             * @method highlightNode
             * @param node
             * @param force
             */
            highlightNode: function (node, force) {
                this.getLayer("nodes").fadeOut();
                this.getLayer("links").fadeOut();


                if (force) {
                    node.fadeIn();
                    node.eachLink(function (link) {
                        var sourceNode = link.getSourceNode();
                        var targetNode = link.getTargetNode();
                        if (sourceNode.enable() && targetNode.enable()) {
                            link.fadeIn();
                            link.selected(true);
                            sourceNode.fadeIn();
                            targetNode.fadeIn();
                        }
                    });
                } else {
                    node.lighting();
                    node.eachLink(function (link) {
                        var sourceNode = link.getSourceNode();
                        var targetNode = link.getTargetNode();
                        if (sourceNode.enable() && targetNode.enable()) {
                            link.lighting();
                            link.selected(true);
                            sourceNode.lighting();
                            targetNode.lighting();
                        }
                    });
                }
            },

            /**
             * Highlight nodes
             * @method highlightNodes
             * @param nodes {Array} Nodes array
             */
            highlightNodes: function (nodes) {
                this.eachNode(function (node) {
                    if (nodes.indexOf(node) == -1) {
                        node.fadeOut(true);
                    }
                });
                this.eachLink(function (link) {
                    var sourceNode = link.getSourceNode();
                    var targetNode = link.getTargetNode();

                    if (sourceNode.fade() || targetNode.fade()) {
                        link.fadeOut(true);
                    }
                }, this);
            },


            /**
             * Recover all fade statues
             * @method recover
             * @param force
             */
            recover: function (force) {
                this.getLayer("nodes").recover(force);
                this.getLayer("links").recover(force);
            }
        }
    });


})(nx, nx.util, nx.global);