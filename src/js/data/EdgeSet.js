(function (nx, util, global) {
    'use strict';

    /**
     * Edge set clas
     * @class nx.data.EdgeSet
     * @extend nx.data.Edge
     * @module nx.data
     */

    nx.define('nx.data.EdgeSet', nx.data.Edge, {
        properties: {
            /**
             * All child edges
             * @property edges {Object}
             */
            edges: {
                value: function () {
                    return {};
                }
            },
            /**
             * Edge's type
             * @property type {String}
             * @default 'edgeSet'
             */
            type: {
                value: 'edgeSet'
            },
            /**
             * Set/get edge set's visibility
             * @property visible {Boolean}
             * @default true
             */
            visible: {
                get: function () {
                    return this._visible !== undefined ? this._visible : true;
                },
                set: function (value) {
                    if (this._visible !== value) {

                        var visible = this.source().visible() && this.target().visible();

                        if (visible) {
                            this.eachEdge(function (edge) {
                                edge.visible(value);
                            }, this);
                        } else {
                            this.eachEdge(function (edge) {
                                edge.visible(false);
                            }, this);
                        }

                        this.updated(true);

                        this._visible = visible && value;

                        return true;
                    } else {
                        return false;
                    }
                }
            },
            activated: {
                get: function () {
                    return this._activated !== undefined ? this._activated : true;
                },
                set: function (value) {
                    var graph = this.graph();
                    this.eachEdge(function (edge) {
                        if (edge.type() == 'edge') {
                            if (value) {
                                graph.fire('removeEdge', edge);
                            } else {
                                graph.fire('addEdge', edge);
                            }
                        } else if (edge.type() == 'edgeSet') {
                            if (value) {
                                graph.fire('removeEdgeSet', edge);
                            } else {
                                graph.fire('addEdgeSet', edge);
                            }
                        }
                    }, this);
                    this._activated = value;
                }
            }
        },
        methods: {
            /**
             * Add child edge
             * @method addEdge
             * @param edge {nx.data.Edge}
             */
            addEdge: function (edge) {
                var edges = this.edges();
                edges[edge.id()] = edge;
            },
            /**
             * Add child edges
             * @method addEdges
             * @param inEdges {Array}
             */
            addEdges: function (inEdges) {
                nx.each(inEdges, this.addEdge, this);
            },
            /**
             * Remove child edge
             * @method removeEdge
             * @param edge {nx.data.Edge}
             */
            removeEdge: function (edge) {
                var edges = this.edges();
                var id = edge.id();
                delete  edges[id];
            },
            /**
             * Iterate each edges
             * @method eachEdge
             * @param callback {Function}
             * @param context {Object}
             */
            eachEdge: function (callback, context) {
                nx.each(this.edges(), callback, context || this);
            },
            /**
             * @method getEdges
             * @returns {Array}
             */
            getEdges: function () {
                var edges = [];
                this.eachEdge(function (edge, edgeID) {
                    edges.push(edge);
                }, this);
                return edges;
            },
            /**
             * Get all sub edges
             * @returns {Array}
             */
            getSubEdges: function () {
                var edges = [];
                this.eachEdge(function (edge, edgeID) {
                    if (edge instanceof nx.data.EdgeSet) {
                        edges = edges.concat(edge.getSubEdges());
                    } else {
                        edges.push(edge);
                    }
                }, this);
                return edges;
            },
            /**
             * Iterate each sub edges
             * @method eachSubEdge
             * @param callback {Function}
             * @param context {Object}
             */
            eachSubEdge: function (callback, context) {
                var edges = this.getSubEdges();
                nx.each(edges, callback, context);
            },
            getRootEdgeSet: function () {
                var parent = this.parentEdgeSet();
                while (parent) {
                    parent = parent.parentEdgeSet();
                }
                return parent;
            },
            /**
             * Detect is this edge set include sub edge set
             * @method containEdgeSet
             * @returns {boolean}
             */
            containEdgeSet: function () {
                var result = false;
                this.eachEdge(function (edge) {
                    if (edge instanceof nx.data.EdgeSet) {
                        result = true;
                    }
                }, this);
                return result;
            },
            removeEdges: function () {
                var graph = this.graph();
                nx.each(this.edges(), function (edge) {
                    edge.generated(false);
                    if (edge.type() == 'edge') {
                        graph.fire('removeEdge', edge);
                    } else if (edge.type() == 'edgeSet') {
                        graph.fire('removeEdgeSet', edge);
                    }
                });
            }
        }

    });
})(nx, nx.util, nx.global);