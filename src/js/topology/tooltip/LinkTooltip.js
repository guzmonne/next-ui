(function (nx, util, global) {
    /**
     * @class nx.graphic.LinkTooltip
     * @extend nx.graphic.Tooltip
     */

    nx.ui.define("nx.graphic.LinkTooltip", nx.graphic.Tooltip, {
        properties: {
            lazyClose:{
                value:true
            }
        },
        methods: {
            onInit: function () {
                this.lazyClose(true);
            }
        }
    });


    /**
     * @class nx.graphic.LinkTooltipContent
     * @extend nx.ui.Component
     */
    nx.ui.define("nx.graphic.LinkTooltipContent", {
        view: {},
        methods: {
            onInit: function () {
                this.watch("model", function (prop, value) {
                    if (value) {
                        this.resolve().setContent(value.get("id"));
                    }
                },this);
            }
        }
    });


})(nx, nx.graphic.util, nx.global);