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
                var map = this._map;
                var item = map[key],
                    ov;
                if (item) {
                    ov = item.value;
                    item._value = value;
                    item.notify("value");
                    this.fire('change', {
                        action: 'replace',
                        item: map[key],
                        oldValue: ov,
                        newValue: value,
                        // FIXME unnecessary
                        oldItem: map[key],
                        newItem: map[key]
                    });
                } else {
                    item = map[key] = new ObservableDictionaryItem(this, key);
                    item._value = value;
                    this.notify('count');
                    this.fire('change', {
                        action: 'add',
                        items: [map[key]]
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
                    item._dict = null;
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
                this._map = {};
                nx.each(items, function (item) {
                    item._dict = null;
                });
                this.notify('count');
                this.fire('change', {
                    action: 'clear',
                    items: items
                });
            }
        }
    });
})(nx);
