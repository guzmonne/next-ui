(function (nx, global) {


    nx.define("ENC.TW.ViewModel.ControlVM.Aggregation", nx.Observable, {
        properties: {
            MVM: {},
            graph: {
                dependencies: ['MVM.topologyGenerated', 'MVM.topology', 'update', 'MVM.topoData'],
                value: function (generated, topology, update, topoData) {
                    if (generated && topology && topoData) {
                        var graph = topology.graph();
                        var vertexSets = graph.vertexSets();
                        var _vertexSets = {};
                        vertexSets.each(function (item, key) {
                            var vertexSet = item.value();
                            if (vertexSet.generated()) {
                                _vertexSets[key] = vertexSet;
                            }
                        });
                        this.vertexSets(_vertexSets);
                        this.selectedNodes(topo.selectedNodes());
                    }
                }
            },
            selectedNodes: {

            },
            vertexSets: {

            },
            update: {
                value: true
            }
        },
        methods: {
            expand: function (sender, args) {
                var vertexSet = sender.model();
                var topo = this.MVM().topology();
                var nodeSet = topo.getNode(vertexSet.id());
                if (nodeSet) {
                    nodeSet.collapsed(!nodeSet.collapsed());
                }
            },
            delete: function (sender, args) {
                var vertexSet = sender.model();
                var topo = this.MVM().topology();
                var nodeSet = topo.getNode(vertexSet.id());
                if (nodeSet) {
                    topo.deleteNodeSet(nodeSet);
                    topo.fit();
                    this.notify('update');
                }
            },
            aggregate: function (sender, events) {
                var topo = this.MVM().topology();
                var nodes = topo.selectedNodes().toArray();
                topo.selectedNodes().clear();
                topo.aggregationNodes(nodes);
            }
        }
    })


})(nx, nx.global);