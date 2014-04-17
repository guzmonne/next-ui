(function (nx, global) {

    /**
     * Vertex class
     * @class nx.data.Vertex
     * @extend nx.data.ObservableObject
     * @module nx.data
     */

    var Vector = nx.geometry.Vector;
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
                    this.position({x: parseFloat(value)});
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
                    this.position({y: parseFloat(value)});
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
            edgeSet: {
                value: function () {
                    return {};
                }
            },
            edgeSetCollection: {
                value: function () {
                    return {};
                }
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
            initPosition: function () {
                this.position({
                    x: this._getXPath.call(this),
                    y: this._getYPath.call(this)
                });
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
             * Add connected edgeSet, which source vertex is this vertex
             * @method addEdgeSet
             * @param edgeSet {nx.data.EdgeSet}
             * @param linkKey {String}
             */
            addEdgeSet: function (edgeSet, linkKey) {
                var _edgeSet = this.edgeSet();
                _edgeSet[linkKey] = edgeSet;
            },
            /**
             * Remove edgeSet from connected edges array
             * @method removeEdgeSet
             * @param edgeSet {nx.data.EdgeSet}
             */
            removeEdgeSet: function (edgeSet) {
                var linkKey = edgeSet.linkKey();
                var _edgeSet = this.edgeSet();
                delete  _edgeSet[linkKey];
            },


            addEdgeSetCollection: function (esc, linkKey) {
                var edgeSetCollection = this.edgeSetCollection();
                edgeSetCollection[linkKey] = esc;
            },
            removeEdgeSetCollection: function (esc, linkKey) {
                var edgeSetCollection = this.edgeSetCollection();
                delete edgeSetCollection[linkKey];
            },
            /**
             * Iterate all connected edgeSet
             * @method eachEdgeSet
             * @param callback {Function}
             * @param context {Object}
             */
            eachEdgeSet: function (callback, context) {
                nx.each(this.edgeSet(), callback, context || this);
            },
            /**
             * Get all edgeSet
             * @method getEdgeSet
             * @returns {Array}
             */
            getEdgeSet: function () {
                var ary = [];
                this.eachEdgeSet(function (edgeSet) {
                    ary[ary.length] = edgeSet;
                }, this);
                return ary;
            },


            /**
             * Iterate all connected visible edgeSet
             * @method eachVisibleEdgeSet
             * @param callback {Function}
             * @param context {Object}
             */

            eachVisibleEdgeSet: function (callback, context) {
                nx.each(this.edgeSet(), function (edgeSet, linkKey) {
                    if (edgeSet.visible() && edgeSet.source().visible() && edgeSet.target().visible()) {
                        callback.call(context || this, edgeSet, linkKey);
                    }
                }, this);
            },


            /**
             * Get all connected edgeSet
             * @method getEdgeSetCollection
             * @returns {Array}
             */
            getEdgeSetCollection: function () {
                var ary = [];
                this.eachEdgeSet(function (edgeSet) {
                    ary[ary.length] = edgeSet;
                }, this);
                return ary;
            },
            /**
             * Iterate all connected edges
             * @method eachEdge
             * @param callback {Function}
             * @param context {Object}
             */
            eachEdge: function (callback, context) {
                this.eachEdgeSet(function (edgeSet) {
                    edgeSet.eachEdge(callback, context || this);
                }, this);
            },
            /**
             * Return all connected edges
             * @method getEdges
             * @return {Object}
             */
            getEdges: function () {
                var ary = [];
                this.eachEdge(function (edge) {
                    ary[ary.length] = edge;
                }, this);
                return ary;
            },
            /**
             * Iterate all connected vertices
             * @method eachConnectedVertices
             * @param callback {Function}
             * @param context {Object}
             */
            eachConnectedVertices: function (callback, context) {
                var id = this.id();
                this.eachEdgeSet(function (edgeSet) {
                    var vertex = edgeSet.sourceID() == id ? edgeSet.target() : edgeSet.source();
                    callback.call(context || this, vertex, this);
                }, this);
            },
            /**
             * Get all connected vertices
             * @method getConnectedVertices
             * @returns {Object} key is vertex id, value is vertex
             */
            getConnectedVertices: function () {
                var vertices = {};
                this.eachConnectedVertices(function (vertex) {
                    vertices[vertex.id()] = vertex;
                }, this);
                return vertices;
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
            getVisibleParentVertexSet: function () {
                var parentVertexSet = this.parentVertexSet();

                while (parentVertexSet && parentVertexSet.parentVertexSet() && !parentVertexSet.visible()) {
                    parentVertexSet = parentVertexSet.parentVertexSet();
                }

                return parentVertexSet;
            },
            /**
             * Save x&y to original data
             * @method save
             */
            save: function () {
                this._setXPath.call(this, this._x);
                this._setYPath.call(this, this._y);
            },
            /**
             * Reset x&y
             * @method reset
             */
            reset: function () {
                this._x = null;
                this._y = null;
                this.initPosition();
            }
        }
    });


})(nx, nx.global);
