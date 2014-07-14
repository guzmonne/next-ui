(function (nx, global) {

    ENC.TW.nodelist = {
        generated: {
            convert: function (value) {
                return value ? 'tw-node-list-item-generated' : ''
            }
        },
        selectable: {
            convert: function (value) {
                return value ? '' : 'disabled'
            }
        },
        checked: {
            convert: function (value) {
                if (value) {
                    return value ? 'checked' : ''
                } else {
                    return '';
                }
            },
            convertBack: function (value) {
                return value;
            }
        }
    };


    nx.define("ENC.TW.View.Inventory", nx.ui.Component, {
        events: [],
        view: {
            content: [
                {
                    tag: 'input',
                    props: {
                        'class': 'form-control tw-inventory-search',
                        value: '{controlVM.inventory.searchKey}',
                        placeholder: 'Search'
                    }
                },
                {
                    props: {
                        'class': 'tw-node-list'
                    },
                    content: {
                        tag: 'ul',
                        props: {

                            items: '{controlVM.inventory.devices}',
                            template: {
                                tag: 'li',
                                props: {
                                    'class': ['tw-node-list-item', '{value.generated,converter=ENC.TW.nodelist.generated}']
                                },
                                content: [
                                    {
                                        tag: 'input',
                                        props: {
                                            type: 'checkbox',
                                            checked: '{value.selected,converter=ENC.TW.nodelist.checked,direction=<>}',
                                            disabled: 'true'//'{value.generated,converter=ENC.TW.nodelist.selectable}'
                                        }
                                    },
                                    {
                                        tag: 'span',
                                        props: {
                                            'class': 'tw-node-list-item-color',
                                            style: {
                                                'borderColor': '{value.color}'
                                            },
                                            color: '{value.color}'
                                        },
                                        events: {
                                            'click': '{#_changeColor}'
                                        }

                                    },
                                    {
                                        tag: 'span',
                                        props: {
                                            'class': '{value.deviceType,converter=ENC.TW.converter.icon}',
                                            type: '{value.deviceType}'
                                        }
                                    },
                                    {
                                        tag: 'span',
                                        props: {
                                            'class': 'tw-node-list-item-label',
                                            type: '{value.label}'
                                        },
                                        content: '{value.label}'
                                    },
                                    {
                                        tag: 'span',
                                        props: {
                                            'class': 'tw-node-list-item-info fa fa-info-circle'
                                        },
                                        events: {
                                            'click': '{#_showInfo}'
                                        }
                                    },
                                    {
                                        tag: 'span',
                                        props: {
                                            'class': 'tw-node-list-item-locate-node  fa fa-bullseye'
                                        },
                                        events: {
                                            'click': '{#owner.model.controlVM.inventory.locateNode}'
                                        }
                                    }
                                ],
                                events: {
                                    'click': '{#owner.model.controlVM.inventory.selectItem}',
                                    'mouseenter': '{#owner.model.controlVM.inventory.highlightItem}',
                                    'mouseleave': '{#owner.model.controlVM.inventory.recoverItem}'
                                }

                            }
                        }
                    }
                },
                {
                    name: 'info',
                    props: {
                        'class': 'tw-inventory-info'
                    },
                    content: [
                        {
                            tag: 'span',
                            props: {
                                'class': '{#item.deviceType,converter=ENC.TW.nodelist.icon}'
                            }
                        },
                        {
                            tag: 'h1',
                            content: '{#item.label}'
                        },
                        {
                            tag: 'h3',
                            content: '{#item.deviceType}'
                        },
                        {
                            tag: 'label',
                            content: '{#item.ip}'
                        }
                    ]
                }
            ]
        },
        properties: {
            item: {}
        },
        methods: {
            _showInfo: function (sender, events) {
                var vertex = sender.model().value();
                this.item(vertex);
                var bound = sender.dom().getBound();
                this.view('info').dom().setStyles({
                    left: bound.left + 32,
                    top: bound.top - 20,
                    display: 'block'
                });
            },
            _changeColor: function (sender, events) {
                var colors = ['#59FF32', '#FFAD32', '#FF3253', ''];
                var vertex = sender.model().value();
                var color = vertex.get('color');
                var index = colors.indexOf(color);
                index++;
                if (index >= colors.length) {
                    index = 0;
                }
                console.log(index);
                vertex.set('color', colors[index])

            }
        }
    });
})(nx, nx.global);