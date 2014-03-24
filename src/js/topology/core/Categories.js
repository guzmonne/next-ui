(function (nx, util, global) {

    nx.define("nx.graphic.Topology.Categories", {
        events: [],
        properties: {
        },
        methods: {
            recover: function (force) {
                nx.each(this.layers(), function (layer) {
                    layer.recover(force);
                }, this);
            }
        }
    });


})(nx, nx.util, nx.global);