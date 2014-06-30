(function (nx, global) {

    /**
     * ObservableGraph class
     * @extend nx.data.ObservableObject
     * @class nx.data.ObservableGraph
     * @module nx.data
     */
    nx.define('nx.data.ObservableGraph', nx.data.ObservableObject, {
        mixins: [
            nx.data.ObservableGraph.DataProcessor,
            nx.data.ObservableGraph.Vertices,
            nx.data.ObservableGraph.VertexSets,
            nx.data.ObservableGraph.Edges,
            nx.data.ObservableGraph.EdgeSets,
            nx.data.ObservableGraph.EdgeSetCollections
        ],
        event: ['setData', 'insertData', 'clear', 'startGenerate', 'endGenerate'],
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
             * If 'false', when vertex'position changed, will not write to original data
             * @property autoSave
             * @default true
             */
            autoSave: {
                value: true
            },
            filter: {},
            groupBy: {},
            levelBy: {}
        },
        methods: {
            init: function (args) {
                this.inherited(args);
                this._data = {nodes: [], links: [], nodeSet: []};
            },
            clear: function () {
                this._data = {nodes: [], links: [], nodeSet: []};

                this.vertices().clear();

                this.vertexSets().clear();

                this.edgeSetCollections().clear();

                this.edgeSets().clear();

                this.edges().clear();

                this.fire('clear');
            },

            /**
             * Set data, data should follow Common Topology Data Definition
             * @method setData
             * @param {Object} inData
             */
            setData: function (inData) {

                this.clear();

                this._data.nodes = inData.nodes || [];
                this._data.links = inData.links || [];
                this._data.nodeSet = inData.nodeSet || [];

                var data = this.processData(this._data);

                // process
                this._generate(data);

                /**
                 * Trigger when set data to ObservableGraph
                 * @event setData
                 * @param sender {Object}  event trigger
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
                this._data.nodes = this._data.nodes.concat(inData.nodes || []);
                this._data.links = this._data.links.concat(inData.links || []);
                this._data.nodeSet = this._data.nodeSet.concat(inData.nodeSet || []);


                var data = this.processData(inData);

                // process
                this._generate(data);

                /**
                 * Trigger when insert data to ObservableGraph
                 * @event insertData
                 * @param sender {Object}  event trigger
                 * @param {Object} data data, which been processed by data processor
                 */

                this.fire('insertData', data);

            },


            _generate: function (data) {
                this.nodes(data.nodes);

                this.links(data.links);

                nx.each(data.nodeSet, this._addVertexSet, this);


                var filter = this.filter();
                if (filter) {
                    filter.call(this, this);
                }


                this.eachVertexSet(this.initVertexSet, this);

                /**
                 * @event startGenerate
                 * @param sender {Object}  Trigger instance
                 */
                this.fire('startGenerate');

//                console.time('vertex');
                this.eachVertex(this.generateVertex, this);
//                console.timeEnd('vertex');

//                console.time('edgeSet');
                this.eachEdgeSet(this.generateEdgeSet, this);
//                console.timeEnd('edgeSet');


                this.eachVertexSet(this.generateVertexSet, this);


                this.eachVertexSet(function (vertexSet) {
                    vertexSet.activated(true, {force: true});
                    this.updateVertexSet(vertexSet);
                }, this);


                /**
                 * @event endGenerate
                 * @param sender {Object}  Trigger instance
                 */
                this.fire('endGenerate');

            },

            /**
             * Get original data
             * @returns {Object}
             */

            getData: function () {
                var data = nx.clone(this._data);
                if (data.nodeSet.length === 0) {
                    delete data.nodeSet;
                }
                return data;
            },

            /**
             * Get visible vertices data bound
             * @method getBound
             * @returns {{x: number, y: number, width: number, height: number, maxX: number, maxY: number}}
             */

            getBound: function (invertices) {

                var min_x, max_x, min_y, max_y;

                var vertices = invertices || nx.util.values(this.visibleVertices()).concat(nx.util.values(this.visibleVertexSets()));
                var firstItem = vertices[0];
                var x, y;

                if (firstItem) {
                    x = firstItem.get ? firstItem.get('x') : firstItem.x;
                    y = firstItem.get ? firstItem.get('y') : firstItem.y;
                    min_x = max_x = x || 0;
                    min_y = max_y = y || 0;
                } else {
                    min_x = max_x = 0;
                    min_y = max_y = 0;
                }


                nx.each(vertices, function (vertex, index) {
                    x = vertex.get ? vertex.get('x') : vertex.x;
                    y = vertex.get ? vertex.get('y') : vertex.y;
                    min_x = Math.min(min_x, x || 0);
                    max_x = Math.max(max_x, x || 0);
                    min_y = Math.min(min_y, y || 0);
                    max_y = Math.max(max_y, y || 0);
                });

                return {
                    x: min_x,
                    y: min_y,
                    left: min_x,
                    top: min_y,
                    width: max_x - min_x,
                    height: max_y - min_y,
                    maxX: max_x,
                    maxY: max_y
                };
            },
            /**
             * Revers all vertices' original data
             * @method reset
             */
            reset: function () {

            },
            dispose: function () {
                this.clear();
                this.inherited();
            }

        }
    });

})(nx, nx.global);