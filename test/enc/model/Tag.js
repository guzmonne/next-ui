(function (nx, global) {

    var config = ENC.TW.Config;
    var util = ENC.Util;


    nx.define("ENC.TW.Model.Tag", nx.Observable, {
        view: {},
        properties: {
            type: {},
            data: {
                dependencies: ['type'],
                update: function (type) {
                    if (type && type == 'physical') {
                        util.getJSON(config.tag, function (data) {
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