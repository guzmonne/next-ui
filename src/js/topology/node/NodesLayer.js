(function (nx, util, global) {

    'use strict';



    /**
     * Nodes layer
     Could use topo.getLayer('nodesLayer') get this
     * @class nx.graphic.Topology.NodesLayer
     * @extend nx.graphic.Topology.Layer
     *
     */
    nx.define('nx.graphic.Topology.NodesLayer', nx.graphic.Topology.Layer, {
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
        events: ['clickNode', 'enterNode', 'leaveNode', 'dragNodeStart', 'dragNode', 'dragNodeEnd', 'hideNode', 'pressNode', 'selectNode', 'updateNodeCoordinate'],
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
                        style: 'transition: fill-opacity 0.5s;'
                    }
                }

            ]
        },
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
            },
            highlightedNodes: {
                value: function () {
                    return [];
                }
            }
        },
        methods: {
            attach: function (args) {
                this.attach.__super__.apply(this, arguments);
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
            },
            draw: function () {

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
                node.setProperty('nodeScale', topo.nodeScale());
                node.setProperty('radius', topo.nodeRadius());
                node.setProperty('useSmartLabel', topo.useSmartLabel());
                node.setProperty('iconType', topo.nodeIconType());
                node.setProperty('showIcon', topo.nodeShowIcon());
                node.setProperty('selected', topo.nodeSelected());
                node.setProperty('color', topo.nodeColor());

                node.setProperty('label', topo.nodeLabel());
                node.on('nodemousedown', function (sender, event) {
                    this.fire('pressNode', node);
                }, this);

                node.on('nodemouseup', function (sender, event) {
                    this.fire('clickNode', node);
                }, this);

                node.on('nodemouseenter', function (sender, event) {
                    this.fire('enterNode', node);

                }, this);

                node.on('nodemouseleave', function (sender, event) {
                    this.fire('leaveNode', node);
                }, this);

                node.on('nodeselected', function (sender, event) {
                    this.fire('selectNode', node);
                }, this);

                node.on('hide', function (sender, event) {
                    this.fire('hideNode', node);
                }, this);

                node.on('nodedragstart', function (sender, event) {
                    this._moveSelectionNodes(event, node);
                    this.fire('dragNodeStart', node);
                }, this);

                node.on('nodedrag', function (sender, event) {
                    this._moveSelectionNodes(event, node);
                    this.fire('dragNode', node);
                }, this);

                node.on('nodedragend', function (sender, event) {
                    this.fire('dragNodeEnd', node);
                }, this);

                vertex.on('updateCoordinate', function (sender, position) {
                    this.fire('updateNodeCoordinate', node);
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

                //topo.getLayer('links').fadeIn();
                this.topology().getLayer('links').fadeIn();


            },
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
            highlightNode: function (node) {
                var highlightedNodes = this.highlightedNodes();
                var el = this.resolve('activated');

                this.highlightedNodes().push(node);
                node.append(el);
                node.eachConnectedNodes(function (node) {
                    this.highlightedNodes().push(node);
                    node.append(el);
                }, this);

                var topo = this.topology();
                if (topo.supportMultipleLink()) {
                    topo.getLayer('linkSet').highlightLinkSet(this.getNodeConnectedLinkSet(node));
                } else {
                    topo.getLayer('links').highlightLinks(this.getNodeConnectedLinks(node));
                }


                topo.getLayer('links').fadeOut();
                this.fadeOut();
            },
            highlightNodes: function (nodes) {
                this.recover();
                nx.each(nodes, function (node) {
                    this.highlightedNodes().push(node);
                    node.append(this.resolve('activated'));
                }, this);


                var topo = this.topology();
                topo.getLayer('links').highlightLinks(node.getLinks());
                topo.getLayer('links').fadeOut();

                this.fadeOut();
            },
            /**
             * Recover all nodes status
             * @method recover
             */
            recover: function () {
                this.fadeIn(function () {
                    nx.each(this.highlightedNodes(), function (node) {
                        node.append(this.resolve('static'));
                    }, this);
                    this.highlightedNodes([]);
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
                nx.each(this.nodes(), function (node) {
                    node.dispose();
                });

                this.nodes([]);
                this.nodesMap({});
                this.$('activated').empty();
                this.$('static').empty();
                this.$('static').setStyle('fill-opacity', 1);
            },
            _moveSelectionNodes: function (event, node) {
                var topo = this.topology();
                var nodes = topo.selectedNodes().toArray();
                if (nodes.indexOf(node) === -1) {
                    node.move(event.drag.delta[0], event.drag.delta[1]);
                }else{
                    nx.each(nodes, function (node) {
                        node.move(event.drag.delta[0], event.drag.delta[1])
                    });
                }


            }
        }
    });


})(nx, nx.graphic.util, nx.global);