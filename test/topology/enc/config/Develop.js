(function (nx, global) {


    var serverURL = 'https://sdn-controller/';

    nx.define("ENC.TW.Config", {
        static: true,
        statics: {
            'physical': serverURL + 'api/v0/topology/physical-topology',
            'tag': serverURL + 'api/v0/network-device/tag',
            'isis': serverURL + 'api/v0/topology/l3/isis',
            'static-route': serverURL + 'api/v0/topology/l3/static-route',
            'ospf': serverURL + 'api/v0/topology/l3/ospf',
            'l2default': serverURL + 'api/v0/topology/l2/default',
            'force': serverURL + ' api/v0/topology/force',
            'enterprise': serverURL + 'api/v0/topology/enterprise'


        }
    });

})(nx, nx.global);