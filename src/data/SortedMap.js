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
                value: 0
            }
        },
        methods: {
            init: function (data) {
                // TODO
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
                var entry;
                // TODO
                return entry;
            },
            /**
             * Remove value(s) from SortedMap by key(s).
             * @method remove
             * @param key The key of value attempt to be removed.
             * @return Removed value.
             */
            remove: function (key) {
                var value;
                // TODO
                return value;
            },
            /**
             * Remove value from SortedMap by index.
             * @method removeAt
             * @param index The index of value attempt to be removed.
             * @return Removed value.
             */
            removeAt: function (index) {
                var value;
                // TODO
                return value;
            },
            /**
             * Get the key at specified index.
             * @method getKeyAt
             * @param index The index.
             * @return The key, null if not exists.
             */
            getKeyAt: function (index) {
                // TODO
                return null;
            },
            /**
             * Get the index of specified key.
             * @method indexOf
             * @param key The key.
             * @return The index, -1 if not exists.
             */
            indexOf: function (key) {
                // TODO
                return -1;
            },
            /**
             * Get a value with specified key.
             * @method getValue
             * @param key The value's key.
             * @return The value.
             */
            getValue: function (key) {
                var value;
                // TODO
                return value;
            },
            /**
             * Change value of speicifed key.
             * @method setValue
             * @param key The key attempt to be changed.
             * @param value The new value.
             * @return The new value.
             */
            setValue: function (key, value) {
                var value;
                // TODO
                return value;
            },
            /**
             * Get a value with speicifed index.
             * @method getValueAt
             * @param index The value's index.
             * @return The value.
             */
            getValueAt: function (index) {
                var value;
                // TODO
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
                var value;
                // TODO
                return value;
            },
            /**
             * Sort the SortedMap with a comparer function.
             * @method sort
             * @param comparer A function expecting arguments: key1, value1, key2, value2
             */
            sort: function (comparer) {
                // TODO
            },
            /**
             * Get array of key-value pairs of all entries.
             * @method toArray
             * @return An array, each item of which is an object with key and value property.
             */
            toArray: function () {
                var array = [];
                // TODO
                return array;
            }
        }
    });
})(nx);
