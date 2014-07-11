(function (nx, global) {

    var VM = nx.define("ENC.TW.ViewModel", nx.Observable, {
        events: [],
        properties: {

            topoDataType: {
                value: 'physical',//physical
                watcher: function (prop, value) {
                    this.topoDataModel().type(value);
                }
            },
            topoDataModel: {
                value: function () {
                    return  new ENC.TW.Model.TopologyData();
                }
            },
            topoData: {
                dependencies: ['topoDataModel.data'],
                value: function (data) {
                    if (data) {
                        return data;
                    }
                }
            },
            topology: {
                value: null
            },
            status: {
                value: function () {
                    var vm = new ENC.TW.ViewModel.Status();
                    vm.set('MVM', this);
                    return vm;
                }
            },
            topologyVM: {
                value: function () {
                    var vm = new ENC.TW.ViewModel.TopologyVM();
                    vm.set('MVM', this);
                    return vm;
                }
            },
            controlVM: {
                value: function () {
                    var vm = new ENC.TW.ViewModel.ControlVM();
                    vm.set('MVM', this);
                    return vm;
                }
            }
        }
    });

})(nx, nx.global);