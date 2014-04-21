(function (nx, global) {

    /**
     * Topology basic layer class
     * @class nx.graphic.Topology.Layer
     * @extend nx.graphic.Group
     * @module nx.graphic.Topology
     */
    nx.define("nx.graphic.Topology.Layer", nx.graphic.Group, {
        view: {
            type: 'nx.graphic.Group'
        },
        properties: {
            /**
             * Get topology
             * @property topology
             */
            topology: {
                value: null
            },
            fade: {
                value: false
            }
        },
        methods: {
            init: function (args) {
                this.inherited(args);
                this.view().set("data-nx-type", this.__className__);
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
                var el = this.view();
                var _force = force !== undefined;
                if (this._fade && !_force) {
                    return;
                }
                el.setStyle('opacity', 0.2, 0.5, callback, context);
                this._fade = _force;
            },
            /**
             * Fade in layer
             * @method fadeIn
             * @param [callback] {Function} callback after fade out
             * @param [context] {Object} callback context
             */
            fadeIn: function (callback, context) {
                var el = this.view();
                el.setStyle('opacity', 0.2, 1, callback, context);
            },
            /**
             * Recover layer's fade statues
             * @param force {Boolean} force recover all items
             * @param [callback] {Function} callback after fade out
             * @param [context] {Object} callback context
             */
            recover: function (force, callback, context) {
                var el = this.view();
                if (this._fade && !force) {
                    return;
                }

                el.setStyle('opacity', 1, 0, callback, context);
                delete this._fade;
            },
            /**
             * clear layer's content
             * @method clear
             */
            clear: function () {
                this.view().dom().empty();
            },
            dispose: function () {
                this.clear();
                //this.inherited();
            }
        }
    });
})(nx, nx.global);