(function (nx) {
    var Vector = nx.math.Vector;

    /**
     * Mathematics Line class
     * @class nx.math.Line
     * @module nx.math
     */

    /**
     * Line class constructor function
     * @param start {nx.math.Vector}
     * @param end {nx.math.Vector}
     * @constructor
     */
    function Line(start, end) {
        this.start = start || new Vector();
        this.end = end || new Vector();
        this.dir = this.end.subtract(this.start);
    }

    Line.prototype = {
        constructor: Line,
        /**
         * @method length
         * @returns {*}
         */
        length: function () {
            return this.dir.length();
        },
        /**
         * @method squaredLength
         * @returns {*}
         */
        squaredLength: function () {
            return this.dir.squaredLength();
        },
        /**
         * @method angle
         * @returns {*}
         */
        angle: function () {
            return this.dir.angle();
        },
        /**
         * @methid intersection
         * @returns {*}
         */
        circumferentialAngle: function () {
            var angle = this.angle();
            if (angle < 0) {
                angle += 360;
            }
            return angle;
        },
        /**
         * @method center
         * @returns {nx.math.Vector}
         */
        center: function () {
            return this.start.add(this.end).divide(2);
        },
        /**
         * @method slope
         * @returns {*}
         */
        slope: function () {
            return this.dir.slope();
        },
        /**
         * @method general
         * @returns {Array}
         */
        general: function () {
            var k = this.slope(),
                start = this.start;
            if (isFinite(k)) {
                return [k, -1, start.y - k * start.x];
            }
            else {
                return [1, 0, -start.x];
            }
        },
        /**
         * @method intersection
         * @param l {nx.math.Line}
         * @returns {nx.math.Vector}
         */
        intersection: function (l) {
            var g0 = this.general(),
                g1 = l.general();

            return new Vector(
                (g0[1] * g1[2] - g1[1] * g0[2]) / (g0[0] * g1[1] - g1[0] * g0[1]),
                (g0[0] * g1[2] - g1[0] * g0[2]) / (g1[0] * g0[1] - g0[0] * g1[1]));
        },
        /**
         * @method pedal
         * @param v {nx.math.Vector}
         * @returns {nx.math.Vector}
         */
        pedal: function (v) {
            var dir = this.dir,
                g0 = this.general(),
                g1 = [dir.x, dir.y, -v.x * dir.x - v.y * dir.y];

            return new Vector(
                (g0[1] * g1[2] - g1[1] * g0[2]) / (g0[0] * g1[1] - g1[0] * g0[1]),
                (g0[0] * g1[2] - g1[0] * g0[2]) / (g1[0] * g0[1] - g0[0] * g1[1]));
        },
        /**
         * @method translate
         * @param v {nx.math.Vector}
         * @returns {mx.math.Line}
         */
        translate: function (v) {
            v = v.rotate(this.angle());
            return new Line(this.start.add(v), this.end.add(v));
        },
        /**
         * @method rotate
         * @param a {Number}
         * @returns {nx.math.Line}
         */
        rotate: function (a) {
            return new Line(this.start.rotate(a), this.end.rotate(a));
        },
        /**
         * @method negate
         * @returns {nx.math.Line}
         */
        negate: function () {
            return new Line(this.end, this.start);
        },
        /**
         * @method normal
         * @returns {nx.math.Vector}
         */
        normal: function () {
            var dir = this.dir, l = this.dir.length();
            return new Vector(-dir.y / l, dir.x / l);
        },
        /**
         * @method pad
         * @param a {nx.math.Vector}
         * @param b {nx.math.Vector}
         * @returns {nx.math.Line}
         */
        pad: function (a, b) {
            var n = this.dir.normalize();
            return new Line(this.start.add(n.multiply(a)), this.end.add(n.multiply(-b)));
        },
        /**
         * @method clone
         * @returns {nx.math.Line}
         */
        clone: function () {
            return new Line(this.start, this.end);
        }
    };

    nx.math.Line = Line;
})(nx);