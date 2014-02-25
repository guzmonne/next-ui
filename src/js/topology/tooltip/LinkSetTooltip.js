(function (nx, util, global) {
    /**
     * @class nx.graphic.LinkSetTooltip
     * @extend nx.graphic.Tooltip
     */

    nx.ui.define("nx.graphic.LinkSetTooltip", nx.ui.Popover, {
        properties: {
            lazyClose: {
                value: true
            }
        },
        methods: {
            onInit: function () {
                this.lazyClose(true);
            }
        }
    });


    /**
     * @class nx.graphic.LinkSetTooltipContent
     * @extend nx.ui.Component
     */
    nx.ui.define("nx.graphic.LinkSetTooltipContent", {
        properties: {
            linkSet: {}
        },
        view: {
            content: [
                {
                    props: {
                        style: {
                            'maxHeight': '247px',
                            'overflow': 'auto'
                        }
                    },
                    content: {
                        name: 'list',
                        type: 'nx.ui.SelectableList',
                    }
                }
            ]
        },
        methods: {
            onInit: function () {
                this.watch("linkSet", function (prop, linkSet) {
                    if (linkSet) {
                        var labels = [];
                        nx.each(linkSet.getLinks(), function (link) {
                            labels.push("<b>Source</b> :" + link.sourceNode().label() + " <b>Target</b> :" + link.targetNode().label());
                        });
                        this.resolve("list").items(labels);
                    }
                }, this);
            }
        }
    });


})(nx, nx.graphic.util, nx.global);