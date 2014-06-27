(function (nx, global) {

    nx.define("ENC.TW.ViewModel.ControlVM", nx.Observable, {
        events: [],
        properties: {
            MVM: {
                watcher: function (prop, value) {
                    if (value) {
                        this.viewSetting().MVM(value);
                    }
                }
            },
            viewSetting: {
                value: function () {
                    return new ENC.TW.ViewModel.ControlVM.ViewSetting();
                }
            }
        },
        methods: {

        }
    });
})(nx, nx.global);