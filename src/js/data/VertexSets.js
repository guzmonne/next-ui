(function (nx, global) {

    nx.define('nx.data.ObservableGraph.VertexSets', nx.data.ObservableObject, {
        events: ['addVertexSet', 'removeVertexSet', 'updateVertexSet', 'updateVertexSetCoordinate'],
        properties: {
            vertexSets: {
                value: function () {
                    var vertexSets = new nx.data.ObservableDictionary();
                    vertexSets.on('change', function (sender, args) {
                        var action = args.action;
                        var items = args.items;
                        if (action == 'clear') {
                            nx.each(items, function (vertexSet) {
                                this.deleteVertexSet(vertexSet);
                            }, this);
                        }
                    }, this);
                    return vertexSets;
                }
            },
            visibleVertexSets: {
                get: function () {
                    var vertexSets = {};
                    this.eachVertexSet(function (vertexSet, id) {
                        if (vertexSet.visible()) {
                            vertexSets[id] = vertexSet;
                        }
                    });
                    return vertexSets;
                }
            }
        },
        methods: {
            /**
             * Add vertex set to Graph
             * @method addVertexSet
             * @param {JSON} data Vertex set original data, which include nodes(Array) attribute. That is node's ID collection.  e.g. {nodes:[id1,id2,id3]}
             * @param {Object} [config] Config object
             * @returns {nx.data.VertexSet}
             */
            addVertexSet: function (data, config) {


                var vertexSet = this._addVertexSet(data, config);

                this.generateVertexSet(vertexSet);


//                if (config.parentVertexSetID != null) {
//                    var parentVertexSet = this.getVertexSet(config.parentVertexSetID);
//                    if (parentVertexSet) {
//                        var parentID = vertexSet.id();
//                        parentVertexSet.removeVertices(data.nodes);
//                        parentVertexSet.nodes().push(parentID);
//                        parentVertexSet.vertexSet()[parentID] = vertexSet;
//                        parentVertexSet.updated(false);
//                        /**
//                         * @event updateVertexSet
//                         * @param sender {Object}  Trigger instance
//                         * @param {nx.data.VertexSet} vertexSet VertexSet object
//                         */
//                        setTimeout(function () {
//                            this.fire('updateVertexSet', parentVertexSet);
//                        }.bind(this), 0);
//
//
//                        vertexSet.parentVertexSet(parentVertexSet);
//                    }
//                }


                this._data.nodeSet.push(data);


                return vertexSet;
            },
            _addVertexSet: function (data, config) {
                var verticesLength = this.vertexSets().count() + this.vertices().count();
                var identityKey = this.identityKey();
                //
                if (!nx.is(data, 'Object')) {
                    data = {data: data};
                }
                var vertexSetID = data[identityKey] !== undefined ? data[identityKey] : verticesLength;
                var vertexSet = new nx.data.VertexSet(data);


                var vertexPositionGetter = this.vertexPositionGetter();
                var vertexPositionSetter = this.vertexPositionSetter();
                if (vertexPositionGetter && vertexPositionSetter) {
                    vertexSet.positionGetter(vertexPositionGetter);
                    vertexSet.positionSetter(vertexPositionSetter);
                }

                //
                vertexSet.sets({
                    graph: this,
                    type: 'vertexSet',
                    autoSave: this.autoSave(),
                    id: vertexSetID
                });

                if (config) {
                    vertexSet.sets(config);
                }

                vertexSet.initPosition();

                this.vertexSets().setItem(vertexSetID, vertexSet);

                return vertexSet;
            },
            initVertexSet: function (vertexSet) {
                vertexSet.initNodes();
            },
            generateVertexSet: function (vertexSet) {
                if (vertexSet.visible() && !vertexSet.generated()) {
                    vertexSet.generated(true);
                    vertexSet.on('updateCoordinate', this._updateVertexSetCoordinateFN = function (sender, args) {
                        /**
                         * @event updateVertexSetCoordinate
                         * @param sender {Object}  Trigger instance
                         * @param {nx.data.VertexSet} vertexSet VertexSet object
                         */
                        this.fire('updateVertexSetCoordinate', vertexSet);

                        var _xDelta = args.newPosition.x - args.oldPosition.x;
                        var _yDelta = args.newPosition.y - args.oldPosition.y;

                        nx.each(vertexSet.vertices(), function (vertex) {
                            vertex.translate(_xDelta, _yDelta);
                        });
                        nx.each(vertexSet.vertexSet(), function (vertexSet) {
                            vertexSet.translate(_xDelta, _yDelta);
                        });


                    }, this);


                    //todo
                    setTimeout(function () {
                        vertexSet.activated(true, {force: true});
                        this.updateVertexSet(vertexSet);
                    }.bind(this), 0);

                    this.fire('addVertexSet', vertexSet);
                }
            },
            updateVertexSet: function (vertexSet) {
                if (vertexSet.generated()) {
                    vertexSet.updated(false);
                    /**
                     * @event updateVertexSet
                     * @param sender {Object}  Trigger instance
                     * @param {nx.data.VertexSet} vertexSet VertexSet object
                     */
                    this.fire('updateVertexSet', vertexSet);
                }
            },

            /**
             * Remove a vertex set from Graph
             * @method removeVertexSet
             * @param {String} id
             * @returns {Boolean}
             */
            removeVertexSet: function (id) {

                var vertexSet = this.vertexSets().getItem(id);
                if (!vertexSet) {
                    return false;
                }


                vertexSet.activated(true);

                nx.each(vertexSet.edgeSets(), function (edgeSet, linkKey) {
                    this.removeEdgeSet(linkKey);
                }, this);

                nx.each(vertexSet.edgeSetCollections(), function (esc, linkKey) {
                    this.deleteEdgeSetCollection(linkKey);
                }, this);

                vertexSet.generated(false);
                vertexSet.off('updateCoordinate', this._updateVertexSetCoordinateFN, this);


                this.fire('removeVertexSet', vertexSet);

            },
            deleteVertexSet: function (id) {

                var vertexSet = this.vertexSets().getItem(id);
                if (!vertexSet) {
                    return false;
                }

                vertexSet.activated(false);


                vertexSet.off('updateCoordinate', this._updateVertexCoordinateFN, this);


                var index = this._data.nodeSet.indexOf(vertexSet.getData());
                if (index != -1) {
                    this._data.nodeSet.splice(index, 1);
                }

                this.vertexSets().removeItem(id);

                this.fire('deleteVertexSet', vertexSet);
                vertexSet.dispose();
            },
            eachVertexSet: function (callback, context) {
                this.vertexSets().each(function (item, id) {
                    callback.call(context || this, item.value(), id);
                });
            },
            getVertexSet: function (id) {
                return  this.vertexSets().getItem(id);
            }
        }
    });


})(nx, nx.global);