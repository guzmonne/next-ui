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
             * @property edges {Array}
             */
            edges: {
                value: function () {
                    return [];
                }
            },
            /**
             * All virtual child edges
             * @property virtualEdges {Array}
             */
            virtualEdges: {
                value: function () {
                    return [];
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

                    var visible;

                    if (value && (this.source().visible() && this.target().visible())) {
                        visible = true;
                    } else {
                        visible = false;
                    }


                    nx.each(this.edges(), function (edge) {
                        edge.visible(visible);
                    });


                    if (this._visible !== undefined || this._visible !== value) {
                        this.updated(true);
                    }

                    this._visible = visible;

                }
            },
            activated: {
                get: function () {
                    return this._activated;
                },
                set: function (value) {
                    var graph = this.graph();
                    nx.each(this.edges(), function (edge) {
                        edge.visible(!value);
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
                    });
                    this._activated = value;
                }
            }
        },
        methods: {
            /**
             * Add child edge
             * @method addEdge
             * @param edge {nx.data.Edge}
             * @returns {Boolean}
             */
            addEdge: function (edge) {
                return this.edges().push(edge);
            },
            /**
             * Add child edges
             * @method addEdges
             * @param edges {Array}
             * @returns {Array}
             */
            addEdges: function (edges) {
                return this.edges(this.edges().concat(edges));
            },
            /**
             * Add virtual edges
             * @method addVirtualEdges
             * @param edges {Array}
             * @returns {Array}
             */
            addVirtualEdges: function (edges) {
                return this.virtualEdges(this.virtualEdges().concat(edges));
            },
            /**
             * Remove child edge
             * @method removeEdge
             * @param edge {nx.data.Edge}
             */
            removeEdge: function (edge) {
                var edges = this.edges();
                edges.splice(edges.indexOf(edge), 1);
            },
            /**
             * Iterate each edges, include virtual edges
             * @method eachEdges
             * @param callback {Function}
             * @param context {Object}
             */
            eachEdges: function (callback, context) {
                nx.each(this.edges().concat(this.virtualEdges()), callback, context || this);
            },
            /**
             * Get every child edges, include all child level
             * @method getEdges
             * @param isVisible {Boolean} is include visible edges,default false.
             * @param isNotVirtual {Boolean} is not include virtual edges,default false.
             * @returns {Array}
             */
            getEdges: function (isVisible, isNotVirtual) {
                var edges = [];
                nx.each(this.edges().concat(this.virtualEdges()), function (edge) {

                    if (edge instanceof nx.data.EdgeSet) {
                        edges = edges.concat(edge.getEdges(isVisible, isNotVirtual));
                    } else {

                        if (isNotVirtual === true && isVisible === true) {
                            if (edge.visible() && !edge.virtual()) {
                                edges.push(edge);
                            }
                        } else if (isNotVirtual === true) {
                            if (!edge.virtual()) {
                                edges.push(edge);
                            }
                        } else if (isVisible === true) {
                            if (edge.visible()) {
                                edges.push(edge);
                            }
                        } else {
                            edges.push(edge);
                        }
                    }
                });
                return edges;
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
                var edgeSet = util.find(this.edges().concat(this.virtualEdges()), function (edge) {
                    return edge instanceof nx.data.EdgeSet;
                });

                return edgeSet !== undefined;

            }
        }

    });
})(nx, nx.graphic.util, nx.global);