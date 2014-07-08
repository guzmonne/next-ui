(function (nx, global) {

    nx.define("ENC.TW.ViewModel.ControlVM", nx.Observable, {
        events: [],
        properties: {
            MVM: {
                watcher: function (prop, value) {
                    if (value) {
                        this.viewSetting().MVM(value);
                        this.inventory().MVM(value);
                        this.aggregation().MVM(value);
                        this.layer().MVM(value);
                    }
                }
            },
            viewSetting: {
                value: function () {
                    return new ENC.TW.ViewModel.ControlVM.ViewSetting();
                }
            },
            inventory: {
                value: function () {
                    return new ENC.TW.ViewModel.ControlVM.Inventory();
                }
            },
            aggregation: {
                value: function () {
                    return new ENC.TW.ViewModel.ControlVM.Aggregation();
                }
            },
            layer: {
                value: function () {
                    return new ENC.TW.ViewModel.ControlVM.Layer();
                }
            }
        },
        methods: {

        }
    });
})(nx, nx.global);