(function(nx, globasl) {

    nx.define('RingChartVM', nx.Observable, {
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
            ring: {
                dependencies: ['partition'],
                value: function(partition) {
                    if (partition) {
                        var ring = new RingVM();
                        ring.sets({
                            startAngle: this.startAngle(),
                            endAngle: this.endAngle(),
                            gapAngle: this.gapAngle(),
                            innerRadius: this.innerRadius(),
                            outerRadius: this.outerRadius(),
                            colorGenerate: this.color(),
                            collection: partition.collection()
                        });
                        return ring;
                    }
                }
            },
            updater: {
                dependencies: ['startAngle', 'endAngle', 'gapAngle', 'innerRadius', 'outerRadius'],
                value: function() {
                    if (this._ring) {
                        this._ring.sets({
                            startAngle: this.startAngle(),
                            endAngle: this.endAngle(),
                            gapAngle: this.gapAngle(),
                            innerRadius: this.innerRadius(),
                            outerRadius: this.outerRadius()
                        });
                        this._ring.update();
                    }
                }
            },
            partition: {
                set: function(value) {
                    if (this._partition) {
                        //todo
                    }
                    value.on('change', function() {
                        this._ring.update();
                    }.bind(this));

                    this._partition = value;
                }
            }
        },
        methods: {
            init: function(args) {
                this.inherited(args);
                this.sets(args);
            }
        }
    });
})(nx, window);