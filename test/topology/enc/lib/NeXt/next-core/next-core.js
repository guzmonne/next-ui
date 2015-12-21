/**
 * @module nx
 */

var nx = {
    VERSION: '0.7.0',
    DEBUG: false,
    global: (function () {
        return this;
    }).call(null)
};

if (!Function.prototype.bind) {
    Function.prototype.bind = function (context) {
        var f = this;
        return function () {
            return f.apply(context, arguments);
        };
    };
}


(function (nx) {
    /**
     * @class nx
     * @static
     */


    var isArray = Array.isArray || function (target) {
        return target && target.constructor === Array;
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
        if (target && callback) {
            if (target.__each__) {
                target.__each__(callback, context);
            }
            else {
                var length = target.length;
                if (length >= 0) {
                    for (var i = 0; i < length; i++) {
                        callback.call(context, target[i], i);
                    }
                }
                else {
                    for (var key in target) {
                        if (target.hasOwnProperty(key)) {
                            callback.call(context, target[key], key);
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
    nx.clone = function (target) {
        if (target) {
            if (target.__clone__) {
                return target.__clone__();
            }
            else {
                if (nx.is(target, 'Array')) {
                    return target.slice(0);
                }
                else {
                    var result = {};
                    for (var key in target) {
                        if (target.hasOwnProperty(key)) {
                            result[key] = target[key];
                        }
                    }

                    return result;
                }
            }
        }
        else {
            return target;
        }
    };

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
        }
        else {
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
            }
            else {
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
            }
            else {
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
            }
            else {
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
            }
            else {
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
            }
            else {
                return name in target;
            }
        }
        else {
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
        }
        else {
            if (target === source) {
                return 0;
            }
            else if (target > source) {
                return 1;
            }
            else if (target < source) {
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
            var tokens = path.split('.'), token,
                i = 0, length = tokens.length;

            if (value === undefined) {
                for (; result && i < length; i++) {
                    token = tokens[i];
                    if (result.__get__) {
                        result = result.__get__(token);
                    }
                    else {
                        result = result[token];
                    }
                }
            }
            else {
                length -= 1;
                for (; result && i < length; i++) {
                    token = tokens[i];
                    if (result.__get__) {
                        result = result.__get__(token);
                    }
                    else {
                        result = result[token] = result[token] || {};
                    }
                }

                token = tokens[i];
                if (result) {
                    if (result.__set__) {
                        result.__set__(token, value);
                    }
                    else {
                        result[token] = value;
                    }

                    result = value;
                }
            }
        }

        return result;
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
                }
                else {
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
                }
                else {
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
                }
                else {
                    this[name] = value;
                }
            }
            else {
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

            listeners.push({
                owner: this,
                handler: handler,
                context: context || this
            });
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
                }
                else {
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
            var listeners = this.__listeners__[name],
                listener, result;
            if (listeners) {
                for (var i = 0, length = listeners.length; i < length; i++) {
                    listener = listeners[i];
                    if (listener && listener.handler) {
                        result = listener.handler.call(listener.context, listener.owner, data);
                        if (result === false) {
                            return false;
                        }
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
                    }
                    else if (!meta.update && !meta.value) {
                        owner.set(name, arguments[0]);
                    }
                }
            });
        }
        else {
            defaultValue = meta.value;
        }

        if (target[name] && meta.inherits) {
            meta = nx.extend({}, target[name].__meta__, meta);
        }

        var fn = function (value, params) {
            if (value === undefined && arguments.length === 0) {
                return fn.__getter__.call(this, params);
            }
            else {
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
        }
        else {
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
            }
            else if (!parent) {
                if (nx.is(type, 'Object')) {
                    members = type;
                    type = null;
                }
                else if (nx.is(type, 'Function')) {
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
                }
                else if (nx.is(value, nx.keyword.internal.Keyword)) {
                    switch (value.type) {
                    case "binding":
                        // FIXME memory leak
                        value.apply(this, name);
                        break;
                    }
                }
                else {
                    this["_" + name] = value;
                }
            }, Class);

            if (methods.init) {
                methods.init.call(Class);
            }
        }
        else {
            Class = function () {
                var mixins = this.__mixins__;
                this.__id__ = instanceId++;
                this.__listeners__ = {};
                this.__bindings__ = this.__bindings__ || {};
                this.__watchers__ = this.__watchers__ || {};
                this.__keyword_bindings__ = this.__keyword_bindings__ || [];
                this.__keyword_watchers__ = this.__keyword_watchers__ || {};

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
                    }
                    else if (nx.is(value, nx.keyword.internal.Keyword)) {
                        // FIXME memory leak
                        // FIXME bind order
                        this.__keyword_bindings__.push({
                            name: name,
                            definition: value
                        });
                    }
                    else {
                        this["_" + name] = value;
                    }
                }, this);

                nx.each(Class.__properties__, function (name) {
                    var prop = this[name];
                    if (!prop || prop.__type__ !== "property") {
                        return;
                    }
                    var meta = prop.__meta__,
                        watcher = meta.watcher;
                    if (watcher) {
                        if (nx.is(watcher, "String")) {
                            watcher = this[watcher];
                        }
                        this.watch(name, watcher.bind(this));
                        this.__keyword_watchers__[name] = watcher;
                    }
                }, this);

                nx.each(this.__keyword_bindings__, function (binding) {
                    binding.instance = binding.definition.apply(this, binding.name);
                }, this);

                if (this.__ctor__) {
                    this.__ctor__.apply(this, arguments);
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
                    if (name !== 'init') {
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
                            }
                            else {
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
                                }
                                else if (child) {
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
                            }
                            else {
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
                    }
                    else {
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
                        uncascade: function () {
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
                            }
                        };
                        var watching = nx.keyword.internal.watch(o, this.source, function () {
                            var rslt;
                            if (this.callback) {
                                rslt = this.callback.apply(this.context ? binding.owner : binding, arguments);
                            }
                            else {
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
})(nx);
(function (nx) {

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
})(nx);
(function (nx) {
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
                nx.each(names == '*' ? this.__properties__ : (nx.is(names, 'Array') ? names : [names]), function (name) {
                    this._watch(name, handler, context);
                }, this);
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
                }
                else {
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
                    params.converter = Binding.converters[params.converter];
                }
                else {
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

                watchers.push({
                    owner: this,
                    handler: handler,
                    context: context
                });

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
                            if (oldValue !== value || (params && params.force)) {
                                if (setter.call(this, value, params) !== false) {
                                    return this.notify(name, oldValue);
                                }
                            }

                            return false;
                        };

                        property._watched = true;
                    }
                }
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
                    }
                    else {
                        watchers.length = 0;
                    }
                }
            },
            _notify: function (name, oldValue) {
                var map = this.__watchers__;
                nx.each(map[name], function (watcher) {
                    if (watcher && watcher.handler) {
                        watcher.handler.call(watcher.context, name, this.get(name), oldValue, watcher.owner);
                    }
                }, this);
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
                }
                else {
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
                        this._updateTarget();
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
                            direction = (bindingMeta && bindingMeta.direction) || '<-';
                        }

                        if (format == 'auto') {
                            format = bindingMeta && bindingMeta.format;
                        }

                        if (converter == 'auto') {
                            converter = bindingMeta && bindingMeta.converter;
                        }
                    }
                    else {
                        if (bindingType == 'auto') {
                            bindingType = target.can(targetPath) ? 'event' : 'property';
                        }

                        if (direction == 'auto') {
                            direction = '<-';
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
                    }
                    else {
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
                        }
                        else {
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
                }
            },
            /**
             * @property length
             * @type {Number}
             */
            length: {
                get: function () {
                    return this._data.length;
                }
            }
        },
        methods: {
            init: function (iter) {
                var data = this._data = [];
                if (nx.is(iter, Iterable)) {
                    this._data = iter.toArray();
                }
                else {
                    Iterable.getIterator(iter)(function (item) {
                        data.push(item);
                    });
                }
            },
            /**
             * Add an item.
             * @method add
             * @param item
             */
            add: function (item) {
                this._data.push(item);
            },
            /**
             * Add multiple items.
             * @method addRange
             * @param iter
             * @returns {*}
             */
            addRange: function (iter) {
                var data = this._data;
                var items = Iterable.toArray(iter);
                data.splice.apply(data, [data.length, 0].concat(items));

                return items;
            },
            /**
             * @method remove
             * @param item
             * @returns {*}
             */
            remove: function (item) {
                var index = this.indexOf(item);
                if (index >= 0) {
                    this._data.splice(index, 1);
                    return index;
                }
                else {
                    return -1;
                }
            },
            /**
             * @method removeAt
             * @param index
             * @returns {*}
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
                this._data.splice(index, 0, item);
            },
            /**
             * @method insertRange
             * @param index
             * @param iter
             * @returns {*}
             */
            insertRange: function (iter, index) {
                var data = this._data;
                var items = Iterable.toArray(iter);
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
             * @method indexOf
             * @param item
             * @returns {*}
             */
            indexOf: function (item) {
                var data = this._data;
                if (data.indexOf) {
                    return data.indexOf(item);
                }
                else {
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
                }
                else {
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
            key: {
                get: function () {
                    return this._key;
                }
            },
            value: {
                get: function () {
                    return this._dict.getItem(this._key);
                },
                set: function (value) {
                    this._dict.setItem(this._key, value);
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
                    var count = 0;
                    this.each(function () {
                        count++;
                    });

                    return count;
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
                if (dict) {
                    nx.each(dict, function (value, key) {
                        map[key] = new DictionaryItem(this, '' + key);
                        map[key]._value = value;
                    }, this);
                }

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
                var item = this._map[key] = new DictionaryItem(this, '' + key);
                item._value = value;

                return item;
            },
            /**
             * @method removeItem
             * @param key {String}
             */
            removeItem: function (key) {
                var item = this._map[key];
                delete this._map[key];
                return item;
            },
            /**
             * @method clear
             */
            clear: function () {
                var items = this.toArray();
                this._map = {};
                return items;
            },
            /**
             * @method each
             * @param callback {Function}
             * @param [context] {Object}
             */
            each: function (callback, context) {
                nx.each(this._map, callback, context);
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
})(nx);
(function (nx) {

    /**
     * @class ObservableCollection
     * @namespace nx.data
     * @extends nx.data.Collection
     * @uses nx.Observable
     */
    nx.define('nx.data.ObservableCollection', nx.data.Collection, {
        mixins: nx.Observable,
        events: ['change'],
        methods: {
            /**
             * Add an item.
             * @method add
             * @param item
             */
            add: function (item) {
                this.inherited(item);
                this.notify('count');
                this.notify('length');
                this.fire('change', {
                    action: 'add',
                    items: [item]
                });

                return item;
            },
            /**
             * @method addRange
             * @param iter
             */
            addRange: function (iter) {
                var items = this.inherited(iter);
                this.notify('count');
                this.notify('length');
                this.fire('change', {
                    action: 'add',
                    items: items
                });

                return items;
            },
            /**
             * @method insert
             * @param item
             * @param index
             */
            insert: function (item, index) {
                this.inherited(item, index);
                this.notify('count');
                this.notify('length');
                this.fire('change', {
                    action: 'add',
                    items: [item],
                    index: index
                });
            },
            /**
             * @method insertRange
             * @param iter
             * @param index
             */
            insertRange: function (iter, index) {
                var result = this.inherited(iter, index);
                this.notify('count');
                this.notify('length');
                this.fire('change', {
                    action: 'add',
                    items: result,
                    index: index
                });
            },
            /**
             * @method remove
             * @param item
             */
            remove: function (item) {
                var result = this.inherited(item);
                if (result >= 0) {
                    this.notify('count');
                    this.notify('length');
                    this.fire('change', {
                        action: 'remove',
                        items: [item],
                        index: result
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
                        }
                        else if (a < b) {
                            return -1;
                        }
                        else {
                            return 0;
                        }
                    }
                });

                return result;
            }
        }
    });
})(nx);

(function (nx) {

    var Observable = nx.Observable;
    var Dictionary = nx.data.Dictionary;

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
                var map = this._map;
                if (key in map) {
                    var oldItem = map[key];
                    var newItem = this.inherited(key, value);
                    this.fire('change', {
                        action: 'replace',
                        oldItem: oldItem,
                        newItem: newItem
                    });
                }
                else {
                    var item = this.inherited(key, value);
                    this.notify('count');
                    this.fire('change', {
                        action: 'add',
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
                if (key in map) {
                    var item = map[key];
                    delete map[key];
                    this.notify('count');
                    this.fire('change', {
                        action: 'remove',
                        items: [item]
                    });
                }
            },
            /**
             * @method clear
             */
            clear: function () {
                var items = this.toArray();
                this.notify('count');
                this.fire('change', {
                    action: 'clear',
                    items: items
                });
                this._map = {};
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
