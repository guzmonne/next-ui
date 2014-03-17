(function (nx, util, global, logger) {


    'use strict';

    /**
     * ObservableGraph class
     * @extend nx.data.ObservableObject
     * @class nx.data.ObservableGraph
     * @module nx.data
     */
    var GRAPH = nx.define('nx.data.ObservableGraph', nx.data.ObservableObject, {
        statics: {
            dataProcessor: {
                'force': new nx.data.ObservableGraph.ForceProcessor(),
                'quick': new nx.data.ObservableGraph.QuickProcessor(),
                'circle': new nx.data.ObservableGraph.CircleProcessor()
            },
            /**
             * Register graph data processor,
             * @static
             * @method registerDataProcessor
             * @param {String} name data processor name
             * @param {Object} cls processor instance, instance should have a process method
             */
            registerDataProcessor: function (name, cls) {
                GRAPH.dataProcessor[name] = cls;
            }
        },
        event: ['addVertex', 'removeVertex', 'updateVertex', 'updateVertexCoordinate', 'addEdge', 'removeEdge', 'updateEdge', 'addEdgeSet', 'removeEdgeSet', 'updateEdgeSet', 'addVertexSet', 'removeVertexSet', 'updateVertexSet', 'updateVertexSetCoordinate', 'setData', 'insertData', 'clear', 'startGenerate'],
        properties: {
            /**
             * Use this attribute of original data as vertex's id and link's mapping key
             * default is index, if not set use array's index as id
             * @property identityKey {String}
             * @default 'index'
             */
            identityKey: {
                value: 'index'
            },
            /**
             * Set pre data processor,it could be 'force'/'quick'
             * @property dataProcessor
             * @default undefined
             */
            dataProcessor: {},
            /**
             * If 'false', when vertex'position changed, will not write to original data
             * @property autoSave
             * @default true
             */
            autoSave: {
                value: true
            },
            /**
             * Set to re-write vertex's get/set x position method, it should include two function set & get
             * @property xMutatorMethod {Array}
             * @default undefined
             */
            xMutatorMethod: {},
            /**
             * Set to re-write vertex's get/set y position method, it should include two function set & get
             * @property yMutatorMethod {Array}
             * @default undefined
             */
            yMutatorMethod: {},
            width: {
                value: 100
            },
            height: {
                value: 100
            },
            ObservableVertex: {},
            ObservableEdge: {}
        },
        methods: {
            init: function (args) {
                this.init.__super__.apply(this, args);
                this._clear();
            },
            _clear: function () {
                this._originalData = {nodes: [], links: [], nodeSet: []};

                this.vertices = [];
                this.verticesMap = {};

                this.edges = [];
                this.edgesMap = {};

                this._edgeSet = [];
                this._edgeSetMap = {};

                this._vertexSet = [];
                this._vertexSetMap = {};

                //[TODO] observable collection
                //this.ObservableVertex()


                this.fire('clear');
            },

            /**
             * Set data, data should follow Common Topology Data Definition
             * @method setData
             * @param {Object} inData
             */
            setData: function (inData) {

                this._clear();

                this._originalData.nodes = inData.nodes || [];
                this._originalData.links = inData.links || [];
                this._originalData.nodeSet = inData.nodeSet || [];


                var data = this._preProcessData(this._originalData);

                // process
                this._processData(data);

                /**
                 * Trigger when set data to ObservableGraph
                 * @event setData
                 * @param {Object} sender event trigger
                 * @param {Object} data data, which been processed by data processor
                 */

                this.fire('setData', data);


            },
            /**
             * Insert data, data should follow Common Topology Data Definition
             * @method insertData
             * @param {Object} inData
             */
            insertData: function (inData) {
                //migrate orginal data
                this._originalData.nodes = this._originalData.nodes.concat(inData.nodes || []);
                this._originalData.links = this._originalData.links.concat(inData.links || []);
                this._originalData.nodeSet = this._originalData.nodeSet.concat(inData.nodeSet || []);


                var data = this._preProcessData(this._originalData);

                // process
                this._processData(data);

                /**
                 * Trigger when insert data to ObservableGraph
                 * @event insertData
                 * @param {Object} sender event trigger
                 * @param {Object} data data, which been processed by data processor
                 */

                this.fire('insertData', data);

            },

            _preProcessData: function (data) {
                var identityKey = this.identityKey();
                var dataProcessor = this.dataProcessor();

                //TODO data validation

                if (dataProcessor) {
                    var processor = GRAPH.dataProcessor[dataProcessor];
                    if (processor) {
                        return processor.process(data, identityKey, this);
                    } else {
                        return data;
                    }
                } else {
                    return data;
                }
            },

            _processData: function (data) {
                nx.each(data.nodes, function (node) {
                    this._addVertex(node);
                }, this);

                nx.each(data.links, function (link) {
                    this._addEdge(link);
                }, this);

                nx.each(data.nodeSet, function (node) {
                    this._addVertexSet(node);
                }, this);

                nx.each(this._vertexSet, this._processVertexSet, this);

                this._generate();
            },
            /**
             * Get original data
             * @returns {Object}
             */

            getData: function () {
                var data = nx.clone(this._originalData);
                if (data.nodeSet.length === 0) {
                    delete data.nodeSet;
                }
                return data;
            },

            /**
             * Add vertex to Graph
             * @method addVertex
             * @param {JSON} data Vertex original data
             * @param {Object} [inOptions] Config object
             * @param {Boolean} [isGenerate=true] If 'true',not trigger generate process.
             * @returns {nx.data.Vertex}
             */
            addVertex: function (data, inOptions, isGenerate) {

                this._originalData.nodes.push(data);

                var vertex = this._addVertex(data, inOptions);

                if (isGenerate !== false) {
                    vertex.generated(true);
                    /**
                     * @event addVertex
                     * @param {Object} sender Trigger instance
                     * @param {nx.data.Vertex} vertex Vertex object
                     */
                    this.fire('addVertex', vertex);
                }
                return vertex;
            },
            /**
             * Remove a vertex from Graph
             * @method removeVertex
             * @param {nx.data.Vertex} vertex Vertex object
             * @returns {Boolean}
             */
            removeVertex: function (vertex, isNotifyParentVertexSet) {

                vertex.eachConnectedEdgeSet(function (edgeSet) {
                    this._removeEdgeSet(edgeSet);
                }, this);


                this.vertices = util.without(this.vertices, vertex);
                delete this.verticesMap[vertex.id()];

                if (isNotifyParentVertexSet !== false) {
                    var vertexSet = vertex.parentVertexSet();
                    if (vertexSet) {
                        vertexSet.removeVertex(vertex);
                    }
                }

                /**
                 * @event removeVertex
                 * @param {Object} sender Trigger instance
                 * @param {nx.data.Vertex} vertex Vertex object
                 */

                this.fire('removeVertex', vertex);

                return vertex.destroy();
            },

            /**
             * Add edge to Graph
             * @method addEdge
             * @param {JSON} data Vertex original data
             * @param {Object} [inOptions] Config object
             * @param {Boolean} [isGenerate=true] If 'true',not trigger generate process.
             * @returns {nx.data.Edge}
             */

            addEdge: function (data, inOptions, isGenerate) {

                if (!(inOptions && inOptions.virtual)) {
                    this._originalData.links.push(data);
                }

                var edge = this._addEdge(data, inOptions);

                if (isGenerate !== false) {
                    var edgeSet = edge.parentEdgeSet();
                    if (edgeSet.generated()) {
                        if (!edgeSet.activated()) {
                            /**
                             * @event addEdge
                             * @param {Object} sender Trigger instance
                             * @param {nx.data.Edge} edge Edge object
                             */
                            this.fire('addEdge', edge);
                        }
                        this.fire('updateEdgeSet', edgeSet);
                    } else {
                        edgeSet.generated(true);
                        /**
                         * @event addEdgeSet
                         * @param {Object} sender Trigger instance
                         * @param {nx.data.EdgeSet} edgeSet EdgeSet object
                         */
                        this.fire('addEdgeSet', edgeSet);

                    }

                }
                return edge;
            },
            /**
             * Remove edge from Graph
             * @method removeEdge
             * @param edge {nx.data.Edge} edge Edge object
             * @param isNotifyParentEdgeSet {Booleean}
             */
            removeEdge: function (edge, isNotifyParentEdgeSet) {
                var edgeSet = edge.parentEdgeSet();
                edgeSet.removeEdge(edge);

                /**
                 * @event removeEdge
                 * @param {Object} sender Trigger instance
                 * @param {nx.data.Edge} edge Edge object
                 */
                this.fire('removeEdge', edge);


                edge.source().removeEdge(edge);
                edge.target().removeEdge(edge);

                if (isNotifyParentEdgeSet !== false) {
                    this.fire('updateEdgeSet', edgeSet);
                }

                this.edges.splice(this.edges.indexOf(edge), 1);
                delete this.edgesMap[edge.id()];

            },

            _addEdgeSet: function (config) {
                var edgeSet = new nx.data.EdgeSet();
                var id = edgeSet.__id__;
                edgeSet.graph(this);
                edgeSet.sets(config);
                edgeSet.id(id);
                this._edgeSetMap[config.linkKey] = edgeSet;
                this._edgeSet.push(edgeSet);
                return edgeSet;
            },


            _removeEdgeSet: function (edgeSet) {
                edgeSet.eachEdges(function (edge) {
                    if (edge.type() == 'edgeSet') {
                        this._removeEdgeSet(edge);
                    } else {
                        this.removeEdge(edge, false);
                    }
                }, this);

                this._edgeSet.splice(this._edgeSet.indexOf(edgeSet), 1);
                delete this._edgeSetMap[edgeSet.linkKey()];

                /**
                 * @event removeEdgeSet
                 * @param {Object} sender Trigger instance
                 * @param {nx.data.EdgeSet} edgeSet EdgeSet object
                 */
                this.fire('removeEdgeSet', edgeSet);
            },

            /**
             * Add vertex set to Graph
             * @method addVertexSet
             * @param {JSON} data Vertex set original data, which include nodes(Array) attribute. That is node's ID collection.  e.g. {nodes:[id1,id2,id3]}
             * @param {Object} [inOptions] Config object
             * @param {Boolean} [isGenerate=true] If 'true',not trigger generate process.
             * @returns {nx.data.VertexSet}
             */
            addVertexSet: function (data, inOptions, isGenerate) {

                this._originalData.nodeSet.push(data);

                var vertexSet = this._addVertexSet(data, inOptions);

                if (isGenerate !== false) {
                    var addedVirtualEdgeSet = this._processVertexSet(vertexSet);
                    /**
                     * @event addVertexSet
                     * @param {Object} sender Trigger instance
                     * @param {nx.data.VertexSet} vertexSet VertexSet object
                     */
                    this.fire('addVertexSet', vertexSet);

                    nx.each(addedVirtualEdgeSet, function (edgeSet) {
                        this.fire('addEdgeSet', edgeSet);
                    }, this);
                }
                return vertexSet;
            },
            /**
             * Remove a vertex set from Graph
             * @method removeVertexSet
             * @param {nx.data.VertexSet} vertexSet VertexSet object
             * @returns {Boolean}
             */
            removeVertexSet: function (vertexSet) {
                //[todo]

            },

            _addVertex: function (data, config) {
                var vertices = this.vertices;
                var verticesLength = vertices.length;
                var identityKey = this.identityKey();
                //
                if (!nx.is(data, 'Object')) {
                    data = {data: data};
                }
                var id = data[identityKey] !== undefined ? data[identityKey] : verticesLength;
                var vertex = new nx.data.Vertex(data);


                var xMutatorMethod = this.xMutatorMethod();
                if (xMutatorMethod) {
                    vertex.getXPath(xMutatorMethod[0]);
                    vertex.setXPath(xMutatorMethod[1]);
                }


                var yMutatorMethod = this.yMutatorMethod();
                if (yMutatorMethod) {
                    vertex.getYPath(yMutatorMethod[0]);
                    vertex.setYPath(yMutatorMethod[1]);
                }

                //
                vertex.graph(this);
                vertex.autoSave(this.autoSave());
                vertex.id(id);


                if (config) {
                    vertex.sets(config);
                }

                vertex.setPosition();

                vertex.on('updateCoordinate', function () {
                    /**
                     * @event updateVertexCoordinate
                     * @param {Object} sender Trigger instance
                     * @param {nx.data.Vertex} vertex Vertex object
                     */
                    this.fire('updateVertexCoordinate', vertex);
                }, this);

                vertices.push(vertex);
                this.verticesMap[id] = vertex;

                return vertex;
            },

            _addEdge: function (data, inOption) {
                var identityKey = this.identityKey();
                var source, target, sourceID, targetID;

                sourceID = nx.is(data.source, 'Object') ? data.source[identityKey] : data.source;
                source = this.verticesMap[sourceID] || this._vertexSetMap[sourceID];


                targetID = nx.is(data.target, 'Object') ? data.target[identityKey] : data.target;
                target = this.verticesMap[targetID] || this._vertexSetMap[targetID];


                if (source && target) {
                    var linkKey = sourceID + '_' + targetID;
                    var reverseLinkKey = targetID + '_' + sourceID;


                    var edge = new nx.data.Edge(data);
                    var id = data.id === undefined ? edge.__id__ : data.id;

                    edge.sets({
                        id: id,
                        source: source,
                        target: target,
                        sourceID: sourceID,
                        targetID: targetID,
                        linkKey: linkKey,
                        reverseLinkKey: reverseLinkKey,
                        graph: this
                    });
                    if (inOption) {
                        edge.sets(inOption);
                    }
                    source.addEdge(edge);
                    target.addReverseEdge(edge);

                    this.edgesMap[id] = edge;
                    this.edges.push(edge);


                    var edgeSetMap = this._edgeSetMap;


                    var edgeSet = edgeSetMap[linkKey] || edgeSetMap[reverseLinkKey];
                    if (!edgeSet) {
                        edgeSet = this._addEdgeSet({
                            source: source,
                            target: target,
                            sourceID: sourceID,
                            targetID: targetID,
                            linkKey: linkKey,
                            reverseLinkKey: reverseLinkKey
                        });
                    } else {
                        edgeSet.updated(true);
                    }

                    edgeSet.addEdge(edge);
                    edge.parentEdgeSet(edgeSet);
                    edge.reverse(linkKey !== edgeSet.linkKey());


                    return edge;

                } else {
                    if (console) {
                        console.log('source node or target node is not defined, or linkMappingKey value error', data, source, target);
                    }
                    return undefined;
                }
            },


            _addVertexSet: function (data, config) {
                var verticesLength = this._vertexSet.length;
                var identityKey = this.identityKey();
                //
                if (!nx.is(data, 'Object')) {
                    data = {data: data};
                }
                var vertexSetID = data[identityKey] !== undefined ? data[identityKey] : verticesLength;
                var vertexSet = new nx.data.VertexSet(data);

                //
                vertexSet.graph(this);
                vertexSet.type('nodeSet');
                vertexSet.autoSave(this.autoSave());
                vertexSet.id(vertexSetID);

                if (config) {
                    vertexSet.sets(config);
                }

                vertexSet.setPosition();

                vertexSet.on('updateCoordinate', function () {
                    /**
                     * @event updateVertexSetCoordinate
                     * @param {Object} sender Trigger instance
                     * @param {nx.data.VertexSet} vertexSet VertexSet object
                     */
                    this.fire('updateVertexSetCoordinate', vertexSet);
                }, this);

//                this.vertices.push(vertexSet);
//                this.verticesMap[vertexSetID] = vertexSet;

                this._vertexSet.push(vertexSet);
                this._vertexSetMap[vertexSetID] = vertexSet;


                return vertexSet;
            },

            _processVertexSet: function (vertexSet) {
                var vertexSetID = vertexSet.id();
                var vertices = vertexSet.get('nodes');
                var addedVirtualEdgeSet = {};
                var connectedVertices = [];
                var connectedEdgeSetMap = {};
                var EdgeSet = {};
                var internalVertices = [];

                if (vertices) {
                    nx.each(vertices, function (internalID) {
                        var vertex = this.verticesMap[internalID] || this._vertexSetMap[internalID];
                        if (vertex && vertex.visible()) {

                            vertex.eachConnectedEdgeSet(function (edgeset, linkKey) {
                                //get another vertex
                                var _vertex = edgeset.sourceID() == internalID ? edgeset.target() : edgeset.source();
                                var id = _vertex.id();
                                if (_vertex.visible()) {
                                    //if _vertex not in the vertices
                                    if (vertices.indexOf(id) === -1) {
                                        connectedVertices.push(_vertex);
                                        //setup a edgeSetMap
                                        var map = connectedEdgeSetMap[id] = connectedEdgeSetMap[id] || [];
                                        map.push(edgeset);
                                    } else {
                                        edgeset.visible(false);
                                    }
                                    EdgeSet[linkKey] = edgeset;
                                }
                            }, this);
                            internalVertices.push(vertex);
                            vertexSet.addVertex(vertex);
                        }
                    }, this);

                    nx.each(internalVertices, function (vertex) {
                        vertex.visible(false);
                    });


                    nx.each(connectedEdgeSetMap, function (edgeSet, id) {
                        if (vertexSetID !== id) {
                            var edge = this._addEdge({
                                source: vertexSetID,
                                target: id
                            }, {virtual: true});

                            var _edgeSet = edge.parentEdgeSet();
                            _edgeSet.addVirtualEdges(edgeSet);
                            addedVirtualEdgeSet[_edgeSet.id()] = _edgeSet;
                        }

                    }, this);
                }

                vertexSet.addEdgeSet(EdgeSet);
                vertexSet.activated(true);
                return addedVirtualEdgeSet;
            },
            /**
             * Get vertex object by id
             * @method getVertex
             * @param id
             * @returns {nx.data.Vertex}
             */
            getVertex: function (id) {
                return this.verticesMap[id];
            },
            /**
             * Get edge object by id
             * @method getEdge
             * @param id
             * @returns {nx.data.Edge}
             */
            getEdge: function (id) {
                return this.edgesMap[id];
            },
            /**
             * Get vertex set object by id
             * @method getVertexSet
             * @param id
             * @returns {nx.data.VertexSet}
             */
            getVertexSet: function (id) {
                return this._vertexSetMap[id];
            },
            /**
             * Get edge set object by id
             * @method getEdgeSet
             * @param id
             * @returns {nx.data.EdgeSet}
             */
            getEdgeSet: function (id) {
                return this._edgeSetMap[id];
            },
            /**
             * Iterate each vertex item
             * @method eachVertex
             * @param fn {Function} callback function, param is a vertex object
             * @param context {Object} Context of callback function
             */
            eachVertex: function (fn, context) {
                nx.each(this.vertices, fn, context || this);
            },
            /**
             * Iterate each edge item
             * @method eachEdge
             * @param fn {Function} callback function, param is a edge object
             * @param context {Object} Context of callback function
             */
            eachEdge: function (fn, context) {
                nx.each(this._edges, fn, context || this);
            },
            /**
             * Iterate each visible vertex item
             * @method eachVisibleVertex
             * @param fn {Function} callback function, param is a vertex object
             * @param context {Object} Context of callback function
             */
            eachVisibleVertex: function (fn, context) {
                nx.each(this.vertices.concat(this._vertexSet), function (vertex) {
                    if (vertex.visible()) {
                        fn.call(context || this, vertex);
                    }
                }, context || this);
            },
            /**
             * Iterate each visible edge item
             * @method eachVisibleEdge
             * @param fn {Function} callback function, param is a edge object
             * @param context {Object} Context of callback function
             */
            eachVisibleEdge: function (fn, context) {
                nx.each(this._edges, function (edge) {
                    if (edge.visible()) {
                        fn.call(context || this, edge);
                    }
                }, context || this);
            },
            /**
             * Iterate each vertex set item
             * @method eachVertexSet
             * @param fn {Function} callback function, param is a vertexSet object
             * @param context {Object} Context of callback function
             */
            eachVertexSet: function (fn, context) {
                nx.each(this._vertexSet, fn, context || this);
            },
            /**
             * Get all visible vertex object
             * @method getVisibleVertices
             * @returns {Array}
             */
            getVisibleVertices: function () {
                var vertices = [];

                this.eachVisibleVertex(function (vertex) {
                    vertices.push(vertex);
                });
                return vertices;
            },
            /**
             * Get all visible edge objects
             * @method getVisibleEdges
             * @returns {Array}
             */
            getVisibleEdges: function () {
                var edges = [];
                this.eachVisibleEdge(function (edge) {
                    edges.push(edge);
                });
                return edges;
            },
            /**
             * Get edgeSet by source vertex id and target vertex id
             * @method getEdgeSetBySourceAndTarget
             * @param source {nx.data.Vertex|Number|String} could be vertex object or id
             * @param target {nx.data.Vertex|Number|String} could be vertex object or id
             * @returns {nx.data.EdgeSet}
             */
            getEdgeSetBySourceAndTarget: function (source, target) {
                var edgeSetMap = this._edgeSetMap;

                var sourceID = nx.is(source, 'Object') ? source.id() : source;
                var targetID = nx.is(target, 'Object') ? target.id() : target;

                var linkKey = sourceID + '_' + targetID;
                var reverseLinkKey = targetID + '_' + sourceID;

                return edgeSetMap[linkKey] || edgeSetMap[reverseLinkKey];
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
                var edges = [];
                nx.each(inVertices, function (vertex) {
                    edges = edges.concat(vertex.edges);
                    edges = edges.concat(vertex.reverseEdges);
                });


                return util.uniq(edges);
            },
            /**
             * Get edges which's source and target vertex are both in the passed vertices
             * @method getInternalEdgesByVertices
             * @param inVertices
             * @returns {Array}
             */

            getInternalEdgesByVertices: function (inVertices) {
                var edges = [];
                var verticesMap = {};
                var internalEdges = [];
                nx.each(inVertices, function (vertex) {
                    edges = edges.concat(vertex.edges);
                    edges = edges.concat(vertex.reverseEdges);
                    verticesMap[vertex.id()] = vertex;
                });

                nx.each(edges, function (edge) {
                    if (verticesMap[edge.sourceID()] !== undefined && verticesMap[edge.targetID()] !== undefined) {
                        internalEdges.push(edge);
                    }
                });


                return internalEdges;

            },
            /**
             * Get edges which's  just one of source or target vertex in the passed vertices. All edges connected ourside of passed vertices
             * @method getInternalEdgesByVertices
             * @param inVertices
             * @returns {Array}
             */
            getExternalEdgesByVertices: function (inVertices) {
                var edges = [];
                var verticesMap = {};
                var externalEdges = [];
                nx.each(inVertices, function (vertex) {
                    edges = edges.concat(vertex.edges);
                    edges = edges.concat(vertex.reverseEdges);
                    verticesMap[vertex.id()] = vertex;
                });

                nx.each(edges, function (edge) {
                    if (verticesMap[edge.sourceID()] === undefined || verticesMap[edge.targetID()] === undefined) {
                        externalEdges.push(edge);
                    }
                });


                return externalEdges;

            },


            _generate: function () {
                /**
                 * @event startGenerate
                 * @param {Object} sender Trigger instance
                 */
                this.fire('startGenerate');

                nx.each(this.vertices, this._generateVertex, this);

                //nx.each(this.edges, this._generateEdge, this);

                nx.each(this._vertexSet, this._generateVertexSet, this);

                nx.each(this._edgeSet, this._generateEdgeSetMap, this);

            },

            _generateVertex: function (vertex) {
                if (vertex.visible() && !vertex.generated()) {
                    vertex.generated(true);
                    this.fire('addVertex', vertex);
                } else if (vertex.generated() && vertex.updated()) {
                    vertex.updated(false);
                    /**
                     * @event updateVertex
                     * @param {Object} sender Trigger instance
                     * @param {nx.data.Vertex} vertex Vertex object
                     */
                    this.fire('updateVertex', vertex);
                }
            },
            _generateEdge: function (edge) {
                if (!edge.generated() && edge.source().generated() && edge.target().generated()) { //edgeSet.visible() &&
                    edge.generated(true);
                    this.fire('addEdge', edge);
                } else if (edge.generated() && edge.updated()) {
                    edge.updated(false);
                    /**
                     * @event updateEdgeSet
                     * @param {Object} sender Trigger instance
                     * @param {nx.data.EdgeSet} edgeSet EdgeSet object
                     */
                    this.fire('updateEdge', edge);
                }
            },
            _generateEdgeSetMap: function (edgeSet) {
                if (!edgeSet.generated() && edgeSet.source().generated() && edgeSet.target().generated()) { //edgeSet.visible() &&
                    edgeSet.generated(true);
                    this.fire('addEdgeSet', edgeSet);
                } else if (edgeSet.generated() && edgeSet.updated()) {
                    edgeSet.updated(false);
                    /**
                     * @event updateEdgeSet
                     * @param {Object} sender Trigger instance
                     * @param {nx.data.EdgeSet} edgeSet EdgeSet object
                     */
                    this.fire('updateEdgeSet', edgeSet);
                }
            },
            _generateVertexSet: function (vertex) {
                if (vertex.visible() && !vertex.generated()) {
                    vertex.generated(true);
                    this.fire('addVertexSet', vertex);
                } else if (vertex.generated() && vertex.updated()) {
                    vertex.updated(false);
                    /**
                     * @event updateVertexSet
                     * @param {Object} sender Trigger instance
                     * @param {nx.data.VertexSet} vertexSet VertexSet object
                     */
                    this.fire('updateVertexSet', vertex);
                }
            },

            /**
             * Get visible vertices data bound
             * @method getBound
             * @returns {{x: number, y: number, width: number, height: number, maxX: number, maxY: number}}
             */

            getBound: function () {

                var min_x, max_x, min_y, max_y;

                var vertices = this.getVisibleVertices();
                var firstItem = vertices[0];

                if (firstItem) {
                    min_x = max_x = firstItem.get('x') || 0;
                    min_y = max_y = firstItem.get('y') || 0;
                } else {
                    min_x = max_x = 0;
                    min_y = max_y = 0;
                }


                nx.each(vertices, function (vertex, index) {
                    min_x = Math.min(min_x, vertex.get('x') || 0);
                    max_x = Math.max(max_x, vertex.get('x') || 0);
                    min_y = Math.min(min_y, vertex.get('y') || 0);
                    max_y = Math.max(max_y, vertex.get('y') || 0);
                });

                return {
                    x: min_x,
                    y: min_y,
                    width: max_x - min_x,
                    height: max_y - min_y,
                    maxX: max_x,
                    maxY: max_y
                };
            },
            /**
             * Save data to original data
             * @method save
             */
            save: function () {
                this.eachVertex(function (vertex) {
                    vertex.save();
                });
            },
            /**
             * Revers all vertices' original data
             * @method reset
             */
            reset: function () {
                this.eachVertex(function (vertex) {
                    vertex.reset();
                });
            }

        }
    });

})(nx, nx.util, nx.global, nx.logger);