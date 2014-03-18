(function (nx, util, global) {

    nx.define("nx.graphic.Topology.Graph", {
        events: ['beforeSetData', 'afterSetData', 'insertData', 'topologyGenerated'],
        properties: {
            /**
             * @property identityKey
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
            data: {
                get: function () {
                    return this.graph().getData();
                },
                set: function (value) {

                    var fn = function (data) {
                        this.fire("beforeSetData", data);
                        this.clear();
                        this.graph().sets({
                            width: this.visibleContainerWidth(),
                            height: this.visibleContainerHeight()
                        });
                        // set Data;
                        this.graph().setData(data);
                        //
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
             * @property autoLayout
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
            xMutatorMethod: {
                get: function () {
                    return this._xMutatorMethod || false;
                },
                set: function (value) {
                    this._xMutatorMethod = value;
                    this.graph().set('xMutatorMethod', value);
                }
            },
            yMutatorMethod: {
                get: function () {
                    return this._yMutatorMethod || false;
                },
                set: function (value) {
                    this._yMutatorMethod = value;
                    this.graph().set('yMutatorMethod', value);
                }
            },
            dataProcessor: {
                get: function () {
                    return this._dataProcessor || false;
                },
                set: function (value) {
                    this._dataProcessor = value;
                    this.graph().set('dataProcessor', value);
                }
            },
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
                    if (this.useSmartLabel()) {
                        setTimeout(function () {
                            this.fire('topologyGenerated');
                        }.bind(this), 100);
                    } else {
                        this.fire('topologyGenerated');
                    }

                }, this);


            },
            /**
             * Set whole network data to draw a topology
             * @method setData
             * @param data {Object} should be {nodes:[],links:[]}
             */
            setData: function (data) {
                this.data(data);
            },

            insertData: function (data) {
                this.graph().insertData(data);
                this.adjustLayout();
                this.fire("insertData", data);
            },


            /**
             * Get topology data
             * @method getData
             * @returns {nx.ObservableGraph}
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


            /**
             * Start rendering topology
             * @method start
             */
            start: function () {
            }
        }
    });


})(nx, nx.util, nx.global);