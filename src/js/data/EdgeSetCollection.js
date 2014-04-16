(function (nx, global) {
    'use strict';

    /**
     * Edge set collection class
     * @class nx.data.EdgeSetCollection
     * @extend nx.data.Edge
     * @module nx.data
     */

    nx.define('nx.data.EdgeSetCollection', nx.data.Edge, {
        properties: {
            /**
             * All child edgeset
             * @property edgeSetMap {Object}
             */
            edgeSetMap: {
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
                value: 'edgeSetCollection'
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
                            this.eachEdgeSet(function (edgeSet) {
                                edgeSet.visible(value);
                            }, this);
                        } else {
                            this.eachEdgeSet(function (edgeSet) {
                                edgeSet.visible(false);
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
//                    var graph = this.graph();
//                    this.eachEdge(function (edge) {
//                        if (edge.type() == 'edge') {
//                            if (value) {
//                                graph.fire('removeEdge', edge);
//                            } else {
//                                graph.fire('addEdge', edge);
//                            }
//                        } else if (edge.type() == 'edgeSet') {
//                            if (value) {
//                                graph.fire('removeEdgeSet', edge);
//                            } else {
//                                graph.fire('addEdgeSet', edge);
//                            }
//                        }
//                    }, this);
//                    this._activated = value;
                }
            }
        },
        methods: {
            /**
             * Add child edgeSet
             * @method addEdgeSet
             * @param edgeSet {nx.data.EdgeSet}
             */
            addEdgeSet: function (edgeSet) {
                var edgeSetMap = this.edgeSetMap();
                edgeSetMap[edgeSet.linkKey()] = edgeSet;
            },
            /**
             * Remove child edgeSet
             * @method removeEdgeSet
             * @param edge {nx.data.EdgeSet}
             */
            removeEdgeSet: function (edgeSet) {
                var edgeSetMap = this.edgeSetMap();
                var linkKey = edgeSet.linkKey();
                delete  edgeSetMap[linkKey];
            },
            /**
             * Iterate each edgeSet
             * @method eachEdgeSet
             * @param callback {Function}
             * @param context {Object}
             */
            eachEdgeSet: function (callback, context) {
                nx.each(this.edgeSetMap(), callback, context || this);
            },
            eachEdge: function (callback, context) {
                this.eachEdgeSet(function (edgeSet) {
                    edgeSet.eachEdge(callback, context);
                }, this);
            },
            getEdges: function () {
                var ary = [];
                this.eachEdge(function (edge) {
                    ary[ary.length] = edge;
                }, this);
                return ary;
            },
            disposeEdges: function () {

            }
        }

    });
})(nx, nx.global);