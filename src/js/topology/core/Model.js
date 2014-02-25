(function (nx, util, global) {

    nx.define("nx.graphic.Topology.Model", {
        events: [],
        properties: {
            /**
             * @property identityKey
             */
            identityKey: {
                value: "index"
            },
            xMutatorMethod: {},
            yMutatorMethod: {},
            dataProcessor: {}
        },
        methods: {
            initModel: function () {
                var graph = new nx.data.ObservableGraph();
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
                var linkSetLayer = this.getLayer("linkSet");
                graph.on("addVertex", function (sender, vertex) {
                    nodesLayer.addNode(vertex);
                }, this);

                graph.on("removeVertex", function (sender, vertex) {

                }, this);


                graph.on("updateVertex", function (sender, vertex) {

                }, this);

                graph.on("updateVertexCoordinate", function (sender, vertex) {

                }, this);

                graph.on("addEdge", function (sender, edge) {
                    linksLayer.addLink(edge);
                }, this);

                graph.on("removeEdge", function (sender, edge) {

                }, this);
                graph.on("updateEdge", function (sender, edge) {

                }, this);
                graph.on("addEdgeSet", function (sender, edgeSet) {

                }, this);

                graph.on("removeEdgeSet", function (sender, edgeSet) {

                }, this);
                graph.on("updateEdgeSet", function (sender, edgeSet) {

                }, this);


                graph.on("addVertexSet", function (sender, vertexSet) {

                }, this);

                graph.on("removeVertexSet", function (sender, vertexSet) {

                }, this);

                graph.on("updateVertexSet", function (sender, vertexSet) {

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


//
//
//                graph.on("addVertex", function (sender, vertex) {
//                    nodesLayer.addNode(vertex);
//                }, this);
//
//                graph.on("removeVertex", function (sender, vertex) {
//                    nodesLayer.removeNode(vertex);
//                    //linksLayer.removeNode(vertex);
//                }, this);
//
//                graph.on("updateVertex", function (sender, vertex) {
//                    nodesLayer.updateNode(vertex);
//
//                }, this);
//
//                graph.on("addEdge", function (sender, edge) {
////                    if (this.lazyRenderingLink() || graph.vertices.length > 100) {
////                        util.delay(function () {
////                            linksLayer.addLink(edge)
////                        }, 5 * this._lazyRenderingLinkStep++);
////                    } else {
////                        linksLayer.addLink(edge);
////                    }
//
//                    linksLayer.addLink(edge)
//                }, this);
//
//                graph.on('removeEdge', function (sender, edge) {
//                    linksLayer.removeLink(edge);
//                }, this);
//
//                graph.on("updateEdge", function (sender, edge) {
//                    linksLayer.updateLink(edge);
//                }, this);
//
//
//
//                graph.on("clear", function (sender, edge) {
//                    this._lazyRenderingLinkStep = 1;
//                    this.clear();
//                }, this);


                this.model(graph);

            },
            /**
             * Set whole network data to draw a topology
             * @method setData
             * @param data {Object} should be {nodes:[],links:[]}
             * @param name {String} name for this data
             * @param ignore {Boolean} is add this data to data collection
             */
            setData: function (data, name, ignore) {

                this._onReady(function () {


                    this.fire("beforeSetData", data);


                    this.clear();

                    // set Data;
                    this.model().setData(data);


                    //this.fit();
                    //this.adjustLayout();

                    this.fire("afterSetData", data);


//                    nx.each(this.layersQueue(), function (layer) {
//                        layer.draw();
//                    });

                });
            },

            insertData: function (data) {
                this.model().insertData(data);
                this.adjustLayout();
                this.fire("insertData", data);
            },


            /**
             * Get topology data
             * @method getData
             * @returns {nx.ObservableGraph}
             */
            getData: function () {
                return this.model().getData();
            },


            _saveData: function () {
                var data = this.model().getData();

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


})(nx, nx.graphic.util, nx.global);