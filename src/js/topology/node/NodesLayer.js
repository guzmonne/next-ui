(function (nx, global) {
    var util = nx.util;
    /**
     * Nodes layer
     Could use topo.getLayer('nodes') get this
     * @class nx.graphic.Topology.NodesLayer
     * @extend nx.graphic.Topology.Layer
     *
     */
    var CLZ = nx.define('nx.graphic.Topology.NodesLayer', nx.graphic.Topology.DoubleLayer, {
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
                topo.watch('nodeConfig', this.__watchNodeConfigFN = function (prop, value) {
                    this.nodeConfig = nx.extend({}, CLZ.defaultConfig, value);
                    delete  this.nodeConfig.__owner__;
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
            highlightRelatedNode: function () {
            },

            updateNodeRevisionScale: function (value) {
                this.eachVisibleNode(function (node) {
                    node.revisionScale(value);
                }, this);
            },
            //get node instance class
            _getNodeInstanceClass: function (vertex) {
                var Clz;
                var nodeInstanceClass = topo.nodeInstanceClass();
                if (nx.is(nodeInstanceClass, 'Function')) {
                    Clz = nodeInstanceClass.call(this, vertex);
                    if (nx.is(Clz, 'String')) {
                        Clz = nx.path(global, Clz);
                    }
                } else {
                    Clz = nx.path(global, nodeInstanceClass);
                }
                if (!Clz) {
                    throw "Error on instance node class";
                }
                return Clz;
            },

            _generateNode: function (vertex) {
                var id = vertex.id();
                var topo = this.topology();
                var stageScale = topo.stageScale();
                var Clz = this._getNodeInstanceClass(vertex);
                var node = new Clz({
                    topology: topo
                });
                node.setModel(vertex);
                node.attach(this.view('static'));

                node.sets({
                    'class': 'node',
                    'data-id': id,
                    'stageScale': stageScale
                });
//                node._stageScale = stageScale;

                // add multiple drag events
                node.on('dragNode', function (sender, event) {
                    topo._moveSelectionNodes(event, node);
                }, this);

                this.updateDefaultSetting(node);
                return node;
            },


            updateDefaultSetting: function (node) {
                var topo = this.topology();
                // delegate events
                var superEvents = nx.graphic.Component.__events__;
                nx.each(node.__events__, function (e) {
                    if (superEvents.indexOf(e) == -1) {
                        node.on(e, function (sender, event) {
                            this.fire(e, node);
                        }, this);
                    }
                }, this);

                //properties
                var nodeConfig = this.nodeConfig;
                nx.each(nodeConfig, function (value, key) {
                    util.setProperty(node, key, value, topo);
                }, this);

                if (topo.showIcon() && topo.revisionScale() == 1) {
                    util.setProperty(node, 'showIcon', true);
                }
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
            //todo
            eachVisibleNode: function (fn, context) {
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
                this.clear();
                this.topology().unwatch('stageScale', this.__watchStageScaleFN, this);
                this.topology().watch('nodeConfig', this.__watchNodeConfigFN, this);
                this.inherited();
            }
        }
    });


})(nx, nx.global);