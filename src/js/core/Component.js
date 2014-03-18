(function (nx, util, global) {
    var NS = "http://www.w3.org/2000/svg";
    var xlink = 'http://www.w3.org/1999/xlink';
    var attrList = ['class'];

    nx.Object.delegateEvent = function (source, sourceEvent, target, targetEvent) {
        if (!target.can(targetEvent)) {
            source.on(sourceEvent, function (sender, event) {
                target.fire(targetEvent, event);
            });
            nx.Object.extendEvent(target, targetEvent);
        }
    };


    //http://www.timotheegroleau.com/Flash/experiments/easing_function_generator.htm
    var ease = function (t, b, c, d) {
        var ts = (t /= d) * t;
        var tc = ts * t;
        return b + c * (5.7475 * tc * ts + -14.3425 * ts * ts + 8.395 * tc + 1.2 * ts);
    };


    nx.define('nx.graphic.Component', nx.ui.Component, {
        events: ['mouseenter', 'mouseleave', 'dragstart', 'drag', 'dragmove', 'dragend'],
        properties: {
            translateX: {
                get: function () {
                    return this._translateX !== undefined ? this._translateX : 0;
                },
                set: function (value) {
                    if (this._translateX !== value) {
                        this._translateX = value;
                        this.setTransform(this._translateX);
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            translateY: {
                get: function () {
                    return this._translateY !== undefined ? this._translateY : 0;
                },
                set: function (value) {
                    if (this._translateY !== value) {
                        this._translateY = value;
                        this.setTransform(null, this._translateY);
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            scale: {
                get: function () {
                    return this._scale !== undefined ? this._scale : 1;
                },
                set: function (value) {
                    if (this._scale !== value) {
                        this._scale = value;
                        this.setTransform(null, null, this._scale);
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            translate: {
                get: function () {
                    return{
                        x: this._translateX,
                        y: this._translateY
                    };
                },
                set: function (value) {
                    this.setTransform(value.x, value.y);
                }
            },
            rotate: {
                get: function () {
                    return this._rotate !== undefined ? this._rotate : 0;
                },
                set: function (value) {
                    if (this._rotate !== value) {
                        this._rotate = value;
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            visible: {
                get: function () {
                    return this.resolve('@root').getStyle("display") != "none";
                },
                set: function (value) {
                    this.resolve('@root').setStyle("display", value ? "" : "none");
                    this.resolve('@root').setStyle("pointer-events", value ? "all" : "none");
                }
            },
            'class': {
                get: function () {
                    return this._class !== undefined ? this._class : 0;
                },
                set: function (value) {
                    if (this._class !== value) {
                        this._class = value;
                        this.root().addClass(value);
                        return true;
                    } else {
                        return false;
                    }
                }
            },
        },
        view: {},
        methods: {
            init: function (args) {
                this.inherited(args);
                this.sets(args);
            },
            append: function (parent) {
                var parentElement;
                if (parent) {
                    parentElement = this._parentElement = parent.resolve("@root");
                } else {
                    parentElement = this._parentElement = this._parentElement || this.resolve("@root").parentNode() || this.parent().resolve("@root");
                }
                if (parentElement && parentElement.$dom && !parentElement.contains(this.resolve("@root"))) {
                    parentElement.appendChild(this.resolve("@root"));
                }
            },
            remove: function () {
                var parentElement = this._parentElement = this._parentElement || this.resolve("@root").parentNode();
                if (parentElement && this.resolve("@root")) {
                    parentElement.removeChild(this.resolve("@root"));
                }
            },
            $: function (name) {
                return this.resolve(name).resolve('@root');
            },
            root: function () {
                return this.resolve('@root');
            },
            setTransform: function (translateX, translateY, scale, durition) {

                var tx = translateX != null ? translateX : this._translateX || 0;
                var ty = translateY != null ? translateY : this._translateY || 0;
                var scl = scale != null ? scale : this.scale();


                this.setStyle('-webkit-transform', ' translate(' + tx + 'px, ' + ty + 'px) scale(' + scl + ')', durition);


                this._translateX = tx;
                this._translateY = ty;
                this._scale = scl;
            },
            setStyle: function (key, value, durition) {
                var el = this.resolve('@root');
                if (durition) {
                    el.setStyle('-webkit-transition', 'all ' + durition + 's ease');
                    el.setStyle('transition', 'all ' + durition + 's ease');
                } else {
                    el.setStyle('-webkit-transition', '');
                    el.setStyle('transition', '');
                }
                el.setStyle(key, value);
            },
            upon: function (name, handler, context) {
                if (name == 'mouseenter') {
                    this.inherited('mouseover', this._mouseenter.bind(this), context);
                }
                if (name == 'mouseleave') {
                    this.inherited('mouseout', this._mouseleave.bind(this), context);
                }
                this.inherited(name, handler, context);
            },
            _mouseleave: function (sender, event) {
                var element = this.root().$dom;
                var target = event.target;
                var related = event.relatedTarget;
                if (!element.contains(related) && target !== related) {
                    this.fire("mouseleave", event);
                }
            },
            _mouseenter: function (sender, event) {
                var element = this.root().$dom;
                var target = event.target;
                var related = event.relatedTarget;
                if (target && !element.contains(related) && target !== related) {
                    this.fire("mouseenter", event);
                }
            },
            getBound: function () {
                return this.root().$dom.getBoundingClientRect();
            },
            dispose: function () {
                if (this.root()) {
                    this.root().$dom.remove();
                }
                this.inherited();
            },
            animate: function (config) {
                var self = this;
                var aniMap = [];
                var el = this.resolve('@root');
                nx.each(config.to, function (value, key) {
                    var oldValue = this.has(key) ? this.get(key) : el.getStyle(key);
                    aniMap.push({
                        key: key,
                        oldValue: oldValue,
                        newValue: value
                    });
                }, this);

                if (this._ani) {
                    this._ani.stop();
                }

                var ani = this._ani = new nx.graphic.Animation({
                    duration: config.duration || 1000,
                    context: config.context || this
                });
                ani.callback(function (progress) {
                    nx.each(aniMap, function (item) {
                        //var value = item.oldValue + (item.newValue - item.oldValue) * progress;
                        var value = ease(progress, item.oldValue, item.newValue - item.oldValue, 1);
                        self.set(item.key, value);
                    });
                    //console.log(progress);
                });

                if (config.complete) {
                    ani.complete(config.complete);
                }
                ani.on("complete", function () {
                    this.fire("animationComplete");
                }, this);
                ani.start();
            }
        }
    });

})(nx, nx.util, nx.global);