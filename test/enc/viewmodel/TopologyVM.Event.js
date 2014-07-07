(function (nx, global) {


    nx.define("ENC.TW.ViewModel.TopologyVM.Event", nx.Observable, {
        events: [],
        properties: {
            scene: {},
            topo: {},
            MVM: {},
            expandALL: {
                value: false
            }
        },
        methods: {
            ready: function (topo, event) {
                topo.showLoading();
                this.scene(topo.currentScene());
                this.topo(topo);
                this.MVM().topology(topo);

                topo.getLayer('groups').registerGroupItem('TWNodeSetPolygonGroup', 'ENC.TW.View.TopologyView.NodeSetPolygonGroup');

            },
            dispatchTopoOriginalEvent: function (eventName) {
                var args = arguments.callee.caller.arguments;
                this.topo().dispatchEvent(eventName, args[0], args[1]);
            },
            resize: function () {

            },
            topologyGenerated: function () {
                console.log(this._topo.getData());
            },
            dragNodeEnd: function (sender, node) {
                this.dispatchTopoOriginalEvent('dragNodeEnd');
                this.MVM().topologyVM().updated(true);
            },
            dragNodeSetEnd: function (sender, node) {
                this.dispatchTopoOriginalEvent('dragNodeSetEnd');
                this.MVM().topologyVM().updated(true);
            },
            expandNodeSet: function (sender, nodeSet) {
                if (this.expandALL()) {
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
            }
        }
    });
})(nx, nx.global);