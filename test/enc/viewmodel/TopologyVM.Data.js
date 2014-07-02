(function (nx, global) {
    nx.define("ENC.TW.ViewModel.TopologyVM.Data", nx.Observable, {
        events: [],
        properties: {
            MVM: {},
            topologyData: {
                dependencies: ['MVM.topoData'],
                value: function (data) {
                    if (data) {
//                        delete  data.nodeSet;
                        return data;
                    }
                }
            },
            graph: {

            }
        },
        methods: {

        }
    });

})(nx, nx.global);