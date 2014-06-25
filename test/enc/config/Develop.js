(function (nx, global) {


    var serverURL = 'https://sdn-controller/';

    nx.define("ENC.TW.Config", {
        static: true,
        statics: {
            'physical': serverURL + 'api/v0/topology/physical-topology',
            'tag': serverURL + 'api/v0/network-device/tag'
        }
    });

})(nx, nx.global);