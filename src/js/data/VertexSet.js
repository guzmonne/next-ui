(function (nx, util, global) {
    /**
     * Vertex set ckass
     * @class nx.data.VertexSet
     * @extend nx.data.Vertex
     * @module nx.data
     */
    nx.define('nx.data.VertexSet', nx.data.Vertex, {
        properties: {
            /**
             * All child vertices
             * @property vertices {Array}
             * @default []
             */
            vertices: {
                value: function () {
                    return [];
                }
            }
        },
        methods: {
            /***
             * Add child vertex
             * @method addVertex
             * @param vertex {nx.data.vertex}
             */
            addVertex: function (vertex) {
                return this.vertices().push(vertex);
            },
            /**
             * Remove vertex
             * @param vertex {nx.data.vertex}
             * @returns {Array}
             */
            removeVertex: function (vertex) {
                return this.vertices(util.without(this.vertices(), vertex));
            }
        }
    });

})(nx, nx.graphic.util, nx.global);