(function (nx, global) {

    nx.define('Base.AutoLayout', nx.ui.Component, {
        view: {
            content: {
                name: 'topo',
                type: 'nx.graphic.Topology',
                props: {
                    adaptive: true,
                    nodeLabel: '{id}',
                    dataProcessor: 'quick',
                    identityKey: 'id',
                    nodeShowIcon: false,
                    useSmartLabel: false,
                    quickLayout: true,
                    lazyRenderingLink: true,
                    useZoomingAnimation: false,
                    supportMultipleLink: false
                },
                events: {
                    'ready': '{#_ready}'
                }
            }
        },
        methods: {
            _ready: function (sender, event) {
                var start = new Date();

                var g = new GraphGenerator();
                g.generate(100);

                var topologyData = {nodes: g.nodes, links: g.links};
                console.log(new Date() - start);
                sender.setData(topologyData);

                console.log(new Date() - start);
            }
        }
    });

})(nx, nx.global);