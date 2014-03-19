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
             * @property vertices {Array}
             * @default []
             */
            vertices: {
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
                        var graph = this.graph();


                        nx.each(this.vertices(), function (vertex) {
                            vertex.visible(!value);
                            if (value) {
                                if (vertex.generated()) {
                                    vertex.generated(false);
                                    if (vertex.type() == 'vertex') {
                                        graph.fire('removeVertex', vertex);
                                    } else {
                                        graph.fire('removeVertexSet', vertex);
                                    }
                                }
                            } else {
                                if (!vertex.generated()) {
                                    vertex.generated(true);
                                    if (vertex.type() == 'vertex') {
                                        graph.fire('addVertex', vertex);
                                    } else {
                                        graph.fire('addVertexSet', vertex);
                                    }
                                }
                            }
                        }, this);


                        nx.each(this.edges.concat(this.reverseEdges), function (edge) {
                            var edgeset = edge.parentEdgeSet();
                            edgeset.visible(value);
                            if (value) {
                                if (!edgeset.generated()) {
                                    edgeset.generated(true);
                                    graph.fire('addEdgeSet', edgeset);
                                }

                            } else {
                                edgeset.generated(false);
                                graph.fire('removeEdgeSet', edgeset);
                                edgeset._activated = null;
                            }
                        }, this);


                        nx.each(this.edgeSetMap(), function (edgeset) {
                            edgeset.visible(!value);
                            if (value) {
                                edgeset.generated(false);
                                graph.fire('removeEdgeSet', edgeset);
                                edgeset._activated = null;
                            } else {
                                if (!edgeset.generated()) {
                                    edgeset.generated(true);
                                    graph.fire('addEdgeSet', edgeset);
                                }
                                edgeset.visible(true);
                            }
                        }, this);
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            edgeSetMap: {
                value: function () {
                    return {};
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
            /**
             * Remove vertex
             * @param vertex {nx.data.Vertex}
             * @returns {Array}
             */
            removeVertex: function (vertex) {
                return this.vertices(util.without(this.vertices(), vertex));
            },
            addEdgeSet: function (obj) {
                var edgeSetMap = this.edgeSetMap();
                nx.each(obj, function (edgeSet, linkKey) {
                    edgeSetMap[linkKey] = edgeSet;
                }, this);
            }
        }
    });

})(nx, nx.util, nx.global);