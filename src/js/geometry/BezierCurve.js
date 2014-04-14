(function (nx, ui, global) {
    /**
     * @class BezierCurve
     * @namespace nx.geometry
     */
    var EXPORT = nx.define("nx.geometry.BezierCurve", nx.Observable, {
        statics: {
            separate: function separate(bezier, rate) {
                var rest = 1 - rate;
                var intervalSeparatePoint = function (interval) {
                    return [interval[0][0] * rest + interval[1][0] * rate, interval[0][1] * rest + interval[1][1] * rate];
                };
                var intervalInter = function (i1, i2) {
                    return [intervalSeparatePoint([i1[0], i2[0]]), intervalSeparatePoint([i1[1], i2[1]])];
                };
                var bezierLower = function (bezier) {
                    var i, rslt = [];
                    for (i = 0; i < bezier.length - 1; i++) {
                        rslt.push(intervalInter(bezier[i], bezier[i + 1]));
                    }
                    return rslt;
                };
                // start iterate
                var point, left = [], right = [];
                var intervals = bezier, interval;
                while (intervals.length) {
                    interval = intervals[0];
                    left.push([interval[0], intervalSeparatePoint(interval)]);
                    interval = intervals[intervals.length - 1];
                    right.unshift([intervalSeparatePoint(interval), interval[1]]);
                    if (intervals.length == 1) {
                        point = intervalSeparatePoint(intervals[0]);
                    }
                    intervals = bezierLower(intervals);
                }
                return {
                    point: point,
                    left: left,
                    right: right
                };
            }
        }
    });
})(nx, nx.ui, window);
