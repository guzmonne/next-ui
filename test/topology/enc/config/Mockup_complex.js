(function (nx, global) {


    var serverURL = 'mockup/';

    nx.define("ENC.TW.Config", {
        static: true,
        statics: {
            'physical': serverURL + 'physical_complex.json',
            'tag': serverURL + 'tag.json'
        }
    });

})(nx, nx.global);