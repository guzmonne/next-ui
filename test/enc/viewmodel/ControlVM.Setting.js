(function (nx, global) {


    nx.define("ENC.TW.ViewModel.ControlVM.Setting", nx.Observable, {
        properties: {
            MVM: {},
            type: {
                dependencies: ['MVM.topoDataType']
            },
            layers: {
                value: function () {
                    return [
                        {id: 'physical', label: 'Physical'},
                        {id: 'l2', label: 'L2-default', number: '20'},
                        {id: 'ospf', label: 'OSPF', number: '30'}
                    ];
                }
            }
        },
        methods: {
            switchLayer: function (sender, args) {
                var model = sender.model();
                var layer = model.id;
                this.MVM().topoDataType(layer);
            }
        }
    })


})(nx, nx.global);