(function (nx, util, global) {

    nx.define("nx.graphic.Topology.NodeMixin", {
        events: [],
        properties: {
            nodeInstanceClass: {
                value: 'nx.graphic.Topology.Node'
            },
            nodeSetInstanceClass: {
                value: 'nx.graphic.Topology.NodeSet'
            },
            /**
             * @property showIcon
             */
            autoToggleIcon: {
                value: true
            },
            nodeDraggable: {
                value: true
            },
            useSmartLabel: {
                value: true
            },
            nodeScale: {},
            nodeRadius: {},
            nodeIconType: {},
            nodeLabel: {},
            nodeShowIcon: {
                value: false
            },
            nodeSelected: {
                value: false
            },
            nodeColor: {},
            showIcon: {
                value: false
            },
            /**
             * @property selectedNodes
             */
            selectedNodes: {
                value: function () {
                    return new nx.data.ObservableCollection();
                }
            }

        },
        methods: {
            initNode: function () {
                this.selectedNodes().on('change', function (sender, args) {
                    if (args.action == 'add') {
                        args.items[0].selected(true);
                    } else if (args.action == 'remove') {
                        args.items[0].selected(false);
                    } else if (args.action == "clear") {
                        nx.each(args.items, function (node) {
                            node.selected(false);
                        });
                    }
                });


                this.watch("showIcon", function (prop, value) {
                    this.eachNode(function (node) {
                        node.nodeShowIcon(value);
                    });
                }, this);
            },

            getBoundByNodes: function (inNodes, isNotIncludeLabel) {

                var boundAry = [];

                var lastIndex = inNodes.length - 1;

                nx.each(inNodes, function (node) {
                    if (isNotIncludeLabel) {
                        boundAry.push(node.getIconBound());
                    } else {
                        boundAry.push(node.getBound());
                    }
                });


                var bound = {
                    left: 0,
                    top: 0,
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0,
                    maxX: 0,
                    maxY: 0
                };
                //
                boundAry.sort(function (a, b) {
                    return a.left - b.left;
                });

                bound.x = bound.left = boundAry[0].left;
                bound.maxX = boundAry[lastIndex].left;

                boundAry.sort(function (a, b) {
                    return (a.left + a.width) - (b.left + b.width);
                });

                bound.width = boundAry[lastIndex].left + boundAry[lastIndex].width - bound.x;


                //
                boundAry.sort(function (a, b) {
                    return a.top - b.top;
                });

                bound.y = bound.top = boundAry[0].top;
                bound.maxY = boundAry[lastIndex].top;

                boundAry.sort(function (a, b) {
                    return (a.top + a.height) - (b.top + b.height);
                });

                bound.height = boundAry[lastIndex].top + boundAry[lastIndex].height - bound.y;

                return bound;


            },

            /**
             * Add a node to topology
             * @param obj
             * @param inOption
             * @returns {*}
             */
            addNode: function (obj, inOption) {
                var vertex = this.graph().addVertex(obj, inOption);
                this.adjustLayout();
                this.fire("addNode", this.getNode(vertex.id()));
                return this.getNode(vertex.id());
            },
            /**
             * Add a nodeSet
             * @param obj
             * @param inOption
             * @returns {*}
             */
            addNodeSet: function (obj, inOption) {
                var vertex = this.graph().addVertexSet(obj, inOption);
                this.adjustLayout();
                this.fire("addNodeSet", this.getNode(vertex.id()));
                return this.getNode(vertex.id());
            },
            aggregationNodes: function (inNodes, inName) {

                var vertexSet = {nodes: []};

                nx.each(inNodes, function (node) {
                    vertexSet.nodes.push(node.id());
                });

                vertexSet.label = inName;
                if (!inName) {
                    vertexSet.label = [inNodes[0].label(), inNodes[inNodes.length - 1].label()].sort().join("-");
                }

                vertexSet.x = inNodes[0].model().x();
                vertexSet.y = inNodes[0].model().y();


                this.addNodeSet(vertexSet);
            },
            /**
             * Remove a node
             * @param inNode
             * @returns {boolean}
             */
            removeNode: function (inNode) {
                var vertex;
                if (inNode instanceof  nx.graphic.Topology.Node) {
                    vertex = inNode.model();
                } else if (inNode instanceof  nx.data.Vertex) {
                    vertex = inNode;
                } else {
                    vertex = this.graph().getVertex(inNode);
                }
                if (vertex) {
                    this.graph().removeVertex(vertex);
                    this.adjustLayout();
                    this.fire("removeNode");
                    return true;
                } else {
                    return false;
                }
            },
            /**
             * Traverse each node
             * @method eachNode
             * @param fn
             * @param context
             */
            eachNode: function (fn, context) {
                this.getLayer("nodes").eachNode(fn, context || this);
                this.getLayer("nodeSet").eachNodeSet(fn, context || this);
            },
            /**
             * Get node by node id
             * @method getNode
             * @param id
             * @returns {*}
             */
            getNode: function (id) {
                return this.getLayer("nodes").getNode(id) || this.getLayer("nodeSet").getNodeSet(id);
            },

            getNodes: function () {
                return this.getLayer("nodes").nodes();
            }
        }
    });


})(nx, nx.graphic.util, nx.global);