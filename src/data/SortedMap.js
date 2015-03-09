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
                this._data.splice(index, 0, item);
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
                }

                return value;
            },
            /**
             * get the item of this._data by index
             * @param index
             * @returns {*}
             * @private
             */
            __getItemAt: function (index) {
                var item;
                if (index > -1) {
                    item = this._data[index];
                } else {
                    var sliceArgs = [index, index + 1];
                    if (index === -1) {
                        sliceArgs.splice(-1, 1);
                    }
                    var sliceArray = Array.prototype.slice.apply(this._data, sliceArgs);
                    if (sliceArray.length === 1) {
                        item = sliceArray[0];
                    }
                }

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
             * Change value of speicifed key.
             * @method setValue
             * @param key The key attempt to be changed.
             * @param value The new value.
             * @return The new value.
             */
            setValue: function (key, value) {
                var item = this._map[key];
                if (item !== undefined) {
                    item.value = value;
                } else {
                    value = false;
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
                    item.value = value;
                }
                return value;
            },
            /**
             * Sort the SortedMap with a comparer function.
             * @method sort
             * @param comparer A function expecting arguments: key1, value1, key2, value2
             */
            sort: function (comparer) {
                this._data.sort(comparer);
            },
            /**
             * Get array of key-value pairs of all entries.
             * @method toArray
             * @return An array, each item of which is an object with key and value property.
             */
            toArray: function () {
                return this._data;
            }
        }
    });
})(nx);
