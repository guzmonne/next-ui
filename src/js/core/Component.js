(function (nx, global) {

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


    /**
     * Base class of graphic component
     * @class nx.graphic.Component
     * @extend nx.ui.Component
     * @module nx.graphic
     */

    nx.define('nx.graphic.Component', nx.ui.Component, {
        /**
         * Fire when drag start
         * @event dragstart
         * @param sender {Object}  Trigger instance
         * @param event {Object} original event object
         */
        /**
         * Fire when drag move
         * @event dragmove
         * @param sender {Object}  Trigger instance
         * @param event {Object} original event object , include delta[x,y] for the shift
         */
        /**
         * Fire when drag end
         * @event dragend
         * @param sender {Object}  Trigger instance
         * @param event {Object} original event object
         */
        events: ['mouseenter', 'mouseleave', 'dragstart', 'dragmove', 'dragend'],
        properties: {
            /**
             * Set/get x translate
             * @property translateX
             */
            translateX: {
                set: function (value) {
                    this.setTransform(value);
                }
            },
            /**
             * Set/get y translate
             * @property translateY
             */
            translateY: {
                set: function (value) {
                    this.setTransform(null, value);
                }
            },
            /**
             * Set/get scale
             * @property scale
             */
            scale: {
                set: function (value) {
                    this.setTransform(null, null, value);
                }
            },
            /**
             * Set/get translate, it set/get as {x:number,y:number}
             * @property translate
             */
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
            /**
             * Set/get element's visibility
             * @property visible
             */
            visible: {
                get: function () {
                    return this._visible !== undefined ? this._visible : true;
                },
                set: function (value) {
                    this.dom().setStyle("display", value ? "" : "none");
                    this.dom().setStyle("pointer-events", value ? "all" : "none");
                    this._visible = value;
                }
            },
            /**
             * Set/get css class
             * @property class
             */
            'class': {
                get: function () {
                    return this._class !== undefined ? this._class : '';
                },
                set: function (value) {
                    if (this._class !== value) {
                        this._class = value;
                        this.dom().addClass(value);
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        },
        view: {},
        methods: {
            init: function (args) {
                this.inherited(args);
                this.sets(args);
            },
            /**
             * Get component dom element by name
             * @param name {String}
             * @returns {nx.dom.Element}
             */
            $: function (name) {
                return this.view(name).dom();
            },
            /**
             * Set component's transform
             * @method setTransform
             * @param [translateX] {Number} x axle translate
             * @param [translateY] {Number} y axle translate
             * @param [scale] {Number} element's scale
             * @param [duration=0] {Number} transition time, unite is second
             */
            setTransform: function (translateX, translateY, scale, duration) {

                var tx = translateX != null ? translateX : this._translateX || 0;
                var ty = translateY != null ? translateY : this._translateY || 0;
                var scl = scale != null ? scale : this._scale || 1;

//                this.setStyle('transform', ' matrix(' + scl + ',' + 0 + ',' + 0 + ',' + scl + ',' + tx + ', ' + ty + ')', duration);
                this.setStyle('transform', ' translate(' + tx + 'px, ' + ty + 'px) scale(' + scl + ')', duration);

                this._translateX = tx;
                this._translateY = ty;
                this._scale = scl;
            },
            /**
             * Set component's css style
             * @method setStyle
             * @param key {String} css key
             * @param value {*} css value
             * @param [duration=0] {Number} set transition time
             * @param [callback]
             * @param [context]
             */
            setStyle: function (key, value, duration, callback, context) {
                this.setTransition(callback, context, duration);
                this.dom().setStyle(key, value);
            },
            setTransition: function (callback, context, duration) {
                var el = this.dom();
                if (duration) {
                    el.setStyle('transition', 'all ' + duration + 's ease');
                    this.on('transitionend', function fn() {
                        if (callback) {
                            callback.call(context || this);
                        }
                        el.setStyle('transition', '');
                        this.off('transitionend', fn, this);
                    }, this);
                } else {
                    el.setStyle('transition', '');
                    if (callback) {
                        setTimeout(function () {
                            callback.call(context || this);
                        }, 0);
                    }
                }
            },
            /**
             * Append component's element to parent node or other dom element
             * @param [parent] {nx.graphic.Component}
             * @method append
             */
            append: function (parent) {
                var parentElement;
                if (parent) {
                    parentElement = this._parentElement = parent.resolve("@root");
                } else {
                    parentElement = this._parentElement = this._parentElement || this.resolve("@root").parentNode();//|| this.parent().resolve("@root");
                }
                if (parentElement && parentElement.$dom && this._resources && this.resolve("@root") && !parentElement.contains(this.resolve("@root"))) {
                    parentElement.appendChild(this.resolve("@root"));
                }
            },
            /**
             * Remove component's element from dom tree
             * @method remove
             */
            remove: function () {
                var parentElement = this._parentElement = this._parentElement || this.resolve("@root").parentNode();
                if (parentElement && this._resources && this.resolve("@root")) {
                    parentElement.removeChild(this.resolve("@root"));
                }
            },
            /**
             * Inherited nx.ui.component's upon function, fixed mouseleave & mouseenter event
             * @method upon
             * @param name {String} event name
             * @param handler {Function} event handler
             * @param [context] {Object} event handler's context
             */
            upon: function (name, handler, context) {
                if (name == 'mouseenter') {
                    this.inherited('mouseover', this._mouseenter.bind(this), context);
                }
                if (name == 'mouseleave') {
                    this.inherited('mouseout', this._mouseleave.bind(this), context);
                }
                this.inherited(name, handler, context);
            },
            _mouseenter: function (sender, event) {
                var element = this.dom().$dom;
                var target = event.currentTarget, related = event.relatedTarget || event.fromElement;
                if (target && !element.contains(related) && target !== related) {
                    /**
                     * Fire when mouse enter
                     * @event mouseenter
                     * @param sender {Object}  Trigger instance
                     * @param event {Object} original event object
                     */
                    this.fire("mouseenter", event);
                }
            },
            _mouseleave: function (sender, event) {
                var element = this.dom().$dom;
                var target = event.currentTarget, related = event.toElement || event.relatedTarget;
                if (!element.contains(related) && target !== related) {
                    /**
                     * Fire when mouse leave
                     * @event mouseenter
                     * @param sender {Object}  Trigger instance
                     * @param event {Object} original event object
                     */
                    this.fire("mouseleave", event);
                }
            },
            /**
             * Get component's bound, delegate element's getBoundingClientRect function
             * @method getBound
             * @returns {*|ClientRect}
             */
            getBound: function () {
                return this.dom().$dom.getBoundingClientRect();
            },
            dispose: function () {
                if (this._resources && this._resources['@root']) {
                    this.dom().$dom.remove();
                }
                this.inherited();
            },
            /**
             * Set animation for element,pass a config to this function
             * {
             *      to :{
             *          attr1:value,
             *          attr2:value,
             *          ...
             *      },
             *      duration:Number,
             *      complete:Function
             * }
             * @method animate
             * @param config {JSON}
             */
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
                    /**
                     * Fired when animation completed
                     * @event animationCompleted
                     * @param sender {Object}  Trigger instance
                     * @param event {Object} original event object
                     */
                    this.fire("animationCompleted");
                }, this);
                ani.start();
            }
        }
    });

})(nx, nx.global);