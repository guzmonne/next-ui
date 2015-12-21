(function (nx, global) {

    var config = ENC.TW.Config;
    var util = ENC.Util;


    nx.define("ENC.TW.Model.Tag", nx.Observable, {
        view: {},
        properties: {
            type: {},
            data: {
            }
        },
        methods: {
            init: function (args) {
                this.inherited(args);
                util.getJSON(config.tag, function (data) {
                    this.data(data.response);
                }, this);
            }
        }
    });


})(nx, nx.global);