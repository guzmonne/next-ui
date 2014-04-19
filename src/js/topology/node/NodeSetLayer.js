(function (nx, global) {
    var util = nx.util;
    var CLZ = nx.define('nx.graphic.Topology.NodeSetLayer', nx.graphic.Topology.Layer, {
        statics: {
            defaultConfig: {
            }
        },
        events: ['clickNodeSet', 'enterNodeSet', 'leaveNodeSet', 'dragNodeSetStart', 'dragNodeSet', 'dragNodeSetEnd', 'hideNodeSet', 'pressNodeSet', 'selectNodeSet', 'updateNodeSetCoordinate', 'expandNodeSet', 'collapseNodeSet'],
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

                nodeSet.dispose();
                nodeSetArray.splice(nodeSetArray.indexOf(nodeSet), 1);
                delete nodeSetMap[id];
            },
            updateNodeSet: function (nodeSetMap) {
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
                nodeSet.attach(this.resolve('static'));

                nodeSet.sets({
                    'data-node-id': nodeSet.id(),
                    'class': 'node nodeset',
                    stageScale: topo.stageScale()
                }, topo);


                var nodeSetConfig = nx.extend({}, CLZ.defaultConfig, topo.nodeSetConfig());
                delete nodeSetConfig.__owner__; //fix bug
                nx.each(nodeSetConfig, function (value, key) {
                    util.setProperty(nodeSet, key, value, topo);
                }, this);
                util.setProperty(nodeSet, 'showIcon', topo.showIcon());
                util.setProperty(nodeSet, 'label', nodeSetConfig.label, topo);

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
                nx.each(this.nodeSetArray(), fn, context || this);
            },
            eachVisibleNodeSet: function (fn, context) {
                nx.each(this.nodeSetArray(), fn, context || this);
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
                this.topology().unwatch('stageScale', this.__watchStageScaleFN, this);
                this.inherited();
            }
        }
    });


})(nx, nx.global);