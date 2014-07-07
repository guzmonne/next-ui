(function (nx, global) {

    var config = ENC.TW.Config;
    var util = ENC.Util;


    nx.define("ENC.TW.Model.TopologyData", nx.Observable, {
        view: {},
        properties: {
            type: {},
            data: {
                dependencies: ['type'],
                update: function (type) {
                    if (type) {
                        util.getJSON(config[type] || config.physical, function (data) {
                            this.data(data.response);
                        }, this);
                    }
                }
            }
        },
        methods: {

        }
    });


})(nx, nx.global);