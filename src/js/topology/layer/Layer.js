(function (nx, global) {

    /**
     * Topology basic layer class
     * @class nx.graphic.Topology.Layer
     * @extend nx.graphic.Group
     * @module nx.graphic.Topology
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
            /**
             * Layer's highlight element's collection
             * @property highlightElements
             */
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
             * fade out layer
             * @method fadeOut
             * @param [force] {Boolean} force layer fade out and can't fade in
             * @param [callback] {Function} callback after fade out
             * @param [context] {Object} callback context
             */
            fadeOut: function (force, callback, context) {
                var el = this.resolve('static') || this.resolve('@root');
                var _force = force !== undefined;
                if (this._fade && !_force) {
                    return;
                }
                if (callback) {
                    el.on('transitionend', function fn() {
                        callback.call(context || this);
                        el.off('transitionend', fn, this);
                    }, this);
                }
                el.setStyle('opacity', 0.2, 0.5);

                this._fade = _force;
            },
            /**
             * Fade in layer
             * @method fadeIn
             * @param [callback] {Function} callback after fade out
             * @param [context] {Object} callback context
             */
            fadeIn: function (callback, context) {
                var el = this.resolve('static') || this.resolve('@root');
                if (callback) {
                    el.on('transitionend', function fn() {
                        callback.call(context || this);
                        el.off('transitionend', fn, this);
                    }, this);
                }

                el.setStyle('opacity', 1, 0.5);
            },
            /**
             * Recover layer's fade statues
             * @param force {Boolean} force recover all items
             */
            recover: function (force, callback, context) {
                var staticEl = this.resolve('static') || this.resolve('@root');
                if (this._fade && !force) {
                    return;
                }

                var fn = function () {
                    nx.each(this.highlightElements(), function (el) {
                        el.append(staticEl);
                    }, this);
                    this.highlightElements([]);
                    if (callback) {
                        callback.call(context || this);
                    }
                };

                staticEl.setStyle('opacity', 1);
                fn.call(this);
//                this.fadeIn(fn, this);

                //this.show();

                delete this._fade;
            },
            /**
             * Move a element to 'active' group for highlight this element

             layer.highlightElement(this.view('node1'));
             layer.fadeout();

             * @method highlightElement
             * @param el {nx.graphic.Component} element for highlight
             */
            highlightElement: function (el) {
                var highlightElements = this.highlightElements();
                var activeEl = this.resolve('active');

                highlightElements.push(el);
                el.append(activeEl);
                this.resolve('static').upon('transitionend', null, this);
            },
            /**
             * clear layer's content
             * @method clear
             */
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
})(nx, nx.global);