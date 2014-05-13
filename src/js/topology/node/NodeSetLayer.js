(function (nx, global) {
    var util = nx.util;
    var CLZ = nx.define('nx.graphic.Topology.NodeSetLayer', nx.graphic.Topology.DoubleLayer, {
        statics: {
            defaultConfig: {
                iconType: 'nodeSet'
            }
        },
        events: ['clickNodeSet', 'enterNodeSet', 'leaveNodeSet', 'dragNodeSetStart', 'dragNodeSet', 'dragNodeSetEnd', 'hideNodeSet', 'pressNodeSet', 'selectNodeSet', 'updateNodeSetCoordinate', 'expandNodeSet', 'collapseNodeSet', 'beforeExpandNodeSet', 'beforeCollapseNodeSet', 'updateNodeSet','removeNodeSet'],
        properties: {
            nodeSetArray: {
                value: function () {
                    return [];
                }
            },
            nodeSetMap: {
                value: function () {
                    return {};
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
                var nodeSetMap = this.nodeSetMap();
                var nodeSetArray = this.nodeSetArray();
                var id = vertexSet.id();
                var nodeSet = this._generateNodeSet(vertexSet);

                nodeSetArray[nodeSetArray.length] = nodeSet;
                nodeSetMap[id] = nodeSet;
                return nodeSet;
            },

            updateNodeRevisionScale: function (value) {
                this.eachVisibleNodeSet(function (nodeSet) {
                    nodeSet.revisionScale(value);
                }, this);
            },

            removeNodeSet: function (vertexSet) {
                var nodeSetMap = this.nodeSetMap();
                var nodeSetArray = this.nodeSetArray();
                var id = vertexSet.id();
                var nodeSet = nodeSetMap[id];

                this.fire('removeNodeSet', nodeSet);
                nodeSet.dispose();
                nodeSetArray.splice(nodeSetArray.indexOf(nodeSet), 1);
                delete nodeSetMap[id];


            },
            updateNodeSet: function (vertexSet) {
                var nodeSetMap = this.nodeSetMap();
                var id = vertexSet.id();
                var nodeSet = nodeSetMap[id];
                this.fire('updateNodeSet', nodeSet);
            },
            _generateNodeSet: function (vertexSet) {

                var topo = this.topology();

                //get node class
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
                    return;
                }


                var nodeSet = new Clz({
                    topology: topo
                });
                nodeSet.setModel(vertexSet);
                nodeSet.attach(this.view('static'));

                nodeSet.sets({
                    'data-node-id': nodeSet.id(),
                    'class': 'node nodeset',
                    stageScale: topo.stageScale()
                }, topo);


                var nodeSetConfig = nx.extend({}, CLZ.defaultConfig, topo.nodeSetConfig());
                var label = nodeSetConfig.label;
                delete nodeSetConfig.label;
                delete nodeSetConfig.__owner__;

                nx.each(nodeSetConfig, function (value, key) {
                    setTimeout(function () {
                        util.setProperty(nodeSet, key, value, topo);
                    }, 10);
                }, this);


                if (label != null) {
                    setTimeout(function () {
                        util.setProperty(nodeSet, 'label', label, topo);
                    }, 10);
                }

                setTimeout(function () {
                    util.setProperty(nodeSet, 'showIcon', topo.showIcon());
                }, 10);
                //register events
                var superEvents = nx.graphic.Component.__events__;
                nx.each(nodeSet.__events__, function (e) {
                    if (superEvents.indexOf(e) == -1) {
                        nodeSet.on(e, function (sender, event) {
                            this.fire(e.replace('Node', 'NodeSet'), nodeSet);
                        }, this);
                    }
                }, this);

                //register multiple move
                nodeSet.on('dragNode', function (sender, event) {
                    topo._moveSelectionNodes(event, nodeSet);
                }, this);

                nodeSet.set('data-node-id', vertexSet.id());

                return nodeSet;
            },
            /**
             * Get node by id
             * @param id
             * @returns {*}
             * @method getNode
             */
            getNodeSetByID: function (id) {
                var nodeSetMap = this.nodeSetMap();
                return nodeSetMap[id];
            },
            /**
             * Iterate all nodeSet
             * @method eachNode
             * @param fn
             * @param context
             */
            eachNodeSet: function (fn, context) {
                nx.each(this.nodeSetMap(), fn, context || this);
            },
            eachVisibleNodeSet: function (fn, context) {
                nx.each(this.nodeSetMap(), function (nodeSet, id) {
                    if (nodeSet.visible()) {
                        fn.call(context || this, nodeSet, id);
                    }
                }, this);
            },
            getNodeSet: function () {
                return this.nodeSetArray();
            },
            clear: function () {
                nx.each(this.nodeSetArray(), function (nodeSet) {
                    nodeSet.dispose();
                });

                this.nodeSetArray([]);
                this.nodeSetMap({});
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