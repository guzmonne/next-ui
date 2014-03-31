(function (nx, util, global) {


    /**
     * Nodes layer
     Could use topo.getLayer('nodes') get this
     * @class nx.graphic.Topology.NodesLayer
     * @extend nx.graphic.Topology.Layer
     *
     */
    nx.define('nx.graphic.Topology.NodesLayer', nx.graphic.Topology.Layer, {
        events: ['clickNode', 'enterNode', 'leaveNode', 'dragNodeStart', 'dragNode', 'dragNodeEnd', 'hideNode', 'pressNode', 'selectNode', 'updateNodeCoordinate'],
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
                topo.on('projectionChange', this._projectionChangeFN = function (sender, event) {
                    var projectionX = topo.projectionX();
                    var projectionY = topo.projectionY();
                    var nodes = this.nodes();
                    nx.each(nodes, function (node) {
                        var model = node.model();
                        node.position({
                            x: projectionX.get(model.get('x')),
                            y: projectionY.get(model.get('y'))
                        });
                    }, this);
                }, this);


                topo.watch('revisionScale', this._watchRevisionScale = function (prop, value) {
                    var nodes = this.nodes();
                    if (value == 1) {

                        nx.each(nodes, function (node) {
                            if (topo.showIcon()) {
                                node.showIcon(true);
                            } else {
                                node.radius(6);
                            }
                            node.view('label').set('visible', true);
                        });
                    } else if (value == 0.8) {
                        nx.each(nodes, function (node) {
                            node.showIcon(false);
                            node.radius(6);
                            node.view('label').set('visible', true);
                        });
                    } else if (value == 0.6) {
                        nx.each(nodes, function (node) {
                            node.showIcon(false);
                            node.radius(4);
                            node.view('label').set('visible', true);
                        });

                    } else if (value == 0.4) {
                        nx.each(nodes, function (node) {
                            node.showIcon(false);
                            node.radius(2);
                            node.view('label').set('visible', false);
                        });
                    }

                }, this);


            },
            /**
             * Add node a nodes layer
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
                node.attach(this.resolve('static'));
            },

            /**
             * Remove node
             * @method removeNode
             * @param vertex
             */
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
                var Clz;
                //get node class
                var topo = this.topology();
                var nodeInstanceClass = topo.nodeInstanceClass();
                if (nx.is(nodeInstanceClass, 'Function')) {
                    Clz = nodeInstanceClass.call(this, vertex);
                    if (nx.is(clz, 'String')) {
                        Clz = nx.path(global, Clz);
                    }
                } else {
                    Clz = nx.path(global, nodeInstanceClass);
                }

                var node = new Clz();
                node.set('topology', topo);
                node.setModel(vertex);

                node.set('class', 'node');
                node.resolve('@root').set('data-node-id', node.id());

                var defaultConfig = {
                };
                var nodeConfig = nx.extend(defaultConfig, topo.nodeConfig());
                nx.each(nodeConfig, function (value, key) {
                    util.setProperty(node, key, value, topo);
                }, this);
                util.setProperty(node, 'showIcon', topo.showIcon());
                util.setProperty(node, 'label', nodeConfig.label, topo);


                var superEvents = nx.graphic.Component.__events__;
                nx.each(node.__events__, function (e) {
                    if (superEvents.indexOf(e) == -1) {
                        node.on(e, function (sender, event) {
                            this.fire(e, node);
                        }, this);
                    }
                }, this);

                node.on('dragNode', function (sender, event) {
                    this._moveSelectionNodes(event, node);
                }, this);


                node.set('data-node-id', vertex.id());
                return node;
            },

            /**
             * Iterate all nodes
             * @method eachNode
             * @param fn
             * @param context
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
             * Get node's connected links
             * @method getNodeConnectedLinks
             * @param node
             * @returns {Array}
             */
            getNodeConnectedLinks: function (node) {
                var links = [];
                var model = node.model();
                var topo = this.topology();
                model.eachEdge(function (edge) {
                    var id = edge.id();
                    var link = topo.getLink(id);
                    links.push(link);
                }, this);
                return links;
            },
            /**
             * Get node connected linkSet
             * @property getNodeConnectedLinkSet
             * @param node
             * @returns {Array}
             */
            getNodeConnectedLinkSet: function (node) {
                var model = node.model();
                var topo = this.topology();
                var linkSetAry = [];

                model.eachEdgeSet(function (edgeSet) {
                    var linkSet = topo.getLinkSetByLinkKey(edgeSet.linkKey());
                    linkSetAry.push(linkSet);
                });
                return linkSetAry;

            },
            /**
             * HighLight node, after call this, should call fadeOut();
             * @method highlightNode
             * @param node
             */
            highlightNode: function (node) {
                this.highlightElement(node);
            },
            /**
             * Batch action, highlight node and related nodes and connected links.
             * @param node
             */
            highlightRelatedNode: function (node) {
                var topo = this.topology();

                this.highlightElement(node);

                node.eachConnectedNodes(function (n) {
                    this.highlightElement(n);
                }, this);


                if (topo.supportMultipleLink()) {
                    topo.getLayer('linkSet').highlightLinkSet(this.getNodeConnectedLinkSet(node));
                    topo.getLayer('linkSet').fadeOut();
                    topo.getLayer('links').fadeOut();
                } else {
                    topo.getLayer('links').highlightLinks(this.getNodeConnectedLinks(node));
                    topo.getLayer('links').fadeOut();
                }

                this.fadeOut();
            },
            _moveSelectionNodes: function (event, node) {
                var topo = this.topology();
                if (topo.nodeDraggable()) {
                    var nodes = topo.selectedNodes().toArray();
                    if (nodes.indexOf(node) === -1) {
                        node.move(event.drag.delta[0], event.drag.delta[1]);
                    } else {
                        nx.each(nodes, function (node) {
                            node.move(event.drag.delta[0], event.drag.delta[1]);
                        });
                    }
                }
            },
            /**
             * Rest
             */
            resetPosition: function () {
                var nodes = this.nodes();
                nx.each(nodes, function (node) {
                    var model = node.model();
                    node.moveTo(projectionX.get(model.get('x')), projectionY.get(model.get('y')));
                }, this);
            },
            clear: function () {
                nx.each(this.nodes(), function (node) {
                    node.dispose();
                });

                this.nodes([]);
                this.nodesMap({});
                this.inherited();
            },
            dispose: function () {
                topo.off('projectionChange', this._projectionChangeFN, this);
                topo.unwatch('revisionScale', this._watchRevisionScale, this);
                this.inherited();
            }
        }
    });


})(nx, nx.util, nx.global);