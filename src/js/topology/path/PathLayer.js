(function (nx, global) {

    /**
     * Path layer class
     Could use topo.getLayer("pathLayer") get this
     * @class nx.graphic.Topology.PathLayer
     * @extend nx.graphic.Topology.Layer
     * @module nx.graphic.Topology
     */
    nx.define("nx.graphic.Topology.PathLayer", nx.graphic.Topology.Layer, {
        properties: {

            /**
             * Path array
             * @property paths
             */
            paths: {
                value: function () {
                    return[];
                }
            }
        },
        view: {
            type: 'nx.graphic.Group'
        },
        methods: {
            attach: function (args) {
                this.attach.__super__.apply(this, arguments);
                var topo = this.topology();
//                topo.on('zoomend', this._draw, this);

            },
            _draw: function () {
                nx.each(this.paths(), function (path) {
                    path.draw();
                });
            },
            /**
             * Add a path to topology
             * @param path {nx.graphic.Topology.Path}
             * @method addPath
             */
            addPath: function (path) {
                this.paths().push(path);
                path.topology(this.topology());
                path.attach(this);
                path.draw();

                //
            },
            /**
             * Remove a path
             * @method removePath
             * @param path
             */
            removePath: function (path) {
                var index = util.indexOf(this._paths, path);
                this._paths.splice(index, 1);
                path.detach(this);
            },
            clear: function () {
                this.paths([]);

                var topo = this.topology();
//                topo.on('zoomend', this._draw, this);

                this.clear.__super__.apply(this, arguments);
            }
        }
    });


})(nx, nx.global);