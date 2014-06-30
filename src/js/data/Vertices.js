(function (nx, global) {
    var util = nx.util;
    nx.define('nx.data.ObservableGraph.Vertices', nx.data.ObservableObject, {
        events: ['addVertex', 'removeVertex', 'deleteVertex', 'updateVertex', 'updateVertexCoordinate'],
        properties: {

            nodes: {
                get: function () {
                    return this._nodes || [];
                },
                set: function (value) {

                    if (this._nodes && nx.is(this._nodes, nx.data.ObservableCollection)) {
                        this._nodes.off('change', this._nodesCollectionProcessor, this);
                    }

                    this.vertices().clear();

                    if (nx.is(value, nx.data.ObservableCollection)) {
                        value.on('change', this._nodesCollectionProcessor, this);
                        value.each(function (value) {
                            this._addVertex(value);
                        }, this);
                    } else {
                        nx.each(value, this._addVertex, this);
                    }

                    this._nodes = value;
                }
            },

            vertexFilter: {},
            vertices: {
                value: function () {
                    var vertices = new nx.data.ObservableDictionary();
                    vertices.on('change', function (sender, args) {
                        var action = args.action;
                        var items = args.items;
                        if (action == 'clear') {
                            nx.each(items, function (vertex) {
                                if (vertex.id) {
                                    this.deleteVertex(vertex.id());
                                }
                            }, this);
                        }
                    }, this);
                    return vertices;
                }
            },
            visibleVertices: {
                get: function () {
                    var vertices = {};
                    this.eachVertex(function (vertex, id) {
                        if (vertex.visible()) {
                            vertices[id] = vertex;
                        }
                    });
                    return vertices;
                }
            },
            vertexPositionGetter: {},
            vertexPositionSetter: {}
        },
        methods: {
            /**
             * Add vertex to Graph
             * @method addVertex
             * @param {JSON} data Vertex original data
             * @param {Object} [config] Config object
             * @returns {nx.data.Vertex}
             */
            addVertex: function (data, config) {
                var vertex;
                var nodes = this.nodes();
                var vertices = this.vertices();
                if (nx.is(nodes, nx.data.ObservableCollection)) {
                    nodes.add(data);
                    vertex = vertices.getItem(vertices.count() - 1);
                } else {
                    nodes.push(data);
                    vertex = this._addVertex(data, config);
                }

                if (config) {
                    vertex.sets(config);
                }
                this.generateVertex(vertex);


                return vertex;
            },
            _addVertex: function (data) {
                var vertices = this.vertices();
                var verticesLength = this.vertexSets().count() + this.vertices().count();
                var identityKey = this.identityKey();
                var vertex, id;


                if (typeof(data) == 'string' || typeof(data) == 'number') {
                    data = {data: data};
                }
                id = nx.path(data, identityKey);
                id = id !== undefined ? id : verticesLength;
                vertex = new nx.data.Vertex(data);

                var vertexPositionGetter = this.vertexPositionGetter();
                var vertexPositionSetter = this.vertexPositionSetter();
                if (vertexPositionGetter && vertexPositionSetter) {
                    vertex.positionGetter(vertexPositionGetter);
                    vertex.positionSetter(vertexPositionSetter);
                }


                vertex.sets({
                    graph: this,
                    autoSave: this.autoSave(),
                    id: id
                });


                //delegate synchronize
                if (nx.is(data, nx.data.ObservableObject)) {
                    var fn = data.set;
                    data.set = function (key, value) {
                        fn.call(data, key, value);
                        //
                        if (vertex.__properties__.indexOf(key) == -1) {
                            if (vertex.has(key)) {
                                vertex[key].call(vertex, value);
                            } else {
                                vertex.notify(key);
                            }
                        }
                    };
                }


                vertex.initPosition();

                vertices.setItem(id, vertex);


                var vertexFilter = this.vertexFilter();
                if (vertexFilter && nx.is(vertexFilter, Function)) {
                    var result = vertexFilter.call(this, data, vertex);
                    vertex.visible(result === false);
                }

                return vertex;
            },
            generateVertex: function (vertex) {
                if (vertex.visible() && !vertex.generated() && !vertex.restricted()) {
                    vertex.generated(true);
                    vertex.on('updateCoordinate', this._updateVertexCoordinateFN = function () {
                        /**
                         * @event updateVertexCoordinate
                         * @param sender {Object}  Trigger instance
                         * @param {nx.data.Vertex} vertex Vertex object
                         */
                        this.fire('updateVertexCoordinate', vertex);
                    }, this);
                    /**
                     * @event addVertex
                     * @param sender {Object}  Trigger instance
                     * @param {nx.data.Vertex} vertex Vertex object
                     */
                    this.fire('addVertex', vertex);
                }
            },

            /**
             * Remove a vertex from Graph
             * @method removeVertex
             * @param {String} id
             * @returns {Boolean}
             */
            removeVertex: function (id) {
                var vertex = this.vertices().getItem(id);
                if (!vertex) {
                    return false;
                }

                nx.each(vertex.edgeSets(), function (edgeSet, linkKey) {
                    this.removeEdgeSet(linkKey);
                }, this);

                nx.each(vertex.edgeSetCollections(), function (esc, linkKey) {
                    this.deleteEdgeSetCollection(linkKey);
                }, this);

                vertex.generated(false);
                vertex.off('updateCoordinate', this._updateVertexCoordinateFN, this);


                /**
                 * @event removeVertex
                 * @param sender {Object}  Trigger instance
                 * @param {nx.data.Vertex} vertex Vertex object
                 */

                this.fire('removeVertex', vertex);
                return vertex;
            },
            /**
             * Delete a vertex from Graph
             * @method removeVertex
             * @param {id} id
             * @returns {Boolean}
             */
            deleteVertex: function (id) {
                var nodes = this.nodes();
                if (nx.is(nodes, nx.data.ObservableCollection)) {
                    var data = this.getVertex(id).getData();
                    nodes.remove(data);
                } else {
                    var index = this.nodes().indexOf(this.getVertex(id).getData());
                    if (index != -1) {
                        this.nodes().splice(index, 1);
                    }
                    this._deleteVertex(id);
                }
            },
            _deleteVertex: function (id) {
                var vertex = this.vertices().getItem(id);
                if (!vertex) {
                    return false;
                }

                nx.each(vertex.edgeSets(), function (edgeSet) {
                    this.deleteEdgeSet(edgeSet);
                }, this);

                nx.each(vertex.edgeSetCollections(), function (esc) {
                    this.deleteEdgeSetCollection(esc);
                }, this);

                var vertexSet = vertex.parentVertexSet();
                if (vertexSet) {
                    vertexSet.removeVertex(id);
                }

                vertex.off('updateCoordinate', this._updateVertexCoordinateFN, this);


                this.fire('deleteVertex', vertex);

                this.vertices().removeItem(id);

                vertex.dispose();
            },
            eachVertex: function (callback, context) {
                this.vertices().each(function (item, id) {
                    callback.call(context || this, item.value(), id);
                });
            },
            getVertex: function (id) {
                return  this.vertices().getItem(id);
            },
            _nodesCollectionProcessor: function (sender, args) {
                var items = args.items;
                var action = args.action;
                var identityKey = this.identityKey();
                if (action == 'add') {
                    nx.each(items, function (data) {
                        var vertex = this._addVertex(data);
                        this.generateVertex(vertex);

                    }, this);
                } else if (action == 'remove') {
                    nx.each(items, function (data) {
                        var id = nx.path(data, identityKey);
                        this._deleteVertex(id);
                    }, this);
                } else if (action == 'clear') {
                    this.vertices().clear();
                }


            }
        }
    });


})(nx, nx.global);