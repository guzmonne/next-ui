(function (nx, global) {

    var g = new GraphGenerator();
    g.generate(100);

    var topologyData = {nodes: g.nodes, links: g.links};

    nx.define('Base.Highlight', nx.ui.Component, {
        view: {
            content: {
                name: 'topo',
                type: 'nx.graphic.Topology',
                props: {
                    adaptive: true,
                    dataProcessor: 'force',
                    nodeLabel: 'model.id',
                    showIcon: false,
                    data: topologyData
                },
                events: {
                    topologyGenerated: '{#_main}'
                }
            }
        },
        methods: {
            _main: function (sender, event) {
                var topo = sender;
                var node1 = topo.getNode(3);
                var nodeLayer = topo.getLayer('nodes');
                var linksLayer = topo.getLayer('links');
                var linkSetLayer = topo.getLayer('linkSet');
                // highlight related nodes
                nodeLayer.highlightRelatedNode(topo.getNode(0));
                // highlight node
                nodeLayer.highlightNode(topo.getNode(30));
                // highlight linkset
                linkSetLayer.highlightLinkSet(topo.getNode(40).getConnectedLinkSet())

                nodeLayer.fadeOut(true);
                linksLayer.fadeOut(true);


            }
        }
    });

})(nx, nx.global);


