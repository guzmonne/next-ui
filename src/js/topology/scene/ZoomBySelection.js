(function (nx, util, global) {

    /**
     * Zoom by selection scene
     * @class nx.graphic.Topology.ZoomBySelection
     * @extend nx.graphic.Topology.SelectionScene
     */
    nx.define("nx.graphic.Topology.ZoomBySelection", nx.graphic.Topology.SelectionScene, {
        properties: {
            selectedNodes: {
                get: function () {
                    return this.topology().selectedNodes();
                }
            },
            showBound: {value: false},
            timer: {}
        },
        methods: {
            activate: function () {
                this.inherited();
                this.on('startSelection', this._setIcon, this);
                this.on('selecting', this._moveIcon, this);
                this.on('endSelection', this._handler, this);


                this.topology().resolve("nav").resolve("zoomselection").addClass("n-icon-zoom-by-selection-heighlight-x22");


                this.topology().addClass("n-topology-cursor-zoom-in");

            },
            deactivate: function () {
                this.inherited();
                this.off('endSelection', this._handler, this);

                this.topology().resolve("nav").resolve("zoomselection").removeClass("n-icon-zoom-by-selection-heighlight-x22");
                this.topology().removeClass("n-topology-cursor-zoom-in");

            },
            _setIcon: function () {

            },
            _moveIcon: function (sender, event) {

            },
            _handler: function (sender, bound) {
                if (bound.width > 10 && bound.height > 10) {
                    var topo = this.topology();
                    this.zoom(bound);
                    topo.mode("default");
                    topo.fire("selectArea", bound);
                }

            },
            zoom: function (bound) {
                this.topology().zoomByBound(bound);
            },
            stopZoom: function () {
                this.topology().stopZoomAnimation();
            }
        }
    });


})(nx, nx.graphic.util, nx.global);