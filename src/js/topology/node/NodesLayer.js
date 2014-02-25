(function (nx, util, global) {
    /**
     * Nodes layer
     Could use topo.getLayer("nodesLayer") get this
     * @class nx.graphic.Topology.NodesLayer
     * @extend nx.graphic.Topology.Layer
     *
     */
    nx.define("nx.graphic.Topology.NodesLayer", nx.graphic.Topology.Layer, {
        /**
         * @event clickNode
         */
        /**
         * @event enterNode
         */
        /**
         * @event leaveNode
         */
        /**
         * @event dragNodeStart
         */
        /**
         * @event dragNode
         */
        /**
         * @event dragNodeEnd
         */
        events: ["clickNode", 'enterNode', 'leaveNode', 'dragNodeStart', 'dragNode', 'dragNodeEnd', 'hideNode', 'pressNode'],
        properties: {
            /**
             * Get all nodes
             * @property nodes
             */
            nodes: {
                value: function () {
                    return [];
                }
            },
            /**
             * Get all node's map , id is key
             * @property nodesMap
             */
            nodesMap: {
                value: function () {
                    return {};
                }
            }
        },
        methods: {
            attach: function (args) {

                this.inherited(args);


                var topo = this.topology();
//                topo.watch("revisionScale", this._watchRevisionScale = function (prop, value) {
//
//                }, this);
//
//
//                topo.watch("showIcon", this._watchShowIcon = function (prop, value) {
//                    this.eachNode(function (node) {
//                        node.showIcon(value);
//                    }, this);
//                }, this);
//
//                var updateNodesByScale = util.debounce(function (scale) {
//                    var showLabel = scale > 0.5;
//                    var fontSize = Math.min(Math.floor(7 + 5 * scale), 13);
//                    var radius;
//                    if (scale <= 1) {
//                        radius = Math.round(scale * 5);
//                    } else {
//                        radius = 5;
//                    }
//                    this.eachNode(function (node) {
//                        node.resolve("label").visible(showLabel);
//                        node.dotRadius(radius);
//                        node.fontSize(fontSize);
//                    }, this);
//                }.bind(this), 100);
//
//
//                topo.watch("scale", this._watchScale = function (prop, value) {
//                    updateNodesByScale(value);
//                    //
//                }, this);


//                model.watch("position", function (prop, value) {
//                    this.position({x: projectionX.get(value.x), y: projectionY.get(value.y)});
//                }, this);

                topo.on("projectionChange", this._projectionChangeFN = function (sender, event) {
                    var projectionX = topo.projectionX();
                    var projectionY = topo.projectionY();
                    var nodes = this.nodes();
                    nx.each(nodes, function (node) {
                        var model = node.model();
                        node.position({
                            x: projectionX.get(model.get("x")),
                            y: projectionY.get(model.get("y"))
                        });
                    }, this);
                }, this);
            },
            /**
             * Add node a layer
             * @param vertex
             * @method addNode
             */
            addNode: function (vertex) {
                var nodesMap = this.nodesMap();
                var nodes = this.nodes();
                var id = vertex.id();

                var node = this._generateNode(vertex);
                nodes.push(node);
                nodesMap[id] = node;

                node.attach(this);
            },


            removeNode: function (vertex) {
                var nodesMap = this.nodesMap();
                var nodes = this.nodes();
                var id = vertex.id();
                var node = nodesMap[id];
                node.dispose();

                nodes.splice(nodes.indexOf(node), 1);
                delete nodesMap[id];
            },
            updateNode: function (vertex) {

//                //todo
//                var nodesMap = this.nodesMap();
//
//                nodesMap[vertex.id()].visible(vertex.visible());
                //nodesMap[vertex.id()].fadeOut();
            },
            _generateNode: function (vertex) {
                var topo = this.topology();
                var nodeInstanceClass = topo.nodeInstanceClass();
                var clz = nx.path(global, nodeInstanceClass);

                var node = new clz();
                node.sets({
                    owner: this,
                    topology: topo
                });
                node.setModel(vertex);

                node.set("class", "node");

//                node.on("mousedown", function (sender, event) {
//                    nx.eventObject = event;
//                    this.fire("pressNode", node);
//                    event.stop();
//                }, this);
//
//                node.on("mouseup", function (sender, event) {
//                    nx.eventObject = event;
//                    this.fire("clickNode", node);
//                    event.stop();
//                }, this);
//
//                node.on("mouseenter", function (sender, event) {
//                    nx.eventObject = event;
//                    this.fire("enterNode", node);
//                }, this);
//
//                node.on("mouseleave", function (sender, event) {
//                    nx.eventObject = event;
//                    this.fire("leaveNode", node);
//                }, this);
//
//                node.on("hide", function (sender, event) {
//                    this.fire("hideNode", node);
//                }, this);
//
//                node.on("dragstart", function (sender, event) {
//                    nx.eventObject = event;
//
//                    this._dragNodeStartOffset = event.getPageXY();
//
//                    this.fire("dragNodeStart", node);
//                }, this);
//
//                node.on("drag", function (sender, event) {
//                    nx.eventObject = event;
//
//                    this._moveSelectionNodes(event, node);
//
//                    this.fire("dragNode", node);
//                    this.topology().fire("updating");
//                }, this);
//
//                node.on("dragend", function (sender, event) {
//                    nx.eventObject = event;
//
//                    this._dragNodeStartOffset = null;
//
//                    this.fire("dragNodeEnd", node);
//                }, this);

                node.set("data-node-id", vertex.id());

                return node;
            },
            /**
             * Traverse all nodes
             * @param fn
             * @param context
             * @method eachNode
             */
            eachNode: function (fn, context) {
                nx.each(this.nodes(), fn, context || this);
            },
            /**
             * Get node by id
             * @param id
             * @returns {*}
             * @method getNode
             */
            getNode: function (id) {
                var nodesMap = this.nodesMap();
                return nodesMap[id];
            },
            /**
             * Fade out all nodes
             * @param force
             * @method fadeOut
             */
            fadeOut: function (force) {
                this.eachNode(function (node) {
                    if (node.fadeOut) {
                        node.fadeOut(force);
                    }
                });
            },
            /**
             * Fade in all nodes
             * @param force
             * @method fadeIn
             */
            fadeIn: function (force) {
                this.eachNode(function (node) {
                    if (node.fadeIn) {
                        node.fadeIn(force);
                    }
                });
            },
            /**
             * Lighting all nodes
             * @method lighting
             */
            lighting: function () {
                this.eachNode(function (node) {
                    if (node.lighting) {
                        node.lighting();
                    }
                });
            },
            /**
             * Recover all nodes status
             * @param force
             * @method recover
             */
            recover: function (force) {
                this.eachNode(function (node) {
                    if (node.fadeIn) {
                        node.fadeIn(force);
                    }
                });
            },
            clear: function () {

                this.topology().off("projectionChange", this._projectionChangeFN, this);

                nx.each(this.nodes(), function (node) {
                    node.dispose();
                });
                this.nodes([]);
                this.nodesMap({});
                this.inherited();
            },
            _moveSelectionNodes: function (event, node) {
                var topo = this.topology();
                var nodes = topo.selectedNodes();
                if (nodes.indexOf(node) !== -1) {
                    nodes = util.without(nodes.toArray(), node);

                    var startOffset = this._dragNodeStartOffset;
                    var offset = event.getPageXY();
                    if (startOffset) {
                        var x = offset.x - startOffset.x;
                        var y = offset.y - startOffset.y;
                        nx.each(nodes, function (node) {
                            node.move(x, y);
                        });
                    }
                    this._dragNodeStartOffset = offset;
                }
            }
        }
    });


})(nx, nx.graphic.util, nx.global);