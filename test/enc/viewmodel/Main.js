(function (nx, global) {

    var VM = nx.define("ENC.TW.ViewModel", nx.Observable, {
        events: [],
        properties: {

            topoDataType: {
                value: 'physical',
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
            topologyVM: {
                value: function () {
                    var vm = new ENC.TW.ViewModel.TopologyVM();
                    vm.set('MVM', this);
                    return vm;
                }
            },
            tagVM: {
                value: function () {
                    var vm = new ENC.TW.ViewModel.TagVM();
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
            },
            topologyGenerated: {
                value: false
            },
            topology: {
                value: null
            }
        }
    });

})(nx, nx.global);