(function (nx, util, global) {
    /**
     * Node tooltip class
     * @class nx.graphic.NodeTooltip
     * @extend nx.graphic.Tooltip
     */
    nx.ui.define("nx.graphic.NodeTooltip", nx.graphic.Tooltip, {
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
     * Node tooltip content class
     * @class nx.graphic.NodeTooltipContent
     * @extend nx.ui.Component
     */

    nx.ui.define("nx.graphic.NodeTooltipContent", {
        view: {
            content: [
                {
                    name: 'header',
                    props: {
                        'class': 'n-topology-node-tootltip-header'
                    },
                    content: [
                        {
                            name: "actions",
                            props: {
                                'class': 'n-topology-node-tootltip-header-actions'
                            },
                            content: [
                                {
                                    name: 'thumbtack',
                                    tag: 'i',
                                    props: {
                                        'class': '{icon}',
                                        'aria-selected': '{pin}'
                                    },
                                    events: {
                                        "click": "{_pinDialog}"
                                    }
                                }
                            ]
                        },
                        {
                            tag: 'span',
                            props: {
                                'class': 'n-topology-node-tootltip-header-text'
                            },
                            name: 'title'
                        }
                    ]
                },
                {
                    name: 'content',
                    props: {
                        'class': 'n-topology-node-tootltip-content n-list'
                    },
                    content: [
                        {
                            name: "list",
                            tag: "ul",
                            props: {
                                items: '{keys}',
                                'class': 'n-list-wrap',
                                template: {
                                    tag: "li",
                                    props: {
                                        'class': 'n-list-item-i',
                                        role: 'listitem'
                                    },
                                    content: [
                                        {
                                            tag: 'label',
                                            content: "{key}: "
                                        },
                                        {
                                            tag: 'span',
                                            content: "{value}"
                                        }
                                    ]

                                }
                            }
                        }
                    ]
                }
            ]
        },
        methods: {
            onInit: function () {
                this.watch("model", function (prop, value) {

                    if (value) {
                        var keysArray = [];
                        nx.each(value._data, function (value, key) {
                            if (value !== undefined && !util.isObject(value)) {
                                keysArray.push({
                                    value: value,
                                    key: key
                                });
                            }
                        });
                        this.resolve("list").items(keysArray);
                        this.resolve("title").setContent(value.get("id"));


                    }
                }, this);


            }
        }
    });
})(nx, nx.graphic.util, nx.global);