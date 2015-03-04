(function (nx) {

    /**
     * @class SortedMap
     * @namespace nx.data
     * @uses nx.Observable
     */
    nx.define('nx.data.SortedMap', {
        mixins: nx.Observable,
        events: ['change'],
        methods: {
            /**
             * Add or insert an value with specified key and index.
             * @method add
             * @param key Specified key.
             * @param value The value.
             * @param index (Optional) Specified index.
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
            remove: function () {
                var value;
                // TODO
                return value;
            },
            /**
             * Remove value from SortedMap by index.
             * @method removeAt
             * @param index... The index of value attempt to be removed.
             * @return Removed value.
             */
            removeAt: function () {
                var value;
                // TODO
                return value;
            },
            /**
             * Change a key.
             * @method setKey
             * @param key The old key to be set.
             * @param newkey The new key to be set.
             */
            setKey: function (key, newkey) {
                // TODO
            },
            /**
             * Get an entry with specified key.
             * @method getEntry
             * @param key The entry's key.
             * @return The entry.
             */
            getEntry: function (key) {
                var entry;
                // TODO
                return entry;
            },
            /**
             * Get an entry with specified index.
             * @method getEntryAt
             * @param index The entry's index.
             * @return Removed values.
             */
            getEntryAt: function (index) {
                var entry;
                // TODO
                return entry;
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
            }
        }
    });
})(nx);
