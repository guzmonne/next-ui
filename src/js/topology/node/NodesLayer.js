(function (nx, util, global) {


    /**
     * Nodes layer
     Could use topo.getLayer('nodes') get this
     * @class nx.graphic.Topology.NodesLayer
     * @extend nx.graphic.Topology.Layer
     *
     */
    var CLZ = nx.define('nx.graphic.Topology.NodesLayer', nx.graphic.Topology.Layer, {
        statics: {
            defaultConfig: {
            }
        },
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
                topo.watch('stageScale', this.__watchStageScaleFN = function (prop, value) {
                    this.eachNode(function (node) {
                        node.stageScale(value);
                    });
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

                nodes[nodes.length] = node;
                nodesMap[id] = node;
                return node;
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

            },

            updateNodeRevisionScale: function (value) {
                var radius = 6;
                var topo = this.topology();
                if (value == 0.6) {
                    radius = 4;
                } else if (value <= 0.4) {
                    radius = 2;
                }


                this.eachNode(function (node) {
                    if(topo.showIcon()){
                        node.showIcon(value == 1);
                    }
                    node.radius(radius);
                    node.view('label').set('visible', value > 0.4);
                }, this);
            },


            _generateNode: function (vertex) {

                var topo = this.topology();


                //get node instance class
                var Clz;
                var nodeInstanceClass = topo.nodeInstanceClass();
                if (nx.is(nodeInstanceClass, 'Function')) {
                    Clz = nodeInstanceClass.call(this, vertex);
                    if (nx.is(clz, 'String')) {
                        Clz = nx.path(global, Clz);
                    }
                } else {
                    Clz = nx.path(global, nodeInstanceClass);
                }
                if (!Clz) {
                    return;
                }


                var node = new Clz({
                    topology: topo
                });
                node.setModel(vertex);
                node.attach(this.resolve('static'));

                node.sets({
                    'class': 'node',
                    'data-node-id': node.id(),
                    stageScale: topo.stageScale()
                });


                var nodeConfig = nx.extend({}, CLZ.defaultConfig, topo.nodeConfig());
                nx.each(nodeConfig, function (value, key) {
                    util.setProperty(node, key, value, topo);
                }, this);
                util.setProperty(node, 'showIcon', topo.showIcon());
                util.setProperty(node, 'label', nodeConfig.label, topo); // set label at last


                //delegate events
                var superEvents = nx.graphic.Component.__events__;
                nx.each(node.__events__, function (e) {
                    if (superEvents.indexOf(e) == -1) {
                        node.on(e, function (sender, event) {
                            this.fire(e, node);
                        }, this);
                    }
                }, this);

                // add multiple drag events
                node.on('dragNode', function (sender, event) {
                    topo._moveSelectionNodes(event, node);
                }, this);

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
            clear: function () {
                nx.each(this.nodes(), function (node) {
                    node.dispose();
                });

                this.nodes([]);
                this.nodesMap({});
                this.inherited();
            },
            dispose: function () {
                this.topology().unwatch('stageScale', this.__watchStageScaleFN, this);
                this.inherited();
            }
        }
    });


})(nx, nx.util, nx.global);