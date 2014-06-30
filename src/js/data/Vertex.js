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
             * Set to auto save x/y data to original data
             * @property ausoSave
             */
            autoSave: {
                value: true
            },
            positionGetter: {
                value: function () {
                    return function () {
                        return {
                            x: nx.path(this._data, 'x') || 0,
                            y: nx.path(this._data, 'y') || 0
                        };
                    };
                }
            },
            positionSetter: {
                value: function () {
                    return function (position) {
                        if (this._data) {
                            var x = nx.path(this._data, 'x');
                            var y = nx.path(this._data, 'y');
                            if (position.x !== x || position.y !== y) {
                                nx.path(this._data, 'x', position.x);
                                nx.path(this._data, 'y', position.y);
                                return true;
                            } else {
                                return false;
                            }
                        }
                    };
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
                    var _position = {
                        x: this._x,
                        y: this._y
                    };
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
                        this.fire("updateCoordinate", {
                            oldPosition: _position,
                            newPosition: {
                                x: this._x,
                                y: this._y
                            }
                        });
                        this.notify("vector");
                    }
                }
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
             * Get vertex's Vector object
             * @readOnly
             */
            vector: {
                get: function () {
                    var position = this.position();
                    return new Vector(position.x, position.y);
                }
            },
            restricted: {
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

                    var graph = this.graph();

                    if (value === false) {
                        if (this.generated()) {
                            nx.each(this.edgeSetCollections(), function (esc, linkKey) {
                                graph.deleteEdgeSetCollection(linkKey);
                            }, this);
                            graph.removeVertex(this.id());
                        }
                    } else {
                        if (!this.restricted() && !this.generated()) {
                            graph.generateVertex(this);

                            nx.each(this.edgeSets(), function (edgeSet) {
                                graph._generateConnection(edgeSet);
                            });
                        }
                    }
                    var parentVertexSet = this.parentVertexSet();
                    if (parentVertexSet) {
                        graph.updateVertexSet(parentVertexSet);
                    }
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
            edgeSets: {
                value: function () {
                    return {};
                }
            },
            edgeSetCollections: {
                value: function () {
                    return {};
                }
            },
            edges: {
                get: function () {
                    var edges = {};
                    nx.each(this.edgeSets(), function (edgeSet) {
                        nx.extend(edges, edgeSet.edges());
                    });
                    return edges;
                }
            },
            connectedVertices: {
                get: function () {
                    var vertices = {};
                    this.eachConnectedVertex(function (vertex, id) {
                        vertices[id] = vertex;
                    }, this);
                    return vertices;
                }
            },
            /**
             * Graph instance
             * @property graph {nx.data.ObservableGraph}
             */
            graph: {

            },
            /**
             * Vertex parent vertex set, if exist
             * @property parentVertexSet {nx.data.VertexSet}
             */
            parentVertexSet: {},
            rootVertexSet: {
                get: function () {
                    var parentVertexSet = this.parentVertexSet();
                    while (parentVertexSet && parentVertexSet.parentVertexSet()) {
                        parentVertexSet = parentVertexSet.parentVertexSet();
                    }
                    return parentVertexSet;
                }
            },
            generatedRootVertexSet: {
                get: function () {
                    var parentVertexSet = this.parentVertexSet();

                    while (parentVertexSet && parentVertexSet.parentVertexSet()) {

                        var _parentVertexSet = parentVertexSet.parentVertexSet();

                        if (!_parentVertexSet.generated() || (_parentVertexSet.generated() && _parentVertexSet.activated())) {
                            parentVertexSet = _parentVertexSet;
                        } else {
                            break;
                        }
                    }
                    return parentVertexSet;
                }
            }
        },
        methods: {

//
            set: function (key, value) {
                if (this.has(key)) {
                    this[key].call(this, value);
                } else {
                    nx.path(this._data, key, value);
                }
            },
            get: function (key) {
                if (this.has(key)) {
                    return this[key].call(this);
                } else {
                    return nx.path(this._data, key);
                }
            },
            has: function (name) {
                var member = this[name];
                return (member && member.__type__ == 'property');
            },

            initPosition: function () {
                this.position(this.positionGetter().call(this));
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
                var _edgeSets = this.edgeSets();
                _edgeSets[linkKey] = edgeSet;
            },
            /**
             * Remove edgeSet from connected edges array
             * @method removeEdgeSet
             * @param linkKey {String}
             */
            removeEdgeSet: function (linkKey) {
                var _edgeSets = this.edgeSets();
                delete  _edgeSets[linkKey];
            },
            addEdgeSetCollection: function (esc, linkKey) {
                var edgeSetCollections = this.edgeSetCollections();
                edgeSetCollections[linkKey] = esc;
            },
            removeEdgeSetCollection: function (linkKey) {
                var edgeSetCollections = this.edgeSetCollections();
                delete edgeSetCollections[linkKey];
            },
            /**
             * Iterate all connected vertices
             * @method eachConnectedVertex
             * @param callback {Function}
             * @param context {Object}
             */
            eachConnectedVertex: function (callback, context) {
                var id = this.id();
                nx.each(this.edgeSets(), function (edgeSet) {
                    var vertex = edgeSet.sourceID() == id ? edgeSet.target() : edgeSet.source();
                    if (vertex.visible() && !vertex.restricted()) {
                        callback.call(context || this, vertex, vertex.id());
                    }
                }, this);

                nx.each(this.edgeSetCollections(), function (esc) {
                    var vertex = esc.sourceID() == id ? esc.target() : esc.source();
                    if (vertex.visible() && !vertex.restricted()) {
                        callback.call(context || this, vertex, vertex.id());
                    }
                }, this);
            },
            translate: function (x, y) {
                var _position = this.position();
                if (x != null) {
                    _position.x += x;
                }

                if (y != null) {
                    _position.y += y;
                }

                this.position(_position);
            },


            /**
             * Save x&y to original data
             * @method save
             */
            save: function () {
                this.positionSetter().call(this, {x: this._x, y: this._y});
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
    })
    ;
})
(nx, nx.global);
