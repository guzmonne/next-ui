(function (nx, global) {
    nx.Binding.converters.objectToArray = {
        convert: function (value) {
            return nx.util.values(value);
        }
    };

    ENC.TW.aggregation = {
        activated: {
            convert: function (value) {
                return 'tw-aggregation-list-item-activated ' + (value ? 'fa  fa-caret-right' : 'fa  fa-caret-down')
            }
        },
        icon: {
            convert: function (value) {
                return 'n-icon-' + deviceTypeMapping[value];
            }
        },
        subVertices: {
            convert: function (value) {
                return value ? Object.keys(value).length : 0;
            }
        },
        child: {
            convert: function (value) {
                return value ? 'n-hidden' : '';
            }
        },
        num: {
            convert: function (value) {
                if (value < 2) {
                    return  value + " node has"
                } else {
                    return  value + " nodes have"
                }
            }
        }

    };


    nx.define("ENC.TW.View.Aggregation", nx.ui.Component, {
        events: [],
        view: {
            content: {
                props: {
                    'class': 'tw-aggregation'
                },
                content: [
                    {
                        tag: 'h5',
                        content: 'Aggregation List'
                    },
                    {
                        props: {
                            'class': 'tw-aggregation-list-box'
                        },
                        content: {
                            name: 'list',
                            type: 'ENC.TW.View.Aggregation.List',
                            props: {
                                vertexSets: '{controlVM.aggregation.vertexSets}',
//                                root: '{#owner}'
                            }
                        }
                    },
                    {
                        tag: 'h5',
                        content: 'Aggregation Action'
                    },
                    {
                        props: {
                            'class': 'tw-aggregation-action'
                        },
                        content: [
                            {
                                tag: 'button',
                                props: {
                                    'class': 'btn btn-warning btn-xs'
                                },
                                content: 'Expand All',
                                events: {
                                    'click': '{topologyVM.expandAll}'
                                }
                            }
                        ]
                    },
                    {

                        props: {
                            'class': 'tw-aggregation-rename'
                        },
                        content: {
                            name: 'renamePanel',
                            type: 'nx.ui.Popup',
                            props: {
                                'class': 'popover tw-aggregation-rename-panel'
                            },
                            content: {
                                tag: 'input',
                                props: {
                                    'value': '{controlVM.aggregation.currentNodeSet.label}'
                                }
                            }
                        }
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
            },
            rename: function (sender, events) {
                var vertexSet = sender.model();
                debugger;
            },
            attach: function (parent, index) {
                this.inherited(parent, index);
                this.view('list').root(this);
            }
        }
    });

    nx.define('ENC.TW.View.Aggregation.List', nx.ui.Component, {
        view: {
            tag: 'ul',
            props: {
                'class': 'tw-aggregation-list',
                items: '{#vertexSets,converter=objectToArray}',
                template: {
                    tag: 'li',
                    props: {
                        'class': 'tw-aggregation-list-item'
                    },
                    content: [
                        {
                            props: {
                                'class': 'tw-aggregation-list-item-info'
                            },
                            content: [
                                {
                                    tag: 'span',
                                    props: {
                                        'class': '{activated,converter=ENC.TW.aggregation.activated}'
                                    },
                                    events: {
                                        'click': '{#root.model.controlVM.aggregation.expand}'
                                    }
                                },
                                {
                                    tag: 'span',
                                    props: {
                                        'class': 'n-icon-GroupL tw-aggregation-list-item-icon',
                                        type: '{value.deviceType}'
                                    }
                                },
                                {
                                    tag: 'input',
                                    name: 'input',
                                    props: {
                                        'class': 'tw-aggregation-list-item-label',
                                        value: '{name}',
                                        'readOnly': true
                                    },
//                                    content: '{name}',
                                    events: {
                                        'click': '{#root.model.controlVM.aggregation.expand}',
                                        'blur': '{#_blur}',
                                        'keydown': '{#_key}'
                                    }
                                },
                                {
                                    tag: 'span',
                                    props: {
                                        'class': 'tw-aggregation-list-item-num'
                                    },
                                    content: '{subVertices,converter=ENC.TW.aggregation.subVertices}' //converter
                                },
                                {
                                    tag: 'span',
                                    props: {
                                        'class': 'fa fa-trash-o tw-aggregation-list-item-trash tools '
                                    },
                                    events: {
                                        'click': '{#root.model.controlVM.aggregation.delete}'
                                    }
                                },
                                {
                                    tag: 'span',
                                    props: {
                                        'class': 'fa fa-pencil-square-o tw-aggregation-list-item-edit tools'
                                    },
                                    events: {
                                        'click': '{#_rename}'
                                    }
                                }
                            ]
                        },
                        {
                            type: 'ENC.TW.View.Aggregation.List',
                            props: {
                                vertexSets: '{vertexSet}',
                                root: '{#root}',
                                'visible': '{activated,converter=inverted}'
                            }
                        },
                        {
                            props: {
                                'class': 'tw-aggregation-list-item-devices',
                                'visible': '{activated,converter=inverted}',
                                items: '{vertices,converter=objectToArray}',
                                template: {
                                    content: [
                                        {
                                            tag: 'span',
                                            props: {
                                                'class': '{deviceType,converter=ENC.TW.inventory.icon}',
                                                type: '{deviceType}'
                                            }
                                        },
                                        {
                                            tag: 'span',
                                            props: {
                                                'class': 'tw-aggregation-list-item-devices-label',
                                                type: '{label}'
                                            },
                                            content: '{label}'
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                }
            }
        },
        properties: {
            vertexSets: {

            },
            root: {}
        },
        methods: {
            _rename: function (sender, events) {
                var parent = sender.parent();
                var input = parent.content().getItem('2');
                if (input.dom().$dom.hasAttribute('readOnly')) {
                    input.dom().removeAttribute('readOnly');
                    input.dom().$dom.focus();
                } else {
                    input.dom().setAttribute('readOnly', 'true');
                }
            },
            _blur: function (sender, events) {
                sender.dom().setAttribute('readOnly', 'true');
                this.root().model().controlVM().aggregation().rename(sender.model());
            },
            _key: function (sender, event) {
                var code = event.keyCode;
                switch (code) {
                    case 13:
                        sender.dom().blur();
                }
            }
        }
    });


})(nx, nx.global);