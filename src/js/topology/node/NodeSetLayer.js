(function (nx, global) {
    var util = nx.util;
    var CLZ = nx.define('nx.graphic.Topology.NodeSetLayer', nx.graphic.Topology.DoubleLayer, {
        statics: {
            defaultConfig: {
                iconType: 'nodeSet',
                label: 'model.label'
            }
        },
        events: ['clickNodeSet', 'enterNodeSet', 'leaveNodeSet', 'dragNodeSetStart', 'dragNodeSet', 'dragNodeSetEnd', 'hideNodeSet', 'pressNodeSet', 'selectNodeSet', 'updateNodeSetCoordinate', 'expandNodeSet', 'collapseNodeSet', 'beforeExpandNodeSet', 'beforeCollapseNodeSet', 'updateNodeSet', 'removeNodeSet'],
        properties: {
            nodeSetArray: {
                get: function () {
                    this.nodeSetCollection().toArray();
                }
            },
            nodeSetMap: {
                get: function () {
                    this.nodeSetCollection().toObject();
                }
            },
            nodeSetCollection: {
                value: function () {
                    return new nx.data.ObservableDictionary();
                }
            }
        },
        methods: {
            attach: function (args, index) {
                this.inherited(args, index);
                var topo = this.topology();
                topo.watch('stageScale', this.__watchStageScaleFN = function (prop, value) {
                    this.eachNodeSet(function (nodeSet) {
                        nodeSet.stageScale(value);
                    });
                }, this);
            },
            addNodeSet: function (vertexSet) {
                var nodeSetCollection = this.nodeSetCollection();
                var id = vertexSet.id();
                var nodeSet = this._generateNodeSet(vertexSet);

                nodeSetCollection.setItem(id, nodeSet);
                return nodeSet;
            },

            updateNodeRevisionScale: function (value) {
                this.eachVisibleNodeSet(function (nodeSet) {
                    nodeSet.revisionScale(value);
                }, this);
            },

            removeNodeSet: function (vertexSet) {
                var nodeSetCollection = this.nodeSetCollection();
                var id = vertexSet.id();
                var nodeSet = nodeSetCollection.getItem(id);

                this.fire('removeNodeSet', nodeSet);
                nodeSet.dispose();
                nodeSetCollection.removeItem(id);


            },
            updateNodeSet: function (vertexSet) {
                var nodeSetCollection = this.nodeSetCollection();
                var id = vertexSet.id();
                var nodeSet = nodeSetCollection.getItem(id);
                this.fire('updateNodeSet', nodeSet);
            },
            _getNodeSetInstanceClass: function (vertexSet) {


                var Clz;
                var nodeSetInstanceClass = topo.nodeSetInstanceClass();
                if (nx.is(nodeSetInstanceClass, 'Function')) {
                    Clz = nodeSetInstanceClass.call(this, vertexSet);
                    if (nx.is(Clz, 'String')) {
                        Clz = nx.path(global, Clz);
                    }
                } else {
                    Clz = nx.path(global, nodeSetInstanceClass);
                }

                if (!Clz) {
                    throw "Error on instance node set class";
                }
                return Clz;

            },
            _generateNodeSet: function (vertexSet) {
                var id = vertexSet.id();
                var topo = this.topology();
                var stageScale = topo.stageScale();
                var Clz = this._getNodeSetInstanceClass(vertexSet);

                var nodeSet = new Clz({
                    topology: topo
                });
                nodeSet.setModel(vertexSet);
                nodeSet.attach(this.view('static'));

                nodeSet.sets({
                    'data-id': id,
                    'class': 'node nodeset',
                    stageScale: stageScale
                }, topo);

                this.updateDefaultSetting(nodeSet);
//                setTimeout(function () {
//                    this.updateDefaultSetting(node);
//                }.bind(this), 0);
                return nodeSet;


            },
            updateDefaultSetting: function (nodeSet) {
                var topo = this.topology();


                //register events
                var superEvents = nx.graphic.Component.__events__;
                nx.each(nodeSet.__events__, function (e) {
                    if (superEvents.indexOf(e) == -1) {
                        nodeSet.on(e, function (sender, event) {
                            this.fire(e.replace('Node', 'NodeSet'), nodeSet);
                        }, this);
                    }
                }, this);


                var nodeSetConfig = nx.extend({}, CLZ.defaultConfig, topo.nodeSetConfig());
                delete nodeSetConfig.__owner__;

                nx.each(nodeSetConfig, function (value, key) {
                    util.setProperty(nodeSet, key, value, topo);
                }, this);

                util.setProperty(nodeSet, 'showIcon', topo.showIcon());


            },
            /**
             * Get node by id
             * @param id
             * @returns {*}
             * @method getNode
             */
            getNodeSetByID: function (id) {
                return this.nodeSetCollection().getItem(id);
            },
            /**
             * Iterate all nodeSet
             * @method eachNode
             * @param callback
             * @param context
             */
            eachNodeSet: function (callback, context) {
                this.nodeSetCollection().each(function (item, id) {
                    var nodeSet = item.value();
                    callback.call(context || this, nodeSet, id);
                }, this);
            },
            eachVisibleNodeSet: function (callback, context) {
                this.nodeSetCollection().each(function (item, id) {
                    var nodeSet = item.value();
                    if (nodeSet.visible()) {
                        callback.call(context || this, nodeSet, id);
                    }
                }, this);
            },
            clear: function () {
                this.eachNodeSet(function (nodeSet) {
                    nodeSet.dispose();
                });

                this.nodeSetCollection().clear();
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