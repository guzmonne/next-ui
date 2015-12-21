(function (nx, global) {


    nx.define("ENC.TW.ViewModel.ControlVM.Setting", nx.Observable, {
        properties: {
            MVM: {},
            type: {
                dependencies: ['MVM.topoDataType']
            }
        },
        methods: {

        }
    })


})(nx, nx.global);