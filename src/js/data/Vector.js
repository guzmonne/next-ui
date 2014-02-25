(function (nx) {
    /**
     * Mathematics Vector class
     * @class nx.math.Vector
     * @module nx.math
     */

    /**
     * Vector constructor function
     * @param x {Number}
     * @param y {Number}
     * @constructor
     */
    function Vector(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    Vector.prototype = {
        constructor: Vector,
        /**
         * @method equals
         * @param v {nx.math.Vector}
         * @returns {boolean}
         */
        equals: function (v) {
            return this.x === v.x && this.y === v.y;
        },
        /**
         * @method length
         * @returns {number}
         */
        length: function () {
            return Math.sqrt(this.squaredLength());
        },
        /**
         * @method squaredLength
         * @returns {number}
         */
        squaredLength: function () {
            var x = this.x,
                y = this.y;

            return x * x + y * y;
        },
        /**
         * @method angle
         * @returns {number}
         */
        angle: function () {
            var l = this.length(),
                a = l && Math.acos(this.x / l);
            a = a * 180 / Math.PI;
            a = this.y > 0 ? a : -a;

            return a;
        },
        /**
         * @method circumferentialAngle
         * @returns {number}
         */
        circumferentialAngle: function () {
            var angle = this.angle();
            if (angle < 0) {
                angle += 360;
            }
            return angle;

        },
        /**
         * @method slope
         * @returns {number}
         */
        slope: function () {
            return this.y / this.x;
        },
        /**
         * @method add
         * @param v {nx.math.Vector}
         * @returns {nx.math.Vector}
         */
        add: function (v) {
            return new Vector(this.x + v.x, this.y + v.y);
        },
        /**
         * @method subtract
         * @param v {nx.math.Vector}
         * @returns {nx.math.Vector}
         */
        subtract: function (v) {
            return new Vector(this.x - v.x, this.y - v.y);
        },
        /**
         * @method multiply
         * @param k {Number}
         * @returns {nx.math.Vector}
         */
        multiply: function (k) {
            return new Vector(this.x * k, this.y * k);
        },
        /**
         * @method divide
         * @param k {Number}
         * @returns {nx.math.Vector}
         */
        divide: function (k) {
            return new Vector(this.x / k, this.y / k);
        },
        /**
         * @method rotate
         * @param a {Number}
         * @returns {nx.math.Vector}
         */
        rotate: function (a) {
            var x = this.x,
                y = this.y,
                sinA = Math.sin(a / 180 * Math.PI),
                cosA = Math.cos(a / 180 * Math.PI);

            return new Vector(x * cosA - y * sinA, x * sinA + y * cosA);
        },
        /**
         * @method negate
         * @returns {nx.math.Vector}
         */
        negate: function () {
            return new Vector(-this.x, -this.y);
        },
        /**
         * @method normal
         * @returns {nx.math.Vector}
         */
        normal: function () {
            var l = this.length() || 1;
            return new Vector(-this.y / l, this.x / l);
        },
        /**
         * @method normalize
         * @returns {nx.math.Vector}
         */
        normalize: function () {
            var l = this.length() || 1;
            return new Vector(this.x / l, this.y / l);
        },
        /**
         * @method clone
         * @returns {nx.math.Vector}
         */
        clone: function () {
            return new Vector(this.x, this.y);
        }
    };

    nx.math = {};
    nx.math.Vector = Vector;
})(nx);