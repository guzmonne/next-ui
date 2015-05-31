(function(nx, globasl) {

    nx.define('RingVM', nx.Observable, {
        properties: {
            startAngle: {
                value: 0
            },
            endAngle: {
                value: 0
            },
            gapAngle: {
                value: 1
            },
            innerRadius: {
                value: 0
            },
            outerRadius: {
                value: 0
            },
            color: {
                value: null
            },
            colorGenerate: {
                value: null
            },
            ringItemType: {

            },
            rings: {
                value: function() {
                    return [];
                }
            },
            collection: {
                set: function(value) {
                    if (value) {
                        var length = value.length();
                        var perAngle = this._endAngle - this._startAngle - this._gapAngle * (length - 1);
                        nx.each(value, function(item, index) {
                            var percentage = item.percentage();
                            var deltaPercentage = item.deltaPercentage();
                            var ringItemVM = new RingItemVM();
                            ringItemVM.sets({
                                startAngle: perAngle * deltaPercentage + this._startAngle + this._gapAngle * index,
                                endAngle: perAngle * deltaPercentage + perAngle * percentage + this._startAngle + this._gapAngle * index,
                                innerRadius: this._innerRadius,
                                outerRadius: this._outerRadius,
                                gapAngle: this._gapAngle,
                                colorGenerate: this._colorGenerate,
                                model: item
                            });

                            if (this._colorGenerate) {
                                var color = this._colorGenerate;
                                if (nx.is(color, 'Function')) {
                                    color = color(item._data, ringItemVM);
                                }
                                ringItemVM.color(color);
                                ringItemVM.colorGenerate(this._colorGenerate);
                            }

                            this.rings().push(ringItemVM);
                        }, this);
                        this._collection = value;
                    }
                }
            },
            animation: {
                value: true,
                watcher: function(prop, value) {
                    nx.each(this._rings, function(ringItemVM, index) {
                        ringItemVM.animation(value);
                    })
                }
            },
            active: {
                value: true,
                watcher: function(prop, value) {
                    nx.each(this._rings, function(ringItemVM, index) {
                        ringItemVM.active(value);
                    })
                }
            }
        },
        methods: {
            init: function(args) {
                this.inherited(args);
                this.sets(args);
            },
            update: function() {
                var length = this._collection.length();
                var perAngle = this._endAngle - this._startAngle - this._gapAngle * (length - 1);
                nx.each(this._rings, function(ringItemVM, index) {
                    var percentage = ringItemVM._model.percentage();
                    var deltaPercentage = ringItemVM._model.deltaPercentage();
                    ringItemVM.animation(this._animation);
                    ringItemVM.sets({
                        startAngle: perAngle * deltaPercentage + this._startAngle + this._gapAngle * index,
                        endAngle: perAngle * deltaPercentage + perAngle * percentage + this._startAngle + this._gapAngle * index,
                        gapAngle: this._gapAngle,
                        innerRadius: this._innerRadius,
                        outerRadius: this._outerRadius
                    });
                }, this);

            }
        }
    });
})(nx, window);