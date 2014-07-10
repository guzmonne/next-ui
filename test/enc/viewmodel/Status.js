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
            }
        }
    })


})(nx, nx.global);