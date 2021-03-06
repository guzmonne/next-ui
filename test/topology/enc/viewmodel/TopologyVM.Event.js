(function (nx, global) {


    nx.define("ENC.TW.ViewModel.TopologyVM.Event", nx.Observable, {
        events: [],
        properties: {
            scene: {},
            topo: {},
            MVM: {}
        },
        methods: {
            ready: function (topo, event) {
                topo.showLoading();
                this.scene(topo.currentScene());
                this.topo(topo);
                this.MVM().topology(topo);

                topo.getLayer('groups').registerGroupItem('TWNodeSetPolygonGroup', 'ENC.TW.View.TopologyView.NodeSetPolygonGroup');

                topo.graph().vertexFilter(function (model) {
                    return model.role == "host";
                });


            },
            dispatchTopoOriginalEvent: function (eventName) {
                var args = arguments.callee.caller.arguments;
                this.topo().dispatchEvent(eventName, args[0], args[1]);
            },
            resize: function () {

            },
            topologyGenerated: function () {
            },
            beforeSetData: function () {
                var topo = this.topo();
                topo.showLoading();
            },
            dragNodeEnd: function (sender, node) {
                this.dispatchTopoOriginalEvent('dragNodeEnd');
                this.MVM().status().nodePositionUpdated(true);

                //update nodeset's position if node is root node
                var vertex = node.model();
                var parentVertexSet = vertex.parentVertexSet();
                if (parentVertexSet) {
                    var id = node.id();
                    if (parentVertexSet.get('root') == id) {
                        parentVertexSet._data.x = vertex._x;
                        parentVertexSet._data.y = vertex._y;
                        parentVertexSet._x = vertex._x;
                        parentVertexSet._y = vertex._y;
                        node.parentNodeSet().position(node.position());
                    }
                }
            },
            dragNodeSetEnd: function (sender, node) {
                this.dispatchTopoOriginalEvent('dragNodeSetEnd');
                this.MVM().status().nodePositionUpdated(true);
            },
            expandNodeSet: function (sender, nodeSet) {
                if (!nodeSet.animation()) {
                    var _groupsLayer = this._topo.getLayer('groups');
                    var group = nodeSet.group = _groupsLayer.addGroup({
                        shapeType: 'TWNodeSetPolygonGroup',
                        nodeSet: nodeSet,
                        nodes: nx.util.values(nodeSet.nodes()),
                        label: nodeSet.label(),
                        color: '#9BB150',
                        id: nodeSet.id()
                    });
                } else {
                    this._topo.blockEvent(false);
                    this._topo.stage().resetFitMatrix();
                    this._topo.fit(function () {
                        var _groupsLayer = this._topo.getLayer('groups');


                        var group = nodeSet.group = _groupsLayer.addGroup({
                            shapeType: 'TWNodeSetPolygonGroup',
                            nodeSet: nodeSet,
                            nodes: nx.util.values(nodeSet.nodes()),
                            label: nodeSet.label(),
                            color: '#9BB150',
                            id: nodeSet.id()
                        });

                        var parentNodeSet = nodeSet.parentNodeSet();
                        while (parentNodeSet && parentNodeSet.group) {
                            parentNodeSet.group.draw();
                            parentNodeSet = parentNodeSet.parentNodeSet();
                        }
                        group.view().dom().addClass('active');
                        setTimeout(function () {
                            group.view().dom().removeClass('active');
                        }, 200);
                        this._topo.adjustLayout();
                    }, this);
                }
            },
            enterNode: function (sender, node) {
                this.dispatchTopoOriginalEvent('enterNode');
                node.view('label').text(node.model().get('label'));
            },
            leaveNode: function (sender, node) {
                this.dispatchTopoOriginalEvent('leaveNode');
                node.view('label').text(node.label());
            },
            enterNodeSet: function (sender, nodeSet) {
                this.dispatchTopoOriginalEvent('enterNodeSet');
                nodeSet.view('label').text(nodeSet.model().get('name'));
            },
            leaveNodeSet: function (sender, nodeSet) {
                this.dispatchTopoOriginalEvent('leaveNodeSet');
                nodeSet.view('label').text(nodeSet.label());
            },
            deleteNodeSet: function (sender, events) {
                this.dispatchTopoOriginalEvent('deleteNodeSet');
                this.MVM().status().aggregationModified(true);
            }
        }
    });
})(nx, nx.global);