(function (nx, global) {


    nx.define("ENC.TW.ViewModel.ControlVM.Aggregation", nx.Observable, {
        properties: {
            MVM: {},
            graph: {
                dependencies: ['MVM.topologyGenerated', 'MVM.topology'],
                value: function (generated, topology) {
                    if (generated && topology) {
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
                    }
                }
            },
            vertexSets: {

            },
            devices: {
                dependencies: ['searchKey', 'vertices'],
                value: function (searchKey, vertices) {
                    if (vertices) {
                        if (!searchKey) {
                            return vertices;
                        } else {
                            var q = this.query();
                            var col = q.where(function (item) {
                                var label = item.value().get('label');
                                return label.indexOf(searchKey) != -1;
                            });
                            return col.toArray();
                        }
                    }
                }
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
            }
        }
    })


})(nx, nx.global);