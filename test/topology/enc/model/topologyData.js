(function (nx, global) {

    var config = ENC.TW.Config;
    var util = ENC.Util;


    nx.define("ENC.TW.Model.TopologyData", nx.Observable, {
        view: {},
        properties: {
            type: {},
            layout: {},
            data: {
                dependencies: ['type', 'layout'],
                update: function (type, layout) {
                    if (type) {
                        util.getJSON(config[layout] || config[type] || config.physical, function (data) {
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