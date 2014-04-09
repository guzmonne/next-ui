(function (nx, util, global) {
    /**
     * Vertex set ckass
     * @class nx.data.VertexSet
     * @extend nx.data.Vertex
     * @module nx.data
     */
    nx.define('nx.data.VertexSet', nx.data.Vertex, {
        properties: {
            /**
             * All child vertices
             * @property vertices {Object}
             * @default {}
             */
            vertices: {
                value: function () {
                    return {};
                }
            },

            nodesArray: {
                value: function () {
                    return [];
                }
            },
            originalEdgeSetMap: {
                value: function () {
                    return {};
                }
            },
            /**
             * VertexSet's type
             * @property type {String}
             * @default 'vertexset'
             */
            type: {
                value: 'vertexSet'
            },
            visible: {
                get: function () {
                    return this._visible !== undefined ? this._visible : true;
                },
                set: function (visible) {

                    nx.each(this.vertices(), function (edge) {
                        edge.visible(visible);
                    });


                    if (this._visible !== undefined || this._visible !== visible) {
                        this.updated(true);
                    }
                    this._visible = visible;
                }
            },
            activated: {
                get: function () {
                    return this._activated !== undefined ? this._activated : true;
                },
                set: function (value) {
                    if (this._activated !== value) {
                        this._activated = value;
                        var graph = this.graph();

                        if (value) {
                            nx.each(this.vertices(), function (vertex) {
                                vertex.visible(false);
                                vertex.generated(false);
                                if (vertex.type() == 'vertex') {
                                    graph.fire('removeVertex', vertex);
                                } else {
                                    if (!vertex.activated()) {
                                        vertex.activated(true);
                                    }
                                    graph.fire('removeVertexSet', vertex);
                                }
                            }, this);

                            this.eachEdgeSet(function (edgeSet) {
                                edgeSet.visible(true);
                                edgeSet.generated(true);
                                graph.fire('addEdgeSet', edgeSet);
                            });

                            this.eachEdge(function (edge) {
                                if (edge.type() == 'edgeSet') {
                                    edge.visible(false);
                                    edge.generated(false);
                                    graph.fire('removeEdgeSet', edge);
                                } else {
                                    edge.visible(true);
                                    edge.generated(true);
                                    graph.fire('addEdge', edge);
                                }
                            });


                            nx.each(this.originalEdgeSetMap(), function (edgeSet, linkKey) {
                                edgeSet.visible(false);
                                edgeSet.generated(false);
                                graph.fire('removeEdgeSet', edgeSet);
                            });


                        } else {

                            //expand


                            nx.each(this.vertices(), function (vertex) {
                                vertex.visible(true);
                                vertex.generated(true);
                                if (vertex.type() == 'vertex') {
                                    graph.fire('addVertex', vertex);
                                } else {
                                    graph.fire('addVertexSet', vertex);
                                }
                            }, this);


                            this.eachEdgeSet(function (edgeSet) {
                                edgeSet.visible(false);
                                var _vertex = edgeSet.sourceID() === this.id() ? edgeSet.target() : edgeSet.source();
                                // console.log(_vertex.type(), edgeSet.linkKey());
                                if (_vertex.type() == 'vertexSet') {
                                    //debugger;
                                }
                            }, this);


                            var fn = function (edgeSet) {
                               // console.log(edgeSet.linkKey(), '---');
                                edgeSet.eachEdge(function (edge) {
                                    var sourceVertexSet = edge.source().parentVertexSet();
                                    var targetVertexSet = edge.target().parentVertexSet();
                                    var condition = edge.source().generated() && edge.target().generated() && edge.source().visible() && edge.target().visible();
                                    var sourceCondition = sourceVertexSet && sourceVertexSet.generated() && edge.target().generated() && sourceVertexSet.visible() && edge.target().visible();
                                    var targetCondition = targetVertexSet && edge.source().generated() && targetVertexSet.generated() && edge.source().visible() && targetVertexSet.visible();
                                    var _edgeSet;
//                                    console.log(sourceVertexSet);
//                                    console.log(targetVertexSet);
//                                    console.log(edge.linkKey(), edge.type(), condition);
                                    if (condition) {
                                        if (edge.type() == 'edgeSet') {
                                            edge.visible(true);
                                            edge.generated(true);
                                            graph.fire('addEdgeSet', edge);
                                        } else {
                                            edge.visible(true);
                                            edge.generated(true);
                                            graph.fire('addEdge', edge);
                                        }
                                    } else if (sourceCondition) {
                                        _edgeSet = graph._addEdgeSet({
                                            source: sourceVertexSet,
                                            target: edge.target(),
                                            sourceID: sourceVertexSet.id(),
                                            targetID: edge.target().id()
                                        });
                                        _edgeSet.addEdge(edge);
                                        edgeSet.addEdge(_edgeSet);
                                        graph.fire('addEdgeSet', _edgeSet);
                                    } else if (targetCondition) {
                                        _edgeSet = graph._addEdgeSet({
                                            source: edge.source(),
                                            target: targetVertexSet,
                                            sourceID: edge.source().id(),
                                            targetID: targetVertexSet.id()
                                        });
                                        _edgeSet.addEdge(edge);
                                        edgeSet.addEdge(_edgeSet);
                                        graph.fire('addEdgeSet', _edgeSet);
                                    } else {
                                        if (edge.type() == 'edgeSet') {
                                            fn.call(this, edge);
                                        }
                                    }
                                }, this);
                            };

                            this.eachEdgeSet(function (edgeSet) {
                                fn.call(this, edgeSet);
                            }, this);

                            nx.each(this.originalEdgeSetMap(), function (edgeSet, linkKey) {
                                edgeSet.visible(true);
                                edgeSet.generated(true);
                                graph.fire('addEdgeSet', edgeSet);
                               // console.log(linkKey);
                            });
                        }
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        },
        methods: {
            /***
             * Add child vertex
             * @method addVertex
             * @param vertex {nx.data.Vertex}
             */
            addVertex: function (vertex) {
                return this.vertices().push(vertex);
            },

            addVertices: function (nodes) {
                var graph = this.graph();
                var vertexSetID = this.id();
                var vertices = {};
                var vertexSetConnectedEdgeSet = {};

                var vertexSetEdgeSet = {};

                var map = {};

                var insideNodes = util.uniq(this.nodesArray().concat(nodes));

                nx.each(nodes, function (nodeID) {
                    var vertex = graph.verticesMap[nodeID] || graph._vertexSetMap[nodeID];
                    if (vertex) {
                        vertex.eachVisibleEdgeSet(function (edgeSet, linkKey) {
                            var _vertex = edgeSet.sourceID() == nodeID ? edgeSet.target() : edgeSet.source();
                            var _vertexID = _vertex.id();
                            if (insideNodes.indexOf(_vertexID) == -1 && _vertexID !== vertexSetID) {
                                map = vertexSetConnectedEdgeSet[_vertexID] = vertexSetConnectedEdgeSet[_vertexID] || [];
                                map.push(edgeSet);
                            } else {
                                edgeSet.visible(false);
                                vertexSetEdgeSet[linkKey] = edgeSet;
                            }


                        }, this);

                        vertex.visible(false);
                        vertex.parentVertexSet(this);

                        vertices[nodeID] = vertex;
                    }
                }, this);


                nx.each(vertexSetConnectedEdgeSet, function (edgeSetArray, vertexID) {
                    var _edgeSet = graph._addEdgeSet({
                        source: this,
                        target: graph.getVertex(vertexID) || graph.getVertexSet(vertexID),
                        sourceID: vertexSetID,
                        targetID: vertexID
                    });
                    _edgeSet.addEdges(edgeSetArray);
//                    console.log(vertexSetID, vertexID);

                    var _vertexSet = graph._vertexSetMap[vertexID]; //5
                    if (_vertexSet) {
//                        var obj = {};
//                        nx.each(edgeSetArray, function (edgeset, linkKey) {
//                            edgeset.eachEdge(function (edge) {
//                                var _vertex = insideNodes.indexOf(edge.sourceID()) !== -1 ? edge.target() : edge.source();
//                                if (_vertex.type() == 'vertex') {
//                                    obj[_vertex.id()] = _vertex;
//                                }
//                            });
//                        });
////
//                        nx.each(obj, function (vertex, id) {
//                            var __edgeSet = graph._addEdgeSet({
//                                source: this,
//                                target: vertex,
//                                sourceID: vertexSetID,
//                                targetID: id
//                            });
//
//                            console.log(vertexSetID, id, __edgeSet.linkKey());
//                            _edgeSet.addEdge(__edgeSet);
//                        }, this);
                    }

                }, this);


//                console.log(vertexSetEdgeSet);

                this.nodesArray(insideNodes);
                this.vertices(nx.extend(this.vertices(), vertices));
                this.originalEdgeSetMap(nx.extend(this.originalEdgeSetMap(), vertexSetEdgeSet));
            },


            /**
             * Remove vertex
             * @param vertex {nx.data.Vertex}
             * @returns {Array}
             */
            removeVertex: function (vertex) {
                return this.vertices(util.without(this.vertices(), vertex));
            },
            addInsideEdgeSet: function (edgeSet) {
                var insideEdgeSet = this.insideEdgeSet();
                insideEdgeSet[edgeSet.linkKey()] = edgeSet;
            }
        }
    });

})(nx, nx.util, nx.global);