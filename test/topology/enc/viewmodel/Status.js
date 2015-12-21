(function (nx, global) {

    nx.define("ENC.TW.ViewModel.Status", nx.Observable, {
        properties: {
            MVM: {},
            topologyGenerated: {
                value: false
            },
            aggregationModified: {
                value: false
            },
            nodePositionUpdated: {
                value: false
            },
            topologyCleared: {
                value: false
            },
            updated: {
                dependencies: ['aggregationModified', 'nodePositionUpdated'],
                value: function (modified, updated) {
                    return !!modified || !!updated;
                }
            }
        }
    })


})(nx, nx.global);