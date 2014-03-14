(function (nx, util, global) {


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
        events: [],
        properties: {
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

})(nx, nx.graphic.util, nx.global);