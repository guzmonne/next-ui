(function (nx, global) {

    nx.define("nx.graphic.Topology.TooltipPolicy", {
        events: [],
        properties: {
            topology: {},
            tooltipManager: {}
        },
        methods: {
            init: function (args) {
                this.inherited(args);
                this.sets(args);
            },
            clickNode: function (node) {
                var tooltipManager = this.tooltipManager();
                tooltipManager.openNodeTooltip(node);
            }
        }
    });


})(nx, nx.global);