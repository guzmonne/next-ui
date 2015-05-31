(function(nx, global) {

    nx.define("RingItemVM", nx.Observable, {
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
            model: {
                value: null
            },
            timer: {
                value: null
            },
            distance: {
                value: 5
            },
            ring: {
                dependencies: ['model', 'distance'],
                value: function(model, distance) {
                    if (model) {
                        var ring;
                        if (this._ring) {
                            ring = this._ring;
                        } else {
                            ring = new RingVM();
                        }
                        var gap = this.outerRadius() - this.innerRadius();
                        gap = gap < 0 ? gap - distance : gap + distance;
                        ring.sets({
                            startAngle: this.startAngle(),
                            endAngle: this.endAngle(),
                            gapAngle: this.gapAngle(),
                            innerRadius: this.innerRadius() + gap,
                            outerRadius: this.outerRadius() + gap,
                            colorGenerate: this.colorGenerate(),
                            collection: model.children()
                        });
                        return ring;
                    }
                }
            },
            animation: {
                value: true,
                watcher: function(prop, value) {
                    this._ring && this._ring.animation(value);
                }
            },
            active: {
                value: true,
                watcher: function(prop, value) {
                    this._ring && this._ring.animation(value);
                }
            },
            animatedProperties: {
                dependencies: ['startAngle', 'endAngle', 'innerRadius', 'outerRadius', 'gapAngle'],
                value: function(startAngle, endAngle, innerRadius, outerRadius, gapAngle) {
                    if (startAngle && endAngle && innerRadius && outerRadius && gapAngle) {
                        if (this._animation && this._animatedProperties) {
                            if (this._timer) {
                                clearTimeout(this._timer);
                            }
                            this._timer = setTimeout(function() {
                                var step = 0;
                                var _props = this._ani_props;
                                var self = this;

                                this._ring.animation(false);

                                var timer = requestAnimationFrame(function fn() {
                                    var percentage = ++step / 30;
                                    self.ani_props({
                                        startAngle: (startAngle - _props.startAngle) * percentage + _props.startAngle,
                                        endAngle: (endAngle - _props.endAngle) * percentage + _props.endAngle,
                                        innerRadius: (innerRadius - _props.innerRadius) * percentage + _props.innerRadius,
                                        outerRadius: (outerRadius - _props.outerRadius) * percentage + _props.outerRadius,
                                        gapAngle: (gapAngle - _props.gapAngle) * percentage + _props.gapAngle
                                    });
                                    if (step >= 30) {
                                        self._ring.animation(true);
                                        self._ring.update();
                                    } else {
                                        requestAnimationFrame(fn);
                                    }
                                });
                            }.bind(this), 0);

                        } else {
                            this.ani_props({
                                startAngle: startAngle,
                                endAngle: endAngle,
                                innerRadius: innerRadius,
                                outerRadius: outerRadius,
                                gapAngle: gapAngle
                            });
                        }
                        return {
                            startAngle: startAngle,
                            endAngle: endAngle,
                            innerRadius: innerRadius,
                            outerRadius: outerRadius,
                            gapAngle: gapAngle
                        }
                    }
                }
            },
            ani_props: {
                value: null
            },
            updater: {
                dependencies: ['ani_props', 'ring'],
                value: function(ani_props, ring) {
                    if (ani_props && ring) {
                        var distance = this._distance;
                        var gap = this.outerRadius() - this.innerRadius();
                        gap = gap < 0 ? gap - distance : gap + distance;
                        ring.sets({
                            startAngle: ani_props.startAngle,
                            endAngle: ani_props.endAngle,
                            gapAngle: ani_props.gapAngle,
                            innerRadius: ani_props.innerRadius + gap,
                            outerRadius: ani_props.outerRadius + gap
                        });
                        ring.update();
                    }
                }
            },
            parentVM: {

            }
        },
        methods: {}
    });
})(nx, window);