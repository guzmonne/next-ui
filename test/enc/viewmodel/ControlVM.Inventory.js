(function (nx, global) {


    nx.define("ENC.TW.ViewModel.ControlVM.Inventory", nx.Observable, {
        properties: {
            MVM: {},
            graph: {
                dependencies: ['MVM.status.topologyGenerated', 'MVM.topology', 'MVM.topoData'],
                value: function (generated, topology, topoData) {
                    if (generated && topology && topoData) {
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
                            var res = col.toArray();
//                            res.sort(function (a, b) {
//                                return b.value().generated();
//                            });
                            return res;
                        }
                    }
                }
            }
        },
        methods: {
            selectItem: function (sender, args) {
                var vertex = sender.model().value();
            },
            locateNode: function (sender, events) {
                var vertex = sender.model().value();
                this.MVM().topologyVM().locateNode(vertex.id());
            },
            highlightItem: function (sender, events) {
                var vertex = sender.model().value();
                this.MVM().topologyVM().highlightedNodes([vertex.id()]);
            },
            recoverItem: function (sender, events) {
                var vertex = sender.model().value();
                this.MVM().topologyVM().recoverHighlighted();

                //todo , use property fix
                sender.owner().view('info').style().set('display', 'none');

            },
            showInfo: function () {

            }
        }
    })


})(nx, nx.global);