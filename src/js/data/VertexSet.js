(function (nx, global) {
    var util = nx.util;
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
            vertexSet: {
                value: function () {
                    return {};
                }
            },
            nodes: {
                value: function () {
                    return [];
                }
            },
            innerEdgeSetMap: {
                value: function () {
                    return {};
                }
            },
            outerEdgeSetMap: {
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
                    return this._activated !== undefined ? this._activated : null;
                },
                set: function (value) {
                    if (this._activated !== value) {
                        this._activated = value;
                        var selfID = this.id();
                        var graph = this.graph();

                        if (value) {


                            //collapse

                            nx.each(this.vertices(), function (vertex) {
                                vertex.visible(false);
                                if (vertex.generated()) {
                                    vertex.generated(false);
                                    graph._removeVertex(vertex);
                                }
                            }, this);

                            nx.each(this.vertexSet(), function (vertexSet) {
                                vertexSet.visible(false);
                                if (vertexSet.generated()) {
                                    vertexSet.generated(false);
                                    if (!vertexSet.activated()) {
                                        vertexSet.activated(true);
                                    }
                                    graph._removeVertexSet(vertexSet);
                                }
                            }, this);


                            nx.each(this.outerEdgeSetMap(), function (edgeSetAry, vertexID) {
                                var vertex = graph.getVertex(vertexID);
                                var rootVertex = vertex.getVisibleParentVertexSet();
                                var _vertex;

                                if (vertex.visible()) {
                                    _vertex = vertex;
                                } else if (rootVertex && rootVertex != this) {
                                    _vertex = rootVertex;
                                } else {
                                    //todo: get visible parent vertex set
                                    return;
                                }

                                var esc = graph._getEdgeSetCollectionByVertex(selfID, _vertex.id());
                                if (!esc) {
                                    esc = graph._addEdgeSetCollection({
                                        sourceID: selfID,
                                        targetID: _vertex.id(),
                                        source: this,
                                        target: _vertex
                                    });
                                }

                                nx.each(edgeSetAry, function (edgeSet) {
                                    esc.addEdgeSet(edgeSet);
                                });

                                graph.fire('updateEdgeSetCollection', esc);


                                nx.each(edgeSetAry, function (edgeSet) {
                                    if (edgeSet.generated()) {
                                        edgeSet.visible(false);
                                        edgeSet.generated(false);
                                        edgeSet._activated = null;
                                        graph.fire('removeEdgeSet', edgeSet);
                                    }
                                }, this);

                            }, this);


                            nx.each(this.innerEdgeSetMap(), function (edgeSet, linkKey) {
                                if (edgeSet.type() == 'edgeSet') {
                                    edgeSet.visible(false);
                                    edgeSet.generated(false);
                                    edgeSet._activated = null;
                                    graph.fire('removeEdgeSet', edgeSet);
                                } else if (edgeSet.type() == 'edgeSetCollection') {
                                    graph._removeEdgeSetCollection(edgeSet);
                                }
                            }, this);

                        } else {

                            //expand


                            // remove created edgeSet collection
                            nx.each(this.edgeSetCollection(), function (esc, vertexID) {
                                graph._removeEdgeSetCollection(esc);
                            }, this);


                            nx.each(this.vertices(), function (vertex) {
                                vertex.visible(true);
                                vertex.generated(true);
                                graph.fire('addVertex', vertex);
                            }, this);

                            nx.each(this.vertexSet(), function (vertexSet) {
                                vertexSet._visible = true;
                                vertexSet.generated(true);
                                graph.fire('addVertexSet', vertexSet);
                                vertexSet.activated(true);
                            }, this);


                            nx.each(this.outerEdgeSetMap(), function (edgeSetAry, vertexID) {
                                var vertex = graph.getVertex(vertexID);
                                var rootVertex = vertex.getVisibleParentVertexSet();

                                if (vertex.visible()) {
                                    nx.each(edgeSetAry, function (edgeSet) {
                                        edgeSet.visible(true);
                                        edgeSet.generated(true);
                                        graph.fire('addEdgeSet', edgeSet);
                                    }, this);
                                } else if (rootVertex) {
                                    var _vertex = rootVertex;

                                    nx.each(edgeSetAry, function (edgeSet) {
                                        var _source, _target;
                                        if (edgeSet.sourceID() == vertexID) {
                                            _source = _vertex;
                                            _target = edgeSet.target();
                                        } else {
                                            _source = edgeSet.source();
                                            _target = _vertex;
                                        }


                                        var esc = graph._getEdgeSetCollectionByVertex(_source.id(), _target.id());
                                        if (!esc) {
                                            esc = graph._addEdgeSetCollection({
                                                sourceID: _source.id(),
                                                targetID: _target.id(),
                                                source: _source,
                                                target: _target
                                            });
                                        }
                                        esc.addEdgeSet(edgeSet);
                                        graph.fire('updateEdgeSetCollection', esc);

                                    }, this);


                                } else {
                                    //console.log();
                                }

                            }, this);

                            //add inner edgeset
                            nx.each(this.innerEdgeSetMap(), function (edgeSet, linkKey) {
                                if (edgeSet.type() == 'edgeSet') {
                                    edgeSet.visible(true);
                                    edgeSet.generated(true);
                                    graph.fire('addEdgeSet', edgeSet);
                                } else if (edgeSet.type() == 'edgeSetCollection') {
                                    graph.fire('addEdgeSetCollection', edgeSet);
                                }
                            }, this);

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

            addVertices: function (inNodes) {
                var graph = this.graph();
                var vertexSetID = this.id();
                var vertices = {};
                var vertexSet = {};
                var outerEdgeSetMap = {};
                var innerEdgeSetMap = {};

                var map = {};

                var nodes = util.uniq(this.nodes().concat(inNodes));

                //iterate all nodes
                nx.each(nodes, function (nodeID) {
                    // get vertex or vertexSet
                    var vertex = graph.verticesMap[nodeID] || graph._vertexSetMap[nodeID];
                    if (vertex) {
                        //iterate vertex's all connected visible edgeSet

                        vertex.eachEdgeSet(function (edgeSet, linkKey) {
                            // get the the other vertex
                            var _vertex = edgeSet.sourceID() == nodeID ? edgeSet.target() : edgeSet.source();
                            var _vertexID = _vertex.id();
                            // if _vertex is outer vertex
                            if (nodes.indexOf(_vertexID) == -1 && _vertexID !== vertexSetID) {
                                map = outerEdgeSetMap[_vertexID] = outerEdgeSetMap[_vertexID] || [];
                                map[map.length] = edgeSet;
                            } else {
                                edgeSet.visible(false);
                                innerEdgeSetMap[linkKey] = edgeSet;
                            }
                        }, this);

                        vertex.visible(false);
                        vertex.parentVertexSet(this);
                        if (vertex.type() == 'vertex') {
                            vertices[nodeID] = vertex;
                        } else {
                            vertexSet[nodeID] = vertex;
                        }

                    }
                }, this);

                this.nodes(nodes);
                this.vertices(vertices);
                this.vertexSet(vertexSet);
                this.innerEdgeSetMap(innerEdgeSetMap);
                this.outerEdgeSetMap(outerEdgeSetMap);
            },

            eachVertex: function (callback, context) {
                nx.each(nx.extend({}, this.vertices(), this.vertexSet()), callback, context || this);
            },

            /**
             * Remove vertex
             * @param vertex {nx.data.Vertex}
             * @returns {Array}
             */
            removeVertex: function (vertex) {
                delete this.vertices()[vertex.id()];
                delete this.vertexSet()[vertex.id()];
            }
        }
    });

})(nx, nx.global);