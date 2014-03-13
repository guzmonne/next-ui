(function (nx, util, global) {
    'use strict';

    /**
     * Topology basic layer class
     * @class nx.graphic.Topology.Layer
     * @extend nx.graphic.Component
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
            }
        },
        methods: {
            init: function (args) {
                this.init.__super__.apply(this, args);
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
            clear: function () {
                //this.resolve("@root").empty();
            }
        }
    });
})(nx, nx.graphic.util, nx.global);