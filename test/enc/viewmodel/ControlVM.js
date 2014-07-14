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
                        this.selection().MVM(value);
                        this.tag().MVM(value);
                        this.layout().MVM(value);
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
            },
            layout: {
                value: function () {
                    return new ENC.TW.ViewModel.ControlVM.Layout();
                }
            },
            tag: {
                value: function () {
                    return new ENC.TW.ViewModel.ControlVM.Tag();
                }
            },
            selection: {
                value: function () {
                    return new ENC.TW.ViewModel.ControlVM.Selection();
                }
            },

            tagData: {
                dependencies: ['tagDataModel.data'],
                value: function (data) {
                    if (data) {
                        return data;
                    }
                }
            }
        },
        methods: {

        }
    });
})(nx, nx.global);