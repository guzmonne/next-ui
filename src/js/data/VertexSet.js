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
                                if (!vertex.visible()) {
                                    vertex = vertex.getVisibleParentVertexSet();
                                }
                                var esc = graph._getEdgeSetCollectionByVertex(selfID, vertex.id());
                                if (!esc) {
                                    esc = graph._addEdgeSetCollection({
                                        sourceID: selfID,
                                        targetID: vertex.id(),
                                        source: this,
                                        target: vertex
                                    });
                                }

                                nx.each(edgeSetAry, function (edgeSet) {
                                    esc.addEdgeSet(edgeSet);
                                });

                                graph.fire('updateEdgeSetCollection', esc);

                            }, this);


                            nx.each(this.innerEdgeSetMap(), function (edgeSet, linkKey) {
                                if (edgeSet.generated()) {
                                    if (edgeSet.type() == 'edgeSet') {
                                        edgeSet.visible(false);
                                        edgeSet.generated(false);
                                        edgeSet._activated = null;
                                        graph.fire('removeEdgeSet', edgeSet);
                                    } else if (edgeSet.type() == 'edgeSetCollection') {
                                        graph._removeEdgeSetCollection(edgeSet);
                                    }
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


                            //


                            var map = {};
                            nx.each(this.outerEdgeSetMap(), function (edgeSetAry, vertexID) {
                                nx.each(edgeSetAry, function (edgeSet) {
                                    map[edgeSet.linkKey()] = edgeSet;
                                });
                            }, this);


                            nx.each(map, function (edgeSet, linkKey) {
                                var obj = this._getVisibleVertex(edgeSet);
                                var source = obj.source, target = obj.target;
                                if (source && target) {
                                    var sourceID = source.id(), targetID = target.id();
                                    var _sourceID = edgeSet.sourceID(), _targetID = edgeSet.targetID();
                                    if (source.type() == 'edgeSet' && target.type() == 'edgeSet') {
                                        edgeSet.visible(true);
                                        edgeSet.generated(true);
                                        graph.fire('addEdgeSet', edgeSet);
                                    } else {
                                        var esc = graph._getEdgeSetCollectionByVertex(sourceID, targetID);
                                        if (!esc) {
                                            esc = graph._addEdgeSetCollection({
                                                sourceID: sourceID,
                                                targetID: targetID,
                                                source: source,
                                                target: target
                                            });
                                        }
                                        esc.addEdgeSet(edgeSet);
                                        graph.fire('updateEdgeSetCollection', esc);
                                    }
                                }
                            }, this);

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
                var _nodes = nodes.slice();
                var _edgeSetMap = {};


                nx.each(nodes, function (nodeID) {
                    var vertex = graph.verticesMap[nodeID] || graph._vertexSetMap[nodeID];
                    if (vertex) {
                        if (graph.verticesMap[nodeID]) {
                            vertices[nodeID] = vertex;
                            nx.extend(_edgeSetMap, vertex.edgeSet());
                        } else if (graph._vertexSetMap[nodeID]) {
                            vertexSet[nodeID] = vertex;
                            nx.each(vertex.outerEdgeSetMap(), function (edgeSetAry) {
                                nx.each(edgeSetAry, function (edgeSet) {
                                    _edgeSetMap[edgeSet.linkKey()] = edgeSet;
                                });
                            });
                            vertex.eachSubVertex(function (v) {
                                _nodes[_nodes.length] = v.id();
                            });
                        }
                    }
                }, this);


                nx.each(_edgeSetMap, function (edgeSet, linkKey) {
                    var obj = this._getVisibleVertex(edgeSet);
                    var source = obj.source, target = obj.target;
                    if (source && target) {
                        var sourceID = source.id(), targetID = target.id();
                        var _sourceID = edgeSet.sourceID(), _targetID = edgeSet.targetID();
                        if (_nodes.indexOf(sourceID) !== -1 && _nodes.indexOf(targetID) !== -1) {
                            innerEdgeSetMap[linkKey] = edgeSet;
                        } else if (_nodes.indexOf(sourceID) !== -1) {
                            map = outerEdgeSetMap[_targetID] = outerEdgeSetMap[_targetID] || [];
                            map[map.length] = edgeSet;
                        } else if (_nodes.indexOf(targetID) !== -1) {
                            map = outerEdgeSetMap[_sourceID] = outerEdgeSetMap[_sourceID] || [];
                            map[map.length] = edgeSet;
                        }
                    }
                }, this);

                nx.each(nx.extend({}, vertices, vertexSet), function (vertex) {
                    vertex._visible = false;
                    vertex.parentVertexSet(this);
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
            eachSubVertex: function (callback, context) {
                nx.each(this.vertices(), callback, context || this);
                nx.each(this.vertexSet(), function (vertex) {
                    vertex.eachVertex(callback, context);
                }, this);
            },
            _getVisibleVertex: function (edgeSet) {
                var source = edgeSet.source();
                if (!source.visible()) {
                    source = source.getVisibleParentVertexSet();
                }
                var target = edgeSet.target();
                if (!target.visible()) {
                    target = target.getVisibleParentVertexSet();
                }
                return {
                    source: source,
                    target: target
                };
            },
            /**
             * Remove vertex
             * @param vertex {nx.data.Vertex}
             * @returns {Array}
             */
            removeVertex: function (vertex) {
                this.removeVertexById(vertex.id());
            },
            removeVertexById: function (id) {
                var nodes = this.nodes();
                if (nodes.indexOf(id) != -1) {
                    delete this.vertices()[id];
                    delete this.vertexSet()[id];
                    this.nodes().splice(this.nodes().indexOf(id), 1);
                }
            }
        }
    });


})
(nx, nx.global);