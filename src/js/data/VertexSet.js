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
            subVertexSet: {
                get: function () {
                    var vertexSets = {};
                    this.eachSubVertexSet(function (vertexSet, id) {
                        vertexSets[id] = vertexSet;
                    });
                    return vertexSets;
                }
            },
            visible: {
                value: true
            },
            inheritedVisible: {
                get: function () {
                    // all sub vertex is in visible
                    var invisible = true;
                    nx.each(this.vertices(), function (vertex) {
                        if (vertex.visible()) {
                            invisible = false;
                        }
                    });
                    nx.each(this.vertexSet(), function (vertexSet) {
                        if (vertexSet.visible()) {
                            invisible = false;
                        }
                    }, this);
                    return !invisible;
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
            activated: {
                get: function () {
                    return this._activated !== undefined ? this._activated : true;
                },
                set: function (value) {
                    if (this._activated !== value) {
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
            initNodes: function () {
                var graph = this.graph();
                var nodes = this.get('nodes');
                nx.each(nodes, function (id) {
                    var vertex = graph.vertices().getItem(id) || graph.vertexSets().getItem(id);
                    if (vertex && !vertex.restricted()) {
                        var _map = vertex.type() == 'vertex' ? this.vertices() : this.vertexSet();
                        _map[id] = vertex;
                        vertex.restricted(true);
                        vertex.parentVertexSet(this);
                    } else {
                        if (console) {
                            console.log('NodeSet data error', this.id(), id);
                        }
                    }
                }, this);

            },
            /***
             * Add child vertex
             * @method addVertex
             * @param vertex
             */
            addVertex: function (vertex) {
                var nodes = this.get('nodes');
                var id = vertex.id();
                if (vertex && !vertex.restricted()) {
                    var _map = vertex.type() == 'vertex' ? this.vertices() : this.vertexSet();
                    _map[id] = vertex;
                    vertex.restricted(true);

                    if (vertex.parentVertexSet()) {
                        vertex.parentVertexSet().removeVertex(id);
                        vertex.parentVertexSet().update(true);
                    }

                    vertex.parentVertexSet(this);
                    nodes.push(vertex.id());
                    this.updated(true);
                }
            },
            /**
             * Remove vertex
             * @param id {String}
             * @returns {Array}
             */
            removeVertex: function (id) {
                var nodes = this.get('nodes');
                var vertex = this.vertices()[id] || this.vertexSet()[id];
                if (vertex) {
                    vertex.parentVertexSet(null);
                    delete this.vertices()[id];
                    delete this.vertexSet()[id];
                    nodes.splice(nodes.indexOf(id), 1);
                    this.updated(true);
                }
            },
            eachSubVertex: function (callback, context) {
                nx.each(this.vertices(), callback, context || this);
                nx.each(this.vertexSet(), function (vertex) {
                    vertex.eachSubVertex(callback, context);
                }, this);
            },
            eachSubVertexSet: function (callback, context) {
                nx.each(this.vertexSet(), callback, context || this);
                nx.each(this.vertexSet(), function (vertex) {
                    vertex.eachSubVertexSet(callback, context);
                }, this);
            },
            getSubEdgeSets: function () {
                var subEdgeSetMap = {};
                // get all sub vertex and edgeSet
                this.eachSubVertex(function (vertex) {
                    nx.each(vertex.edgeSets(), function (edgeSet, linkKey) {
                        subEdgeSetMap[linkKey] = edgeSet;
                    });
                }, this);
                return subEdgeSetMap;
            },
            _expand: function () {
                var graph = this.graph();

                var parentVertexSet = this.parentVertexSet();
                if (parentVertexSet) {
                    parentVertexSet.activated(false);
                }

                this._activated = false;

                // remove created edgeSet collection
                nx.each(this.edgeSetCollections(), function (esc, linkKey) {
                    graph.deleteEdgeSetCollection(linkKey);
                }, this);


                nx.each(this.vertices(), function (vertex, id) {
                    vertex.restricted(false);
                    if (vertex.visible()) {
                        graph.generateVertex(vertex);
                    }
                }, this);

                nx.each(this.vertexSet(), function (vertexSet) {
                    vertexSet.restricted(false);
                    if (vertexSet.visible()) {
                        graph.generateVertexSet(vertexSet);
                    }
                }, this);

                this.visible(false);

                this._generateConnection();
            },
            _collapse: function () {
                var graph = this.graph();

                this._activated = true;


                this.eachSubVertex(function (vertex) {
                    if (vertex.generated()) {
                        nx.each(vertex.edgeSetCollections(), function (esc, linkKey) {
                            graph.deleteEdgeSetCollection(linkKey);
                        });
                    }
                }, this);


                nx.each(this.vertexSet(), function (vertexSet, id) {
                    if (vertexSet.generated()) {
                        vertexSet.restricted(true);
                        graph.removeVertexSet(id, false);
                    }
                }, this);

                nx.each(this.vertices(), function (vertex, id) {
                    if (vertex.generated()) {
                        vertex.restricted(true);
                        graph.removeVertex(id);
                    }
                }, this);

                this.visible(true);

                this._generateConnection();

            },
            _generateConnection: function () {
                //
                var graph = this.graph();

                nx.each(this.getSubEdgeSets(), function (edgeSet) {
                    graph._generateConnection(edgeSet);
                }, this);
            }
        }
    });


})
(nx, nx.global);