/**
 * @module nx
 */

var nx = {
    VERSION: '0.7.3',
    DEBUG: false,
    global: (function () {
        return this;
    }).call(null)
};


// prepare for cross browser
(function () {
    if (!Function.prototype.bind) {
        Function.prototype.bind = function (context) {
            var f = this;
            return function () {
                return f.apply(context, arguments);
            };
        };
    }
})();


(function (nx) {
    /**
     * @class nx
     * @static
     */


    var isArray = Array.isArray || function (target) {
        return target && target.constructor === Array;
    };
    var isPojo = function (obj) {
        var hasown = Object.prototype.hasOwnProperty;
        if (!obj || Object.prototype.toString(obj) !== "[object Object]" || obj.nodeType || obj === window) {
            return false;
        }
        try {
            // Not own constructor property must be Object
            if (obj.constructor && !hasown.call(obj, "constructor") && !hasown.call(obj.constructor.prototype, "isPrototypeOf")) {
                return false;
            }
        } catch (e) {
            // IE8,9 Will throw exceptions on certain host objects #9897
            return false;
        }
        var key;
        for (key in obj) {}
        return key === undefined || hasown.call(obj, key);
    };

    /**
     * Extend target with properties from sources.
     * @method extend
     * @param target {Object} The target object to be extended.
     * @param source* {Object} The source objects.
     * @returns {Object}
     */
    nx.extend = function (target) {
        for (var i = 1, length = arguments.length; i < length; i++) {
            var arg = arguments[i];
            for (var key in arg) {
                if (arg.hasOwnProperty(key)) {
                    target[key] = arg[key];
                }
            }
        }

        return target;
    };

    /**
     * Iterate over target and execute the callback with context.
     * @method each
     * @param target {Object|Array|Iterable} The target object to be iterate over.
     * @param callback {Function} The callback function to execute.
     * @param context {Object} The context object which act as 'this'.
     */
    nx.each = function (target, callback, context) {
        /* jshint -W014 */
        if (target && callback) {
            if (target.__each__) {
                target.__each__(callback, context);
            } else {
                // FIXME maybe some other array-like things missed here
                if (isArray(target) // normal Array
                    || Object.prototype.toString.call(target) === "[object Arguments]" // array-like: arguments
                    || nx.global.NodeList && target instanceof NodeList // array-like: NodeList
                    || nx.global.HTMLCollection && target instanceof HTMLCollection // array-like: HTMLCollection
                ) {
                    for (var i = 0, length = target.length; i < length; i++) {
                        if (callback.call(context, target[i], i) === false) {
                            break;
                        }
                    }
                } else {
                    for (var key in target) {
                        if (target.hasOwnProperty(key)) {
                            if (callback.call(context, target[key], key) === false) {
                                break;
                            }
                        }
                    }
                }
            }
        }
    };

    /**
     * Shallow clone target object.
     * @method clone
     * @param target {Object|Array} The target object to be cloned.
     * @returns {Object} The cloned object.
     */

    nx.clone = (function () {
        var deepclone = (function () {
            var get, put, top, keys, clone;
            get = function (map, key) {
                for (var i = 0; i < map.length; i++) {
                    if (map[i].key === key) {
                        return map[i].value;
                    }
                }
                return null;
            };
            put = function (map, key, value) {
                var i;
                for (i = 0; i < map.length; i++) {
                    if (map[i].key === key) {
                        map[i].value = value;
                        return;
                    }
                }
                map[i] = {
                    key: key,
                    value: value
                };
            };
            top = function (stack) {
                if (stack.length === 0) {
                    return null;
                }
                return stack[stack.length - 1];
            };
            keys = function (obj) {
                var keys = [];
                if (Object.prototype.toString.call(obj) == '[object Array]') {
                    for (var i = 0; i < obj.length; i++) {
                        keys.push(i);
                    }
                } else {
                    for (var key in obj) {
                        keys.push(key);
                    }
                }
                return keys;
            };
            clone = function (self) {
                // TODO clone DOM object
                if (window === self || document === self) {
                    // window and document cannot be clone
                    return null;
                }
                if (["null", "undefined", "number", "string", "boolean", "function"].indexOf(typeof self) >= 0) {
                    return self;
                }
                if (!isArray(self) && !isPojo(self)) {
                    return self;
                }
                var map = [],
                    stack = [],
                    origin = self,
                    dest = (isArray(self) ? [] : {});
                var stacktop, key, cached;
                // initialize the map and stack
                put(map, origin, dest);
                stack.push({
                    origin: origin,
                    dest: dest,
                    keys: keys(origin),
                    idx: 0
                });
                while (true) {
                    stacktop = top(stack);
                    if (!stacktop) {
                        // the whole object is cloned
                        break;
                    }
                    origin = stacktop.origin;
                    dest = stacktop.dest;
                    if (stacktop.keys.length <= stacktop.idx) {
                        // object on the stack top is cloned
                        stack.pop();
                        continue;
                    }
                    key = stacktop.keys[stacktop.idx++];
                    // clone an object
                    if (isArray(origin[key])) {
                        dest[key] = [];
                    } else if (isPojo(origin[key])) {
                        dest[key] = {};
                    } else {
                        dest[key] = origin[key];
                        continue;
                    }
                    // check if needn't deep into or cloned already
                    cached = get(map, origin[key]);
                    if (cached) {
                        dest[key] = cached;
                        continue;
                    }
                    // deep into the object
                    put(map, origin[key], dest[key]);
                    stack.push({
                        origin: origin[key],
                        dest: dest[key],
                        keys: keys(origin[key]),
                        idx: 0
                    });
                }
                return dest;
            };
            return clone;
        })();
        return function (target, cfg) {
            if (target) {
                if (target.__clone__) {
                    return target.__clone__(cfg);
                } else if (!cfg) {
                    if (nx.is(target, 'Array')) {
                        return target.slice(0);
                    } else {
                        var result = {};
                        for (var key in target) {
                            if (target.hasOwnProperty(key)) {
                                result[key] = target[key];
                            }
                        }

                        return result;
                    }
                } else {
                    // TODO more config options
                    return deepclone(target);
                }
            } else {
                return target;
            }
        };
    })();

    /**
     * Check whether target is specified type.
     * @method is
     * @param target {Object} The target object to be checked.
     * @param type {String|Function} The type could either be a string or a class object.
     * @returns {Boolean}
     */
    nx.is = function (target, type) {
        if (target && target.__is__) {
            return target.__is__(type);
        } else {
            switch (type) {
            case 'Undefined':
                return target === undefined;
            case 'Null':
                return target === null;
            case 'Object':
                return target && (typeof target === 'object');
            case 'String':
            case 'Boolean':
            case 'Number':
            case 'Function':
                return typeof target === type.toLowerCase();
            case 'Array':
                return isArray(target);
            case 'POJO':
                return isPojo(target);
            default:
                return target instanceof type;
            }
        }
    };

    /**
     * Get the specified property value of target.
     * @method get
     * @param target {Object} The target object.
     * @param name {String} The property name.
     * @returns {*} The value.
     */
    nx.get = function (target, name) {
        if (target) {
            if (target.__get__) {
                return target.__get__(name);
            } else {
                return target[name];
            }
        }
    };

    /**
     * Set the specified property of target with value.
     * @method set
     * @param target {Object} The target object.
     * @param name {String} The property name.
     * @param value {*} The value to be set.
     */
    nx.set = function (target, name, value) {
        if (target) {
            if (target.__set__) {
                target.__set__(name);
            } else {
                target[name] = value;
            }
        }
    };

    /**
     * Get all properties of target.
     * @method gets
     * @param target {Object} The target Object.
     * @returns {Object} An object contains all keys and values of target.
     */
    nx.gets = function (target) {
        if (target) {
            if (target.__gets__) {
                return target.__gets__();
            } else {
                var result = {};
                for (var key in target) {
                    if (target.hasOwnProperty(key)) {
                        result[key] = target[key];
                    }
                }
                return result;
            }
        }
    };

    /**
     * Set a bunch of properties for target.
     * @method sets
     * @param target {Object} The target object.
     * @param dict {Object} An object contains all keys and values to be set.
     */
    nx.sets = function (target, dict) {
        if (target && dict) {
            if (target.__sets__) {
                target.__sets__(dict);
            } else {
                for (var key in dict) {
                    if (dict.hasOwnProperty(key)) {
                        target[key] = dict[key];
                    }
                }
            }
        }
    };

    /**
     * Check whether target has specified property.
     * @method has
     * @param target {Object} The target object.
     * @param name {String} The property name.
     * @returns {Boolean}
     */
    nx.has = function (target, name) {
        if (target) {
            if (target.__has__) {
                return target.__has__(name);
            } else {
                return name in target;
            }
        } else {
            return false;
        }
    };

    /**
     * Compare target and source.
     * @method compare
     * @param target {Object} The target object.
     * @param source {Object} The source object.
     * @returns {Number} The result could be -1,0,1 which indicates the comparison result.
     */
    nx.compare = function (target, source) {
        if (target && target.__compare__) {
            return target.__compare__(source);
        } else {
            if (target === source) {
                return 0;
            } else if (target > source) {
                return 1;
            } else if (target < source) {
                return -1;
            }

            return 1;
        }
    };

    /**
     * Get value from target specified by a path and optionally set a value for it.
     * @method path
     * @param target {Object} The target object.
     * @param path {String} The path.
     * @param [value] {*} The value to be set.
     * @returns {*}
     */
    nx.path = function (target, path, value) {
        var result = target;
        if (path) {
            var tokens, token, length, i = 0;
            if (typeof path === "string") {
                tokens = path.split(".");
            } else if (isArray(path)) {
                tokens = path;
            } else {
                return target;
            }
            length = tokens.length;

            if (value === undefined) {
                for (; result && i < length; i++) {
                    token = tokens[i];
                    if (result.__get__) {
                        result = result.__get__(token);
                    } else {
                        result = result[token];
                    }
                }
            } else {
                length -= 1;
                for (; result && i < length; i++) {
                    token = tokens[i];
                    if (result.__get__) {
                        result = result.__get__(token);
                    } else {
                        result = result[token] = result[token] || {};
                    }
                }

                token = tokens[i];
                if (result) {
                    if (result.__set__) {
                        result.__set__(token, value);
                    } else {
                        result[token] = value;
                    }

                    result = value;
                }
            }
        }

        return result;
    };

    nx.idle = function () {};

    nx.identity = function (i) {
        return i;
    };

    nx.uuid = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }).toUpperCase();
    };


})(nx);
(function (nx) {

    var classId = 1,
        instanceId = 1,
        metaPrefix = '@',
        eventPrefix = 'on',
        classes = {},
        global = nx.global;

    /**
     * The base of any Classes defined in nx framework.
     * @class nx.Object
     * @constructor
     */
    function NXObject() {}

    var NXPrototype = NXObject.prototype = {
        constructor: NXObject,
        /**
         * Dispose current object.
         * @method dispose
         */
        dispose: function () {
            this.__listeners__ = {};
        },
        /**
         * Destroy current object.
         * @method destroy
         */
        destroy: function () {
            this.dispose();
        },
        /**
         * Call overridden method from super class
         * @method inherited
         */
        inherited: function () {
            var base = this.inherited.caller.__super__;
            if (base) {
                return base.apply(this, arguments);
            }
        },
        /**
         * Check whether current object is specified type.
         * @method is
         * @param type {String|Function}
         * @returns {Boolean}
         */
        is: function (type) {
            if (typeof type === 'string') {
                type = nx.path(global, type);
            }

            if (type) {
                if (this instanceof type) {
                    return true;
                } else {
                    var mixins = this.__mixins__;
                    for (var i = 0, len = mixins.length; i < len; i++) {
                        var mixin = mixins[i];
                        if (type === mixin) {
                            return true;
                        }
                    }
                }
            }

            return false;
        },
        /**
         * Check whether current object has specified property.
         * @method has
         * @param name {String}
         * @returns {Boolean}
         */
        has: function (name) {
            var member = this[name];
            return member && member.__type__ == 'property';
        },
        /**
         * Get specified property value.
         * @method get
         * @param name {String}
         * @returns {*}
         */
        get: function (name) {
            var member = this[name];
            if (member !== undefined) {
                if (member.__type__ == 'property') {
                    return member.call(this);
                } else {
                    return member;
                }
            }
        },
        /**
         * Set specified property value.
         * @method set
         * @param name {String}
         * @param value {*}
         */
        set: function (name, value) {
            var member = this[name];
            if (member !== undefined) {
                if (member.__type__ == 'property') {
                    return member.call(this, value);
                } else {
                    this[name] = value;
                }
            } else {
                this[name] = value;
            }
        },
        /**
         * Get all properties.
         * @method gets
         * @returns {Object}
         */
        gets: function () {
            var result = {};
            nx.each(this.__properties__, function (name) {
                result[name] = this.get(name);
            }, this);

            return result;
        },
        /**
         * Set a bunch of properties.
         * @method sets
         * @param dict {Object}
         */
        sets: function (dict) {
            if (dict) {
                for (var name in dict) {
                    if (dict.hasOwnProperty(name)) {
                        this.set(name, dict[name]);
                    }
                }
            }
        },
        /**
         * Check whether current object has specified event.
         * @method can
         * @param name {String}
         * @returns {Boolean}
         */
        can: function (name) {
            var member = this[eventPrefix + name];
            return member && member.__type__ == 'event';
        },
        /**
         * Add an event handler.
         * @method on
         * @param name {String}
         * @param handler {Function}
         * @param [context] {Object}
         */
        on: function (name, handler, context) {
            var map = this.__listeners__;
            var listeners = map[name] = map[name] || [{
                owner: null,
                handler: null,
                context: null
            }];
            var listener = {
                owner: this,
                handler: handler,
                context: context || this
            };

            listeners.push(listener);
            return {
                release: function () {
                    var idx = listeners.indexOf(listener);
                    if (idx >= 0) {
                        listeners.splice(idx, 1);
                    }
                }
            };
        },
        /**
         * Remove an event handler.
         * @method off
         * @param name {String}
         * @param [handler] {Function}
         * @param [context] {Object}
         */
        off: function (name, handler, context) {
            var listeners = this.__listeners__[name],
                listener;
            if (listeners) {
                if (handler) {
                    context = context || this;
                    for (var i = 0, length = listeners.length; i < length; i++) {
                        listener = listeners[i];
                        if (listener.handler == handler && listener.context == context) {
                            listeners.splice(i, 1);
                            break;
                        }
                    }
                } else {
                    listeners.length = 1;
                }
            }
        },
        /**
         * Add a single event handler.
         * @method upon
         * @param name {String}
         * @param handler {Function}
         * @param [context] {Object}
         */
        upon: function (name, handler, context) {
            var map = this.__listeners__;
            var listeners = map[name] = map[name] || [{
                owner: null,
                handler: null,
                context: null
            }];

            listeners[0] = {
                owner: this,
                handler: handler,
                context: context
            };
        },
        /**
         * Trigger an event.
         * @method fire
         * @param name {String}
         * @param [data] {*}
         */
        fire: function (name, data) {
            var i, length, listener, result, calling, existing = this.__listeners__[name];
            calling = existing ? existing.slice() : [];
            for (i = 0, length = calling.length; i < length; i++) {
                listener = calling[i];
                if (listener && listener.handler && (existing[i] === listener || existing.indexOf(listener) >= 0)) {
                    result = listener.handler.call(listener.context, listener.owner, data);
                    if (result === false) {
                        return false;
                    }
                }
            }
        },
        __is__: function (type) {
            return this.is(type);
        },
        __has__: function (name) {
            return this.has(name);
        },
        __get__: function (name) {
            return this.get(name);
        },
        __set__: function (name, value) {
            return this.set(name, value);
        },
        __gets__: function () {
            return this.gets();
        },
        __sets__: function (dict) {
            return this.sets(dict);
        }
    };

    NXObject.__classId__ = NXPrototype.__classId__ = 0;
    NXObject.__className__ = NXPrototype.__className__ = 'nx.Object';
    NXObject.__events__ = NXPrototype.__events__ = [];
    NXObject.__properties__ = NXPrototype.__properties__ = [];
    NXObject.__methods__ = NXPrototype.__methods__ = [];
    NXObject.__defaults__ = NXPrototype.__defaults__ = {};
    NXObject.__mixins__ = NXPrototype.__mixins__ = [];
    NXObject.extendEvent = extendEvent;
    NXObject.extendProperty = extendProperty;
    NXObject.extendMethod = extendMethod;

    /**
     * Define an event and attach to target.
     * @method extendEvent
     * @static
     * @param target {Object}
     * @param name {String}
     */
    function extendEvent(target, name) {
        var eventName = eventPrefix + name;
        var exist = target[eventName] && target[eventName].__type__ == 'event';
        var fn = target[eventName] = function (handler, context) {
            var map = this.__listeners__;
            var listeners = map[name] = map[name] || [{
                owner: null,
                handler: null,
                context: null
            }];

            listeners[0] = {
                owner: this,
                handler: handler,
                context: context
            };
        };

        fn.__name__ = name;
        fn.__type__ = 'event';

        if (!exist) {
            target.__events__.push(name);
        }

        return fn;
    }

    /**
     * Define a property and attach to target.
     * @method extendProperty
     * @static
     * @param target {Object}
     * @param name {String}
     * @param meta {Object}
     */
    function extendProperty(target, name, meta) {
        if (nx.is(meta, nx.keyword.internal.Keyword) || !nx.is(meta, "Object")) {
            meta = {
                value: meta
            };
        }
        var defaultValue;
        var exist = target[name] && target[name].__type__ == 'property';
        if (meta.dependencies) {
            if (nx.is(meta.dependencies, "String")) {
                meta.dependencies = meta.dependencies.replace(/\s/g, "").split(",");
            }
            defaultValue = nx.keyword.binding({
                source: meta.dependencies,
                async: true,
                callback: function () {
                    var owner = this.owner;
                    if (meta.update) {
                        meta.update.apply(owner, arguments);
                    }
                    if (nx.is(meta.value, "Function")) {
                        owner.set(name, meta.value.apply(owner, arguments));
                    } else if (!meta.update && !meta.value) {
                        owner.set(name, arguments[0]);
                    }
                }
            });
        } else {
            defaultValue = meta.value;
        }

        if (target[name] && meta.inherits) {
            meta = nx.extend({}, target[name].__meta__, meta);
        }

        var fn = function (value, params) {
            if (value === undefined && arguments.length === 0) {
                return fn.__getter__.call(this, params);
            } else {
                return fn.__setter__.call(this, value, params);
            }
        };

        fn.__name__ = name;
        fn.__type__ = 'property';
        fn.__meta__ = meta;
        fn.__getter__ = meta.get || function () {
            return this['_' + name];
        };

        fn.__setter__ = meta.set || function (value) {
            this['_' + name] = value;
        };

        fn.getMeta = function (key) {
            return key ? fn.__meta__[key] : fn.__meta__;
        };

        if (nx.is(target, "Function") && target.__properties__ && !target.__static__) {
            target.prototype[name] = fn;
        } else {
            target[name] = fn;
        }

        if (defaultValue !== undefined) {
            target.__defaults__[name] = defaultValue;
        }

        if (!exist) {
            if (!nx.is(target, "Function") && target.__properties__ === target.constructor.__properties) {
                target.__properties__ = target.__properties__.slice();
            }
            target.__properties__.push(name);
        }

        return fn;
    }

    /**
     * Define a method and attach to target.
     * @method extendMethod
     * @static
     * @param target {Object}
     * @param name {String}
     * @param method {Function}
     */
    function extendMethod(target, name, method) {
        var exist = target[name] && target[name].__type__ == 'method';

        if (target[name] && target[name] !== method) {
            method.__super__ = target[name];
        }

        method.__name__ = name;
        method.__type__ = 'method';
        method.__meta__ = {};

        target[name] = method;

        if (!exist) {
            target.__methods__.push(name);
        }
    }

    /**
     * Define a class
     * @method define
     * @param [type] {String}
     * @param [parent] {Function}
     * @param [members] {Object}
     * @returns {Function}
     */
    function define(type, parent, members) {
        if (!members) {
            if (nx.is(parent, 'Object')) {
                members = parent;
                parent = null;

                if (nx.is(type, 'Function')) {
                    parent = type;
                    type = null;
                }
            } else if (!parent) {
                if (nx.is(type, 'Object')) {
                    members = type;
                    type = null;
                } else if (nx.is(type, 'Function')) {
                    parent = type;
                    type = null;
                }
            }
        }

        members = members || {};

        var sup = parent || NXObject;
        var mixins = members.mixins || [];
        var events = members.events || [];
        var props = members.properties || {};
        var methods = members.methods || {};
        var static = members.static || false;
        var statics = members.statics || {};
        var prototype;
        var key, i, length;
        var Class, SuperClass;

        if (nx.is(mixins, 'Function')) {
            mixins = [mixins];
        }

        if (sup.__static__) {
            throw new Error('Static class cannot be inherited.');
        }

        if (static) {
            Class = function () {
                throw new Error('Cannot instantiate static class.');
            };

            Class.__classId__ = classId++;
            Class.__className__ = type ? type : 'Anonymous';
            Class.__static__ = true;
            Class.__events__ = [];
            Class.__properties__ = [];
            Class.__methods__ = [];
            Class.__defaults__ = {};

            for (i = 0, length = events.length; i < length; i++) {
                extendEvent(Class, events[i]);
            }

            for (key in props) {
                if (props.hasOwnProperty(key)) {
                    extendProperty(Class, key, props[key]);
                }
            }

            for (key in methods) {
                if (methods.hasOwnProperty(key)) {
                    extendMethod(Class, key, methods[key]);
                }
            }

            for (key in statics) {
                if (statics.hasOwnProperty(key)) {
                    Class[key] = statics[key];
                }
            }

            nx.each(Class.__defaults__, function (value, name) {
                if (nx.is(value, "Function")) {
                    this["_" + name] = value.call(this);
                } else if (nx.is(value, nx.keyword.internal.Keyword)) {
                    switch (value.type) {
                    case "binding":
                        // FIXME memory leak
                        value.apply(this, name);
                        break;
                    }
                } else {
                    this["_" + name] = value;
                }
            }, Class);

            if (methods.init) {
                methods.init.call(Class);
            }
        } else {
            Class = function () {
                // get the real arguments
                var args = arguments[0];
                if (Object.prototype.toString.call(args) !== "[object Arguments]") {
                    args = arguments;
                }

                var mixins = this.__mixins__;
                this.__id__ = instanceId++;
                this.__listeners__ = {};
                this.__bindings__ = this.__bindings__ || {};
                this.__watchers__ = this.__watchers__ || {};
                this.__keyword_bindings__ = this.__keyword_bindings__ || [];
                this.__keyword_watchers__ = this.__keyword_watchers__ || {};
                this.__keyword_init__ = this.__keyword_init__ || [];

                this.__initializing__ = true;

                for (var i = 0, length = mixins.length; i < length; i++) {
                    var ctor = mixins[i].__ctor__;
                    if (ctor) {
                        ctor.call(this);
                    }
                }

                nx.each(Class.__defaults__, function (value, name) {
                    if (nx.is(value, "Function")) {
                        this["_" + name] = value.call(this);
                    } else if (nx.is(value, nx.keyword.internal.Keyword)) {
                        // FIXME memory leak
                        // FIXME bind order
                        this.__keyword_bindings__.push({
                            name: name,
                            definition: value
                        });
                    } else {
                        this["_" + name] = value;
                    }
                }, this);

                nx.each(Class.__properties__, function (name) {
                    var prop = this[name];
                    if (!prop || prop.__type__ !== "property") {
                        return;
                    }
                    var meta = prop.__meta__,
                        watcher = meta.watcher,
                        init = meta.init;
                    if (watcher && this.watch) {
                        if (nx.is(watcher, "String")) {
                            watcher = this[watcher];
                        }
                        this.watch(name, watcher.bind(this));
                        this.__keyword_watchers__[name] = watcher;
                    }
                    if (init) {
                        this.__keyword_init__.push(init);
                    }
                }, this);

                nx.each(this.__keyword_bindings__, function (binding) {
                    binding.instance = binding.definition.apply(this, binding.name);
                }, this);

                nx.each(this.__keyword_init__, function (init) {
                    init.apply(this, args);
                }, this);

                if (this.__ctor__) {
                    this.__ctor__.apply(this, args);
                }

                nx.each(this.__keyword_watchers__, function (watcher, name) {
                    watcher.call(this, name, this[name].call(this));
                }, this);

                nx.each(this.__keyword_bindings__, function (binding) {
                    binding.instance.notify();
                }, this);

                this.__initializing__ = false;
            };

            SuperClass = function () {};

            SuperClass.prototype = sup.prototype;
            prototype = new SuperClass();
            prototype.constructor = Class;
            prototype.__events__ = sup.__events__.slice(0);
            prototype.__properties__ = sup.__properties__.slice(0);
            prototype.__methods__ = sup.__methods__.slice(0);
            prototype.__defaults__ = nx.clone(sup.__defaults__);
            prototype.__mixins__ = sup.__mixins__.concat(mixins);

            Class.__classId__ = classId++;
            Class.__className__ = prototype.__className__ = type ? type : 'Anonymous';
            Class.__super__ = prototype.__super__ = sup;
            Class.prototype = prototype;

            if (methods.init) {
                prototype.__ctor__ = methods.init;
            }

            for (key in members) {
                if (members.hasOwnProperty(key)) {
                    prototype[metaPrefix + key] = Class[metaPrefix + key] = members[key];
                }
            }

            nx.each(mixins, function (mixin) {
                var mixinPrototype = mixin.prototype;

                nx.each(mixin.__events__, function (name) {
                    extendEvent(prototype, name);
                });

                nx.each(mixin.__properties__, function (name) {
                    extendProperty(prototype, name, mixinPrototype[name].__meta__);
                });

                nx.each(mixin.__methods__, function (name) {
                    if (name !== 'init' && name !== 'dispose') {
                        extendMethod(prototype, name, mixinPrototype[name]);
                    }
                });
            });

            for (i = 0, length = events.length; i < length; i++) {
                extendEvent(prototype, events[i]);
            }

            for (key in props) {
                if (props.hasOwnProperty(key)) {
                    extendProperty(prototype, key, props[key]);
                }
            }

            for (key in methods) {
                if (methods.hasOwnProperty(key)) {
                    extendMethod(prototype, key, methods[key]);
                }
            }

            for (key in statics) {
                if (statics.hasOwnProperty(key)) {
                    Class[key] = statics[key];
                }
            }

            Class.__ctor__ = prototype.__ctor__;
            Class.__events__ = prototype.__events__;
            Class.__properties__ = prototype.__properties__;
            Class.__methods__ = prototype.__methods__;
            Class.__defaults__ = prototype.__defaults__;
            Class.__mixins__ = prototype.__mixins__;
        }

        if (type) {
            nx.path(global, type, Class);
        }

        classes[Class.__classId__] = Class;
        return Class;
    }

    nx.Object = NXObject;
    nx.define = define;
    nx.classes = classes;

})(nx);
(function (nx) {
    var keyword = nx.keyword = nx.keyword || {
        binding: function (source, callback, async) {
            var context = false;
            if (typeof source !== "string") {
                context = !! source.context;
                callback = source.callback;
                async = source.async;
                source = source.source;
            }
            return new nx.keyword.internal.Keyword({
                type: "binding",
                context: context,
                source: source,
                async: async,
                callback: callback
            });
        },
        internal: {
            idle: function () {},
            watch: (function () {
                var single = function (o, path, listener, context) {
                    var keys = path.split(".");

                    function level(parent, idx) {
                        if (parent && idx < keys.length) {
                            var key = keys[idx];
                            // watch on the collection changes
                            if (key == "*" || key == "%") {
                                // TODO handler watching on collection changes
                            } else {
                                var child = nx.path(parent, key);
                                if (parent.watch) {
                                    var pathRest = keys.slice(idx + 1).join("."),
                                        childUnwatch = level(child, idx + 1);
                                    var watcher = function (pname, pnewvalue, poldvalue) {
                                        var newvalue = pathRest ? nx.path(pnewvalue, pathRest) : pnewvalue;
                                        var oldvalue = pathRest ? nx.path(poldvalue, pathRest) : poldvalue;
                                        listener.call(context || o, path, newvalue, oldvalue);
                                        if (pnewvalue !== child) {
                                            childUnwatch();
                                            child = pnewvalue;
                                            childUnwatch = level(child, idx + 1);
                                        }
                                    };
                                    parent.watch(key, watcher, parent);
                                    return function () {
                                        childUnwatch();
                                        parent.unwatch(key, watcher, parent);
                                    };
                                } else if (child) {
                                    return level(child, idx + 1);
                                }
                            }
                        }
                        return keyword.internal.idle;
                    }
                    var unwatch = level(o, 0);
                    return {
                        unwatch: unwatch,
                        notify: function () {
                            var value = nx.path(o, path);
                            listener.call(context || o, path, value, value);
                        }
                    };
                };

                var singleWithCollection = function (o, path, listener, context) {
                    var collman = {
                        collection: null,
                        unlistener: null,
                        listener: function (collection, evt) {
                            listener.call(context || o, path, collection, evt);
                        },
                        update: function (value) {
                            if (collman.collection === value) {
                                return;
                            }
                            /* jslint -W030 */
                            collman.unlistener && collman.unlistener();
                            if (value && value.is && value.is(nx.data.ObservableCollection)) {
                                value.on("change", collman.listener, o);
                                collman.unlistener = function () {
                                    value.off("change", collman.listener, o);
                                };
                            } else {
                                collman.unlistener = null;
                            }
                            collman.collection = value;
                        }
                    };
                    collman.update(nx.path(o, path));
                    var unwatcher = single(o, path, function (path, value) {
                        collman.update(value);
                        listener.call(context || o, path, value);
                    }, context);
                    return {
                        unwatch: function () {
                            unwatcher.unwatch();
                            /* jslint -W030 */
                            collman.unlistener && collman.unlistener();
                        },
                        notify: unwatcher.notify
                    };
                };

                return function (target, paths, update) {
                    if (!target || !paths || !update) {
                        return;
                    }
                    // apply the watching
                    var deps;
                    if (nx.is(paths, "String")) {
                        deps = paths.replace(/\s/g, "").split(",");
                    } else {
                        deps = paths;
                    }
                    nx.each(deps, function (v, i) {
                        if (/^\d+$/.test(v)) {
                            deps[i] = v * 1;
                        }
                    });
                    var unwatchers = [],
                        vals = [];
                    var notify = function (key, diff) {
                        var values = vals.slice();
                        values.push(key);
                        /* jslint -W030 */
                        diff && values.push(diff);
                        update.apply(target, values);
                    };
                    for (i = 0; i < deps.length; i++) {
                        /* jslint -W083 */
                        (function (idx) {
                            vals[idx] = nx.path(target, deps[idx]);
                            var unwatcher = singleWithCollection(target, deps[idx], function (path, value, diff) {
                                vals[idx] = value;
                                notify(deps[idx], diff);
                            });
                            unwatchers.push(unwatcher);
                        })(i);
                    }
                    return {
                        notify: notify,
                        release: function () {
                            while (unwatchers.length) {
                                unwatchers.shift().unwatch();
                            }
                        }
                    };
                };
            })(),
            Keyword: (function () {
                var Keyword = function (options) {
                    nx.sets(this, options);
                };
                Keyword.prototype = {
                    apply: function (o, pname) {
                        var binding = {
                            owner: o,
                            property: pname,
                            set: o && pname && function (v) {
                                o.set(pname, v);
                                return o.get(pname);
                            }
                        };
                        var watching = nx.keyword.internal.watch(o, this.source, function () {
                            var rslt;
                            if (this.callback) {
                                rslt = this.callback.apply(this.context ? binding.owner : binding, arguments);
                            } else {
                                rslt = arguments[0];
                            }
                            if (!this.async) {
                                binding.set(rslt);
                            }
                        }.bind(this));
                        return watching;
                    }
                };
                return Keyword;
            })()
        }
    };
})(nx);
(function (nx) {

    /**
     * @class Comparable
     * @namespace nx
     */
    var Comparable = nx.define('nx.Comparable', {
        methods: {
            /**
             * Compare with the source.
             * @method compare
             * @param source
             * @returns {Number}
             */
            compare: function (source) {
                if (this === source) {
                    return 0;
                }
                else if (this > source) {
                    return 1;
                }
                else if (this < source) {
                    return -1;
                }

                return 1;
            },
            __compare__: function (source) {
                return this.compare(source);
            }
        }
    });
})(nx);(function (nx) {

    /**
     * @class Iterable
     * @namespace nx
     */
    var Iterable = nx.define('nx.Iterable', {
        statics: {
            /**
             * Get the iteration function from an iterable object.
             * @method getIterator
             * @static
             * @param iter {Object|Array|nx.Iterable}
             * @returns {Function}
             */
            getIterator: function (iter) {
                if (nx.is(iter, Iterable)) {
                    return function (callback, context) {
                        iter.each(callback, context);
                    };
                }
                else {
                    return function (callback, context) {
                        nx.each(iter, callback, context);
                    };
                }
            },
            /**
             * Convert the iterable object to an array.
             * @method toArray
             * @static
             * @param iter {Object|Array|nx.Iterable}
             * @returns {Array}
             */
            toArray: function (iter) {
                if (nx.is(iter, Iterable)) {
                    return iter.toArray();
                }
                else if (nx.is(iter, 'Array')) {
                    return iter.slice(0);
                }
                else {
                    var result = [];
                    nx.each(iter, function (item) {
                        result.push(item);
                    });

                    return result;
                }
            }
        },
        properties: {
            /**
             * @property count {Number}
             */
            count: {
                get: function () {
                    return this.toArray().length;
                }
            }
        },
        methods: {
            /**
             * @method each
             * @param callback
             * @param context
             */
            each: function (callback, context) {
                throw new Error('Not Implemented.');
            },
            /**
             * @method toArray
             * @returns {Array}
             */
            toArray: function () {
                var result = [];
                this.each(function (item) {
                    result.push(item);
                });

                return result;
            },
            __each__: function (callback, context) {
                return this.each(callback, context);
            }
        }
    });
})(nx);(function (nx) {
    /**
     * @class Observable
     * @namespace nx
     */
    var Observable = nx.define('nx.Observable', {
        statics: {
            extendProperty: function extendProperty(target, name, meta) {
                var property = nx.Object.extendProperty(target, name, meta);
                if (property && property.__type__ == 'property') {
                    if (!property._watched) {
                        var setter = property.__setter__;
                        var dependencies = property.getMeta('dependencies');
                        nx.each(dependencies, function (dep) {
                            this.watch(dep, function () {
                                this.notify(name);
                            }, this);
                        }, this);

                        property.__setter__ = function (value, params) {
                            var oldValue = this.get(name);
                            if (oldValue !== value) {
                                if (setter.call(this, value, params) !== false) {
                                    return this.notify(name, oldValue);
                                }
                            }

                            return false;
                        };

                        property._watched = true;
                    }
                }

                return property;
            },
            /**
             * This method in order to watch the change of specified path of specified target.
             * @static
             * @method watch
             * @param target The target observable object.
             * @param path The path to be watched.
             * @param callback The callback function accepting arguments list: (path, newvalue, oldvalue).
             * @param context (Optional) The context which the callback will be called with.
             * @return Resource stub object, with release and affect methods.
             *  <p>release: unwatch the current watching.</p>
             *  <p>affect: invoke the callback with current value immediately.</p>
             */
            watch: function (target, path, callback, context) {
                var keys = (typeof path === "string" ? path.split(".") : path);
                var iterate = function (parent, idx) {
                    if (parent && idx < keys.length) {
                        var key = keys[idx];
                        var child = nx.path(parent, key);
                        if (parent.watch) {
                            var rkeys = keys.slice(idx + 1);
                            var iter = iterate(child, idx + 1);
                            var watch = parent.watch(key, function (pname, pnewvalue, poldvalue) {
                                var newvalue = nx.path(pnewvalue, rkeys);
                                var oldvalue = nx.path(poldvalue, rkeys);
                                callback.call(context || target, path, newvalue, oldvalue);
                                if (pnewvalue !== child) {
                                    iter && iter.release();
                                    child = pnewvalue;
                                    iter = iterate(child, idx + 1);
                                }
                            });
                            return {
                                release: function () {
                                    iter && iter.release();
                                    watch.release();
                                }
                            };
                        } else if (child) {
                            return iterate(child, idx + 1);
                        }
                    }
                    return {
                        release: nx.idle
                    };
                };
                var iter = iterate(target, 0);
                return {
                    release: iter.release,
                    affect: function () {
                        var value = nx.path(target, path);
                        callback.call(context || target, path, value, value);
                    }
                };
            },
            /**
             * Monitor several paths of target at the same time, any value change of any path will trigger the callback with all values of all paths.
             * @static
             * @method monitor
             * @param target The target observable object.
             * @param pathlist The path list to be watched.
             * @param callback The callback function accepting arguments list: (value1, value2, value3, ..., changed_path, changed_old_value).
             * @return Resource stub object, with release and affect methods.
             *  <p>release: release the current monitoring.</p>
             *  <p>affect: invoke the callback with current values immediately.</p>
             */
            monitor: function (target, pathlist, callback) {
                if (!target || !pathlist || !callback) {
                    return;
                }
                // apply the cascading
                var i, paths, resources, values;
                paths = typeof pathlist === "string" ? pathlist.replace(/\s/g, "").split(",") : pathlist;
                resources = [];
                values = [];
                var affect = function (path, oldvalue) {
                    var args = values.slice();
                    args.push(path, oldvalue);
                    callback.apply(target, args);
                };
                for (i = 0; i < paths.length; i++) {
                    (function (idx) {
                        values[idx] = nx.path(target, paths[idx]);
                        var resource = Observable.watch(target, paths[idx], function (path, value) {
                            var oldvalue = values[idx];
                            values[idx] = value;
                            affect(paths[idx], oldvalue);
                        });
                        resources.push(resource);
                    })(i);
                }
                return {
                    affect: affect,
                    release: function () {
                        while (resources.length) {
                            resources.shift().release();
                        }
                    }
                };
            }
        },
        methods: {
            /**
             * @constructor
             */
            init: function () {
                this.__bindings__ = this.__bindings__ || {};
                this.__watchers__ = this.__watchers__ || {};
            },
            /**
             * Dispose current object.
             * @method dispose
             */
            dispose: function () {
                this.inherited();
                nx.each(this.__bindings__, function (binding) {
                    binding.dispose();
                });
                this.__bindings__ = {};
                this.__watchers__ = {};
            },
            /**
             * @method
             * @param names
             * @param handler
             * @param context
             */
            watch: function (names, handler, context) {
                var resources = [];
                nx.each(names == '*' ? this.__properties__ : (nx.is(names, 'Array') ? names : [names]), function (name) {
                    resources.push(this._watch(name, handler, context));
                }, this);
                return {
                    affect: function () {
                        nx.each(resources, function (resource) {
                            resource.affect();
                        });
                    },
                    release: function () {
                        nx.each(resources, function (resource) {
                            resource.release();
                        });
                    }
                };
            },
            /**
             * @method unwatch
             * @param names
             * @param handler
             * @param context
             */
            unwatch: function (names, handler, context) {
                nx.each(names == '*' ? this.__properties__ : (nx.is(names, 'Array') ? names : [names]), function (name) {
                    this._unwatch(name, handler, context);
                }, this);
            },
            /**
             * @method notify
             * @param names
             * @param oldValue
             */
            notify: function (names, oldValue) {
                if (names == '*') {
                    nx.each(this.__watchers__, function (value, name) {
                        this._notify(name, oldValue);
                    }, this);
                } else {
                    nx.each(nx.is(names, 'Array') ? names : [names], function (name) {
                        this._notify(name, oldValue);
                    }, this);
                }

            },
            /**
             * Get existing binding object for specified property.
             * @method getBinding
             * @param prop
             * @returns {*}
             */
            getBinding: function (prop) {
                return this.__bindings__[prop];
            },
            /**
             * Set binding for specified property.
             * @method setBinding
             * @param prop
             * @param expr
             * @param source
             */
            setBinding: function (prop, expr, source) {
                var binding = this.__bindings__[prop];
                var params = {};

                if (nx.is(expr, 'String')) {
                    var tokens = expr.split(',');
                    var path = tokens[0];
                    var i = 1,
                        length = tokens.length;

                    for (; i < length; i++) {
                        var pair = tokens[i].split('=');
                        params[pair[0]] = pair[1];
                    }

                    params.target = this;
                    params.targetPath = prop;
                    params.sourcePath = path;
                    params.source = source;
                    if (params.converter) {
                        params.converter = Binding.converters[params.converter] || nx.path(window, params.converter);
                    }

                } else {
                    params = nx.clone(expr);
                    params.target = this;
                    params.targetPath = prop;
                    params.source = params.source || this;
                }

                if (binding) {
                    binding.destroy();
                }

                this.__bindings__[prop] = new Binding(params);
            },
            /**
             * Clear binding for specified property.
             * @method clearBinding
             * @param prop
             */
            clearBinding: function (prop) {
                var binding = this.__bindings__[prop];
                if (binding) {
                    binding.destroy();
                    this.__bindings__[prop] = null;
                }
            },
            _watch: function (name, handler, context) {
                var map = this.__watchers__;
                var watchers = map[name] = map[name] || [];
                var property = this[name];
                var watcher = {
                    owner: this,
                    handler: handler,
                    context: context
                };

                watchers.push(watcher);

                if (property && property.__type__ == 'property') {
                    if (!property._watched) {
                        var setter = property.__setter__;
                        var dependencies = property.getMeta('dependencies');
                        var equalityCheck = property.getMeta('equalityCheck');
                        nx.each(dependencies, function (dep) {
                            this.watch(dep, function () {
                                this.notify(name);
                            }, this);
                        }, this);

                        property.__setter__ = function (value, params) {
                            var oldValue = this.get(name);
                            if (oldValue !== value || (params && params.force) || equalityCheck === false) {
                                if (setter.call(this, value, params) !== false) {
                                    return this.notify(name, oldValue);
                                }
                            }

                            return false;
                        };

                        property._watched = true;
                    }
                }
                return {
                    affect: function () {
                        var value = watcher.owner.get(name);
                        if (watcher && watcher.handler) {
                            watcher.handler.call(watcher.context || watcher.owner, name, value, value, watcher.owner);
                        }
                    },
                    release: function () {
                        var idx = watchers.indexOf(watcher);
                        if (idx >= 0) {
                            watchers.splice(idx, 1);
                        }
                    }
                };
            },
            _unwatch: function (name, handler, context) {
                var map = this.__watchers__;
                var watchers = map[name],
                    watcher;

                if (watchers) {
                    if (handler) {
                        for (var i = 0, length = watchers.length; i < length; i++) {
                            watcher = watchers[i];
                            if (watcher.handler == handler && watcher.context == context) {
                                watchers.splice(i, 1);
                                break;
                            }
                        }
                    } else {
                        watchers.length = 0;
                    }
                }
            },
            _notify: function (name, oldValue) {
                var i, watcher, calling, existing = this.__watchers__[name];
                calling = existing ? existing.slice() : [];
                for (i = 0; i < calling.length; i++) {
                    watcher = calling[i];
                    if (watcher && watcher.handler && (watcher === existing[i] || existing.indexOf(watcher) >= 0)) {
                        watcher.handler.call(watcher.context || watcher.owner, name, this.get(name), oldValue, watcher.owner);
                    }

                }
            }
        }
    });

    var Binding = nx.define('nx.Binding', Observable, {
        statics: {
            converters: {
                boolean: {
                    convert: function (value) {
                        return !!value;
                    },
                    convertBack: function (value) {
                        return !!value;
                    }
                },
                inverted: {
                    convert: function (value) {
                        return !value;
                    },
                    convertBack: function (value) {
                        return !value;
                    }
                },
                number: {
                    convert: function (value) {
                        return Number(value);
                    },
                    convertBack: function (value) {
                        return value;
                    }
                }
            },
            /**
             * @static
             */
            format: function (expr, target) {
                if (expr) {
                    return expr.replace('{0}', target);
                } else {
                    return '';
                }
            }
        },
        properties: {
            /**
             * Get the target object of current binding.
             */
            target: {
                value: null
            },
            /**
             * Get the target path of current binding.
             */
            targetPath: {
                value: ''
            },
            /**
             * Get the source path of current binding.
             */
            sourcePath: {
                value: ''
            },
            /**
             * Get or set the source of current binding.
             */
            source: {
                get: function () {
                    return this._source;
                },
                set: function (value) {
                    if (this._initialized && this._source !== value) {
                        this._rebind(0, value);
                        if (this._direction[0] == '<') {
                            this._updateTarget();
                        }
                        this._source = value;
                    }
                }
            },
            /**
             * Get or set the binding type.
             */
            bindingType: {
                value: 'auto'
            },
            /**
             * Get the direction for current binding.
             */
            direction: {
                value: 'auto'
            },
            /**
             * Get the trigger for current binding.
             */
            trigger: {
                value: 'auto'
            },
            /**
             * Get the format for current binding.
             */
            format: {
                value: 'auto'
            },
            /**
             * Get the converter for current binding.
             */
            converter: {
                value: 'auto'
            }
        },
        methods: {
            init: function (config) {
                this.sets(config);
                if (config.target) {
                    var target = this.target();
                    var targetPath = this.targetPath();
                    var sourcePath = this.sourcePath();
                    var bindingType = this.bindingType();
                    var direction = this.direction();
                    var format = this.format();
                    var converter = this.converter();
                    var targetMember = target[targetPath];
                    var watchers = this._watchers = [];
                    var keys = this._keys = sourcePath.split('.'),
                        key;
                    var i = 0,
                        length = keys.length;
                    var self = this;

                    if (targetMember) {
                        var bindingMeta = targetMember.__meta__.binding;

                        if (bindingType == 'auto') {
                            bindingType = targetMember.__type__;
                        }

                        if (direction == 'auto') {
                            direction = this._direction = (bindingMeta && bindingMeta.direction) || '<-';
                        }

                        if (format == 'auto') {
                            format = bindingMeta && bindingMeta.format;
                        }

                        if (converter == 'auto') {
                            converter = bindingMeta && bindingMeta.converter;
                        }
                    } else {
                        if (bindingType == 'auto') {
                            bindingType = target.can(targetPath) ? 'event' : 'property';
                        }

                        if (direction == 'auto') {
                            direction = this._direction = '<-';
                        }

                        if (format == 'auto') {
                            format = null;
                        }

                        if (converter == 'auto') {
                            converter = null;
                        }
                    }

                    if (converter) {
                        if (nx.is(converter, 'Function')) {
                            converter = {
                                convert: converter,
                                convertBack: function (value) {
                                    return value;
                                }
                            };
                        }
                    }

                    if (direction[0] == '<') {
                        for (; i < length; i++) {
                            watchers.push({
                                key: keys[i],
                                /*jshint -W083*/
                                handler: (function (index) {
                                    return function (property, value) {
                                        self._rebind(index, value);
                                        self._updateTarget();
                                    };
                                })(i + 1)
                            });
                        }
                    }

                    if (bindingType == 'event') {
                        key = watchers[length - 1].key;
                        watchers.length--;
                        this._updateTarget = function () {
                            var actualValue = this._actualValue;
                            if (actualValue) {
                                target.upon(targetPath, actualValue[key], actualValue);
                            }
                        };
                    } else {
                        this._updateTarget = function () {
                            var actualValue = this._actualValue;
                            if (converter) {
                                actualValue = converter.convert.call(this, actualValue);
                            }

                            if (format) {
                                actualValue = Binding.format(format, actualValue);
                            }

                            nx.path(target, targetPath, actualValue);
                        };
                    }

                    if (direction[1] == '>') {
                        if (target.watch && target.watch.__type__ === 'method') {
                            target.watch(targetPath, this._onTargetChanged = function (property, value) {
                                var actualValue = value;
                                if (converter) {
                                    actualValue = converter.convertBack.call(this, actualValue);
                                }
                                nx.path(this.source(), sourcePath, actualValue);
                            }, this);
                        }
                    }

                    this._initialized = true;
                    this.source(config.source);
                }
            },
            dispose: function () {
                var target = this._target;
                this._rebind(0, null);
            },
            _rebind: function (index, value) {
                var watchers = this._watchers;
                var newSource = value,
                    oldSource;

                for (var i = index, length = watchers.length; i < length; i++) {
                    var watcher = watchers[i];
                    var key = watcher.key;
                    var handler = watcher.handler;

                    oldSource = watcher.source;

                    if (oldSource && oldSource.unwatch && oldSource.unwatch.__type__ === 'method') {
                        oldSource.unwatch(key, handler, this);
                    }

                    watcher.source = newSource;

                    if (newSource) {
                        if (newSource.watch && newSource.watch.__type__ === 'method') {
                            newSource.watch(key, handler, this);
                        }

                        if (newSource.get) {
                            newSource = newSource.get(key);
                        } else {
                            newSource = newSource[key];
                        }
                    }
                }

                this._actualValue = newSource;
            }
        }
    });

})(nx);
(function (nx) {
    /**
     * @class Serializable
     * @namespace nx
     */
    var Serializable = nx.define('nx.Serializable', {
        methods: {
            /**
             * @method serialize
             * @returns {any}
             */
            serialize: function () {
                var result = {};
                nx.each(this.__properties__, function (name) {
                    var prop = this[name];
                    var value = prop.call(this);

                    if (prop.getMeta('serializable') !== false) {
                        if (nx.is(value, Serializable)) {
                            result[name] = value.serialize();
                        }
                        else {
                            result[name] = value;
                        }
                    }
                }, this);

                return result;
            }
        }
    });
})(nx);(function (nx) {

    /**
     * @class Counter
     * @namespace nx.data
     * @uses nx.Observable
     */
    var EXPORT = nx.define("nx.data.Counter", {
        events: [
            /**
             * An event which notifies the happening of a count change of item.
             * @event change
             * @param {Object} evt The event object with item, count, previousCount.
             */
            'change',
            /**
             * Same as change event but only happens on count increasing.
             * @event increase
             * @param {Object} evt The event object with item, count, previousCount.
             */
            'increase',
            /**
             * Same as change event but only happens on count decreasing.
             * @event decrease
             * @param {Object} evt The event object with item, count, previousCount.
             */
            'decrease'
        ],
        methods: {
            init: function () {
                this._nummap = {};
                this._strmap = {};
                this._objmap = [];
                this._nxomap = {};
                this._null = 0;
                this._true = 0;
                this._false = 0;
                this._undefined = 0;
            },
            /**
             * Get count of specified item.
             *
             * @method getCount
             * @param {Any} item The counting item.
             * @return Count of the item.
             */
            getCount: function (item) {
                // XXX PhantomJS bug
                if (Object.prototype.toString.call(null) !== "[object Null]") {
                    if (item === null) {
                        return this._null;
                    } else if (item === undefined) {
                        return this._undefined;
                    }
                }
                // check the type
                switch (Object.prototype.toString.call(item)) {
                case "[object Null]":
                    return this._null;
                case "[object Boolean]":
                    return item ? this._true : this._false;
                case "[object Undefined]":
                    return this._undefined;
                case "[object Number]":
                    return this._nummap[item] || 0;
                case "[object String]":
                    return this._strmap[item] || 0;
                default:
                    if (item.__id__) {
                        return this._nxomap[item.__id__] || 0;
                    } else {
                        return EXPORT.getArrayMapValue(this._objmap, item) || 0;
                    }
                }
            },
            /**
             * Set count of specified item.
             *
             * @method setCount
             * @param {Any} item The counting item.
             * @param {Number} count The count to be set.
             * @return Set result count.
             */
            setCount: function (item, count) {
                // XXX PhantomJS bug
                if (Object.prototype.toString.call(null) !== "[object Null]") {
                    if (item === null) {
                        this._null = count;
                    } else if (item === undefined) {
                        this._undefined = count;
                    }
                }
                // XXX optimizable for obj-map
                var previousCount = this.getCount(item);
                // check if change happening
                if (previousCount === count) {
                    return count;
                }
                // change count
                switch (Object.prototype.toString.call(item)) {
                case "[object Null]":
                    this._null = count;
                    break;
                case "[object Boolean]":
                    if (item) {
                        this._true = count;
                    } else {
                        this._false = count;
                    }
                    break;
                case "[object Undefined]":
                    this._undefined = count;
                    break;
                case "[object Number]":
                    this._nummap[item] = count;
                    break;
                case "[object String]":
                    this._strmap[item] = count;
                    break;
                default:
                    if (item.__id__) {
                        this._nxomap[item.__id__] = count;
                    } else {
                        EXPORT.setArrayMapValue(this._objmap, item, count);
                    }
                    break;
                }
                // trigger events
                var event = {
                    item: item,
                    previousCount: previousCount,
                    count: count
                };
                if (previousCount > count) {
                    this.fire('decrease', event);
                } else {
                    this.fire('increase', event);
                }
                this.fire('change', event);
                return count;
            },
            /**
             * Increase the count of given item.
             *
             * @method increase
             * @param {Any} item The item to count.
             * @param {Number} increment The increment, default 1.
             * @return The increasing result
             */
            increase: function (inItem, i) {
                i = arguments.length > 1 ? Math.floor(i * 1 || 0) : 1;
                return this.setCount(inItem, this.getCount(inItem) + i);
            },
            /**
             * Decrease the count of given item.
             *
             * @method decrease
             * @param {Any} item The item to count.
             * @param {Number} decrement The decrement, default 1.
             * @return The decreasing result
             */
            decrease: function (inItem, i) {
                i = arguments.length > 1 ? Math.floor(i * 1 || 0) : 1;
                return this.setCount(inItem, this.getCount(inItem) - i);
            },
            __addArrayItem: function (inItem) {
                this._arrcache.push(inItem);
            },
            __removeArrayItem: function (inItem) {
                var index = this._arrcache.indexOf(inItem);
                this._arrcache.splice(index, 1);
            },
            __getArrayCounter: function (inItem) {
                var counter = 0;
                nx.each(this._arrcache, function (item) {
                    if (inItem === item) {
                        counter++;
                    }
                });
                return counter;
            }
        },
        statics: {
            _getArrayMapItem: function (map, key) {
                return map.filter(function (item) {
                    return item.key === key;
                })[0];
            },
            getArrayMapValue: function (map, key) {
                return (EXPORT._getArrayMapItem(map, key) || {}).value;
            },
            setArrayMapValue: function (map, key, value) {
                var item = EXPORT._getArrayMapItem(map, key);
                if (!item) {
                    map.push({
                        key: key,
                        value: value
                    });
                } else {
                    item.value = value;
                }
                return value;
            }
        }
    });

})(nx);
(function (nx) {
    var Iterable = nx.Iterable;

    /**
     * @class Collection
     * @namespace nx.data
     * @extends nx.Iterable
     * @constructor
     * @param iter
     */
    var Collection = nx.define('nx.data.Collection', Iterable, {
        properties: {
            /**
             * @property count
             * @type {Number}
             */
            count: {
                get: function () {
                    return this._data.length;
                },
                set: function () {
                    throw new Error("Unable to set count of Collection");
                }
            },
            /**
             * @property length
             * @type {Number}
             */
            length: {
                get: function () {
                    return this._data.length;
                },
                set: function () {
                    throw new Error("Unable to set length of Collection");
                }
            },
            unique: {
                set: function (unique) {
                    // check if the unique status is change
                    /* jshint -W018 */
                    if ( !! this._unique === !! unique) {
                        return;
                    }
                    this._unique = !! unique;
                    if (unique) {
                        // remove duplicated items
                        var data = this._data;
                        var i, len = data.length;
                        for (i = len - 1; i > 0; i--) {
                            if (this.indexOf(data[i]) < i) {
                                this.removeAt(i);
                            }
                        }
                    }
                }
            }
        },
        methods: {
            init: function (iter) {
                var data = this._data = [];
                if (nx.is(iter, Iterable)) {
                    this._data = iter.toArray();
                } else {
                    Iterable.getIterator(iter)(function (item) {
                        data.push(item);
                    });
                }
            },
            /**
             * Add an item.
             *
             * @method add
             * @param item
             * @return added item. Null if fail to add, e.g. duplicated add into unique collection.
             */
            add: function (item) {
                if (!this._unique || this.indexOf(item) == -1) {
                    this._data.push(item);
                    return item;
                }
                return null;
            },
            /**
             * Add multiple items. Will avoid duplicated items for unique collection.
             *
             * @method addRange
             * @param iter
             * @returns array of added items.
             */
            addRange: function (iter) {
                var data = this._data;
                var i, items = Iterable.toArray(iter).slice();
                // check for unique
                if (this._unique) {
                    for (i = items.length - 1; i >= 0; i--) {
                        if (this.indexOf(items[i]) >= 0 || items.indexOf(items[i]) < i) {
                            items.splice(i, 1);
                        }
                    }
                }
                data.splice.apply(data, [data.length, 0].concat(items));
                return items;
            },
            /**
             * @method remove
             * @param item
             * @returns Removed item's index, -1 if not found.
             */
            remove: function (item) {
                var self = this;
                var remove = function (item) {
                    var index = self.indexOf(item);
                    if (index >= 0) {
                        self._data.splice(index, 1);
                        return index;
                    } else {
                        return -1;
                    }
                };
                if (arguments.length > 1) {
                    var i, indices = [];
                    for (i = arguments.length - 1; i >= 0; i--) {
                        indices.unshift(remove(arguments[i]));
                    }
                    return indices;
                } else {
                    return remove(item);
                }
            },
            /**
             * @method removeAt
             * @param index
             * @returns Removed item.
             */
            removeAt: function (index) {
                return this._data.splice(index, 1)[0];
            },
            /**
             * @method insert
             * @param item
             * @param index
             */
            insert: function (item, index) {
                if (!this._unique || this.indexOf(item) == -1) {
                    this._data.splice(index, 0, item);
                    return item;
                }
                return null;
            },
            /**
             * @method insertRange
             * @param index
             * @param iter
             * @returns {*}
             */
            insertRange: function (iter, index) {
                var data = this._data;
                var i, items = Iterable.toArray(iter).slice();
                // check for unique
                if (this._unique) {
                    for (i = items.length - 1; i >= 0; i--) {
                        if (this.indexOf(items[i]) >= 0 || items.indexOf(items[i]) < i) {
                            items.splice(i, 1);
                        }
                    }
                }
                data.splice.apply(data, [index, 0].concat(items));
                return items;
            },
            /**
             * @method clear
             * @returns {*}
             */
            clear: function () {
                var items = this._data.slice();
                this._data.length = 0;
                return items;
            },
            /**
             * @method getItem
             * @param index
             * @returns {*}
             */
            getItem: function (index) {
                return this._data[index];
            },
            /**
             * @method getRange
             * @param index
             * @param count
             * @returns {Collection}
             */
            getRange: function (index, count) {
                return new Collection(this._data.slice(index, index + count));
            },
            /**
             * Get the first index the given item appears in the collection, -1 if not found.
             *
             * @method indexOf
             * @param item
             * @returns {*}
             */
            indexOf: function (item) {
                var data = this._data;
                if (data.indexOf) {
                    return data.indexOf(item);
                } else {
                    for (var i = 0, length = data.length; i < length; i++) {
                        if (nx.compare(data[i], item) === 0) {
                            return i;
                        }
                    }
                    return -1;
                }
            },
            /**
             * @method lastIndexOf
             * @param item
             * @returns {*}
             */
            lastIndexOf: function (item) {
                var data = this._data;
                if (data.lastIndexOf) {
                    return data.lastIndexOf(item);
                } else {
                    for (var i = data.length - 1; i >= 0; i--) {
                        if (nx.compare(data[i], item) === 0) {
                            return i;
                        }
                    }

                    return -1;
                }
            },
            /**
             * @method contains
             * @param item
             * @returns {boolean}
             */
            contains: function (item) {
                return this.indexOf(item) >= 0;
            },
            /**
             * Toggle item's existence.
             * @method toggle
             * @param item
             */
            toggle: function (item, existence) {
                if (arguments.length <= 1) {
                    if (this.contains(item)) {
                        this.remove(item);
                    } else {
                        this.add(item);
                    }
                } else if (existence) {
                    this.add(item);
                } else {
                    this.remove(item);
                }
            },
            /**
             * @method sort
             * @param comp
             * @returns {Array}
             */
            sort: function (comp) {
                return this._data.sort(comp);
            },
            /**
             * @method each
             * @param callback
             * @param context
             */
            each: function (callback, context) {
                nx.each(this._data, callback, context);
            },
            /**
             * @method  toArray
             * @returns {Array}
             */
            toArray: function () {
                return this._data.slice(0);
            }
        }
    });
})(nx);
(function (nx) {
    var Iterable = nx.Iterable;

    var DictionaryItem = nx.define({
        properties: {
            key: {},
            value: {
                set: function (value) {
                    if (this._dict) {
                        this._dict.setItem(this._key, value);
                    } else {
                        this._value = value;
                    }
                }
            }
        },
        methods: {
            init: function (dict, key) {
                this._dict = dict;
                this._key = key;
            }
        }
    });

    var KeyIterator = nx.define(Iterable, {
        methods: {
            init: function (dict) {
                this._dict = dict;
            },
            each: function (callback, context) {
                this._dict.each(function (item) {
                    callback.call(context, item.key());
                });
            }
        }
    });

    var ValueIterator = nx.define(Iterable, {
        methods: {
            init: function (dict) {
                this._dict = dict;
            },
            each: function (callback, context) {
                this._dict.each(function (item) {
                    callback.call(context, item.value());
                });
            }
        }
    });

    /**
     * @class Dictionary
     * @namespace nx.data
     * @extends nx.Iterable
     * @constructor
     * @param dict
     */
    var Dictionary = nx.define('nx.data.Dictionary', Iterable, {
        properties: {
            /**
             * @property count
             * @type {Number}
             */
            count: {
                get: function () {
                    return this._items.length;
                }
            },
            /**
             * @property keys
             * @type {Iterable}
             */
            keys: {
                get: function () {
                    return this._keys;
                }
            },
            /**
             * @property values
             * @type {Iterable}
             */
            values: {
                get: function () {
                    return this._values;
                }
            }
        },
        methods: {
            init: function (dict) {
                var map = this._map = {};
                var items = this._items = [];
                this.setItems(dict);
                this._keys = new KeyIterator(this);
                this._values = new ValueIterator(this);
            },
            /**
             * @method contains
             * @param key {String}
             * @returns {Boolean}
             */
            contains: function (key) {
                return key in this._map;
            },
            /**
             * @method getItem
             * @param key {String}
             * @returns {*}
             */
            getItem: function (key) {
                var item = this._map[key];
                return item && item._value;
            },
            /**
             * @method setItem
             * @param key {String}
             * @param value {any}
             */
            setItem: function (key, value) {
                var item = this._map[key];
                if (!item) {
                    item = this._map[key] = new DictionaryItem(this, '' + key);
                    this._items.push(item);
                }
                item._value = value;
                return item;
            },
            /**
             * @method setItems
             * @param dict {Dictionary|Object}
             */
            setItems: function (dict) {
                if (dict) {
                    nx.each(dict, function (value, key) {
                        this.setItem(key, value);
                    }, this);
                }
            },
            /**
             * @method removeItem
             * @param key {String}
             */
            removeItem: function (key) {
                var map = this._map;
                if (!(key in map)) {
                    return;
                }
                var item = map[key];
                var idx = this._items.indexOf(item);
                delete map[key];
                if (idx >= 0) {
                    this._items.splice(idx, 1);
                }
                item._dict = null;
                return item;
            },
            /**
             * @method clear
             */
            clear: function () {
                var items = this._items.slice();
                this._map = {};
                this._items = [];
                nx.each(items, function (item) {
                    item._dict = null;
                });
                return items;
            },
            /**
             * @method each
             * @param callback {Function}
             * @param [context] {Object}
             */
            each: function (callback, context) {
                context = context || this;
                nx.each(this._map, function (item, key) {
                    callback.call(context, item, key);
                });
            },
            /**
             * @method toArray
             * @returns {Array}
             */
            toArray: function () {
                return this._items.slice();
            },
            /**
             * @method toObject
             * @returns {Object}
             */
            toObject: function () {
                var result = {};
                this.each(function (item) {
                    result[item.key()] = item.value();
                });
                return result;
            }
        }
    });
})(nx);
(function (nx) {

    /**
     * @class ObservableObject
     * @namespace nx.data
     * @extends nx.Observable
     */
    nx.define('nx.data.ObservableObject', nx.Observable, {
        methods: {
            init: function (data) {
                this.inherited();
                this._data = data || {};
            },
            /**
             * Dispose current object.
             * @method dispose
             */
            dispose: function () {
                this.inherited();
                this._data = null;
            },
            /**
             * Check whether current object has specified property.
             * @method has
             * @param name {String}
             * @returns {Boolean}
             */
            has: function (name) {
                var member = this[name];
                return (member && member.__type__ == 'property') || (name in this._data);
            },
            /**
             * Get specified property value.
             * @method get
             * @param name {String}
             * @returns {*}
             */
            get: function (name) {
                var member = this[name];
                if (member === undefined) {
                    return this._data[name];
                }
                else if (member.__type__ == 'property') {
                    return member.call(this);
                }
            },
            /**
             * Set specified property value.
             * @method set
             * @param name {String}
             * @param value {*}
             */
            set: function (name, value) {
                var member = this[name];
                if (member === undefined) {
                    if (this._data[name] !== value) {
                        this._data[name] = value;
                        this.notify(name);
                        return true;
                    }
                }
                else if (member.__type__ == 'property') {
                    return member.call(this, value);
                }
            },
            /**
             * Get all properties.
             * @method gets
             * @returns {Object}
             */
            gets: function () {
                var result = nx.clone(this._data);
                nx.each(this.__properties__, function (name) {
                    result[name] = this.get(name);
                }, this);

                return result;
            }
        }
    });
})(nx);(function (nx) {

    var REGEXP_CHECK = /^(&&|\|\||&|\||\^|-|\(|\)|[a-zA-Z\_][a-zA-Z\d\_]*|\s)*$/;
    var REGEXP_TOKENS = /&&|\|\||&|\||\^|-|\(|\)|[a-zA-Z\_][a-zA-Z\d\_]*/g;
    var REGEXP_OPN = /[a-zA-Z\_][a-zA-Z\d\_]*/;
    var REGEXP_OPR = /&&|\|\||&|\||\^|-|\(|\)/;
    var OPERATORNAMES = {
        "-": "complement",
        "&": "cross",
        "^": "delta",
        "|": "union",
        "&&": "and",
        "||": "or"
    };

    /**
     * @class ObservableCollection
     * @namespace nx.data
     * @extends nx.data.Collection
     * @uses nx.Observable
     */
    var EXPORT = nx.define('nx.data.ObservableCollection', nx.data.Collection, {
        mixins: nx.Observable,
        events: ['change'],
        methods: {
            /**
             * Add an item.
             * @method add
             * @param item
             */
            add: function (item) {
                item = this.inherited(item);
                if (!this._unique || item !== null) {
                    this.notify('count');
                    this.notify('length');
                    this.fire('change', {
                        action: 'add',
                        items: [item]
                    });
                }
                return item;
            },
            /**
             * @method addRange
             * @param iter
             */
            addRange: function (iter) {
                var items = this.inherited(iter);
                if (items.length) {
                    this.notify('count');
                    this.notify('length');
                    this.fire('change', {
                        action: 'add',
                        items: items
                    });
                }
                return items;
            },
            /**
             * @method insert
             * @param item
             * @param index
             */
            insert: function (item, index) {
                item = this.inherited(item, index);
                if (!this._unique || item !== null) {
                    this.notify('count');
                    this.notify('length');
                    this.fire('change', {
                        action: 'add',
                        items: [item],
                        index: index
                    });
                }
                return item;
            },
            /**
             * @method insertRange
             * @param iter
             * @param index
             */
            insertRange: function (iter, index) {
                var items = this.inherited(iter, index);
                if (items.length) {
                    this.notify('count');
                    this.notify('length');
                    this.fire('change', {
                        action: 'add',
                        items: items,
                        index: index
                    });
                }
                return items;
            },
            /**
             * @method remove
             * @param item
             */
            remove: function (item) {
                var result;
                if (arguments.length > 1) {
                    item = Array.prototype.slice.call(arguments);
                    result = this.inherited.apply(this, item);
                    if (result.length) {
                        this.notify('count');
                        this.notify('length');
                        this.fire('change', {
                            action: 'remove',
                            items: item,
                            indices: result
                        });
                    }
                    return result;
                }
                result = this.inherited(item);
                if (result >= 0) {
                    this.notify('count');
                    this.notify('length');
                    this.fire('change', {
                        action: 'remove',
                        items: [item],
                        index: result,
                        indices: [result]
                    });
                }
                return result;
            },
            /**
             * @method removeAt
             * @param index
             */
            removeAt: function (index) {
                var result = this.inherited(index);
                if (result !== undefined) {
                    this.notify('count');
                    this.notify('length');
                    this.fire('change', {
                        action: 'remove',
                        items: [result],
                        index: index
                    });
                }
                return result;
            },
            /**
             * @method clear
             */
            clear: function () {
                var result = this.inherited();
                this.notify('count');
                this.notify('length');
                this.fire('change', {
                    action: 'clear',
                    items: result
                });
            },
            /**
             * @method sort
             * @param comp
             */
            sort: function (comp) {
                var result = this.inherited(comp);
                this.notify('count');
                this.notify('length');
                this.fire('change', {
                    action: 'sort',
                    comparator: comp || function (a, b) {
                        if (a > b) {
                            return 1;
                        } else if (a < b) {
                            return -1;
                        } else {
                            return 0;
                        }
                    }
                });
                return result;
            },
            /**
             * Apply a diff watcher, which handles each item in the collection, to the collection.
             *
             * @method monitor
             * @param handler lambda(item) returning a rollback method
             * @return unwatcher A Object with unwatch method.
             */
            monitor: function (handler) {
                var collection = this;
                // resource (aka. rollback-methods) manager
                var resmgr = {
                    // retains item-vs-rollback-method pairs
                    objcache: [],
                    // since NEXT objects have identified ID, map is used more often
                    idcache: {},
                    // find pair index of indicated item in obj-cache
                    findPair: function (item) {
                        var i;
                        for (i = 0; i < resmgr.objcache.length; i++) {
                            if (item === resmgr.objcache[i][0]) {
                                return i;
                            }
                        }
                        return -1;
                    },
                    // get the rollback method of given item
                    get: function (item) {
                        if (item.__id__) {
                            return resmgr.idcache[item.__id__];
                        } else {
                            var pair = resmgr.objcache[resmgr.findPair(item)];
                            return pair && pair[1];
                        }
                    },
                    // set or remove(with null value) rollback method, will call the old rollback method if exists
                    set: function (item, res) {
                        if (item.__id__) {
                            if (resmgr.idcache[item.__id__]) {
                                resmgr.idcache[item.__id__].call(collection);
                            }
                            if (res) {
                                resmgr.idcache[item.__id__] = res;
                            } else {
                                delete resmgr.idcache[item.__id__];
                            }
                        } else {
                            var pairidx = resmgr.findPair(item);
                            var pair = resmgr.objcache[pairidx];
                            if (pair) {
                                if (pair[1] === res) {
                                    return;
                                }
                                pair[1].call(collection);
                                if (!res) {
                                    resmgr.objcache.splice(pairidx, 1);
                                } else {
                                    pair[1] = res;
                                }
                            } else if (res) {
                                pair = [item, res];
                                resmgr.objcache.push(pair);
                            }
                        }
                    },
                    // call all rollback methods
                    release: function () {
                        nx.each(resmgr.idcache, function (res, key) {
                            res();
                        });
                        nx.each(resmgr.objcache, function (pair) {
                            pair[1]();
                        });
                    }
                };
                // watch the further change of the collection
                var listener = collection.on("change", function (sender, evt) {
                    switch (evt.action) {
                    case "add":
                        nx.each(evt.items, function (item) {
                            var res = handler(item);
                            if (res) {
                                resmgr.set(item, res);
                            }
                        });
                        break;
                    case "remove":
                    case "clear":
                        nx.each(evt.items, function (item) {
                            resmgr.set(item, null);
                        });
                        break;
                    }
                });
                // and don't forget the existing items in the collection
                nx.each(collection, function (item) {
                    var res = handler(item);
                    if (res) {
                        resmgr.set(item, res);
                    }
                });
                // return unwatcher
                return {
                    release: function () {
                        resmgr.release();
                        listener.release();
                    }
                };
            },
            /**
             * Select a sub-collection from a source collection.
             * Usage:
             * <pre>
             * // select all items from collection with property active==true
             * resource = subCollection.select(collection, "active")
             * // select all items from collection with path owner.name=="Knly"
             * resource = subCollection.select(collection, "owner.name", function(name){
             *     return name==="Knly";
             * });
             * // select all string item from collection
             * resource = subCollection.select(collection, function(item){
             *     return typeof item === "string";
             * });
             * </pre>
             * 
             * @method select
             * @param {nx.data.ObservableCollection} source
             * @param {String} conditions
             * @param {Function} determinator
             * @return resource for release the binding
             */
            select: function (source, conditions, determinator) {
                if (!nx.is(source, EXPORT)) {
                    return null;
                }
                if (typeof conditions === "function") {
                    determinator = conditions;
                    conditions = null;
                }
                if (!determinator) {
                    determinator = nx.identity;
                }
                var self = this;
                this.clear();
                var resource = source.monitor(function (item) {
                    var resource;
                    if (conditions) {
                        if (nx.is(item, nx.Observable)) {
                            // monitor the specified conditions
                            resource = nx.Observable.monitor(item, conditions, function () {
                                self.toggle(item, determinator.apply(self, arguments));
                            });
                            resource.affect();
                        } else {
                            // determine the specified conditions if unable to monitor
                            self.toggle(item, determinator.call(self, nx.path(item, conditions)));
                        }
                    } else {
                        // no condition specified means determine item itself
                        self.toggle(item, determinator.call(self, item));
                    }
                    return function () {
                        resource && resource.release();
                        self.toggle(item, false);
                    };
                });
                return resource;
            },
            /**
             * Calculate and synchronize collection with a collection calculation.
             *
             * @method calculate
             * @param experssion
             * @param sources
             * @return resource for release the binding
             */
            calculate: function (expression, sources) {
                var calculation = new EXPORT.Calculation(sources);
                return calculation.calculate(this, expression);
            }
        },
        statics: {
            /**
             * Prepare a calculation provider for a map of collections.
             *
             * @class CollectionRelation
             * @namespace nxex.toolkit.collection
             * @constructor
             * @param map {Object/Map} A map indicates names of the collection for calculation.
             */
            Calculation: nx.define({
                properties: {
                    map: {
                        value: function () {
                            return new nx.data.ObservableDictionary();
                        }
                    }
                },
                methods: {
                    init: function (map) {
                        this.map().setItems(map);
                    },
                    /**
                     * Apply a inter-collection releation to a collection.
                     * Supported operators:<br/>
                     * <table>
                     * <tr><th>Operator</th><th>Calculation</th><th>Method</th></tr>
                     * <tr><td>&amp;</td><td>Sets cross</td><td>cross</td></tr>
                     * <tr><td>|</td><td>Sets union</td><td>union</td></tr>
                     * <tr><td>^</td><td>Sets symmetric difference</td><td>delta</td></tr>
                     * <tr><td>-</td><td>Sets complement</td><td>complement</td></tr>
                     * <tr><td>&amp;&amp;</td><td>Sets logical and</td><td>and</td></tr>
                     * <tr><td>||</td><td>Sets logical or</td><td>or</td></tr>
                     * </table>
                     * Tips:
                     * <ul>
                     * <li>Logical and means 'first empty collection or last collection'</li>
                     * <li>Logical or means 'first non-empty collection or last collection'</li>
                     * </ul>
                     *
                     * @method calculate
                     * @param target {Collection} The target collection.
                     * @param expression {String} The relation expression.
                     * @return An object with release method.
                     */
                    calculate: function (target, expression) {
                        // TODO more validation on the expression
                        if (!expression.match(REGEXP_CHECK)) {
                            throw new Error("Bad expression.");
                        }
                        var self = this;
                        var map = this.map();
                        var tokens = expression.match(REGEXP_TOKENS);
                        var requirements = tokens.filter(RegExp.prototype.test.bind(REGEXP_OPN));
                        var tree = EXPORT.buildExpressionTree(tokens);
                        // sync with the collection existence
                        var res, monitor;
                        var reqmgr = {
                            count: 0,
                            map: {},
                            sync: function () {
                                res && (res.release(), res = null);
                                if (reqmgr.count === requirements.length) {
                                    target.clear();
                                    if (typeof tree === "string") {
                                        // need not to calculate
                                        res = self.map().getItem(tree).monitor(EXPORT.getCollectionSyncMonitor(target));
                                    } else {
                                        res = self._calculate(target, tree);
                                    }
                                }
                            },
                            monitor: function (key, value) {
                                if (requirements.indexOf(key) >= 0) {
                                    /*
                                    if (map[key] && !value) {
                                        reqmgr.count--;
                                    } else if (!map[key] && value) {
                                        reqmgr.count++;
                                    }*/
                                    reqmgr.count += ((!reqmgr.map[key]) * 1 + (!!value) * 1 - 1);
                                    reqmgr.map[key] = value;
                                    reqmgr.sync();
                                }
                            }
                        };
                        monitor = map.monitor(reqmgr.monitor);
                        return {
                            release: function () {
                                res && res.release();
                                monitor.release();
                            }
                        };
                    },
                    _calculate: function (target, tree) {
                        var self = this;
                        var res, iterate, opr = tree[0];
                        // short-circuit for logical operatiors (&& and ||)
                        switch (opr) {
                        case "&&":
                            iterate = function (idx) {
                                var coll, calc, watch, itr;
                                if (typeof tree[idx] === "string") {
                                    coll = self.map().getItem(tree[idx]);
                                } else {
                                    coll = new nx.data.ObservableCollection();
                                    calc = self._calculate(coll, tree[idx]);
                                }
                                if (idx >= tree.length - 1) {
                                    watch = coll.monitor(function (item) {
                                        target.add(item);
                                        return function () {
                                            target.remove(item);
                                        };
                                    });
                                } else {
                                    watch = coll.watch("length", function (n, v) {
                                        if (v) {
                                            itr = iterate(idx + 1);
                                        } else if (itr) {
                                            itr.release();
                                            itr = null;
                                        }
                                    });
                                    watch.affect();
                                }
                                return {
                                    release: function () {
                                        itr && itr.release();
                                        watch && watch.release();
                                        calc && calc.release();
                                    }
                                };
                            };
                            res = iterate(1);
                            break;
                        case "||":
                            iterate = function (idx) {
                                var coll, calc, watch, itr;
                                if (typeof tree[idx] === "string") {
                                    coll = self.map().getItem(tree[idx]);
                                } else {
                                    coll = new nx.data.ObservableCollection();
                                    calc = self._calculate(coll, tree[idx]);
                                }
                                if (idx >= tree.length - 1) {
                                    watch = coll.monitor(EXPORT.getCollectionSyncMonitor(target));
                                } else {
                                    watch = coll.watch("length", function (n, v) {
                                        if (itr) {
                                            itr.release();
                                        }
                                        if (!v) {
                                            itr = iterate(idx + 1);
                                        } else {
                                            itr = coll.monitor(EXPORT.getCollectionSyncMonitor(target));
                                        }
                                    });
                                    watch.affect();
                                }
                                return {
                                    release: function () {
                                        itr && itr.release();
                                        watch && watch.release();
                                        calc && calc.release();
                                    }
                                };
                            };
                            res = iterate(1);
                            break;
                        default:
                            iterate = function () {
                                var i, coll, colls = [];
                                var calc, calcs = [];
                                for (i = 1; i < tree.length; i++) {
                                    if (typeof tree[i] === "string") {
                                        coll = self.map().getItem(tree[i]);
                                    } else {
                                        coll = new nx.data.ObservableCollection();
                                        calc = self._calculate(coll, tree[i]);
                                    }
                                    colls.push(coll);
                                    calcs.push(calc);
                                }
                                calc = EXPORT[OPERATORNAMES[opr]](target, colls);
                                return {
                                    release: function () {
                                        nx.each(calcs, function (calc) {
                                            calc && calc.release();
                                        });
                                        calc.release();
                                    }
                                };
                            };
                            res = iterate();
                            break;
                        }
                        return res;
                    }
                }
            }),
            /**
             * This util returns a monitor function of ObservableCollection, which is used to synchronize item existance between 2 collections.
             *
             * @method getCollectionSyncMonitor
             * @param collection The target collection to be synchronized.
             * @param sync
             *  <ul>
             *  <li>If true, make sure target collection will have all items as source collection has;</li>
             *  <li>If false, make sure target collection will not have any item as source collection has.</li>
             *  </ul>
             *  Default true.
             * @return {function&lt;item&gt;}
             *  The monitor function.
             */
            getCollectionSyncMonitor: function (coll, sync) {
                if (sync !== false) {
                    return function (item) {
                        coll.add(item);
                        return function () {
                            coll.remove(item);
                        };
                    };
                } else {
                    return function (item) {
                        coll.remove(item);
                        return function () {
                            coll.add(item);
                        };
                    };
                }
            },
            /**
             * Affect target to be the cross collection of sources collections.
             * Release object could stop the dependencies.
             *
             * @method cross
             * @param target {Collection}
             * @param sources {Array of Collection}
             * @return an object with release method
             * @static
             */
            cross: function (target, sources) {
                target.clear();
                var counter = new nx.data.Counter();
                var monitors = [];
                var increaseHandler = counter.on("increase", function (o, evt) {
                    if (evt.count == sources.length) {
                        target.add(evt.item);
                    }
                });
                var decreaseHandler = counter.on("decrease", function (o, evt) {
                    if (evt.count == sources.length - 1) {
                        target.remove(evt.item);
                    }
                });

                nx.each(sources, function (coll) {
                    var monitor = coll.monitor(function (item) {
                        counter.increase(item, 1);
                        return function () {
                            counter.decrease(item, 1);
                        };
                    });
                    monitors.push(monitor);
                });
                return {
                    release: function () {
                        increaseHandler.release();
                        decreaseHandler.release();
                        nx.each(monitors, function (monitor) {
                            monitor.release();
                        });
                    }
                };
            },
            /**
             * Affect target to be the union collection of sources collections.
             * Release object could stop the dependencies.
             *
             * @method union
             * @param target {Collection}
             * @param sources {Array of Collection}
             * @return an object with release method
             * @static
             */
            union: function (target, sources) {
                target.clear();
                var counter = new nx.data.Counter();
                var monitors = [];
                var increaseHandler = counter.on("increase", function (o, evt) {
                    if (evt.count === 1) {
                        target.add(evt.item);
                    }
                });
                var decreaseHandler = counter.on("decrease", function (o, evt) {
                    if (evt.count === 0) {
                        target.remove(evt.item);
                    }
                });

                nx.each(sources, function (coll) {
                    var monitor = coll.monitor(function (item) {
                        counter.increase(item, 1);
                        return function () {
                            counter.decrease(item, 1);
                        };
                    });
                    monitors.push(monitor);
                });
                return {
                    release: function () {
                        increaseHandler.release();
                        decreaseHandler.release();
                        nx.each(monitors, function (monitor) {
                            monitor.release();
                        });
                    }
                };
            },
            /**
             * Affect target to be the complement collection of sources collections.
             * Release object could stop the dependencies.
             *
             * @method complement
             * @param target {Collection}
             * @param sources {Array of Collection}
             * @return an object with release method
             * @static
             */
            complement: function (target, sources) {
                target.clear();
                var counter = new nx.data.Counter();
                var monitors = [];
                var length = sources.length;
                var changeHandler = counter.on("change", function (o, evt) {
                    var previous = evt.previousCount,
                        count = evt.count;
                    if (previous < length && count >= length) {
                        target.add(evt.item);
                    }
                    if (previous >= length && count < length) {
                        target.remove(evt.item);
                    }
                });
                var globalMonitor = sources[0].monitor(function (item) {
                    counter.increase(item, length);
                    return function () {
                        counter.decrease(item, length);
                    };
                });
                monitors.push(globalMonitor);
                nx.each(sources, function (coll, index) {
                    if (index > 0) {
                        var monitor = coll.monitor(function (item) {
                            counter.decrease(item);
                            return function () {
                                counter.increase(item);
                            };
                        });
                        monitors.push(monitor);
                    }
                });
                return {
                    release: function () {
                        changeHandler.release();
                        nx.each(monitors, function (monitor) {
                            monitor.release();
                        });
                    }
                };
            },
            /**
             * Affect target to be the symmetric difference collection of sources collections.
             * Release object could stop the dependencies.
             * The name 'delta' is the symbol of this calculation in mathematics.
             * @reference {http://en.wikipedia.org/wiki/Symmetric_difference}
             * @method delta
             * @param target {Collection}
             * @param sources {Array of Collection}
             * @return an object with release method
             * @static
             */
            delta: function (target, sources) {
                target.clear();
                var bound = true;
                var monitors = [];
                nx.each(sources, function (coll) {
                    var monitor = coll.monitor(function (item) {
                        target.toggle(item);
                        return function () {
                            if (bound) {
                                target.toggle(item);
                            }
                        };
                    });
                    monitors.push(monitor);
                });
                return {
                    release: function () {
                        bound = false;
                        nx.each(monitors, function (monitor) {
                            monitor.release();
                        });
                    }
                };
            },
            /**
             * Affect target to be the equivalent collection of the first non-empty collection.
             * Release object could stop the dependencies.
             *
             * @method or
             * @param target {Collection}
             * @param sources {Array of Collection}
             * @return an object with release method
             * @static
             */
            or: function (target, sources) {
                target.clear();
                var res, bound = true;
                var iterator = function (index) {
                    var watch, res, coll = sources[index];
                    watch = coll.watch('length', function (name, value) {
                        res && res.release();
                        if (index < sources.length - 1 && !value) {
                            res = iterator(index + 1);
                        } else {
                            res = coll.monitor(function (item) {
                                target.add(item);
                                return function () {
                                    if (bound) {
                                        target.remove(item);
                                    }
                                };
                            });
                        }
                    });
                    watch.affect();
                    return {
                        release: function () {
                            res && res.release();
                            watch && watch.release();
                        }
                    };
                };
                res = iterator(0);
                return {
                    release: function () {
                        bound = false;
                        res.release();
                    }
                };
            },
            /**
             * Affect target to be the equivalent collection of the first empty collection or the last collection.
             * Release object could stop the dependencies.
             *
             * @method and
             * @param target {Collection}
             * @param sources {Array of Collection}
             * @return an object with release method
             * @static
             */
            and: function (target, sources) {
                target.clear();
                var bound = true;
                var iterate = function (idx) {
                    var watcher, resource, coll = sources[idx];
                    if (idx === sources.length - 1) {
                        return coll.monitor(function (item) {
                            target.add(item);
                            return function () {
                                if (bound) {
                                    target.remove(item);
                                }
                            };
                        });
                    }
                    watcher = coll.watch("length", function (n, v) {
                        if (v) {
                            resource = iterate(idx + 1);
                        } else if (resource) {
                            resource.release();
                            resource = null;
                        }
                    });
                    watcher.affect();
                    return {
                        release: function () {
                            if (resource) {
                                resource.release();
                            }
                            watcher.release();
                        }
                    };
                };
                var resource = iterate(0);
                return {
                    release: function () {
                        bound = false;
                        resource.release();
                    }
                };
            },
            /**
             * Build a tree of expresson syntax with the expression tokens.
             * e.g. tokens ["A", "|", "B", "&", "(", "C", "&", "D", ")"], which was separated from expression "A | B & (C | D)",
             * will be separated into [|, A, [&, B, [|, C, D]]], because '&' has higher priority than '|',
             * and braced "C | D" has higher priority than &. <br/>
             * <br/>
             * Similar to the priorities in JavaScript:<br/>
             * <table>
             * <tr><th>operator</th><th>functionality</th></tr>
             * <tr><td>()</td><td>braces</td></tr>
             * <tr><td>-</td><td>complement</td></tr>
             * <tr><td>&</td><td>cross</td></tr>
             * <tr><td>^</td><td>symmetric difference</td></tr>
             * <tr><td>|</td><td>union</td></tr>
             * <tr><td>&&</td><td>and (the first empty collection or the last collection)</td></tr>
             * <tr><td>||</td><td>or (the first non-empty collection)</td></tr>
             * </table>
             *
             * @method buildExpressionTree
             * @param {Array of token} tokens
             * @return {Array tree} Parsed syntax tree of the expression tokens.
             * @static
             */
            buildExpressionTree: (function () {
                var PRIORITIES = [
                    ["-"],
                    ["&"],
                    ["^"],
                    ["|"],
                    ["&&"],
                    ["||"]
                ];
                var getPriority = function (opr) {
                    for (var i = 0; i < PRIORITIES.length; i++) {
                        if (PRIORITIES[i].indexOf(opr) >= 0) {
                            return i;
                        }
                    }
                };
                var buildExpressionNode = function (opr, opn1, opn2) {
                    if (Object.prototype.toString.call(opn1) === "[object Array]" && opn1[0] === opr) {
                        opn1.push(opn2);
                        return opn1;
                    }
                    return [opr, opn1, opn2];
                };
                return function (tokens) {
                    if (typeof tokens === "string") {
                        tokens = tokens.match(REGEXP_TOKENS);
                    }
                    tokens = tokens.concat([")"]);
                    var token, opr, oprstack = [];
                    var opn, opnstack = [];
                    var operands = [];
                    while (tokens.length) {
                        token = tokens.shift();
                        if (token === ")") {
                            while ((opr = oprstack.pop())) {
                                if (opr === "(") {
                                    break;
                                }
                                opn = opnstack.pop();
                                opnstack.push(buildExpressionNode(opr, opnstack.pop(), opn));
                            }
                        } else if (token === "(") {
                            oprstack.push(token);
                        } else if (token.match(REGEXP_OPN)) {
                            opnstack.push(token);
                            if (operands.indexOf(token) == -1) {
                                operands.push(token);
                            }
                        } else if (token.match(REGEXP_OPR)) {
                            while (oprstack.length) {
                                opr = oprstack.pop();
                                if (opr === "(" || getPriority(opr) > getPriority(token)) {
                                    oprstack.push(opr);
                                    break;
                                }
                                opn = opnstack.pop();
                                opnstack.push(buildExpressionNode(opr, opnstack.pop(), opn));
                            }
                            oprstack.push(token);
                        }
                    }
                    if (opnstack[0]) {
                        opnstack[0].operands = operands;
                    }
                    return opnstack[0];
                };
            })()
        }
    });
})(nx);
(function (nx) {

    var Observable = nx.Observable;
    var Dictionary = nx.data.Dictionary;

    var ObservableDictionaryItem = nx.define(Observable, {
        properties: {
            key: {},
            value: {
                set: function (value) {
                    if (this._dict) {
                        this._dict.setItem(this._key, value);
                    } else {
                        this._value = value;
                    }
                }
            }
        },
        methods: {
            init: function (dict, key) {
                this._dict = dict;
                this._key = key;
            }
        }
    });

    /**
     * @class ObservableDictionary
     * @namespace nx.data
     * @extends nx.data.Dictionary
     * @constructor
     * @param dict
     */
    nx.define('nx.data.ObservableDictionary', Dictionary, {
        mixins: Observable,
        events: ['change'],
        methods: {
            /**
             * @method setItem
             * @param key {String}
             * @param value {any}
             */
            setItem: function (key, value) {
                var map = this._map,
                    items = this._items;
                var item = map[key],
                    ov;
                if (item) {
                    ov = item.value;
                    item._value = value;
                    item.notify("value");
                    this.fire('change', {
                        action: 'replace',
                        items: [item],
                        oldValue: ov,
                        newValue: value,
                        // FIXME actually unnecessary
                        oldItem: item,
                        newItem: item
                    });
                } else {
                    item = map[key] = new ObservableDictionaryItem(this, key);
                    items.push(item);
                    item._dict = this;
                    item._value = value;
                    this.notify('count');
                    this.fire('change', {
                        action: 'add',
                        index: items.length - 1,
                        items: [item]
                    });
                }
            },
            /**
             * @method removeItem
             * @param key {String}
             */
            removeItem: function (key) {
                var map = this._map;
                if (!(key in map)) {
                    return;
                }
                var item = map[key];
                var idx = this._items.indexOf(item);
                delete map[key];
                if (idx >= 0) {
                    this._items.splice(idx, 1);
                }
                item._dict = null;
                this.notify('count');
                this.fire('change', {
                    action: 'remove',
                    items: [item]
                });
                return item;
            },
            /**
             * @method clear
             */
            clear: function () {
                var items = this.inherited();
                this.notify('count');
                this.fire('change', {
                    action: 'clear',
                    items: items
                });
            },
            /**
             * Apply a diff watcher, which handles each key-item-pair in the collection, to the dictionary.
             *
             * @method monitor
             * @param handler lambda(key, item) returning a rollback method
             * @return unwatcher A Object with unwatch method.
             */
            monitor: function (keys, callback) {
                // check parameter list
                if (typeof keys === "string" && keys.indexOf(",") >= 0 || Object.prototype.toString.call(keys) === "[object Array]") {
                    if (typeof keys === "string") {
                        keys = keys.replace(/\s/g, "").split(",");
                    }
                    return this._monitor(keys, callback);
                }
                if (typeof keys === "function") {
                    callback = keys;
                    keys = null;
                }
                var dict = this;
                var resmgr = {
                    map: {},
                    get: function (key) {
                        return resmgr.map[key];
                    },
                    set: function (key, res) {
                        if (keys && keys !== key) {
                            return;
                        }
                        var old = resmgr.get(key);
                        old && old();
                        if (res) {
                            resmgr.map[key] = res;
                        } else {
                            delete resmgr.map[key];
                        }
                    },
                    release: function () {
                        var key, map = resmgr.map;
                        for (key in map) {
                            map[key]();
                        }
                    },
                    callback: function (key, value) {
                        if (keys) {
                            if (keys === key) {
                                return callback(value);
                            }
                        } else {
                            return callback(key, value);
                        }
                    }
                };
                var listener = dict.on("change", function (target, evt) {
                    var i, item, key, res;
                    switch (evt.action) {
                    case "replace":
                    case "add":
                        for (i = 0; i < evt.items.length; i++) {
                            item = evt.items[i];
                            key = item.key();
                            res = resmgr.callback(key, item.value());
                            resmgr.set(key, res);
                        }
                        break;
                    case "remove":
                    case "clear":
                        for (i = 0; i < evt.items.length; i++) {
                            resmgr.set(evt.items[i].key(), null);
                        }
                        break;
                    }
                });
                dict.each(function (item, key) {
                    var res = resmgr.callback(key, item.value());
                    resmgr.set(key, res);
                });
                return {
                    release: function () {
                        resmgr.release();
                        listener.release();
                    }
                };
            },
            _monitor: function (keys, callback) {
                var self = this;
                var resmgr = {
                    values: keys.map(function (key) {
                        return self.getItem(key);
                    }),
                    affect: function () {
                        callback.apply(self, resmgr.values);
                    }
                };
                var listener = this.on("change", function (dict, evt) {
                    var idx, key, item, hasValue, affect = false;
                    switch (evt.action) {
                    case "replace":
                    case "add":
                        hasValue = true;
                        break;
                    case "remove":
                    case "clear":
                        hasValue = false;
                        break;
                    }
                    for (i = 0; i < evt.items.length; i++) {
                        item = evt.items[i];
                        key = item.key();
                        idx = keys.indexOf(key);
                        if (idx >= 0) {
                            resmgr.values[idx] = hasValue ? item.value() : undefined;
                            affect = true;
                        }
                    }
                    affect && resmgr.affect();
                });
                return {
                    affect: resmgr.affect,
                    release: listener.release
                };
            }
        }
    });
})(nx);
(function (nx) {
    var Iterable = nx.Iterable;
    var ArrayPrototype = Array.prototype;
    var every = ArrayPrototype.every;
    var some = ArrayPrototype.some;
    var filter = ArrayPrototype.filter;
    var map = ArrayPrototype.map;
    var reduce = ArrayPrototype.reduce;

    /**
     * @class Query
     * @namespace nx.data
     * @extend nx.Iterable
     */
    var Query = nx.define('nx.data.Query', nx.Iterable, {
        methods: {
            /**
             * @constructor
             * @param iter
             */
            init: function (iter) {
                this._iter = iter;
                this.reset();
            },
            /**
             * Reset the query.
             * @method reset
             */
            reset: function () {
                this._where = null;
                this._orderBy = null;
                this._unions = [];
                this._joins = [];
                this._begin = 0;
                this._end = null;
            },
            /**
             * @method where
             * @param expr
             * @chainable
             */
            where: function (expr) {
                this._where = expr;
                return this;
            },
            /**
             * method orderBy
             * @param expr
             * @param desc
             * @chainable
             */
            orderBy: function (expr, desc) {
                if (nx.is(expr, 'Function')) {
                    this._orderBy = desc ? function (a, b) {
                        return expr(b, a);
                    } : expr;
                }
                else {
                    this._orderBy = desc ? function (a, b) {
                        return nx.compare(nx.path(b, expr), nx.path(a, expr));
                    } : function (a, b) {
                        return nx.compare(nx.path(a, expr), nx.path(b, expr));
                    };
                }

                return this;
            },
            /**
             * @method groupBy
             * @param expr
             * @chainable
             */
            groupBy: function (expr) {
                throw new Error('Not Implemented');
            },
            /**
             * @method distinct
             * @param expr
             * @chainable
             */
            distinct: function (expr) {
                throw new Error('Not Implemented');
            },
            /**
             * @method skip
             * @param count
             * @chainable
             */
            skip: function (count) {
                this._begin = count;

                if (this._end) {
                    this._end += count;
                }

                return this;
            },
            /**
             * @method take
             * @param count
             * @chainable
             */
            take: function (count) {
                this._end = this._begin + count;

                return this;
            },
            /**
             * @method join
             * @param iter
             * @param on
             * @chainable
             */
            join: function (iter, on) {
                this._join = function () {

                };
                throw new Error('Not Implemented');
            },
            /**
             * @method select
             * @param expr
             * @returns {Array}
             */
            select: function (expr) {
                var arr = this.toArray();
                if (nx.is(expr, 'Function')) {
                    return map.call(arr, expr);
                }
                else if (nx.is(expr, 'String')) {
                    return map.call(arr, function (item) {
                        return nx.path(item, expr);
                    });
                }
                else if (nx.is(expr, 'Array')) {
                    return map.call(arr, function (item) {
                        var result = {};
                        nx.each(expr, function (path) {
                            nx.path(result, path, nx.path(item, path));
                        });

                        return result;
                    });
                }
                else {
                    return arr;
                }
            },
            /**
             * @method first
             * @param expr
             * @returns {any}
             */
            first: function (expr) {
                var arr = this.toArray();
                if (expr) {
                    for (var i = 0, length = arr.length; i < length; i++) {
                        var item = arr[i];
                        if (expr(item)) {
                            return item;
                        }
                    }
                }
                else {
                    return arr[0];
                }
            },
            /**
             * @method last
             * @param expr
             * @returns {any}
             */
            last: function (expr) {
                var arr = this.toArray();
                if (expr) {
                    for (var i = arr.length - 1; i >= 0; i--) {
                        var item = arr[i];
                        if (expr(item)) {
                            return item;
                        }
                    }
                }
                else {
                    return arr[arr.length - 1];
                }
            },
            /**
             * @method all
             * @param expr
             * @returns {Boolean}
             */
            all: function (expr) {
                return every.call(this.toArray(), expr);
            },
            /**
             * @method any
             * @param expr
             * @returns {Boolean}
             */
            any: function (expr) {
                return some.call(this.toArray(), expr);
            },
            /**
             * @method max
             * @param expr
             * @returns {Number}
             */
            max: function (expr) {
                return reduce.call(this.toArray(), function (pre, cur, index, arr) {
                    return pre > cur ? pre : cur;
                });
            },
            /**
             * @method min
             * @param expr
             * @returns {Number}
             */
            min: function (expr) {
                return reduce.call(this.toArray(), function (pre, cur, index, arr) {
                    return pre < cur ? pre : cur;
                });
            },
            /**
             * @method sum
             * @param expr
             * @returns {Number}
             */
            sum: function (expr) {
                return reduce.call(this.toArray(), function (pre, cur, index, arr) {
                    return pre + cur;
                });
            },
            /**
             * @method average
             * @param expr
             * @returns {Number}
             */
            average: function (expr) {
                var arr = this.toArray();
                return reduce.call(arr, function (pre, cur, index, arr) {
                    return pre + cur;
                }) / arr.length;
            },
            /**
             * @method toArray
             * @returns {Array}
             */
            toArray: function () {
                var arr = Iterable.toArray(this._iter);

                nx.each(this._unions, function (union) {
                    arr.concat(Iterable.toArray(union));
                });

                if (this._where) {
                    arr = filter.call(arr, this._where);
                }

                if (this._orderBy) {
                    arr = arr.sort(this._orderBy);
                }

                if (this._end > 0) {
                    arr = arr.slice(this._begin, this._end);
                }
                else {
                    arr = arr.slice(this._begin);
                }

                this.reset();
                return arr;
            }
        },
        statics: {
            query: (function () {
                var i, internal = {
                        publics: {
                            select: function (array, selector) {
                                var rslt = [];
                                if (nx.is(array, "Array") && nx.is(selector, "Function")) {
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
                                if (nx.is(grouper, "Function")) {
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
                                }
                                else {
                                    map = array;
                                }
                                return map;
                            },
                            aggregate: function (array, aggregater) {
                                var rslt = null,
                                    key;
                                if (nx.is(aggregater, "Function")) {
                                    if (nx.is(array, "Array")) {
                                        rslt = aggregater(array);
                                    }
                                    else {
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
                                var rslt, grouper = null,
                                    aggregater = null;
                                // get original identfier and aggregater
                                if (nx.is(args, "Array")) {
                                    if (typeof args[args.length - 1] === "function") {
                                        aggregater = args.pop();
                                    }
                                    grouper = (args.length > 1 ? args : args[0]);
                                }
                                else {
                                    grouper = args.map;
                                    aggregater = args.aggregate;
                                }
                                // translate grouper into function if possible
                                if (typeof grouper === "string") {
                                    grouper = grouper.replace(/\s/g, "").split(",");
                                }
                                if (nx.is(grouper, "Array") && grouper[0] && typeof grouper[0] === "string") {
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
                                }
                                else if (nx.is(mapper, "Function")) {
                                    if (nx.is(array, "Array")) {
                                        rslt = [];
                                        for (i = 0; i < array.length; i++) {
                                            rslt.push(mapper(array[i], i));
                                        }
                                    }
                                    else {
                                        rslt = mapper(array, 0);
                                    }
                                }
                                else {
                                    if (nx.is(array, "Array")) {
                                        rslt = array.slice();
                                    }
                                    else {
                                        rslt = array;
                                    }
                                }
                                return rslt;
                            },
                            orderby: function (array, comparer) {
                                if (typeof comparer === "string") {
                                    comparer = comparer.replace(/^\s*(.*)$/, "$1").replace(/\s*$/, "").replace(/\s*,\s*/g, ",").split(",");
                                }
                                if (nx.is(comparer, "Array") && comparer[0] && typeof comparer[0] === "string") {
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
                                                }
                                                else if (o2[key] > o1[key]) {
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
})(nx);
(function (nx) {

    /**
     * @class SortedMap
     * @namespace nx.data
     * @uses nx.Observable
     * @param data The initial data of SortedMap, which is an array of objects with properties "key" and "value".
     */
    nx.define('nx.data.SortedMap', {
        mixins: nx.Observable,
        events: ['change'],
        properties: {
            /**
             * The length of SortedMap.
             * @property length
             */
            length: {
                get: function () {
                    return this._data.length;
                }
            }
        },
        methods: {
            init: function (data) {
                data = data || [];
                var b = this.__validateData(data);
                if (b) {
                    this._data = data;
                    this._map = {};

                    //init _map
                    var self = this;
                    nx.each(data, function (item) {
                        var map = self._map;
                        map[item.key] = item;
                    });

                } else {
                    throw Error('init data are invalid!');
                }
            },
            /**
             * validate the init args
             * @param data
             * @returns {boolean}
             * @private
             */
            __validateData: function (data) {
                var b = true;
                if (!nx.is(data, 'Array')) {
                    b = false;
                } else {
                    nx.each(data, function (item) {
                        if (item.key === undefined || item.value === undefined) {
                            b = false;
                            return false;
                        }
                    });
                }

                return b;
            },
            /**
             * Add or insert an value with specified key and index.
             * @method add
             * @param key Specified key.
             * @param value (Optional) The value, default undefined.
             * @param index (Optional) Specified index, default append.
             * @return The created entry.
             */
            add: function (key, value, index) {
                var item = {
                    key: key,
                    value: value
                };
                this._map[key] = item;
                if (index === undefined) {
                    index = this._data.length;
                }
                this._data.splice(index, 0, item);
                this.notify('length');
                this.fire('change', {
                    action: "add",
                    index: index,
                    key: key,
                    value: value
                });
                return value;
            },
            /**
             * Remove value(s) from SortedMap by key(s).
             * @method remove
             * @param key The key of value attempt to be removed.
             * @return Removed value.
             */
            remove: function (key) {
                var value, item;

                item = this._map[key];
                if (item !== undefined) {
                    var idx = this._data.indexOf(item);
                    if (idx > -1) {
                        value = item.value;
                        this._data.splice(idx, 1);
                        delete this._map[key];
                        this.notify('length');
                        this.fire('change', {
                            action: "remove",
                            index: idx,
                            key: key,
                            value: value
                        });
                    } else {
                        throw 'key:"' + key + '" has been found in the _map but not exists in the _data!';
                    }
                }

                return value;
            },
            /**
             * Remove value from SortedMap by index.
             * @method removeAt
             * @param index The index of value attempt to be removed.
             * @return Removed value.
             */
            removeAt: function (index) {
                var value, item = this.__getItemAt(index);

                if (item !== undefined) {
                    value = item.value;
                    this._data.splice(index, 1);
                    delete this._map[item.key];
                    this.notify('length');
                    this.fire('change', {
                        action: "remove",
                        index: index,
                        key: item.key,
                        value: value
                    });
                }

                return value;
            },
            /**
             * get the item of this._data by index
             * @param index Support negative number
             * @returns {Object} item
             * @private
             */
            __getItemAt: function (index) {
                var item = this._data[index > -1 ? index : this._data.length + index];

                return item;
            },
            /**
             * Get the key at specified index.
             * @method getKeyAt
             * @param index The index.
             * @return The key, null if not exists.
             */
            getKeyAt: function (index) {
                var item = this.__getItemAt(index), key;
                if (item) {
                    key = item.key;
                }
                return key;
            },
            /**
             * Get the index of specified key.
             * @method indexOf
             * @param key The key.
             * @return The index, -1 if not exists.
             */
            indexOf: function (key) {
                var item = this._map[key], idx = -1;
                if (item !== undefined) {
                    idx = this._data.indexOf(item);
                }
                return idx;
            },
            /**
             * Get a value with specified key.
             * @method getValue
             * @param key The value's key.
             * @return The value.
             */
            getValue: function (key) {
                var item = this._map[key], value;
                if (item !== undefined) {
                    value = item.value;
                }
                return value;
            },
            /**
             * Change value of specified key.
             * @method setValue
             * @param key The key attempt to be changed.
             * @param value The new value.
             * @return The new value.
             */
            setValue: function (key, value) {
                var item = this._map[key];
                if (item !== undefined) {
                    var oldValue = item.value;
                    var idx = this._data.indexOf(item);
                    item.value = value;
                    this.fire('change', {
                        action: "set",
                        index: idx,
                        key: key,
                        value: value,
                        oldValue: oldValue
                    });
                } else {
                    throw Error('the key:"' + key + '" dos not exists!');
                }

                return value;
            },
            /**
             * Get a value with speicifed index.
             * @method getValueAt
             * @param index The value's index.
             * @return The value.
             */
            getValueAt: function (index) {
                var value, item = this.__getItemAt(index);

                if (item !== undefined) {
                    value = item.value;
                }

                return value;
            },
            /**
             * Change value of speicifed index.
             * @method setValueAt
             * @param index The index attempt to be changed.
             * @param value The new value.
             * @return The new value.
             */
            setValueAt: function (index, value) {
                var item = this.__getItemAt(index);
                if (item !== undefined) {
                    var oldValue = item.value;
                    item.value = value;
                    this.fire('change', {
                        action: "set",
                        index: index,
                        key: item.key,
                        value: value,
                        oldValue: oldValue
                    });
                }
                return value;
            },
            /**
             * change the order of specific Item by key
             * @param key
             * @param index
             */
            setIndex: function (key, index) {
                var idx = this.indexOf(key), result = true;
                if (idx != -1 && index !== idx) {
                    var rtn = this._data.splice(idx, 1);
                    this._data.splice(index, 0, rtn[0]);
                    this.fire('change', {
                        action: 'reorder',
                        index: index,
                        oldIndex: idx,
                        key: key
                    });
                } else {
                    result = false;
                }

                return result;
            },
            /**
             * Sort the SortedMap with a comparer function.
             * @method sort
             * @param comparer A function expecting arguments: key1, value1, key2, value2
             */
            sort: function (comparer) {
                this._data.sort(function (item1, item2) {
                    return comparer.call(null, item1.key, item1.value, item2.key, item2.value);
                });
            },
            /**
             * Get array of key-value pairs of all entries.
             * @method toArray
             * @return An array, each item of which is an object with key and value property.
             */
            toArray: function () {
                var arr = this._data.slice(0);
                for (var i = 0, len = arr.length; i < len; i++) {
                    arr[i] = nx.clone(arr[i]);
                }
                return arr;
            },
            /**
             * support iterator for the callback which has three params:k,v,index
             * @param callback
             */
            each: function (callback) {
                var arr = this.toArray();
                for (var i = 0, len = arr.length; i < len; i++) {
                    var item = arr[i];
                    callback.call(this, item.key, item.value, i);
                }
            },
            /**
             * adapt to the nx.each, which has two params for the callback:k,v
             * @param callback
             * @private
             */
            __each__: function (callback) {
                var arr = this.toArray();
                for (var i = 0, len = arr.length; i < len; i++) {
                    var item = arr[i];
                    callback.call(this, item.key, item.value);
                }
            }
        }
    });
})(nx);
