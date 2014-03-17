(function (nx, util, global) {
    /**
     * @class nx.graphic.LinkTooltipContent
     * @extend nx.ui.Component
     */
    nx.define("nx.graphic.Topology.LinkTooltipContent", nx.ui.Component, {
        view: {},
        methods: {
            onInit: function () {
                this.watch("model", function (prop, value) {
                    if (value) {
                        this.resolve().setContent(value.get("id"));
                    }
                }, this);
            }
        }
    });


})(nx, nx.util, nx.global);