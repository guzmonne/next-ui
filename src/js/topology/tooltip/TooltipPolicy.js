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
            pressStage: function () {
                var tooltipManager = this.tooltipManager();
                tooltipManager.closeAll();
            },
            zooming: function () {
                var tooltipManager = this.tooltipManager();
                tooltipManager.closeAll();
            },
            clickNode: function (node) {
                var tooltipManager = this.tooltipManager();
                tooltipManager.openNodeTooltip(node);
            }
        }
    });

})(nx, nx.global);