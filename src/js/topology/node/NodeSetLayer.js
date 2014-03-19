(function (nx, util, global) {
    'use strict';


    /**
     * Nodes layer
     Could use topo.getLayer('nodesLayer') get this
     * @class nx.graphic.Topology.NodesLayer
     * @extend nx.graphic.Topology.Layer
     *
     */
    nx.define('nx.graphic.Topology.NodeSetLayer', nx.graphic.Topology.Layer, {
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
        events: ['clickNodeSet', 'enterNodeSet', 'leaveNodeSet', 'dragNodeSetStart', 'dragNodeSet', 'dragNodeSetEnd', 'hideNodeSet', 'pressNodeSet', 'selectNodeSet', 'updateNodeSetCoordinate', 'expandNodeSet', 'collapseNodeSet'],
        properties: {
            nodeSet: {
                value: function () {
                    return [];
                }
            },
            nodeSetMap: {
                value: function () {
                    return {};
                }
            },
            highlightedNodeSet: {
                value: function () {
                    return [];
                }
            }
        },
        view: {
            type: 'nx.graphic.Group',
            content: [
                {
                    name: 'activated',
                    type: 'nx.graphic.Group'
                },
                {
                    name: 'static',
                    type: 'nx.graphic.Group',
                    props: {
                        'class': 'n-transition'
                    }
                }

            ]
        },
        methods: {
            attach: function () {
                this.attach.__super__.apply(this, arguments);
                var topo = this.topology();
                topo.on('projectionChange', this._projectionChangeFN = function (sender, event) {
                    var projectionX = topo.projectionX();
                    var projectionY = topo.projectionY();
                    var nodeSet = this.nodeSet();
                    nx.each(nodeSet, function (nodeset) {
                        var model = nodeset.model();
                        nodeset.position({
                            x: projectionX.get(model.get('x')),
                            y: projectionY.get(model.get('y'))
                        });
                    }, this);
                }, this);
            },
            draw: function () {

            },
            /**
             * Add node a nodes layer
             * @param vertexSet
             * @method addNode
             */
            addNodeSet: function (vertexSet) {
                var nodeSetMap = this.nodeSetMap();
                var nodeSet = this.nodeSet();
                var id = vertexSet.id();

                var nodeset = this._generateNodeSet(vertexSet);

                nodeSet.push(nodeset);
                nodeSetMap[id] = nodeset;
                nodeset.attach(this.resolve('static'));
            },


            removeNodeSet: function (vertexSet) {
                var nodeSetMap = this.nodeSetMap();
                var nodeSet = this.nodeSet();
                var id = vertexSet.id();
                var nodeset = nodeSetMap[id];

                nodeset.dispose();
                nodeSet.splice(nodeSet.indexOf(nodeset), 1);
                delete nodeSetMap[id];
            },
            updateNodeSet: function (nodeSetMap) {

//                //todo
//                var nodesMap = this.nodesMap();
//
//                nodesMap[vertex.id()].visible(vertex.visible());
                //nodesMap[vertex.id()].fadeOut();
            },
            _generateNodeSet: function (vertexSet) {
                var Clz;
                //get node class
                var topo = this.topology();
                var nodeSetInstanceClass = topo.nodeSetInstanceClass();
                if (nx.is(nodeSetInstanceClass, 'Function')) {
                    Clz = nodeSetInstanceClass.call(this, vertexSet);
                    if (nx.is(Clz, 'String')) {
                        Clz = nx.path(global, Clz);
                    }
                } else {
                    Clz = nx.path(global, nodeSetInstanceClass);
                }

                var nodeset = new Clz();
                nodeset.set('topology', topo);
                nodeset.setModel(vertexSet);

                nodeset.set('class', 'node');
                nodeset.resolve('@root').set('data-node-id', nodeset.id());
                nodeset.setProperty('nodeScale', topo.nodeScale());
                nodeset.setProperty('radius', topo.nodeRadius());
                nodeset.setProperty('enableSmartLabel', topo.enableSmartLabel());
                nodeset.setProperty('iconType', topo.nodeIconType() || 'groupS');
                nodeset.setProperty('showIcon', topo.nodeShowIcon());
                nodeset.setProperty('selected', topo.nodeSelected());
                nodeset.setProperty('color', topo.nodeColor());

                nodeset.setProperty('label', topo.nodeLabel());
                nodeset.on('nodemousedown', function (sender, event) {
                    this.fire('pressNodeSet', nodeset);
                }, this);

                nodeset.on('nodemouseup', function (sender, event) {
                    this.fire('clickNodeSet', nodeset);
                }, this);

                nodeset.on('nodemouseenter', function (sender, event) {
                    this.fire('enterNodeSet', nodeset);

                }, this);

                nodeset.on('nodemouseleave', function (sender, event) {
                    this.fire('leaveNodeSet', nodeset);
                }, this);

                nodeset.on('nodeselected', function (sender, event) {
                    this.fire('selectNodeSet', nodeset);
                }, this);

                nodeset.on('hide', function (sender, event) {
                    this.fire('hideNodeSet', nodeset);
                }, this);

                nodeset.on('nodedragstart', function (sender, event) {
                    this._moveSelectionNodes(event, nodeset);
                    this.fire('dragNodeSetStart', nodeset);
                }, this);

                nodeset.on('nodedrag', function (sender, event) {
                    this._moveSelectionNodes(event, nodeset);
                    this.fire('dragNodeSet', nodeset);
                }, this);

                nodeset.on('nodedragend', function (sender, event) {
                    this.fire('dragNodeSetEnd', nodeset);
                }, this);

                vertexSet.on('updateCoordinate', function (sender, position) {
                    this.fire('updateNodeSetCoordinate', nodeset);
                }, this);
                nodeset.on('collapseNodeSet', function (sender, position) {
                    this.fire('collapseNodeSet', nodeset);
                }, this);
                nodeset.on('expandNodeSet', function (sender, position) {
                    this.fire('expandNodeSet', nodeset);
                }, this);


                nodeset.set('data-node-id', vertexSet.id());
                return nodeset;
            },

            /**
             * Iterate all nodeSet
             * @method eachNode
             * @param fn
             * @param context
             */
            eachNodeSet: function (fn, context) {
                nx.each(this.nodeSet(), fn, context || this);
            },
            /**
             * Get node by id
             * @param id
             * @returns {*}
             * @method getNode
             */
            getNodeSet: function (id) {
                var nodeSetMap = this.nodeSetMap();
                return nodeSetMap[id];
            },
            /**
             * Fade out all nodes
             * @method fadeOut
             */
            fadeOut: function (fn, context) {
                var el = this.resolve('static');
                el.upon('transitionend', function () {
                    if (fn) {
                        fn.call(context || this);
                    }
                }, this);
                el.root().setStyle('fill-opacity', 0.2);
            },
            /**
             * Fade in all nodes
             * @method fadeIn
             */
            fadeIn: function (fn, context) {
                var el = this.resolve('static');
                el.upon('transitionend', function () {
                    if (fn) {
                        fn.call(context || this);
                    }
                }, this);

                el.root().setStyle('fill-opacity', 1);
                //this.topology().getLayer('links').fadeIn();
            },
            getNodeConnectedLinks: function (nodeset) {
                var links = [];
                var model = nodeset.model();
                var topo = this.topology();
                model.eachEdge(function (edge) {
                    var id = edge.id();
                    var link = topo.getLink(id);
                    links.push(link);
                }, this);
                return links;
            },
            getNodeConnectedLinkSet: function (nodeset) {
                var model = nodeset.model();
                var topo = this.topology();
                var linkSetAry = [];

                model.eachEdgeSet(function (edgeSet) {
                    var linkSet = topo.getLinkSetByLinkKey(edgeSet.linkKey());
                    linkSetAry.push(linkSet);
                }, this);
                return linkSetAry;
            },
            highlightNode: function (nodeset) {
                var highlightedNodeSet = this.highlightedNodeSet();
                var el = this.resolve('activated');

                this.highlightedNodeSet().push(nodeset);
                nodeset.append(el);
                nodeset.eachConnectedNodes(function (nodeset) {
                    this.highlightedNodeSet().push(nodeset);
                    nodeset.append(el);
                }, this);

                var topo = this.topology();
                if (topo.supportMultipleLink()) {
                    topo.getLayer('linkSet').highlightLinkSet(this.getNodeConnectedLinkSet(nodeset));
                } else {
                    topo.getLayer('links').highlightLinks(this.getNodeConnectedLinks(nodeset));
                }
                topo.getLayer('links').fadeOut();
                this.fadeOut();
            },
//            highlightNodes: function (nodes) {
//                this.recover();
//                nx.each(nodes, function (node) {
//                    this.highlightedNodeSet().push(node);
//                    node.append(this.resolve('activated'));
//                }, this);
//
//
//                var topo = this.topology();
//                topo.getLayer('links').highlightLinks(node.getLinks());
//                topo.getLayer('links').fadeOut();
//
//                this.fadeOut();
//            },
            /**
             * Recover all nodes status
             * @method recover
             */
            recover: function () {
                this.fadeIn(function () {
                    nx.each(this.highlightedNodeSet(), function (node) {
                        node.append(this.resolve('static'));
                    }, this);
                    this.highlightedNodeSet([]);
                }, this);
            },
            resetProjection: function () {
                var nodes = this.nodes();
                nx.each(nodes, function (node) {
                    var model = node.model();
                    node.moveTo(projectionX.get(model.get('x')), projectionY.get(model.get('y')));
                }, this);
            },
            clear: function () {
                //this.topology().off('projectionChange', this._projectionChangeFN, this);
                nx.each(this.nodeSet(), function (nodeset) {
                    nodeset.dispose();
                });

                this.nodeSet([]);
                this.nodeSetMap({});
                this.$('activated').empty();
                this.$('static').empty();
                this.$('static').setStyle('fill-opacity', 1);
            },
            _moveSelectionNodes: function (event, node) {
                var topo = this.topology();
                var nodes = topo.selectedNodes().toArray();
                if (nodes.indexOf(node) === -1) {
                    nodes.push(node);
                }

                nx.each(nodes, function (node) {
                    node.move(event.drag.delta[0], event.drag.delta[1]);
                });
            }
        }
    });


})(nx, nx.util, nx.global);