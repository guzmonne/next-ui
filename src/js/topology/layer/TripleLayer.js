(function (nx, global) {

    /**
     * Topology basic layer class
     * @class nx.graphic.Topology.Layer
     * @extend nx.graphic.Group
     * @module nx.graphic.Topology
     */
    nx.define("nx.graphic.Topology.TripleLayer", nx.graphic.Topology.Layer, {
        view: {
            type: 'nx.graphic.Group',
            content: [
                {
                    name: 'highlight',
                    type: 'nx.graphic.Group'
                },
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
             * Layer's highlight element's collection
             * @property highlightedElements
             */
            highlightedElements: {
                value: function () {
                    return new nx.data.ObservableCollection();
                }
            },
            activeElements: {
                value: function () {
                    return new nx.data.ObservableCollection();
                }
            }
        },
        methods: {
            init: function (args) {
                this.inherited(args);

                var highlightEL = this.view('highlight') || this.view();
                var staticEL = this.view('static') || this.view();
                var activeEl = this.view('active') || this.view();

                var highlightedElements = this.highlightedElements();
                var activeElements = this.activeElements();

                highlightedElements.on('change', function (sender, args) {
                    if (args.action == 'add') {
                        nx.each(args.items, function (el) {
                            el.append(highlightEL);
                        });
                    } else if (args.action == 'remove' || args.action == "clear") {
                        nx.each(args.items, function (el) {
                            el.append(staticEL);
                        });
                    }
                });


                activeElements.on('change', function (sender, args) {
                    if (args.action == 'add') {
                        nx.each(args.items, function (el) {
                            if (highlightedElements.indexOf(el) == -1) {
                                el.append(activeEl);
                            }
                        });
                    } else if (args.action == 'remove' || args.action == "clear") {
                        nx.each(args.items, function (el) {
                            el.append(staticEL);
                        });
                    }
                });


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
                var el = this.view('static');
                var _force = force !== undefined;
                if (this._fade && !_force) {
                    return;
                }
                el.setStyle('opacity', 0.2, 0.5, callback, context);
                this._fade = _force;
            },
            /**
             * FadeIn layer's fade statues
             * @param force {Boolean} force recover all items
             * @param [callback] {Function} callback after fade out
             * @param [context] {Object} callback context
             */
            fadeIn: function (force, callback, context) {
                var el = this.view('static');
                if (this._fade && !force) {
                    return;
                }

                el.setStyle('opacity', 1, 0, callback, context);
                delete this._fade;
            },
            /**
             * @param force {Boolean} force recover all items
             * @param [callback] {Function} callback after fade out
             * @param [context] {Object} callback context
             */
            recover: function (force, callback, context) {
                this.fadeIn(force, callback, context);
            },
            /**
             * clear layer's content
             * @method clear
             */
            clear: function () {
                this.view('active').dom().empty();
                this.view('static').dom().empty();
                this.view('highlight').dom().empty();
                this.view('static').dom().setStyle('opacity', 1);
                this.highlightedElements().clear();
                this.activeElements().clear();
            },
            dispose: function () {
                this.clear();
                this.highlightedElements().clear();
                this.activeElements().clear();
                this.inherited();
            }
        }
    });
})(nx, nx.global);