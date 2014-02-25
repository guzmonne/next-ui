(function (nx, util, global) {
    nx.define("nx.data.ObservableGraph.QuickProcessor", {
        methods: {
            process: function (data, key) {
                nx.each(data.nodes, function (node) {
                    node.x = Math.floor(Math.random() * 100);
                    node.y = Math.floor(Math.random() * 100);
                });
            }
        }
    });

})(nx, nx.graphic.util, nx.global);