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
            }
        }
    });


})(nx, nx.global);