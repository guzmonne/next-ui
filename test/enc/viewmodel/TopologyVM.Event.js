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
            },
            dispatchTopoOriginalEvent: function (eventName) {
                var args = arguments.callee.caller.arguments;
                this.topo().dispatchEvent(eventName, args[0], args[1]);
            },
            resize: function () {

            },
            topologyGenerated: function () {
            },
            dragNodeEnd: function (sender, node) {
                this.dispatchTopoOriginalEvent('dragNodeEnd');
            },
            expandNodeSet: function (sender, nodeSet) {
                this._topo.blockEvent(false);
                this._topo.stage().resetFitMatrix();
                this._topo.fit(function () {
                    var _groupsLayer = this._topo.getLayer('groups');


                    nodeSet.group = _groupsLayer.addGroup({
                        shapeType: 'nodeSetPolygon',
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

                    this._topo.adjustLayout();
                }, this);


            }
        }
    });
})(nx, nx.global);