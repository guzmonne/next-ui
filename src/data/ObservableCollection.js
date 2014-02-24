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