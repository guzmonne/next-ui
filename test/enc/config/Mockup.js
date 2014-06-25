(function (nx, global) {


    var serverURL = 'mockup/';

    nx.define("ENC.TW.Config", {
        static: true,
        statics: {
            'physical': serverURL + 'physical.json',
            'tag': serverURL + 'tag.json'
        }
    });

})(nx, nx.global);