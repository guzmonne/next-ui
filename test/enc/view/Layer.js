(function (nx, global) {


    ENC.TW.layer = {
        switcher: {
            convert: function (value) {
                return value ? true : false
            }
        },
        activated: {
            convert: function (value) {
                var model = this.target().model();
                var cls = 'list-group-item tw-layer-item';
                if (model && value && model.id == value) {
                    cls += ' active';
                }
                return cls;
            }
        }

    };


    nx.define("ENC.TW.View.Layer", nx.ui.Component, {
        events: [],
        view: {
            content: [
                {
                    props: {
                        'class': 'tw-layer'
                    },
                    content: [
                        {
                            tag: 'h5',
                            props: {
                            },
                            content: 'Layers'
                        },
                        {
                            props: {
                                'class': 'list-group',
                                items: '{controlVM.layer.layers}',
                                template: {
                                    tag: 'a',
                                    props: {
                                        'class': '{#owner.model.controlVM.layer.type,converter=ENC.TW.layer.activated}'
                                    },
                                    content: [
                                        {
                                            tag: 'span',
                                            content: '{label}',
                                            props: {
                                                href: '#'
                                            }
                                        },
                                        {
                                            tag: 'span',
                                            props: {
                                                'class': 'tw-layer-item-number'
                                            },
                                            content: '{number}'
                                        },
                                        {
                                            tag: 'i',
                                            props: {
                                                'class': 'fa fa-tasks tw-layer-item-switcher',
                                                visible: '{number,converter=ENC.TW.layer.switcher}'
                                            }
                                        }
                                    ],
                                    events: {
                                        'click': '{#owner.model.controlVM.layer.switchLayer}'
                                    }
                                }
                            }
                        }
                    ]
                },

            ]
        },
        properties: {
            item: {}
        },
        methods: {
        }
    });
})(nx, nx.global);