(function (nx, global) {


    var serverURL = 'mockup/';

    nx.define("ENC.TW.Config", {
        static: true,
        statics: {
            'physical': serverURL + 'physical.json',
            'tag': serverURL + 'tag.json',
            'l2default': serverURL + 'l2default.json',
            'ospf': serverURL + 'ospf.json',
            'force': serverURL + 'force.json',
            'enterprise': serverURL + 'enterprise.json',
            'customized':serverURL + 'enterprise.json'
        }
    });

})(nx, nx.global);