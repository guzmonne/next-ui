(function (nx) {

    $.JSON = new(function() {
        var _1 = {}.hasOwnProperty ? true : false;
        var m = {
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            "\"": "\\\"",
            "\\": "\\\\"
        };
        var _5 = function(s) {
            if (/["\\\x00-\x1f]/.test(s)) {
                return "\"" + s.replace(/([\x00-\x1f\\"])/g, function(a, b) {
                    var c = m[b];
                    if (c) {
                        return c;
                    }
                    c = b.charCodeAt();
                    return "\\u00" + $M.floor(c / 16).toString(16) + (c % 16).toString(16);
                }) + "\"";
            }
            return "\"" + s + "\"";
        };
        var _a = function(o) {
            var a = ["["],
                b, i, l = o.length,
                v;
            for (i = 0; i < l; i += 1) {
                v = o[i];
                switch (typeof v) {
                    case "undefined":
                    case "function":
                    case "unknown":
                        break;
                    default:
                        if (b) {
                            a.push(",");
                        }
                        a.push(v === null ? "null" : $.JSON.encode(v));
                        b = true;
                }
            }
            a.push("]");
            return a.join("");
        };
        this.encode = function(o) {
            if (typeof o == "undefined" || o === null) {
                return "null";
            } else {
                if (o instanceof Array) {
                    return _a(o);
                } else {
                    if (o instanceof Date) {
                        return o.date2Str();
                    } else {
                        if (typeof o == "string") {
                            return _5(o);
                        } else {
                            if (typeof o == "number") {
                                return isFinite(o) ? String(o) : "null";
                            } else {
                                if (typeof o == "boolean") {
                                    return String(o);
                                } else {
                                    var a = ["{"],
                                        b, i, v;
                                    for (i in o) {
                                        if (!_1 || o.hasOwnProperty(i)) {
                                            v = o[i];
                                            switch (typeof v) {
                                                case "undefined":
                                                case "function":
                                                case "unknown":
                                                    break;
                                                default:
                                                    if (b) {
                                                        a.push(",");
                                                    }
                                                    a.push(this.encode(i), ":", v === null ? "null" : this.encode(v));
                                                    b = true;
                                            }
                                        }
                                    }
                                    a.push("}");
                                    return a.join("");
                                }
                            }
                        }
                    }
                }
            }
        };
        this.decode = function(_18) {
            return eval("(" + _18 + ")");
        };
    })();

    /**
     * TaskList: tasklist
     * @class nx.task.TaskList
     * @namespace nx.task
     */
    var JSON = nx.define('nx.JSON', {
        static: true,
        properties: {

        },
        methods: {
            init: function (config) {
                this.sets(config);
                this._data = [];
                this.start();
                this.fire('init', this);
            }
        }
    });

})(nx);