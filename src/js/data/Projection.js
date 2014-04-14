(function (nx, util, global) {
    /**
     * Utility class for Projection
     * @class nx.data.Projection
     * @module nx.data
     */

    nx.define("nx.data.Projection", {
        properties: {
            /**
             * Get/set a input range
             * @property input {Array}
             * @default [0, 0]
             */
            input: {
                set: function (range) {
                    if (nx.is(range, 'Array')) {
                        this._input = range;
                    } else {
                        this._input = [0, parseInt(range, 10)];
                    }
                    this.rate("force");
                },
                get: function () {
                    return this._input || [0, 0];
                }
            },
            /**
             * Get/set a output range
             * @property output {Array}
             * @default [0, 0]
             */
            output: {
                set: function (range) {
                    if (nx.is(range, 'Array')) {
                        this._output = range;
                    } else {
                        this._output = [0, parseInt(range, 10)];
                    }
                    this.rate("force");
                },
                get: function () {
                    return this._output || [0, 0];
                }
            },
            /**
             * get a in/out rate
             * @property rate
             */
            rate: {
                set: function (value) {
                    var input = this.input();
                    var output = this.output();
                    if (input && output) {
                        this._rate = (input[1] - input[0]) / (output[1] - output[0]);
                    }
                },
                get: function () {
                    return this._rate;
                }
            },
            converter: {
                value: function () {
                    return {
                        convert: function (value) {
                            return this.get(value);
                        },
                        convertBack: function (value) {
                            return this.invert(value);
                        }
                    };
                }
            }
        },
        methods: {
            /**
             * Get projectioned value
             * @param value {Number}
             * @returns {Number}
             * @method get
             */
            get: function (value) {



                var input = this.input();
                var output = this.output();
                var rate = this.rate();
                if (!input || !output) {
                    return value;
                }
                if (rate === 0) {
                    return (output[1] + output[0]) / 2;
                } else {
                    return ((value || 0) - input[0]) / rate + output[0];
                }

            },
            /**
             * Get a invert projectioned value
             * @param value {Number}
             * @returns {Number}
             * @method invert
             */
            invert: function (value) {
                var input = this.input();
                var output = this.output();
                var rate = this.rate();
                return ((value || 0) - output[0]) * rate + input[0];
            }
        }
    });


})(nx, nx.util, nx.global);