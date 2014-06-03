(function (nx, global) {
    var util = nx.util;
    nx.define('nx.data.ObservableGraph.Vertices', nx.data.ObservableObject, {
        events: ['addVertex', 'removeVertex', 'deleteVertex', 'updateVertex', 'updateVertexCoordinate'],
        properties: {
            vertices: {
                value: function () {
                    var vertices = new nx.data.ObservableDictionary();
                    vertices.on('change', function (sender, args) {
                        var action = args.action;
                        var items = args.items;
                        if (action == 'clear') {
                            nx.each(items, function (vertex) {
                                this.deleteVertex(vertex);
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
                var vertex = this._addVertex(data, config);
                if (config) {
                    vertex.sets(config);
                }
                this.generateVertex(vertex);
                this._data.nodes.push(data);
                return vertex;
            },
            _addVertex: function (data) {
                var vertices = this.vertices();
                var verticesLength = vertices.count();
                var identityKey = this.identityKey();
                //
                if (typeof(data) == 'string' || typeof(data) == 'number') {
                    data = {data: data};
                }
                var id = data[identityKey] !== undefined ? data[identityKey] : verticesLength;
                var vertex = new nx.data.Vertex(data);


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


                vertex.initPosition();

                vertices.setItem(id, vertex);
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


                var index = this._data.nodes.indexOf(vertex.getData());
                if (index != -1) {
                    this._data.nodes.splice(index, 1);
                }
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
            }
        }
    });


})(nx, nx.global);