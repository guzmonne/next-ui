(function (nx, util, global) {

    /**
     * Vertex class
     * @class nx.data.Vertex
     * @extend nx.data.ObservableObject
     * @module nx.data
     */

    var Vector = nx.math.Vector;
    nx.define('nx.data.Vertex', nx.data.ObservableObject, {
        events: ['updateCoordinate'],
        properties: {
            /**
             * Vertex id
             * @property id {String|Number}
             */
            id: {},
            /**
             * Get x coordination mutator function
             * @property getXPath {Function}
             */
            getXPath: {
                value: function () {
                    return function () {
                        return this._data && this._data.x;
                    };
                }
            },
            /**
             * Set x coordination mutator function
             * @property setXPath {Function}
             */
            setXPath: {
                value: function () {
                    return function (value) {
                        this._data.x = value;
                    };
                }
            },
            /**
             * Get y coordination mutator function
             * @property getYPath {Function}
             */
            getYPath: {
                value: function () {
                    return function () {
                        return this._data && this._data.y;
                    };
                }
            },
            /**
             * Set y coordination mutator function
             * @property setYPath {Function}
             */
            setYPath: {
                value: function () {
                    return function (value) {
                        this._data.y = value;
                    };
                }
            },
            /**
             * Set to auto save x/y data to original data
             * @property ausoSave
             */
            autoSave: {
                value: true
            },
            /**
             * Get/set x coordination, suggest use position property
             * @property x
             */
            x: {
                get: function () {
                    return this._x || 0;
                },
                set: function (value) {
                    this.position({x: value});
                }
            },
            /**
             * Get/set y coordination, suggest use position property
             * @property y
             */
            y: {
                get: function () {
                    return this._y || 0;
                },
                set: function (value) {
                    this.position({y: value});
                }
            },
            /**
             * Get/set vertex position.
             * @property position
             */
            position: {
                get: function () {
                    return{
                        x: this._x || 0,
                        y: this._y || 0
                    };
                },
                set: function (obj) {
                    var isModified = false;
                    if (obj.x !== undefined && this._x !== obj.x) {
                        this._x = obj.x;
                        isModified = true;
                    }

                    if (obj.y !== undefined && this._y !== obj.y) {
                        this._y = obj.y;
                        isModified = true;
                    }
                    if (this.autoSave()) {
                        this.save();
                    }

                    if (isModified) {
                        this.fire("updateCoordinate", this.position());
                        this.notify("vector");
                    }
                }
            },
            /**
             * Get vertex's Vector object
             * @readOnly
             */
            vector: {
                get: function () {
                    var position = this.position();
                    return new Vector(position.x, position.y);
                }
            },
            /**
             * Is vertex virtual
             * @property virtual
             * @default false
             */
            virtual: {
                value: false
            },
            /**
             * Set/get vertex's visibility, and this property related to all connect edge set
             * @property visible {Boolean}
             * @default true
             */
            visible: {
                get: function () {
                    return this._visible !== undefined ? this._visible : true;
                },
                set: function (value) {
                    this._visible = value;
                    this.eachEdgeSet(function (edgeSet) {
                        edgeSet.visible(value);
                    });
                }
            },
            /**
             * Status property,tag is this vertex generated
             * @property generated {Boolean}
             * @default false
             */
            generated: {
                value: false
            },
            /**
             * Status property,tag is this vertex updated
             * @property updated {Boolean}
             * @default false
             */
            updated: {
                value: false
            },
            /**
             * Vertex's type
             * @property type {String}
             * @default 'vertex'
             */
            type: {
                value: 'vertex'
            },
            /**
             * Vertex parent vertex set, if exist
             * @property parentVertexSet {nx.data.VertexSet}
             */
            parentVertexSet: {},
            /**
             * Graph instance
             * @property graph {nx.data.ObservableGraph}
             */
            graph: {

            }
        },
        methods: {
            init: function (args) {
                this.inherited(args);
                this.edges = [];
                this.reverseEdges = [];
            },

            setPosition: function () {
                this.position({
                    x: this.getXPath().call(this),
                    y: this.getYPath().call(this)
                });
            },
            /**
             * Add connected edge, which source vertex is this vertex
             * @method addEdge
             * @param edge {nx.data.Edge}
             */
            addEdge: function (edge) {

                edge.visible(this.visible());

                this.edges.push(edge);

                this.reverseEdges = util.without(this.reverseEdges, edge);

            },
            /**
             * Get original data
             * @method getData
             * @returns {Object}
             */
            getData: function () {
                return this._data;
            },
            /**
             * Add connected edge, which target vertex is this vertex
             * @method addReverseEdge
             * @param edge {nx.data.Edge}
             */
            addReverseEdge: function (edge) {
                var index = this.edges.indexOf(edge);
                if (index == -1) {
                    this.reverseEdges.push(edge);
                }
            },
            /**
             * Remove edge from connected edges array
             * @method removeEdge
             * @param edge {nx.data.Edge}
             */
            removeEdge: function (edge) {
                this.edges = util.without(this.edges, edge);
                this.reverseEdges = util.without(this.reverseEdges, edge);
            },
            /**
             * Iterate all connected edges
             * @method eachEdge
             * @param callback {Function}
             * @param context {Object}
             */
            eachEdge: function (callback, context) {
                nx.each(this.edges.concat(this.reverseEdges), callback, context || this);
            },
            /**
             * Iterate all connected edges, which source vertex is this vertex
             * @method eachDirectedEdge
             * @param callback {Function}
             * @param context {Object}
             */
            eachDirectedEdge: function (callback, context) {
                nx.each(this.edges, function (edge) {
                    callback.call(context || this, edge);
                }, this);
            },
            /**
             * Iterate all connected edges, which source vertex is this vertex
             * @method eachReverseEdge
             * @param callback {Function}
             * @param context {Object}
             */
            eachReverseEdge: function (callback, context) {
                nx.each(this.reverseEdges, function (edge) {
                    callback.call(context || this, edge);
                }, this);
            },
            /**
             * Iterate all connected vertices
             * @method eachConnectedVertices
             * @param callback {Function}
             * @param context {Object}
             */
            eachConnectedVertices: function (callback, context) {
                var vertices = this.getConnectedVertices();

                nx.each(vertices, function (vertex) {
                    callback.call(context || this, vertex);
                }, this);
            },
            /**
             * Get all connected vertices
             * @method getConnectedVertices
             * @returns {*|Array}
             */
            getConnectedVertices: function () {
                var vertices = [];
                this.eachDirectedEdge(function (edge) {
                    if (edge.target().visible()) {
                        vertices.push(edge.target());
                    }
                }, this);
                this.eachReverseEdge(function (edge) {
                    if (edge.source().visible()) {
                        vertices.push(edge.source());
                    }
                }, this);

                return util.uniq(vertices);
            },
            /**
             * Iterate all connected edgeSet
             * @method eachConnectedVertices
             * @param callback {Function}
             * @param context {Object}
             */
            eachConnectedEdgeSet: function (callback, context) {
                var edgeSet = this.getConnectedEdgeSet();
                nx.each(edgeSet, callback, context || this);
            },
            /**
             * Get all connected edgeSet
             * @method getConnectedEdgeSet
             * @returns {*|Array}
             */
            getConnectedEdgeSet: function () {
                var edgeSetMap = {};
                nx.each(this.edges.concat(this.reverseEdges), function (edge) {
                    var edgeSet = edge.parentEdgeSet();
                    if (edgeSet.visible()) {
                        edgeSetMap[edgeSet.linkKey()] = edgeSet;
                    }
                }, this);
                return edgeSetMap;
            },


            /**
             * Iterate all connexted edgeSet
             * @param fn {Function}
             * @param context {Object}
             */
            eachEdgeSet: function (fn, context) {
                nx.each(this.getConnectedEdgeSet(), fn, context || this);
            },
            /**
             *Get root vertex set
             * @method getRootVertexSet
             * @returns {*}
             */
            getRootVertexSet: function () {
                var parentVertexSet = this.parentVertexSet();

                while (parentVertexSet && parentVertexSet.parentVertexSet()) {
                    parentVertexSet = parentVertexSet.parentVertexSet();
                }

                return parentVertexSet;
            },
            /**
             * Save x&y to original data
             * @method save
             */
            save: function () {
                this.setXPath(this.x());
                this.setYPath(this.y());
            },
            /**
             * Reset x&y
             * @method reset
             */
            reset: function () {
                this._x = null;
                this._y = null;
            }
        }
    });


})(nx, nx.graphic.util, nx.global);
