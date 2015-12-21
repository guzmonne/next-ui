(function (nx, global) {


    nx.define("ENC.TW.ViewModel.ControlVM.Selection", nx.Observable, {
        properties: {
            MVM: {},
            graph: {
                dependencies: ['MVM.status.topologyGenerated', 'MVM.topology', 'MVM.topoData'],
                value: function (generated, topology, topoData) {
                    if (generated && topology && topoData) {
                        topology.selectedNodes().on('change', this.filter, this);
                    }
                }
            },
            selectedNodes: {
                value: function () {
                    return [];
                }
            }
        },
        methods: {
            filter: function (sender, event) {
                var selectedList = sender.toArray();
                var nodes = [];
                nx.each(selectedList, function (item) {
                    if (item.model().type() == 'vertex') {
                        nodes.push(item);
                    }
                });
                this.selectedNodes(nodes);
            },
            highlightItem: function (sender, events) {
                var vertex = sender.model();
                this.MVM().topologyVM().highlightedNodes([vertex.id()]);
            },
            recoverItem: function (sender, events) {
                this.MVM().topologyVM().recoverHighlighted();
            },
            aggregate: function () {
                var nodes = this.selectedNodes();
                this.MVM().topology().aggregationNodes(nodes);
            }
        }
    })


})(nx, nx.global);