(function (nx, global) {


    nx.define("ENC.TW.ViewModel.ControlVM.Inventory", nx.Observable, {
        properties: {
            MVM: {},
            graph: {
                dependencies: ['MVM.topologyGenerated', 'MVM.topology'],
                value: function (generated, topology) {
                    if (generated && topology) {
                        var graph = topology.graph();
                        var vertices = graph.vertices();
                        this.vertices(vertices.toArray());
                        this.query(new nx.data.Query(vertices));
                    }
                }
            },
            vertices: {
                value: null
            },
            searchKey: {
                value: null
            },
            query: {
                value: null
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
            selectItem: function (sender, args) {
                var vertex = sender.model().value();
            }
        }
    })


})(nx, nx.global);