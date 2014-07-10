(function (nx, global) {

    nx.define("ENC.TW.View.Toolbar", nx.ui.Component, {
        events: [],
        view: {
            props: {
                'class': 'tw-toolbar'
            },
            content: [
                {
                    tag: 'ul',
                    props: {
                    },
                    content: [
                        {
                            tag: 'li',
                            content: [
                                {
                                    tag: 'span',
                                    content: 'Layer',
                                    props: {
                                        target: 'layer'
                                    },
                                    events: {
                                        'click': '{#_toggle}'
                                    }
                                },
                                {
                                    name: 'layer',
                                    type: 'ENC.TW.View.Layer',
                                    props: {
                                        'class': 'tw-toolbar-body n-hidden'
                                    }
                                }
                            ]
                        },
                        {
                            tag: 'li',
                            content: [
                                {
                                    tag: 'span',
                                    content: 'Inventory',
                                    props: {
                                        target: 'inventory'
                                    },
                                    events: {
                                        'click': '{#_toggle}'
                                    }
                                },
                                {
                                    name: 'inventory',
                                    type: 'ENC.TW.View.Inventory',
                                    props: {
                                        'class': 'tw-toolbar-body n-hidden'
                                    }
                                }
                            ]
                        },
                        {
                            tag: 'li',
                            content: [
                                {
                                    tag: 'span',
                                    props: {
                                        target: 'aggregation'
                                    },
                                    content: 'Aggregation',

                                    events: {
                                        'click': '{#_toggle}'
                                    }
                                },
                                {
                                    name: 'aggregation',
                                    type: 'ENC.TW.View.Aggregation',
                                    props: {
                                        'class': 'tw-toolbar-body n-hidden',
                                        type: 'aggregation'
                                    }
                                }
                            ]
                        } ,
                        {
                            tag: 'li',
                            content: [
                                {
                                    tag: 'span',
                                    content: [
                                        {
                                            tag: 'span',
                                            content: 'Selection'
                                        },
                                        {
                                            tag: 'span',
                                            props: {
                                                'class': 'tw-toolbar-hint'
                                            },
                                            content: '{topology.selectedNodes.count}'
                                        }
                                    ],
                                    props: {
                                        target: 'selection'
                                    },
                                    events: {
                                        'click': '{#_toggle}'
                                    }
                                },
                                {
                                    name: 'selection',
                                    type: 'ENC.TW.View.Selection',
                                    props: {
                                        'class': 'tw-toolbar-body n-hidden'
                                    }
                                }
                            ]
                        },
                        {
                            tag: 'li',
                            content: [
                                {
                                    tag: 'span',
                                    content: 'Layout',
                                    props: {
                                        target: 'layout'
                                    },
                                    events: {
                                        'click': '{#_toggle}'
                                    }
                                },
                                {
                                    name: 'layout',
                                    type: 'ENC.TW.View.Layout',
                                    props: {
                                        'class': 'tw-toolbar-body n-hidden'
                                    }
                                }
                            ]
                        },
                        {
                            tag: 'li',
                            content: [
                                {
                                    tag: 'span',
                                    content: 'Setting',
                                    props: {
                                        target: 'setting'
                                    },
                                    events: {
                                        'click': '{#_toggle}'
                                    }
                                },
                                {
                                    name: 'setting',
                                    type: 'ENC.TW.View.Setting',
                                    props: {
                                        'class': 'tw-toolbar-body n-hidden'
                                    }
                                }
                            ]
                        },
                        {
                            tag: 'li',
                            content: [
                                {
                                    tag: 'span',
                                    content: 'Save',
                                    props: {
                                        'class': 'tw-save-btn',
                                        visible: '{topologyVM.updated}'
                                    },
                                    events: {
                                        'click': '{topologyVM.savePosition}'
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        properties: {
        },
        methods: {
            _toggle: function (sender, event) {
                var target = sender.get('target');
                this._toggleClass(target);
            },
            _toggleClass: function (name) {
                var dom = this.view(name).dom();
                if (dom.hasClass('n-hidden')) {
                    this._closeAll();
                    dom.removeClass('n-hidden');
                } else {
                    this._closeAll();
                }
            },
            _closeAll: function () {
                nx.each(document.querySelectorAll('.tw-toolbar-body'), function (dom) {
                    dom.classList.add('n-hidden');
                })
            }
        }
    });


})(nx, nx.global);