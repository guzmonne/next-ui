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
            }
        }
    });
})(nx);
