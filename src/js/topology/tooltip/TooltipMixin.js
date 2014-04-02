(function (nx, global) {

    /**
     * Tooltip mixin class
     * @class nx.graphic.Topology.TooltipMixin
     *
     */

    nx.define("nx.graphic.Topology.TooltipMixin", {
        events: [],
        properties: {
            /**
             * get tooltip manager
             * @property tooltipManager
             */
            tooltipManager: {
                value: function () {
                    return new nx.graphic.Topology.TooltipManager({topology: this});
                }
            },
            /**
             * Set/get the tooltip manager config
             * @property tooltipManagerConfig
             */
            tooltipManagerConfig: {
                get: function () {
                    return this._tooltipManagerConfig;
                },
                set: function (value) {
                    if (value) {
                        var tooltipManager = this.tooltipManager();
                        nx.each(value, function (value, prop) {
                            tooltipManager.set(prop, value);
                        });

                        if (value.tooltipPolicyClass) {
                            var tooltipPolicyClass = nx.path(global, value.tooltipPolicyClass);
                            var tooltipPolicy = new tooltipPolicyClass({
                                topology: this,
                                tooltipManager: tooltipManager
                            });
                            tooltipManager.tooltipPolicy(tooltipPolicy);
                        }
                    }
                    this._tooltipManagerConfig = value;
                }
            }
        },
        methods: {

        }
    });


})(nx, nx.global);