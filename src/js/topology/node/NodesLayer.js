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
             * Get all nodes instance
             * @property nodes {Array}
             */
            nodes: {
                get: function () {
                    return this.nodesDictionary().values();
                }
            },
            /**
             * Get all nodes instance map
             * @property nodesMap {Object}
             */
            nodesMap: {
                get: function () {
                    return this.nodesDictionary().toObject();
                }
            },
            /**
             * Nodes observable dictionary
             * @property nodesDictionary {nx.data.ObservableDictionary}
             */
            nodesDictionary: {
                value: function () {
                    return new nx.data.ObservableDictionary();
                }
            }
        },
        methods: {
            attach: function (args) {
                this.inherited(args);
                var topo = this.topology();
                topo.watch('stageScale', this.__watchStageScaleFN = function (prop, value) {
                    this.nodesDictionary().each(function (item) {
                        item.value().stageScale(value);
                    });
                }, this);


            },
            /**
             * Add node a nodes layer
             * @param vertex
             * @method addNode
             */
            addNode: function (vertex) {
                var id = vertex.id();
                var node = this._generateNode(vertex);
                this.nodesDictionary().setItem(id, node);
                return node;
            },

            /**
             * Remove node
             * @method removeNode
             * @param vertex
             */
            removeNode: function (vertex) {
                var id = vertex.id();
                var nodesDictionary = this.nodesDictionary();
                var node = nodesDictionary.getItem(id);
                if (node) {
                    node.dispose();
                    nodesDictionary.removeItem(id);
                }
            },
            updateNode: function (vertex) {
                var id = vertex.id();
                var nodesDictionary = this.nodesDictionary();
                var node = nodesDictionary.getItem(id);
                if (node) {
                    node.update();
                }
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
                var topo = this.topology();
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


                this.updateDefaultSetting(node);
//                setTimeout(function () {
//                    this.updateDefaultSetting(node);
//                }.bind(this), 0);
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
                var nodeConfig = this.nodeConfig = nx.extend({}, CLZ.defaultConfig, topo.nodeConfig());
                delete  nodeConfig.__owner__;
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
             * @param callback
             * @param context
             */
            eachNode: function (callback, context) {
                this.nodesDictionary().each(function (item, id) {
                    callback.call(context || this, item.value(), id);
                });
            },
            //todo
            eachVisibleNode: function (callback, context) {
                this.nodesDictionary().each(function (item, id) {
                    var node = item.value();
                    if (node.visible()) {
                        callback.call(context || this, node, id);
                    }
                }, this);
            },
            /**
             * Get node by id
             * @param id
             * @returns {*}
             * @method getNode
             */
            getNode: function (id) {
                return this.nodesDictionary().getItem(id);
            },
            clear: function () {
                this.nodesDictionary().each(function (node) {
                    node.dispose();
                });
                this.nodesDictionary().clear();
                this.inherited();

            },
            dispose: function () {
                this.clear();
                this.topology().unwatch('stageScale', this.__watchStageScaleFN, this);
                this.inherited();
            }
        }
    });


})(nx, nx.global);