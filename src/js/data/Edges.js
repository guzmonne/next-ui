(function (nx, global) {

    nx.define('nx.data.ObservableGraph.Edges', nx.data.ObservableObject, {
        events: ['addEdge', 'removeEdge', 'deleteEdge', 'updateEdge', 'updateEdgeCoordinate'],
        properties: {
            edges: {
                value: function () {
                    var edges = new nx.data.ObservableDictionary();
                    edges.on('change', function (sender, args) {
                        var action = args.action;
                        var items = args.items;
                        if (action == 'clear') {
                            nx.each(items, function (edge) {
                                this.deleteEdge(edge);
                            }, this);
                        }
                    }, this);
                    return edges;
                }
            }
        },
        methods: {
            /**
             * Add edge to Graph
             * @method addEdge
             * @param {JSON} data Vertex original data
             * @param {Object} [config] Config object
             * @returns {nx.data.Edge}
             */
            addEdge: function (data, config) {
                var edge = this._addEdge(data, config);

                //update edgeSet
                var edgeSet = edge.parentEdgeSet();
                if (!edgeSet.generated()) {
                    this.generateEdgeSet(edgeSet);
                } else {
                    this.updateEdgeSet(edgeSet);
                }

                this._data.links.push(data);
                return edge;
            },
            _addEdge: function (data, config) {
                var edges = this.edges();
                var identityKey = this.identityKey();
                var source, target, sourceID, targetID;

                sourceID = nx.is(data.source, 'Object') ? data.source[identityKey] : data.source;
                source = this.vertices().getItem(sourceID) || this.vertexSets().getItem(sourceID);


                targetID = nx.is(data.target, 'Object') ? data.target[identityKey] : data.target;
                target = this.vertices().getItem(targetID) || this.vertexSets().getItem(targetID);


                if (source && target) {
                    var edge = new nx.data.Edge(data);
                    var id = data.id == null ? edge.__id__ : data.id;

                    edge.sets({
                        id: id,
                        source: source,
                        target: target,
                        sourceID: sourceID,
                        targetID: targetID,
                        graph: this
                    });
                    if (config) {
                        edge.sets(config);
                    }

                    edge.initialize();

                    edges.setItem(id, edge);

                    var edgeSet = this.getEdgeSetBySourceAndTarget(sourceID, targetID);
//                    var edgeSet = edgeSetMap[linkKey] || edgeSetMap[reverseLinkKey];
                    if (!edgeSet) {
                        edgeSet = this._addEdgeSet({
                            source: source,
                            target: target,
                            sourceID: sourceID,
                            targetID: targetID
                        });
                    } else {
                        edgeSet.updated(true);
                    }

                    edge.sets({
                        linkKey: edgeSet.linkKey(),
                        reverseLinkKey: edgeSet.reverseLinkKey()
                    });

                    edgeSet.addEdge(edge);
                    edge.parentEdgeSet(edgeSet);
                    edge.reverse(sourceID !== edgeSet.sourceID());

                    return edge;

                } else {
                    if (console) {
                        console.log('source node or target node is not defined, or linkMappingKey value error', data, source, target);
                    }
                    return undefined;
                }
            },
            generateEdge: function (edge) {
                if (!edge.generated() && edge.source().generated() && edge.target().generated()) {
                    edge.generated(true);


                    edge.on('updateCoordinate', this._updateEdgeCoordinate, this);

                    /**
                     * @event addEdge
                     * @param sender {Object}  Trigger instance
                     * @param {nx.data.Edge} edge Edge object
                     */
                    this.fire('addEdge', edge);
                }
            },
            /**
             * Remove edge from Graph
             * @method removeEdge
             * @param id {String} edge id
             * @param isUpdateEdgeSet {Boolean}
             */
            removeEdge: function (id, isUpdateEdgeSet) {
                var edge = this.edges().getItem(id);
                if (!edge) {
                    return false;
                }
                edge.generated(false);
                edge.off('updateCoordinate', this._updateEdgeCoordinate, this);
                /**
                 * @event removeEdge
                 * @param sender {Object}  Trigger instance
                 * @param {nx.data.Edge} edge Edge object
                 */
                this.fire('removeEdge', edge);

                if (isUpdateEdgeSet !== false) {
                    var edgeSet = edge.parentEdgeSet();
                    this.updateEdgeSet(edgeSet);
                }
            },
            deleteEdge: function (id, isUpdateEdgeSet) {
                var edge = this.edges().getItem(id);
                if (!edge) {
                    return false;
                }
                edge.off('updateCoordinate', this._updateEdgeCoordinate, this);

                //update parent
                if (isUpdateEdgeSet !== false) {
                    var edgeSet = edge.parentEdgeSet();
                    edgeSet.removeEdge(id);
                    this.updateEdgeSet(edgeSet);
                }

                //


                var index = this._data.links.indexOf(edge.getDate());
                if (index != -1) {
                    this._data.links.splice(index, 1);
                }
                /**
                 * @event deleteEdge
                 * @param sender {Object} Trigger instance
                 * @param {nx.data.Edge} edge Edge object
                 */
                this.fire('deleteEdge', edge);

                this.edges().removeItem(id);

                edge.dispose();

            },
            _updateEdgeCoordinate: function (sender, args) {
                this.fire('updateEdgeCoordinate', sender);
            },
            /**
             * Get edges by source vertex id and target vertex id
             * @method getEdgesBySourceAndTarget
             * @param source {nx.data.Vertex|Number|String} could be vertex object or id
             * @param target {nx.data.Vertex|Number|String} could be vertex object or id
             * @returns {Array}
             */
            getEdgesBySourceAndTarget: function (source, target) {
                var edgeSet = this.getEdgeSetBySourceAndTarget(source, target);
                return edgeSet && edgeSet.getEdges();
            },
            /**
             * Get edges which are connected to passed vertices
             * @method getEdgesByVertices
             * @param inVertices
             * @returns {Array}
             */
            getEdgesByVertices: function (inVertices) {
//                var edges = [];
//                nx.each(inVertices, function (vertex) {
//                    edges = edges.concat(vertex.edges);
//                    edges = edges.concat(vertex.reverseEdges);
//                });
//
//
//                return util.uniq(edges);
            },

            /**
             * Get edges which's source and target vertex are both in the passed vertices
             * @method getInternalEdgesByVertices
             * @param inVertices
             * @returns {Array}
             */

            getInternalEdgesByVertices: function (inVertices) {
//                var edges = [];
//                var verticesMap = {};
//                var internalEdges = [];
//                nx.each(inVertices, function (vertex) {
//                    edges = edges.concat(vertex.edges);
//                    edges = edges.concat(vertex.reverseEdges);
//                    verticesMap[vertex.id()] = vertex;
//                });
//
//                nx.each(edges, function (edge) {
//                    if (verticesMap[edge.sourceID()] !== undefined && verticesMap[edge.targetID()] !== undefined) {
//                        internalEdges.push(edge);
//                    }
//                });
//
//
//                return internalEdges;

            },
            /**
             * Get edges which's  just one of source or target vertex in the passed vertices. All edges connected ourside of passed vertices
             * @method getInternalEdgesByVertices
             * @param inVertices
             * @returns {Array}
             */
            getExternalEdgesByVertices: function (inVertices) {
//                var edges = [];
//                var verticesMap = {};
//                var externalEdges = [];
//                nx.each(inVertices, function (vertex) {
//                    edges = edges.concat(vertex.edges);
//                    edges = edges.concat(vertex.reverseEdges);
//                    verticesMap[vertex.id()] = vertex;
//                });
//
//                nx.each(edges, function (edge) {
//                    if (verticesMap[edge.sourceID()] === undefined || verticesMap[edge.targetID()] === undefined) {
//                        externalEdges.push(edge);
//                    }
//                });
//
//
//                return externalEdges;

            }
        }
    });


})(nx, nx.global);