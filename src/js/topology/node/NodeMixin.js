(function (nx, global) {

    var util = nx.util;


    /**
     * Node mixin class
     * @class nx.graphic.Topology.NodeMixin
     * @module nx.graphic.Topology
     */
    nx.define("nx.graphic.Topology.NodeMixin", {
        events: ['addNode', 'deleteNode', 'addNodeSet'],
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
                    return new nx.data.UniqObservableCollection();
                }
            },
            activeNodes: {
                set: function (value) {
                    var nodesLayer = this.getLayer("nodes");
                    var nodeSetLayer = this.getLayer("nodeSet");
                    var watcher = this._activeNodesWatcher;
                    if (!watcher) {
                        watcher = this._activeNodesWatcher = new nx.graphic.Topology.NodeWatcher();
                        watcher.topology(this);
                        watcher.updater(function () {
                            var nodes = watcher.getNodes();
                            nx.each(nodes, function (node) {
                                if (node.model().type() == 'vertex') {
                                    nodesLayer.activeElements().add(node);
                                } else {
                                    nodeSetLayer.activeElements().add(node);
                                }
                            }, this);
                        }.bind(this));
                    }
                    nodesLayer.activeElements().clear();
                    nodeSetLayer.activeElements().clear();
                    watcher.nodes(value);
                    this._activeNodes = value;
                }
            },
            highlightedNodes: {
                set: function (value) {
                    var nodesLayer = this.getLayer("nodes");
                    var nodeSetLayer = this.getLayer("nodeSet");
                    var watcher = this._highlightedNodesWatcher;
                    if (!watcher) {
                        watcher = this._highlightedNodesWatcher = new nx.graphic.Topology.NodeWatcher();
                        watcher.topology(this);
                        watcher.updater(function () {
                            nx.each(watcher.getNodes(), function (node) {
                                if (node.model().type() == 'vertex') {
                                    nodesLayer.highlightedElements().add(node);
                                } else {
                                    nodeSetLayer.highlightedElements().add(node);
                                }
                            }, this);
                        }.bind(this));
                    }

                    nodesLayer.highlightedElements().clear();
                    nodeSetLayer.highlightedElements().clear();
                    watcher.nodes(value);
                    this._highlightedNodes = value;
                }
            },
            aggregationRule: {

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
                            node.off('remove', this._removeSelectedNode, this);
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
             * Remove a node
             * @method removeNode
             * @param arg
             * @returns {boolean}
             */
            removeNode: function (arg) {
                this.deleteNode(arg);
            },
            deleteNode: function (arg) {
                var id = arg;
                if (nx.is(arg, nx.graphic.Topology.AbstractNode)) {
                    id = arg.id();
                }
                var vertex = this.graph().getVertex(id);
                if (vertex) {
                    var node = this.getNode(id);
                    this.fire("deleteNode", node);
                    this.graph().deleteVertex(id);
                }
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
            removeNodeSet: function (arg) {
//                var id = arg;
//                if (nx.is(arg, nx.graphic.Topology.AbstractNode)) {
//                    id = arg.id();
//                }
//                var inNodeSet = this.getNode(id);
//                if (inNodeSet) {
//                    if (inNodeSet.activated()) {
//                        inNodeSet.activated(false);
//                    }
//                    //this.fire("removeNode", node);
//                    this.graph().removeVertexSet(id);
//                }
                this.deleteNodeSet(arg);
            },
            aggregationNodes: function (inNodes, inConfig) {
                if (inNodes.length < 2) {
                    return;
                }


                var nodes = [];
                nx.each(inNodes, function (n) {
                    if (nx.is(n, nx.graphic.Topology.AbstractNode)) {
                        nodes.push(n);
                    } else {
                        var node = this.getNode(n);
                        if (node) {
                            nodes.push(node);
                        }
                    }
                }, this);


                var config = inConfig || {};
                var vertexSetData = nx.extend({nodes: []}, config);
                var parentNodeSet;
                var isSameParentNodeSet = true;

                //check different parent nodeSet aggregate
                nx.each(nodes, function (node) {
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

                //check incremental aggregate

                if (parentNodeSet && parentNodeSet.activated() === false) {
                    var _nodes = nodes.slice(0);
                    var isIncrementAggregate = true;

                    nx.each(parentNodeSet.nodes(), function (node) {
                        if (_nodes.indexOf(node) == -1) {
                            isIncrementAggregate = false;
                        } else {
                            _nodes.splice(_nodes.indexOf(node), 1);
                        }
                    });

                    // if select nodes in a same group
                    if (_nodes.length === 0) {
                        if (nx.util.values(parentNodeSet.nodes()).length == nodes.length) {
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

                //check extra node aggregate into a nodeSet
                if (parentNodeSet) {
                    var includeExtraNode = false;
                    nx.each(nodes, function (node) {
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


                var aggregationRule = this.aggregationRule();
                if (aggregationRule && nx.is(aggregationRule, 'Function')) {
                    var result = aggregationRule.call(this, nodes, inConfig);
                    if (result === false) {
                        return;
                    }
                }

                vertexSetData.label = config.label;
                if (config.label == null) {
                    vertexSetData.label = [nodes[0].label(), nodes[nodes.length - 1].label()].sort().join("-");
                }

                vertexSetData.x = config.x == null ? nodes[0].model().x() : config.x;
                vertexSetData.y = config.y == null ? nodes[0].model().y() : config.y;
                //vertexSetData.root = rootNodeID || inNodes[0].id();

                var vertexSetConfig = {};
                if (parentNodeSet) {
                    vertexSetConfig.parentVertexSetID = parentNodeSet.id();
                }


                var nodeSet = this.addNodeSet(vertexSetData, vertexSetConfig, parentNodeSet);
                this.stage().resetFitMatrix();
                return nodeSet;
            },

            deleteNodeSet: function (arg) {
                if (!arg) {
                    return;
                }
                var id = arg;
                if (nx.is(arg, nx.graphic.Topology.AbstractNode)) {
                    id = arg.id();
                }
                var nodeSet = this.getNode(id);
                if (nodeSet) {
                    if (nodeSet.activated()) {
                        nodeSet.activated(false);
                    }
                    this.fire("deleteNodeSet", nodeSet);
                }
                this.graph().deleteVertexSet(id);
            },


            /**
             * Traverse each node
             * @method eachNode
             * @param callback
             * @param context
             */
            eachNode: function (callback, context) {
                this.getLayer("nodes").eachNode(callback, context || this);
                this.getLayer("nodeSet").eachNodeSet(callback, context || this);
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
            /**
             * Get all visible nodes
             * @returns {Array}
             */
            getNodes: function () {
                var nodes = this.getLayer("nodes").nodes();
                var nodeSets = this.getLayer("nodeSet").nodeSets();
                if (nodeSets && nodeSets.length !== 0) {
                    return nodes.concat(nodeSets);
                } else {
                    return nodes;
                }
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
                var nodeSetLayer = this.getLayer('nodeSet');
                var nodeLayer = this.getLayer('nodes');

                //highlight node
                if (nx.is(node, 'nx.graphic.Topology.NodeSet')) {
                    nodeSetLayer.highlightedElements().add(node);
                } else {
                    nodeLayer.highlightedElements().add(node);
                }


                // highlight connected nodes and nodeSets
                node.eachConnectedNode(function (n) {
                    if (nx.is(n, 'nx.graphic.Topology.NodeSet')) {
                        nodeSetLayer.highlightedElements().add(n);
                    } else {
                        nodeLayer.highlightedElements().add(n);
                    }
                }, this);


                // highlight connected links and linkSets
                this.getLayer('linkSet').highlightLinkSets(util.values(node.linkSets()));
                this.getLayer('links').highlightLinks(util.values(node.links()));
                this.getLayer('linkSet').fadeOut();
                this.getLayer('links').fadeOut();

                // fade Out layer
                nodeSetLayer.fadeOut();
                nodeLayer.fadeOut();
            },
            /**
             * Batch action, highlight node and related nodes and connected links.
             * @param node
             */
            activeRelatedNode: function (node) {


                var nodeSetLayer = this.getLayer('nodeSet');
                var nodeLayer = this.getLayer('nodes');

                // active node
                if (nx.is(node, 'nx.graphic.Topology.NodeSet')) {
                    nodeSetLayer.activeElements().add(node);
                } else {
                    nodeLayer.activeElements().add(node);
                }


                // highlight connected nodes and nodeSets
                node.eachConnectedNode(function (n) {
                    if (nx.is(n, 'nx.graphic.Topology.NodeSet')) {
                        nodeSetLayer.activeElements().add(n);
                    } else {
                        nodeLayer.activeElements().add(n);
                    }
                }, this);


                // highlight connected links and linkSets
                this.getLayer('linkSet').activeLinkSets(util.values(node.linkSets()));
                this.getLayer('links').activeLinks(util.values(node.links()));
                this.getLayer('linkSet').fadeOut();
                this.getLayer('links').fadeOut();

                // fade Out layer
                nodeSetLayer.fadeOut();
                nodeLayer.fadeOut();

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
            expandNodes: function (nodes, sourcePosition, callback, context, isAnimate) {

                var nodesLength = nx.is(nodes, Array) ? nodes.length : nx.util.keys(nodes).length;
                callback = callback || function () {
                };


                if (nodesLength > 150 || nodesLength === 0 || isAnimate === false) {
                    callback.call(context || this, this);
                } else {

                    var positionMap = [];
                    nx.each(nodes, function (node) {
                        positionMap.push({
                            id: node.id(),
                            position: node.position(),
                            node: node
                        });
                        node.position(sourcePosition);
                    }, this);


                    var ani = new nx.graphic.Animation({
                        duration: 600
                    });
                    ani.callback(function (progress) {
                        nx.each(positionMap, function (item) {
                            var _position = item.position;
                            var node = item.node;
                            node.position({
                                x: sourcePosition.x + (_position.x - sourcePosition.x) * progress,
                                y: sourcePosition.y + (_position.y - sourcePosition.y) * progress
                            });
                        });
                    }.bind(this));

                    ani.complete(function () {
                        callback.call(context || this, this);
                    }.bind(this));
                    ani.start();
                }
            },
            collapseNodes: function (nodes, targetPosition, callback, context, isAnimate) {
                var nodesLength = nx.is(nodes, Array) ? nodes.length : nx.util.keys(nodes).length;
                callback = callback || function () {
                };


                if (nodesLength > 150 || nodesLength === 0 || isAnimate === false) {
                    callback.call(context || this, this);
                } else {
                    var positionMap = [];
                    nx.each(nodes, function (node) {
                        positionMap.push({
                            id: node.id(),
                            position: node.position(),
                            node: node,
                            vertex: node.model(),
                            vertexPosition: node.model().position()
                        });
                    }, this);


                    var ani = new nx.graphic.Animation({
                        duration: 600
                    });
                    ani.callback(function (progress) {
                        nx.each(positionMap, function (item) {
                            var _position = item.position;
                            var node = item.node;
                            node.position({
                                x: _position.x - (_position.x - targetPosition.x) * progress,
                                y: _position.y - (_position.y - targetPosition.y) * progress
                            });
                        });
                    }.bind(this));

                    ani.complete(function () {
                        nx.each(positionMap, function (item) {
                            item.vertex.position(item.vertexPosition);
                        });
                        callback.call(context || this, this);
                    }.bind(this));
                    ani.start();
                }
            },
            _expandAll: function () {
                var nodeSetLayer = this.getLayer('nodeSet');
                var isFinished = true;
                nodeSetLayer.eachNodeSet(function (nodeSet) {
                    nodeSet.collapsed(false);
                    isFinished = false;
                });

                if (!isFinished) {

                    this.disableCurrentScene(true);
                    this.on('expandNodeSet', this.expandAll, this);
                } else {
                    this.stage().resetFitMatrix();
                    this.off('expandNodeSet', this.expandAll, this);
                    this.fit(function () {
                        setTimeout(function () {
                            this.disableCurrentScene(false);
                        }.bind(this), 1200);

                    }, this);

                }

            }
        }
    });


})(nx, nx.global);