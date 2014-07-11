(function (nx, global) {
    ENC.TW.selection = {
        aggregatable: {
            convert: function (len) {
                if (len < 2) {
                    return  "disabled"
                } else {
                    return  ''
                }
            }
        },
        num: {
            convert: function (len) {
                if (len < 2) {
                    return  len + " device has"
                } else {
                    return  len + " devices have"
                }
            }
        }

    };


    nx.define("ENC.TW.View.Selection", nx.ui.Component, {
        events: [],
        view: {
            content: {
                props: {
                    'class': 'tw-selection'
                },
                content: [
                    {
                        tag: 'h5',
                        content: 'List'
                    },

                    {
                        props: {
                            'class': 'tw-node-list'
                        },
                        content: {
                            tag: 'ul',
                            props: {
                                items: '{controlVM.selection.selectedNodes}',
                                template: {
                                    tag: 'li',
                                    props: {
                                        'class': ['tw-node-list-item', '{model.generated,converter=ENC.TW.nodelist.generated}']
                                    },
                                    content: [
                                        {
                                            tag: 'input',
                                            props: {
                                                type: 'checkbox',
                                                checked: 'checked',
                                                disabled: true
                                            }
                                        },
                                        {
                                            tag: 'span',
                                            props: {
                                                'class': 'tw-node-list-item-color',
                                                color: '{model.color}'
                                            }

                                        },
                                        {
                                            tag: 'span',
                                            props: {
                                                'class': '{model.deviceType,converter=ENC.TW.converter.icon}',
                                                type: '{model.deviceType}'
                                            }
                                        },
                                        {
                                            tag: 'span',
                                            props: {
                                                'class': 'tw-node-list-item-label',
                                                type: '{model.label}'
                                            },
                                            content: '{model.label}'
                                        },
                                    ],
                                    events: {
                                        'click': '{#owner.model.controlVM.inventory.selectItem}',
                                        'mouseenter': '{#owner.model.controlVM.selection.highlightItem}',
                                        'mouseleave': '{#owner.model.controlVM.selection.recoverItem}'
                                    }

                                }
                            }
                        }
                    },
                    {
                        tag: 'h5',
                        content: 'Action'
                    },
                    {
                        props: {
                            'class': 'tw-selection-action'
                        },
                        content: [
                            {
                                props: {
                                    'class': 'tw-selection-action-info'
                                },
                                content: [
                                    {
                                        tag: 'span',
                                        content: '{controlVM.selection.selectedNodes.length,converter=ENC.TW.selection.num}'
                                    },
                                    {
                                        tag: 'span',
                                        props: {

                                        },
                                        content: ' been selected.'
                                    },
                                ]
                            },
                            {
                                content: [
                                    {
                                        tag: 'button',
                                        props: {
                                            'class': 'btn btn-warning btn-xs',
                                            disabled: '{controlVM.selection.selectedNodes.length,converter=ENC.TW.selection.aggregatable}'
                                        },
                                        content: 'Aggregate',
                                        events: {
                                            'click': '{controlVM.selection.aggregate}'
                                        }
                                    },
                                    {
                                        tag: 'button',
                                        props: {
                                            'class': 'btn btn-warning btn-xs',
                                            disabled: '{controlVM.selection.selectedNodes.length,converter=inverted}'
                                        },
                                        content: 'Add Tag',
                                        events: {
                                            'click': '{controlVM.selection.addTag}'
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]

            }
        },
        properties: {
            item: {}
        },
        methods: {
            _activated: function (sender, events) {
                var vertexSet = sender.model();
                vertexSet.activated(!vertexSet.activated());
            }
        }
    });

})(nx, nx.global);