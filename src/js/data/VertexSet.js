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
            },
            visible: {
                get: function () {
                    return this._visible !== undefined ? this._visible : true;
                },
                set: function (visible) {

                    nx.each(this.vertices(), function (edge) {
                        edge.visible(visible);
                    });


                    if (this._visible !== undefined || this._visible !== value) {
                        this.updated(true);
                    }

                    this._visible = visible;

                }
            },
            activated: {
                get: function () {
                    return this._activated || false;
                },
                set: function (value) {
                    nx.each(this.vertices(), function (edge) {
                        edge.visible(!value);
                    });
                    this._activated = value;
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