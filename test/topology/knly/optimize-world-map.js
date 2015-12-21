var fs = require('fs');
var PRECISION = 10;
var Vector = {
    angleCosine: function (v1, v2) {
        var cos = (v1[0] * v2[0] + v1[1] * v2[1]) / Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1]) / Math.sqrt(v2[0] * v2[0] + v2[1] * v2[1]);
        return cos;
    }
};
fs.readFile(__dirname + '/lib/world-50m.json', function (err, data) {
    if (err) {
        throw err;
    }
    data = JSON.parse(data);
    var i, arcs, arc, p, cos, isec, iang;
    for (i = 0, arcs = data.arcs; i < arcs.length; i++) {
        arc = arcs[i];
        i == 0 && console.log("brefor", JSON.stringify(arc));
        p = 1, isec = arc[1], iang = arc[1].slice();
        // TODO better algorithm
        while (p < arc.length - 1) {
            cos = Vector.angleCosine(iang, arc[p + 1]);
            if (cos > 0.75) {
                isec[0] += arc[p + 1][0];
                isec[1] += arc[p + 1][1];
                arc.splice(p + 1, 1);
            } else {
                p++;
                iang = arc[p].slice();
                isec = arc[p];
            }
        }
	i == 0 && console.log("after", JSON.stringify(arc));
    }
    // write back
    data = JSON.stringify(data);
    fs.writeFile(__dirname + '/lib/world-smaller.json', data);
});
