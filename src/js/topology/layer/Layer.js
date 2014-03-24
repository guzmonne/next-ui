(function (nx, util, global) {

    /**
     * Topology basic layer class
     * @class nx.graphic.Topology.Layer
     * @extend nx.graphic.Component
     */
    nx.define("nx.graphic.Topology.Layer", nx.graphic.Group, {
        view: {
            type: 'nx.graphic.Group',
            content: [
                {
                    name: 'active',
                    type: 'nx.graphic.Group'
                },
                {
                    name: 'static',
                    type: 'nx.graphic.Group'

                }
            ]
        },
        properties: {
            /**
             * Get topology
             * @property topology
             */
            topology: {
                value: null
            },
            highlightElements: {
                value: function () {
                    return [];
                }
            },
            fade: {
                value: false
            }
        },
        methods: {
            init: function (args) {
                this.inherited(args);
                this.resolve("@root").set("data-nx-type", this.__className__);
            },
            /**
             * Factory function, draw group
             */
            draw: function () {

            },
            /**
             * Show layer
             * @method show
             */
            show: function () {
                this.visible(true);
            },
            /**
             * Hide layer
             * @method hide
             */
            hide: function () {
                this.visible(false);
            },
            /**
             * Fade out all nodes
             * @method fadeOut
             */
            fadeOut: function (force, fn, context) {
                var el = this.resolve('static');
                var _force = force === undefined ? false : force;
                if (this._fade) {
                    return;
                }
                if (fn) {
                    el.upon('transitionend', function callback() {
                        fn.call(context || this);
                        el.upon('transitionend', null, this);
                    }, this);
                }
                el.setStyle('opacity', 0.2, 0.5);

                this._fade = _force;
            },
            /**
             * Fade in all nodes
             * @method fadeIn
             */
            fadeIn: function (fn, context) {
                var el = this.resolve('static') || this.resolve('@root');
                if (fn) {
                    el.upon('transitionend', function () {
                        fn.call(context || this);
                        el.upon('transitionend', null, this);
                    }, this);
                }
                el.setStyle('opacity', 1, 0.5);
            },
            highlightElement: function (el, force) {
                var _force = force === undefined ? false : force;
                if (this._fade && !force) {
                    return;
                }
                var highlightElements = this.highlightElements();
                var activeEl = this.resolve('active');

                highlightElements.push(el);
                el.append(activeEl);
                this.resolve('static').upon('transitionend', null, this);
            },
            recover: function (force) {
                var staticEl = this.resolve('static');
                var _force = force === undefined ? false : force;
                if (this._fade && !force) {
                    return;
                }
                this.fadeIn(function () {
                    nx.each(this.highlightElements(), function (el) {
                        el.append(staticEl);
                    }, this);
                    this.highlightElements([]);
                }, this);
                delete this._fade;
            },
            clear: function () {
                if (this._resources && this._resources.static) {
                    this.$('active').empty();
                    this.$('static').empty();
                    this.$('static').setStyle('opacity', 1);
                } else {
                    this.resolve("@root").empty();
                }
                this.highlightElements([]);
            },
            dispose: function () {
                this.clear();
                //this.inherited();
            }
        }
    });
})(nx, nx.util, nx.global);