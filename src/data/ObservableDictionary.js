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
                this._map = {};
                this.notify('count');
                this.fire('change', {
                    action: 'clear',
                    items: items
                });
            }
        }
    });
})(nx);