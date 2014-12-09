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
            }
        }
    });
})(nx);
