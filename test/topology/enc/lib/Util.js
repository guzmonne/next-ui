(function (nx, global) {

    nx.define("ENC.Util", {
        static: true,
        statics: {
            getJSON: function (url, callback, context) {
                var oReq = new XMLHttpRequest();
                oReq.open("GET", url, true);
                oReq.onload = function (e) {
                    var data = JSON.parse(oReq.response);
                    callback.call(context || this, data);
                }.bind(this);
                oReq.send();
            }
        }
    });


})(nx, nx.global);