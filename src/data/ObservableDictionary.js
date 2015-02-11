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
            monitor: function (callback) {
                var dict = this;
                var resmgr = {
                    map: {},
                    get: function (key) {
                        return resmgr.map[key];
                    },
                    set: function (key, res) {
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
                            res = callback(key, item.value());
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
                dict.each(function (value, key) {
                    resmgr.set(key, callback(key, value));
                });
                return {
                    release: function () {
                        resmgr.release();
                        listener.release();
                    }
                };
            }
        }
    });
})(nx);
