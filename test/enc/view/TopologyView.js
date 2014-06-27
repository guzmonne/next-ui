(function (nx, global) {
    nx.define("ENC.TW.View.TopologyView", nx.ui.Component, {
        events: [],
        view: {
            content: {
                name: 'topo',
                type: 'nx.graphic.Topology',
                props: {
                    adaptive: true,
                    identityKey: 'id',
                    nodeConfig: {
                        label: '{topologyVM.view.nodeLabel}',
                        iconType: '{topologyVM.view.nodeIconPath}'
                    },
                    nodeSetConfig: {
                        label: '{topologyVM.view.nodeSetLabel}',
                        iconType: '{topologyVM.view.nodeSetIconPath}'
                    },
                    groupsLayerConfig: {
                        groupDictionary: '{tagVM.tagDictionary}'
                    },
                    showIcon: true,
                    status: '{topologyVM.view.status,direction=<>}',
                    //currentScene: '{event.scene,direction=>}',
                    data: '{topologyVM.data.topologyData}'
                },
                events: {
                    'ready': '{topologyVM.event.ready}',
                    'topologyGenerated': '{topologyVM.event.topologyGenerated}',
                    'enterNode': '{topologyVM.event.enterNode}',
                    'leaveNode': '{topologyVM.event.leaveNode}',
                    'enterNodeSet': '{topologyVM.event.enterNodeSet}',
                    'leaveNodeSet': '{topologyVM.event.leaveNodeSet}',
                    'dragNodeEnd': '{topologyVM.event.dragNodeEnd}',
                    'expandNodeSet': '{topologyVM.event.expandNodeSet}'
                }
            }

        },
        methods: {
            attach: function (args) {
                this.inherited(args);
                window.topo = this.view('topo')
            }
        }
    });
})(nx, nx.global);