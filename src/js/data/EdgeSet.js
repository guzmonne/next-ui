(function (nx, global) {
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
                        if (value) {
                            graph.fire('removeEdge', edge);
                        } else {
                            graph.fire('addEdge', edge);
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
             * Get all child edges
             * @method getEdges
             * @returns {Array}
             */
            getEdges: function () {
                var edges = [];
                this.eachEdge(function (edge) {
                    edges.push(edge);
                }, this);
                return edges;
            },
            disposeEdges: function () {
                var graph = this.graph();
                nx.each(this.edges(), function (edge) {
                    edge.generated(false);
                    graph.fire('removeEdge', edge);
                });
            }
        }

    });
})(nx, nx.global);