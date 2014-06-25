(function (nx, global) {

    nx.define("ENC.TW.ViewModel.TopologyVM", nx.Observable, {
        events: [],
        properties: {
            MVM: {
                watcher: function (prop, value) {
                    if (value) {
                        this.data().MVM(value);
                        this.event().MVM(value);
                        this.view().MVM(value);
                    }
                }
            },
            data: {
                value: function () {
                    return new ENC.TW.ViewModel.TopologyVM.Data();
                }
            },
            event: {
                value: function () {
                    return new ENC.TW.ViewModel.TopologyVM.Event();
                }
            },
            view: {
                value: function () {
                    return new ENC.TW.ViewModel.TopologyVM.View();
                }
            }
        },
        methods: {

        }
    });
})(nx, nx.global);