(function (nx, global) {


    nx.define("nx.graphic.Topology.TooltipMixin", {
        events: [],
        properties: {
            /**
             * @property tooltipManager
             */
            tooltipManager: {
                value: function () {
                    return new nx.graphic.Topology.TooltipManager({topology: this});
                }
            }
        },
        methods: {

        }
    });


})(nx, nx.global);