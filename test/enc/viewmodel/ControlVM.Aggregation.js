(function (nx, global) {


    nx.define("ENC.TW.ViewModel.ControlVM.Aggregation", nx.Observable, {
        properties: {
            MVM: {},
            graph: {
                dependencies: ['MVM.topology', 'MVM.topoData', 'MVM.status.topologyGenerated', 'MVM.status.aggregationModified', 'update'],
                value: function (topology, topoData, generated) {
                    if (generated && topology && topoData) {
                        var graph = topology.graph();
                        var vertexSets = graph.vertexSets();
                        //get the generated root vertex set
                        var _vertexSets = {};
                        vertexSets.each(function (item, key) {
                            var vertexSet = item.value();
                            if (vertexSet.generated() && !vertexSet.rootVertexSet()) {
                                _vertexSets[key] = vertexSet;
                            }
                        });
                        this.vertexSets(_vertexSets);
                        this.selectedNodes(topology.selectedNodes());
                    }
                }
            },
            selectedNodes: {

            },
            vertexSets: {

            },
            update: {
                value: true
            },
            nodeSetLabel: {
                value: null
            }
        },
        methods: {
            expand: function (sender, args) {
                if (sender.dom().$dom.getAttribute('readOnly')) {
                    var vertexSet = sender.model();
                    var topo = this.MVM().topology();
                    var nodeSet = topo.getNode(vertexSet.id());
                    if (nodeSet) {
                        nodeSet.collapsed(!nodeSet.collapsed());
                    }
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
                    this.MVM().status().aggregationModified(true);
                }
            },
            aggregate: function (sender, events) {
                var topo = this.MVM().topology();
                var nodes = topo.selectedNodes().toArray();
                topo.selectedNodes().clear();
                topo.aggregationNodes(nodes);
            },
            rename: function (vertexSet) {
                var topo = this.MVM().topology();
                var view = this.MVM().topologyVM().view();
                view.notify('labelKey');
                this.MVM().status().aggregationModified(true);
            },
            enterGroup: function (sender, events) {
                var vertexSet = sender.model();
                this.MVM().topologyVM().highlightNodeSetGroup(vertexSet.id());
            },
            leaveGroup: function (sender, events) {
                var vertexSet = sender.model();
                this.MVM().topologyVM().recoverHighlightNodeSetGroup(vertexSet.id());
            },
            vertexEnterGroup: function (sender, events) {
                var vertex = sender.model();
                if (vertex.parentVertexSet()) {
                    this.MVM().topologyVM().highlightNodeSetGroup(vertex.parentVertexSet().id());
                }
            },
            vertexLeaveGroup: function (sender, events) {
                var vertex = sender.model();
                if (vertex.parentVertexSet()) {
                    this.MVM().topologyVM().recoverHighlightNodeSetGroup(vertex.parentVertexSet().id());
                }
            }
        }
    })


})(nx, nx.global);