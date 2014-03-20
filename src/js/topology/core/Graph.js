(function (nx, util, global) {

    /**
     * Topology graph model class
     * @class nx.graphic.Topology.Graph
     * @module nx.graphic.Topology
     */
    nx.define("nx.graphic.Topology.Graph", {
        events: ['beforeSetData', 'afterSetData', 'insertData', 'topologyGenerated'],
        properties: {
            /**
             * Identity the node and link mapping key, default is index
             * @property identityKey {String}
             */
            identityKey: {
                get: function () {
                    return this._identiyKey || 'index';
                },
                set: function (value) {
                    this._identiyKey = value;
                    this.graph().set('identityKey', value);
                }
            },
            /**
             * set/get the topology' data, data should follow Common Topology Data Definition
             * @property data {JSON}
             */
            data: {
                get: function () {
                    return this.graph().getData();
                },
                set: function (value) {

                    var fn = function (data) {
                        /**
                         * Fired before start process data
                         * @event beforeSetData
                         * @param sender {Object} Trigger instance
                         * @param data {JSON}  event object
                         */
                        this.fire("beforeSetData", data);
                        this.clear();
                        this.graph().sets({
                            width: this.visibleContainerWidth(),
                            height: this.visibleContainerHeight()
                        });
                        // set Data;
                        this.graph().setData(data);
                        //
                        /**
                         * Fired after process data
                         * @event afterSetData
                         * @param sender{Object} trigger instance
                         * @param event {Object} original event object
                         */
                        this.fire("afterSetData", data);
                    };


                    if (this.status() === 'appended') {
                        fn.call(this, value);
                    } else {
                        this.on('ready', function () {
                            fn.call(this, value);
                        }, this);
                    }
                }
            },
            /**
             * Set the use force layout, recommand use dataProcessor:'force'
             * @property autoLayout {Boolean}
             */
            autoLayout: {
                get: function () {
                    return this._autoLayout || false;
                },
                set: function (value) {
                    this._autoLayout = value;
                    if (value) {
                        this.graph().dataProcessor("force");
                    } else {
                        this.graph().dataProcessor("");
                    }
                }
            },
            /**
             * Node x position mutator function, it is a array with two function item, first is setter and another is getter
             * @property xMutatorMethod {Array}
             */
            xMutatorMethod: {
                get: function () {
                    return this._xMutatorMethod || false;
                },
                set: function (value) {
                    this._xMutatorMethod = value;
                    this.graph().set('xMutatorMethod', value);
                }
            },
            /**
             * Node y position mutator function, it is a array with two function item, first is setter and another is getter
             * @property yMutatorMethod {Array}
             */
            yMutatorMethod: {
                get: function () {
                    return this._yMutatorMethod || false;
                },
                set: function (value) {
                    this._yMutatorMethod = value;
                    this.graph().set('yMutatorMethod', value);
                }
            },
            /**
             * Pre data processor, it could be 'force'/'quick'. It could also support register a new processor
             * @property dataProcessor {String}
             */
            dataProcessor: {
                get: function () {
                    return this._dataProcessor || false;
                },
                set: function (value) {
                    this._dataProcessor = value;
                    this.graph().set('dataProcessor', value);
                }
            },
            /**
             * Topology graph object
             * @property graph {nx.data.ObservableGraph}
             * @readonly
             */
            graph: {
                value: function () {
                    return new nx.data.ObservableGraph();
                }
            }
        },
        methods: {
            initGraph: function () {
                var graph = this.graph();
                graph.sets({
                    xMutatorMethod: this.xMutatorMethod(),
                    yMutatorMethod: this.yMutatorMethod(),
                    identityKey: this.identityKey(),
                    dataProcessor: this.dataProcessor()
                });

                if (this.autoLayout()) {
                    graph.dataProcessor("force");
                }


                var nodesLayer = this.getLayer("nodes");
                var linksLayer = this.getLayer("links");
                var nodeSetLayer = this.getLayer("nodeSet");
                var linkSetLayer = this.getLayer("linkSet");

                graph.on("addVertex", function (sender, vertex) {
                    nodesLayer.addNode(vertex);
                }, this);

                graph.on("removeVertex", function (sender, vertex) {
                    nodesLayer.removeNode(vertex);
                }, this);

                graph.on("updateVertex", function (sender, vertex) {
                    nodesLayer.updateNode(vertex);
                }, this);

                graph.on("updateVertexCoordinate", function (sender, vertex) {

                }, this);

                graph.on("addEdge", function (sender, edge) {
                    linksLayer.addLink(edge);
                }, this);

                graph.on("removeEdge", function (sender, edge) {
                    linksLayer.removeLink(edge);
                }, this);
                graph.on("updateEdge", function (sender, edge) {
                    linksLayer.updateLink(edge);
                }, this);
                graph.on("addEdgeSet", function (sender, edgeSet) {
                    if (this.supportMultipleLink()) {
                        linkSetLayer.addLinkSet(edgeSet);
                    } else {
                        edgeSet.activated(false);

                    }
                }, this);

                graph.on("removeEdgeSet", function (sender, edgeSet) {
                    if (this.supportMultipleLink()) {
                        linkSetLayer.removeLinkSet(edgeSet);
                    }
                }, this);
                graph.on("updateEdgeSet", function (sender, edgeSet) {
                    if (this.supportMultipleLink()) {
                        linkSetLayer.updateLinkSet(edgeSet);
                    }
                }, this);


                graph.on("addVertexSet", function (sender, vertexSet) {
                    nodeSetLayer.addNodeSet(vertexSet);
                }, this);

                graph.on("removeVertexSet", function (sender, vertexSet) {
                    nodeSetLayer.removeNodeSet(vertexSet);
                }, this);

                graph.on("updateVertexSet", function (sender, vertexSet) {
                    nodeSetLayer.updateNodeSet(vertexSet);
                }, this);

                graph.on("updateVertexSetCoordinate", function (sender, vertexSet) {

                }, this);


                graph.on("setData", function (sender, data) {

                }, this);


                graph.on("insertData", function (sender, data) {

                }, this);


                graph.on("clear", function (sender, event) {

                }, this);


                graph.on("startGenerate", function (sender, event) {
                    this._setProjection();
                }, this);
                graph.on("endGenerate", function (sender, event) {
                    /**
                     * Fired when all topology elements generated
                     * @event topologyGenerated
                     * @param sender{Object} trigger instance
                     * @param event {Object} original event object
                     */
                    if (this.enableSmartLabel()) {
                        setTimeout(function () {
                            this.fire('topologyGenerated');
                        }.bind(this), 100);
                    } else {
                        this.fire('topologyGenerated');
                    }

                }, this);


            },
            /**
             * Set data to topology, recommend use topo.data(data)
             * @method setData
             * @param data {JSON} should be {nodes:[],links:[]}
             */
            setData: function (data) {
                this.data(data);
            },
            /**
             * Insert data to topology
             * @method insertData
             * @param data {JSON}  should be {nodes:[],links:[]}
             */
            insertData: function (data) {
                this.graph().insertData(data);
                /**
                 * Fired after insert data
                 * @event insertData
                 * @param sender{Object} trigger instance
                 * @param event {Object} original event object
                 */
                this.fire("insertData", data);
            },


            /**
             * Get topology data, recommend use topo.data()
             * @method getData
             * @returns {JSON}
             */
            getData: function () {
                return this.data();
            },


            _saveData: function () {
                var data = this.graph().getData();

                if (Object.prototype.toString.call(window.localStorage) === "[object Storage]") {
                    localStorage.setItem("topologyData", JSON.stringify(data));
                }

            },
            _loadLastData: function () {
                if (Object.prototype.toString.call(window.localStorage) === "[object Storage]") {
                    var data = JSON.parse(localStorage.getItem("topologyData"));
                    this.setData(data);
                }
            },
            start: function () {
            }
        }
    });


})(nx, nx.util, nx.global);