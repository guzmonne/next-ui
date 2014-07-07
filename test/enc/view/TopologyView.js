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
//                    dataProcessor: 'force',
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
                    linkConfig: {
//                        drawMethod: '{topologyVM.view.drawLink}'
                    },
                    showIcon: true,
                    status: '{topologyVM.view.status,direction=<>}',
                    //currentScene: '{event.scene,direction=>}',
                    data: '{topologyVM.data.topologyData}',
                    enableGradualScaling: false
                },
                events: {
                    'ready': '{topologyVM.event.ready}',
                    'topologyGenerated': '{topologyVM.event.topologyGenerated}',
                    'enterNode': '{topologyVM.event.enterNode}',
                    'leaveNode': '{topologyVM.event.leaveNode}',
                    'enterNodeSet': '{topologyVM.event.enterNodeSet}',
                    'leaveNodeSet': '{topologyVM.event.leaveNodeSet}',
                    'dragNodeEnd': '{topologyVM.event.dragNodeEnd}',
                    'dragNodeSetEnd': '{topologyVM.event.dragNodeSetEnd}',
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