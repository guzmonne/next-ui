(function (nx, util, global) {

    "use strict";
    /**
     * Edge
     * @class nx.data.Edge
     * @extend nx.data.ObservableObject
     * @module nx.data
     */

    var Line = nx.math.Line;
    nx.define('nx.data.Edge', nx.data.ObservableObject, {
        properties: {
            /**
             * Source vertex
             * @property source {nx.data.Vertex}
             */
            source: {
                value: null
            },
            /**
             * Target vertex
             * @property target {nx.data.Vertex}
             */
            target: {
                value: null
            },
            /**
             * Source vertex id
             * @property sourceID {String|Number}
             */
            sourceID: {
                value: null
            },
            /**
             * Target vertex id
             * @property targetID {String|Number}
             */
            targetID: {
                value: null
            },
            /**
             * Set/get edge's visibility
             * @property visible {Boolean}
             * @default true
             */
            visible: {
                get: function () {
                    return this._visible !== undefined ? this._visible : true;
                },
                set: function (value) {
                    if (this._visible !== undefined && this._visible !== value) {
                        this.updated(true);
                    }
                    this._visible = value;
                }
            },
            /**
             * Edge's linkkey, linkkey = sourceID-targetID
             * @property linkKey {String}
             */
            linkKey: {

            },
            /**
             * Edge's reverse linkkey,reverseLinkKey = targetID + '_' + sourceID
             * @property reverseLinkKey {String}
             */
            reverseLinkKey: {

            },

            /**
             * Status property,tag is this edge generated
             * @property generated {Boolean}
             * @default false
             */
            generated: {
                value: false
            },
            /**
             * Status property,tag is this edge updated
             * @property updated {Boolean}
             * @default false
             */
            updated: {
                value: false
            },
            /**
             * Edge's type
             * @property type {String}
             * @default edge
             */
            type: {
                value: 'edge'
            },
            /**
             * Edge's id
             * @property id {String|Number}
             */
            id: {},
            /**
             * Edge's parent edge set
             * @property parentEdgeSet {nx.data.edgeSet}
             */
            parentEdgeSet: {},
            /**
             * Edge line object
             * @property line {nx.math.Line}
             * @readOnly
             */
            line: {
                get: function () {
                    return new Line(this.source().vector(), this.target().vector());
                }
            },
            /**
             * Edge position object
             * {{x1: (Number), y1: (Number), x2: (Number), y2: (Number)}}
             * @property position {Object}
             * @readOnly
             */
            position: {
                get: function () {
                    return {
                        x1: this.source().get("x"),
                        y1: this.source().get("y"),
                        x2: this.target().get("x"),
                        y2: this.target().get("y")
                    };
                }
            },
            /**
             * Is this link is a reverse link
             * @property reverse {Boolean}
             * @readOnly
             */
            reverse: {
                value: false
            },
            /**
             * Graph instance
             * @property graph {nx.data.ObservableGraph}
             */
            graph: {

            }
        },
        methods: {
            /**
             * Get original data
             * @method getData
             * @returns {Object}
             */
            getData: function () {
                return this._data;
            },
            getRootEdgeSet: function () {
                var parent = this.parentEdgeSet();
                while (parent.parentEdgeSet()) {
                    parent = parent.parentEdgeSet();
                }
                return parent;
            }
        }
    });

})(nx, nx.util, nx.global);