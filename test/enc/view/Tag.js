(function (nx, global) {

    ENC.TW.tag = {
        opened: {
            convert: function (value) {
                return 'tw-tag-list-item-opened ' + (value ? 'fa fa-caret-down' : 'fa   fa-caret-right');
            }
        }
    };


    nx.define("ENC.TW.View.Tag", nx.ui.Component, {
        events: [],
        view: {
            content: [
                {
                    tag: 'input',
                    props: {
                        'class': 'form-control tw-tag-search',
                        value: '{controlVM.inventory.searchKey}',
                        placeholder: 'Search'
                    }
                },
                {
                    props: {
                        'class': 'tw-tag-list'
                    },
                    content: {
                        tag: 'ul',
                        props: {

                            items: '{controlVM.tag.tags}',
                            template: {
                                tag: 'li',
                                props: {
                                    'class': ['tw-tag-list-item']
                                },
                                content: [
                                    {
                                        content: [
                                            {
                                                tag: 'span',
                                                props: {
                                                    'class': '{opened,converter=ENC.TW.tag.opened}'
                                                },
                                                events: {
                                                    'click': '{#_collapsed}'
                                                }
                                            },
                                            {
                                                tag: 'input',
                                                name: 'input',
                                                props: {
                                                    'class': 'tw-tag-list-item-label',
                                                    value: '{key}',
                                                    'readOnly': true
                                                },
                                                events: {
                                                    'click': '{#root.model.controlVM.tag.highlightTag}',
                                                    'blur': '{#_blur}',
                                                    'keydown': '{#_key}'
                                                }
                                            },
                                            {
                                                tag: 'span',
                                                props: {
                                                    'class': 'tw-tag-list-item-num'
                                                },
                                                content: '{nodes.length}' //converter
                                            },
                                            {
                                                tag: 'span',
                                                props: {
                                                    'class': 'fa fa-trash-o tw-tag-list-item-trash tools '
                                                },
                                                events: {
                                                    'click': '{#root.model.controlVM.tag.delete}'
                                                }
                                            },
                                            {
                                                tag: 'span',
                                                props: {
                                                    'class': 'fa fa-pencil-square-o tw-tag-list-item-edit tools'
                                                },
                                                events: {
                                                    'click': '{#_rename}'
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        //list
                                    }

                                ],
                                events: {
//                                    'click': '{#owner.model.controlVM.inventory.selectItem}',
                                    'mouseenter': '{#owner.model.controlVM.tag.highlightTag}',
                                    'mouseleave': '{#owner.model.controlVM.tag.recoverTag}'
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
            _rename: function (sender, event) {
                var parent = sender.parent();
                var input = parent.content().getItem('1');
                if (input.dom().$dom.hasAttribute('readOnly')) {
                    input.dom().removeAttribute('readOnly');
                    input.dom().$dom.focus();
                } else {
                    input.dom().setAttribute('readOnly', 'true');
                }
                return false;
            },
            _blur: function (sender, events) {
                sender.dom().setAttribute('readOnly', 'true');
                this.model().controlVM().tag().update(sender.model());
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