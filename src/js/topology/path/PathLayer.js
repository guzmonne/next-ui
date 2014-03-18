(function (nx, global) {

    /**
     * Path layer class
     Could use topo.getLayer("pathLayer") get this
     * @class nx.graphic.Topology.PathLayer
     * @extend nx.graphic.Topology.Layer
     */
    nx.define("nx.graphic.Topology.PathLayer", nx.graphic.Topology.Layer, {
        properties: {
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
                topo.on('resetzooming', this._draw, this);
                topo.on('zoomend', this._draw, this);

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
                path.attach(this);
                path.draw();

                //
            },
            removePath: function (path) {
//                var index = util.indexOf(this._paths, path);
//                this._paths.splice(index, 1);
//                this.removeChild(path);

            },
            clear: function () {
                this.paths([]);

                var topo = this.topology();
                topo.on('resetzooming', this._draw, this);
                topo.on('zoomend', this._draw, this);

                this.clear.__super__.apply(this, arguments);
            }
        }
    });


})(nx, nx.global);