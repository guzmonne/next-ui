(function (nx, global) {

    /**
     * Node mixin class
     * @class nx.graphic.Topology.NodeMixin
     * @module nx.graphic.Topology
     */
    nx.define("nx.graphic.Topology.NodeMixin", {
        events: ['addNode', 'addNodeSet', 'removeNode'],
        properties: {
            /**
             * Node instance class name, support function
             * @property nodeInstanceClass
             */
            nodeInstanceClass: {
                value: 'nx.graphic.Topology.Node'
            },
            /**
             * NodeSet instance class name, support function
             * @property nodeSetInstanceClass
             */
            nodeSetInstanceClass: {
                value: 'nx.graphic.Topology.NodeSet'
            },
            /**
             * Set node's draggable
             * @property nodeDraggable
             */
            nodeDraggable: {
                value: true
            },
            /**
             * Enable smart label
             * @property enableSmartLabel
             */
            enableSmartLabel: {
                value: true
            },
            /**
             * Show or hide node's icon
             * @property showIcon
             */
            showIcon: {
                get: function () {
                    return this._showIcon !== undefined ? this._showIcon : false;
                },
                set: function (value) {
                    if (this._showIcon !== value) {
                        this._showIcon = value;
                        if (this.status() !== "initializing") {
                            this.eachNode(function (node) {
                                node.showIcon(value);
                            });
                        }
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            /**
             * All node's config. key is node's property, support super binding
             * value could be a single string eg: color:'#f00'
             * value could be a an expression eg: label :'{model.id}'
             * value could be a function eg iconType : function (model,instance){ return  'router'}
             * value could be a normal binding expression eg : label :'{#label}'
             * @property {nodeConfig}
             */
            nodeConfig: {},
            /**
             * All nodeSet's config. key is node's property, support super binding
             * value could be a single string eg: color:'#f00'
             * value could be a an expression eg: label :'{model.id}'
             * value could be a function eg iconType : function (model,instance){ return  'router'}
             * value could be a normal binding expression eg : label :'{#label}'
             * @property {nodeSetConfig}
             */
            nodeSetConfig: {},
            /**
             * All selected nodes, could direct add/remove nodes to this collection
             * @property selectedNodes {nx.data.ObservableCollection}
             */
            selectedNodes: {
                value: function () {
                    return new nx.data.ObservableCollection();
                }
            }

        },
        methods: {
            initNode: function () {
                var selectedNodes = this.selectedNodes();
                selectedNodes.on('change', function (sender, args) {
                    if (args.action == 'add') {
                        nx.each(args.items, function (node) {
                            node.selected(true);
                            node.on('remove', this._removeSelectedNode = function () {
                                selectedNodes.remove(node);
                            }, this);
                        }, this);
                    } else if (args.action == 'remove') {
                        nx.each(args.items, function (node) {
                            node.selected(false);
                        }, this);
                    } else if (args.action == "clear") {
                        nx.each(args.items, function (node) {
                            node.selected(false);
                            node.off('remove', this._removeSelectedNode, this);
                        }, this);
                    }
                });
            },
            /**
             * Add a node to topology
             * @method addNode
             * @param obj
             * @param inOption
             * @returns {*}
             */
            addNode: function (obj, inOption) {
                var vertex = this.graph().addVertex(obj, inOption);
                var node = this.getNode(vertex.id());
                this.fire("addNode", node);
                return node;
            },

            /**
             * Add a nodeSet
             * @method addNodeSet
             * @param obj
             * @param [inOption]
             * @param [parentNodeSet]
             * @returns {*}
             */
            addNodeSet: function (obj, inOption, parentNodeSet) {
                var vertex = this.graph().addVertexSet(obj, inOption);
                var nodeSet = this.getNode(vertex.id());
                if (parentNodeSet) {
                    nodeSet.parentNodeSet(parentNodeSet);
                }
                this.fire("addNodeSet", nodeSet);
                return nodeSet;
            },
            aggregationNodes: function (inNodes, inConfig) {


                if (inNodes.length < 2) {
                    return;
                }


                var config = inConfig || {};
                var vertexSetData = nx.extend({nodes: []}, config);
                var parentNodeSet;
                var isSameParentNodeSet = true;

                nx.each(inNodes, function (node) {

                    var _parentNodeSet = node.parentNodeSet();

                    if (_parentNodeSet) {
                        // get the first parentNodeSet
                        if (!parentNodeSet) {
                            parentNodeSet = _parentNodeSet;
                        }
                        // check if all nodes in the same parent nodeSet
                        isSameParentNodeSet = parentNodeSet == _parentNodeSet;
                    }
                    vertexSetData.nodes.push(node.id());
                });


                if (!isSameParentNodeSet) {
                    alert(nx.graphic.Topology.i18n.cantAggregateNodesInDifferentNodeSet);
                    return;
                }

                //increment aggregate

                if (parentNodeSet && parentNodeSet.activated() === false) {
                    var _nodes = inNodes.slice(0);
                    var isIncrementAggregate = true;

                    parentNodeSet.eachVisibleSubNode(function (node) {
                        if (_nodes.indexOf(node) == -1) {
                            isIncrementAggregate = false;
                        } else {
                            _nodes.splice(_nodes.indexOf(node), 1);
                        }
                    });

                    // if select nodes in a same group
                    if (_nodes.length === 0) {
                        if (nx.util.values(parentNodeSet.visibleSubNodes()).length == inNodes.length) {
                            return;
                        }
                    }


                    if (isIncrementAggregate) {
                        parentNodeSet.activated(true);
                        _nodes.push(parentNodeSet);
                        this.aggregationNodes(_nodes, config);
                        return;
                    }
                }


                if (parentNodeSet) {
                    var includeExtraNode = false;
                    nx.each(inNodes, function (node) {
                        var _parentNodeSet = node.parentNodeSet();
                        if (!_parentNodeSet || parentNodeSet != _parentNodeSet) {
                            includeExtraNode = true;
                        }
                    }, this);


                    if (includeExtraNode) {
                        alert(nx.graphic.Topology.i18n.cantAggregateExtraNode);
                        return;
                    }
                }


                vertexSetData.label = config.name;
                if (config.name == null) {
                    vertexSetData.label = [inNodes[0].label(), inNodes[inNodes.length - 1].label()].sort().join("-");
                }

                vertexSetData.x = config.x == null ? inNodes[0].model().x() : config.x;
                vertexSetData.y = config.y == null ? inNodes[0].model().y() : config.y;
                //vertexSetData.root = rootNodeID || inNodes[0].id();

                var vertexSetConfig = {};
                if (parentNodeSet) {
                    vertexSetConfig.parentVertexSetID = parentNodeSet.id();
                }


                this.addNodeSet(vertexSetData, vertexSetConfig, parentNodeSet);
                this.stage().resetFitMatrix();
            },
            /**
             * Remove a node
             * @method removeNode
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
                    this.fire("removeNode");
                    return true;
                } else {
                    return false;
                }
            },
            removeNodeSet: function (inNodeSet) {
                if (inNodeSet.activated()) {
                    inNodeSet.activated(false);
                }
                var vertexSet = inNodeSet.model();
                this.graph().removeVertexSet(vertexSet);
            },

            deleteNode: function (inNode) {
                var model = inNode.model().getData();
                this.removeNode(inNode);
                this.graph().deleteVertex(model);

            },
            deleteNodeSet: function (inNodeSet) {
                var model = inNodeSet.model().getData();
                this.removeNodeSet(inNodeSet);
                this.graph().deleteVertexSet(model);
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
             * Iterate all visible nodes
             * @method eachNode
             * @param fn
             * @param context
             */
            eachVisibleNode: function (fn, context) {
                this.eachNode(function (node) {
                    if (node.visible()) {
                        fn.call(context || this, node);
                    }
                }, this);
            },
            /**
             * Get node by node id
             * @method getNode
             * @param id
             * @returns {*}
             */
            getNode: function (id) {
                return this.getLayer("nodes").getNode(id) || this.getLayer("nodeSet").getNodeSetByID(id);
            },
            /**
             * Get all visible nodes
             * @returns {Array}
             */
            getNodes: function () {
                return this.getLayer("nodes").nodes().concat(this.getLayer("nodeSet").nodeSetArray());
            },
            /**
             * Register a customize icon
             * @param name {String}
             * @param url {URL}
             * @param width {Number}
             * @param height {Number}
             */
            registerIcon: function (name, url, width, height) {
                var XLINK = 'http://www.w3.org/1999/xlink';
                var NS = "http://www.w3.org/2000/svg";
                var icon1 = document.createElementNS(NS, "image");
                icon1.setAttributeNS(XLINK, 'href', url);
                nx.graphic.Icons.icons[name] = {
                    size: {
                        width: width,
                        height: height
                    },
                    icon: icon1.cloneNode(true),
                    name: name
                };

                var icon = icon1.cloneNode(true);
                icon.setAttribute("height", height);
                icon.setAttribute("width", width);
                icon.setAttribute("data-device-type", name);
                icon.setAttribute("id", name);
                icon.setAttribute("class", 'deviceIcon');
                this.stage().addDef(icon);
            },
            /**
             * Batch action, highlight node and related nodes and connected links.
             * @param node
             */
            highlightRelatedNode: function (node) {
                var layer = this.getLayer('nodes');

                if (nx.is(node, 'nx.graphic.Topology.NodeSet')) {
                    layer = this.getLayer('nodeSet');
                }
                layer.highlightedElements().add(node);


                node.eachConnectedNode(function (n) {
                    layer.highlightedElements().add(n);
                }, this);


                this.getLayer('linkSet').highlightLinkSetArray(node.getLinkSet());
                this.getLayer('linkSet').fadeOut();
                this.getLayer('links').fadeOut();

//                this.getLayer('links').highlightLinks(node.getLinks());
//                this.getLayer('links').fadeOut();


                layer.fadeOut();
            },
            /**
             * Batch action, highlight node and related nodes and connected links.
             * @param node
             */
            activeRelatedNode: function (node) {
                var layer = this.getLayer('nodes');
                if (nx.is(node, 'nx.graphic.Topology.NodeSet')) {
                    layer = this.getLayer('nodeSet');
                }
                layer.activeElements().add(node);

                node.eachConnectedNode(function (n) {
                    layer.activeElements().add(n);
                }, this);

                this.getLayer('linkSet').activeLinkSetArray(node.getLinkSet());
                this.getLayer('links').activeLinks(node.getLinks());

                this.fadeOut();
            },
            /**
             * Get the bound of passing node's
             * @param inNodes {Array}
             * @param isNotIncludeLabel {Boolean}
             * @returns {Array}
             */

            getBoundByNodes: function (inNodes, isNotIncludeLabel) {

                if (inNodes.length === 0) {
                    return null;
                }

                var boundAry = [];


                nx.each(inNodes, function (node) {
                    if (node.visible()) {
                        if (isNotIncludeLabel) {
                            boundAry.push(node.getIconBound());
                        } else {
                            boundAry.push(this.getInsideBound(node.getBound()));
                        }
                    }
                }, this);


                var lastIndex = boundAry.length - 1;
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
            _moveSelectionNodes: function (event, node) {
                if (this.nodeDraggable()) {
                    var nodes = this.selectedNodes().toArray();
                    var stageScale = this.stageScale();
                    if (nodes.indexOf(node) === -1) {
                        node.move(event.drag.delta[0] * stageScale, event.drag.delta[1] * stageScale);
                    } else {
                        nx.each(nodes, function (node) {
                            node.move(event.drag.delta[0] * stageScale, event.drag.delta[1] * stageScale);
                        });
                    }
                }
            },
            expandAll: function () {
                var nodeSetLayer = this.getLayer('nodeSet');
                var isFinished = true;
                nodeSetLayer.eachVisibleNodeSet(function (nodeSet) {
                    nodeSet.collapsed(false);
                    isFinished = false;
                });
                if (!isFinished) {
                    this.disableCurrentScene(true);
                    this.on('expandNodeSet', this.expandAll, this);
                } else {
                    this.off('expandNodeSet', this.expandAll, this);
                    this.fit(function () {
                        setTimeout(function () {
                            this.disableCurrentScene(false);
                        }.bind(this), 800);

                    }, this);

                }

            }
        }
    });


})(nx, nx.global);