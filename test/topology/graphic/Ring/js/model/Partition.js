(function(nx, global) {
    nx.define("nx.data.Partition", nx.Observable, {
        events: ['change'],
        properties: {
            valuer: {
                value: function() {
                    return function(i) {
                        return i
                    }
                },
                watcher: function(prop, value) {
                    this._update(this.collection());
                    this.fire('change');
                }
            },
            data: {
                value: null,
                equalityCheck: false,
                watcher: function(prop, value) {
                    //
                    this.collection().clear();
                    this.items().clear();
                    //
                    this._generateItems(value, 0);
                    //
                    var data = this._process(value, 0);
                    this.collection().addRange(data);
                }
            },
            collection: {
                value: function() {
                    return new nx.data.ObservableCollection();
                }
            },
            items: {
                value: function() {
                    return new nx.data.Dictionary();
                }
            }
        },
        methods: {
            init: function(args) {
                this.inherited();
                if (args.valuer) {
                    this._valuer = args.valuer;
                }
                if (args.data) {
                    this.data(args.data);
                }
            },
            _generateItems: function(ary, depth) {
                nx.each(ary, function(data, index) {
                    var item = new nx.data.PartitionItem(data);
                    item.depth(depth);
                    item.index(index);
                    if (data.children && nx.is(data.children, 'Array') && data.children.length) {
                        this._generateItems(data.children, depth + 1);
                    }
                    this.items().setItem(data.id, item);
                }, this);
            },
            _process: function(ary, depth) {
                var sum = 0;
                var items = [];
                var _items = this._items;
                var valuer = this.valuer();
                var values = [];
                ary.forEach(function(currentValue) {
                    var _value = parseFloat(valuer(currentValue, _items.getItem(currentValue.id)));
                    sum += _value;
                    values.push(_value);
                });

                var deltaPercentage = 0;
                nx.each(ary, function(data, index) {
                    var item = _items.getItem(data.id);
                    var percentage = values[index] / sum;
                    item.percentage(percentage);
                    item.deltaPercentage(deltaPercentage);
                    if (data.children && nx.is(data.children, 'Array') && data.children.length) {
                        item.children().addRange(this._process(data.children, depth + 1));
                    }
                    items.push(item);
                    deltaPercentage += percentage;
                }, this);
                return items;
            },
            _update: function(collection) {
                var sum = 0;
                var valuer = this.valuer();
                var values = [];
                nx.each(collection, function(item) {
                    var _value = parseFloat(valuer(item._data, item));
                    sum += _value;
                    values.push(_value);
                });

                var deltaPercentage = 0;
                nx.each(collection, function(item, index) {
                    var percentage = values[index] / sum;
                    item.percentage(percentage);
                    item.deltaPercentage(deltaPercentage);
                    deltaPercentage += percentage;

                    this._update(item.children());

                }, this);
            }
        }
    });

    nx.define('nx.data.PartitionItem', nx.data.ObservableObject, {
        properties: {
            percentage: {
                value: 0
            },
            deltaPercentage: {
                value: 0
            },
            depth: {
                value: 0
            },
            index: {
                value: 0
            },
            children: {
                value: function() {
                    return new nx.data.ObservableCollection();
                }
            }
        }
    });


})(nx, window);