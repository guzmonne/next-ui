(function (nx, global) {

    nx.define("nx.util", {
        static: true,
        methods: {
            without: function (arrray, item) {
                var index;
                while ((index = arrray.indexOf(item)) != -1) {
                    arrray.splice(index, 1);
                }
                return arrray;
            },
            find: function (arrray, iterator, context) {
                var result;
                arrray.some(function (value, index, list) {
                    if (iterator.call(context || this, value, index, list)) {
                        result = value;
                        return true;
                    }
                });
                return result;
            },
            uniq: function (array, iterator, context) {
                var initial = iterator ? array.map(array, iterator.bind(context || this)) : array;
                var results = [];
                nx.each(initial, function (value, index) {
                    if (results.indexOf(value) == -1) {
                        results.push(array[index]);
                    }
                });
                return results;
            },
            indexOf: function (array, item) {
                return array.indexOf(item);
            },
            setProperty: function (source, key, value, owner) {
                var propValue;
                var rpatt = /(?={)\{([^{}]+?)\}(?!})/;
                if (value !== undefined) {
                    var model = source.model();
                    if (nx.is(value, 'String') && rpatt.test(value)) {
                        var expr = RegExp.$1;
                        if (expr[0] === '#') {
                            source.setBinding(key, 'owner.' + expr.slice(1), owner);
                        } else {
                            source.setBinding(key, 'owner.model.' + expr, owner);
                        }
                    } else if (nx.is(value, 'String')) {
                        var path = value.split('.');
                        if (path.length == 2 && path[0] == 'model') {
                            source.setBinding(key, value, source);
                        } else {
                            source.set(key, value);
                        }
                    } else {
                        source.set(key, value);
                    }
                }
            },
            loadScript: function (url, callback) {
                var script = document.createElement("script");
                script.type = "text/javascript";

                if (script.readyState) {  //IE
                    script.onreadystatechange = function () {
                        if (script.readyState == "loaded" ||
                            script.readyState == "complete") {
                            script.onreadystatechange = null;
                            callback();
                        }
                    };
                } else {  //Others
                    script.onload = function () {
                        callback();
                    };
                }
                script.src = url;
                document.getElementsByTagName("head")[0].appendChild(script);
            },
            parseURL: function (url) {
                var a = document.createElement('a');
                a.href = url;
                return {
                    source: url,
                    protocol: a.protocol.replace(':', ''),
                    host: a.hostname,
                    port: a.port,
                    query: a.search,
                    params: (function () {
                        var ret = {},
                            seg = a.search.replace(/^\?/, '').split('&'),
                            len = seg.length, i = 0, s;
                        for (; i < len; i++) {
                            if (!seg[i]) {
                                continue;
                            }
                            s = seg[i].split('=');
                            ret[s[0]] = s[1];
                        }
                        return ret;
                    })(),
                    file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
                    hash: a.hash.replace('#', ''),
                    path: a.pathname.replace(/^([^\/])/, '/$1'),
                    relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
                    segments: a.pathname.replace(/^\//, '').split('/')
                };
            },
            query: (function () {
                var i, internal = {
                    publics: {
                        select: function (array, selector) {
                            var rslt = [];
                            if ($.isArray(array) && $.isFunction(selector)) {
                                var i, item;
                                for (i = 0; i < array.length; i++) {
                                    item = array[i];
                                    if (selector(item)) {
                                        rslt.push(item);
                                    }
                                }
                            }
                            return rslt;
                        },
                        group: function (array, grouper) {
                            var map;
                            if ($.isFunction(grouper)) {
                                map = {};
                                var i, id, group;
                                for (i = 0; i < array.length; i++) {
                                    id = grouper(array[i]);
                                    if (!id || typeof id !== "string") {
                                        continue;
                                    }
                                    group = map[id] = map[id] || [];
                                    group.push(array[i]);
                                }
                            } else {
                                map = array;
                            }
                            return map;
                        },
                        aggregate: function (array, aggregater) {
                            var rslt = null, key;
                            if ($.isFunction(aggregater)) {
                                if ($.isArray(array)) {
                                    rslt = aggregater(array);
                                } else {
                                    rslt = [];
                                    for (key in array) {
                                        rslt.push(aggregater(array[key], key));
                                    }
                                }
                            }
                            return rslt;
                        }
                    },
                    privates: {
                        aggregate: function (array, args) {
                            var rslt, grouper = null, aggregater = null;
                            // get original identfier and aggregater
                            if ($.isArray(args)) {
                                if (typeof args[args.length - 1] === "function") {
                                    aggregater = args.pop();
                                }
                                grouper = (args.length > 1 ? args : args[0]);
                            } else {
                                grouper = args.map;
                                aggregater = args.aggregate;
                            }
                            // translate grouper into function if possible
                            if (typeof grouper === "string") {
                                grouper = grouper.replace(/\s/g, "").split(",");
                            }
                            if ($.isArray(grouper) && grouper[0] && typeof grouper[0] === "string") {
                                grouper = (function (keys) {
                                    return function (obj) {
                                        var i, o = {};
                                        for (i = 0; i < keys.length; i++) {
                                            o[keys[i]] = obj[keys[i]];
                                        }
                                        return JSON.stringify(o);
                                    };
                                })(grouper);
                            }
                            // do map aggregate
                            rslt = internal.publics.aggregate(internal.publics.group(array, grouper), aggregater);
                            return rslt;
                        },
                        mapping: function (array, mapper) {
                            var i, rslt;
                            if (mapper === true) {
                                rslt = EXPORT.clone(array);
                            } else if ($.isFunction(mapper)) {
                                if ($.isArray(array)) {
                                    rslt = [];
                                    for (i = 0; i < array.length; i++) {
                                        rslt.push(mapper(array[i], i));
                                    }
                                } else {
                                    rslt = mapper(array, 0);
                                }
                            } else {
                                if ($.isArray(array)) {
                                    rslt = array.slice();
                                } else {
                                    rslt = array;
                                }
                            }
                            return rslt;
                        },
                        orderby: function (array, comparer) {
                            if (typeof comparer === "string") {
                                comparer = comparer.replace(/^\s*(.*)$/, "$1").replace(/\s*$/, "").replace(/\s*,\s*/g, ",").split(",");
                            }
                            if ($.isArray(comparer) && comparer[0] && typeof comparer[0] === "string") {
                                comparer = (function (keys) {
                                    return function (o1, o2) {
                                        var i, key, desc;
                                        if (!o1 && !o2) {
                                            return 0;
                                        }
                                        for (i = 0; i < keys.length; i++) {
                                            key = keys[i];
                                            desc = /\sdesc$/.test(key);
                                            key = key.replace(/(\s+desc|\s+asc)$/, "");
                                            if (o1[key] > o2[key]) {
                                                return desc ? -1 : 1;
                                            } else if (o2[key] > o1[key]) {
                                                return desc ? 1 : -1;
                                            }
                                        }
                                        return 0;
                                    };
                                })(comparer);
                            }
                            if (comparer && typeof comparer === "function") {
                                array.sort(comparer);
                            }
                            return array;
                        }
                    },
                    query: function (array, options) {
                        /**
                         * @doctype MarkDown
                         * options:
                         * - options.array [any*]
                         *   - the target array
                         * - options.select: function(any){return boolean;}
                         *   - *optional*
                         *   - pre-filter of the array
                         * - options.aggregate: {grouper:grouper,aggregater:aggregater} or [proplist, aggregater] or [prop, prop, ..., aggregater]
                         *   - *optional*
                         *   - proplist: "prop,prop,..."
                         *   - prop: property name on array items
                         *   - grouper: map an array item into a string key
                         *   - aggregater: function(mapped){return aggregated}
                         * - options.mapping: function(item){return newitem}
                         *   - *optional*
                         * - options.orderby: proplist or [prop, prop, ...]
                         *   - *optional*
                         */
                        if (arguments.length == 1) {
                            options = array;
                            array = options.array;
                        }
                        if (!array) {
                            return array;
                        }
                        if (options.select) {
                            array = internal.publics.select(array, options.select);
                        }
                        if (options.aggregate) {
                            array = internal.privates.aggregate(array, options.aggregate);
                        }
                        if (options.mapping) {
                            array = internal.privates.mapping(array, options.mapping);
                        }
                        if (options.orderby) {
                            array = internal.privates.orderby(array, options.orderby);
                        }
                        return array;
                    }
                };
                for (i in internal.publics) {
                    internal.query[i] = internal.publics[i];
                }
                return internal.query;
            })()
        }
    });


})(nx, nx.global);