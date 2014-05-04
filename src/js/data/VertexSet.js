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
            subVertices: {
                get: function () {
                    var vertices = {};
                    this.eachSubVertex(function (vertex, id) {
                        vertices[id] = vertex;
                    });
                    return vertices;
                }
            },
            visibleSubVertices: {
                get: function () {
                    var vertices = {};
                    nx.each(this.vertices(), function (vertex, id) {
                        if (vertex.visible()) {
                            vertices[id] = vertex;
                        }
                    });
                    nx.each(this.vertexSet(), function (vertexSet, id) {
                        if (vertexSet.activated()) {
                            vertices[id] = vertexSet;
                        } else {
                            vertices = nx.extend(vertices, vertexSet.visibleSubVertices());
                        }
                    }, this);
                    return vertices;
                }
            },
            nodes: {
                value: function () {
                    return [];
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
                    if (visible !== this._visible) {
                        this.eachVertex(function (vertex) {
                            vertex.visible(visible);
                        }, this);
                        this.updated(true);
                        this._visible = visible;
                    }
                }
            },
            activated: {
                get: function () {
                    return this._activated !== undefined ? this._activated : null;
                },
                set: function (value) {
                    if (this._activated !== value) {
                        this._activated = value;
                        if (value) {
                            this._collapse();
                        } else {
                            this._expand();
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
                this.addVertices([vertex.id()]);
            },
            addVertices: function (inNodes) {
                var graph = this.graph();
                var vertices = {};
                var vertexSet = {};
                var nodes = util.uniq(this.nodes().concat(inNodes));
                nx.each(nodes, function (nodeID) {
                    var vertex;
                    if (graph.verticesMap[nodeID]) {
                        vertex = vertices[nodeID] = graph.verticesMap[nodeID];
                    } else if (graph.vertexSetMap[nodeID]) {
                        vertex = vertexSet[nodeID] = graph.vertexSetMap[nodeID];
                    }
                    vertex.visible(false);
                    vertex.parentVertexSet(this);
                }, this);
                this.nodes(nodes);
                this.vertices(vertices);
                this.vertexSet(vertexSet);
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
                this.removeVertexById(vertex.id());
            },
            removeVertexById: function (id) {
                var nodes = this.nodes();
                if (nodes.indexOf(id) != -1) {
                    delete this.vertices()[id];
                    delete this.vertexSet()[id];
                    this.nodes().splice(this.nodes().indexOf(id), 1);
                }
                this.updated(true);
            },
            removeVertices: function (inNodes) {
                nx.each(inNodes, this.removeVertexById, this);
            },
            eachSubVertex: function (callback, context) {
                nx.each(this.vertices(), callback, context || this);
                nx.each(this.vertexSet(), function (vertex) {
                    vertex.eachSubVertex(callback, context);
                }, this);
            },
            _expand: function () {
                var graph = this.graph();
                var subVertices = [], subEdgeSetMap = {};

                // remove created edgeSet collection
                nx.each(this.edgeSetCollection(), function (esc, vertexID) {
                    graph._removeEdgeSetCollection(esc);
                }, this);
                this.visible(false);
                this.edgeSetCollection({});


                nx.each(this.vertices(), function (vertex) {
                    vertex.visible(true);
                    vertex.generated(true);
                    graph.fire('addVertex', vertex);
                }, this);

                nx.each(this.vertexSet(), function (vertexSet) {
                    vertexSet._visible = true;
                    vertexSet._activated = true; //check
                    vertexSet.generated(true);
                    graph.fire('addVertexSet', vertexSet);
                }, this);


                // get all sub vertex and edgeSet
                this.eachSubVertex(function (vertex) {
                    vertex.eachEdgeSet(function (edgeSet, linkKey) {
                        subEdgeSetMap[linkKey] = edgeSet;
                    });
                    subVertices.push(vertex);
                }, this);


                nx.each(subEdgeSetMap, function (edgeSet, linkKey) {
                    var obj = this._getVisibleVerticesOfEdgeSet(edgeSet);
                    if (obj.source == obj.target) {
                        return;
                    }

                    if (edgeSet.source() == obj.source && edgeSet.target() == obj.target) {
                        edgeSet.generated(true);
                        graph.fire('addEdgeSet', edgeSet);
                    } else {
                        var _linkKey = obj.source.id() + '_' + obj.target.id();
                        var _reverseLinkKey = obj.target.id() + '_' + obj.source.id();
                        var esc = graph.edgeSetCollectionMap[_linkKey] || graph.edgeSetCollectionMap[_reverseLinkKey];
                        if (!esc) {
                            esc = graph._addEdgeSetCollection({
                                source: obj.source,
                                target: obj.target,
                                sourceID: obj.source.id(),
                                targetID: obj.target.id()
                            });
                        }
                        esc.addEdgeSet(edgeSet);
                        graph.fire('updateEdgeSetCollection', esc);
                    }
                }, this);
            },
            _collapse: function () {
                var graph = this.graph();
                var subVertices = [], subEdgeSetMap = {};

                // get all sub vertex and edgeSet
                this.eachSubVertex(function (vertex) {
                    vertex.eachEdgeSet(function (edgeSet, linkKey) {
                        subEdgeSetMap[linkKey] = edgeSet;
                    });
                    subVertices.push(vertex);
                }, this);

                nx.each(this.vertexSet(), function (vertexSet) {
                    if (vertexSet.generated()) {
                        vertexSet.generated(false);
                        if (!vertexSet.activated()) {
                            vertexSet.activated(true);
                        }
                        vertexSet.visible(false);
                        graph._removeVertexSet(vertexSet, false);
                    } else {
                        vertexSet.visible(false);
                    }
                }, this);

                nx.each(this.vertices(), function (vertex) {
                    vertex.visible(false);
                    if (vertex.generated()) {
                        vertex.generated(false);
                        graph._removeVertex(vertex);
                    }
                }, this);


                this._visible = true;
                nx.each(subEdgeSetMap, function (edgeSet, linkKey) {
                    var obj = this._getVisibleVerticesOfEdgeSet(edgeSet);
                    var _linkKey = obj.source.id() + '_' + obj.target.id();
                    var _reverseLinkKey = obj.target.id() + '_' + obj.source.id();
                    var esc = graph.edgeSetCollectionMap[_linkKey] || graph.edgeSetCollectionMap[_reverseLinkKey];

                    if (obj.source == obj.target) {
                        return;
                    }

                    if (!esc) {
                        esc = graph._addEdgeSetCollection({
                            source: obj.source,
                            target: obj.target,
                            sourceID: obj.source.id(),
                            targetID: obj.target.id()
                        });
                    }
                    esc.addEdgeSet(edgeSet);
                    graph.fire('updateEdgeSetCollection', esc);
                }, this);

            },
            _collapseSubNodes: function () {

            },
            _getVisibleVerticesOfEdgeSet: function (edgeSet) {
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
            }
        }
    });


})
(nx, nx.global);