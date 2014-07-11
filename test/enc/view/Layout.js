(function (nx, global) {


    ENC.TW.layout = {
        activated: {
            convert: function (value) {
                var cls = '';
                if (value) {
                    cls += ' active';
                }
                return cls;
            }
        }

    };


    nx.define("ENC.TW.View.Layout", nx.ui.Component, {
        events: [],
        view: {
            content: [
                {
                    props: {
                        'class': 'tw-setting'
                    },
                    content: [
                        {
                            tag: 'h5',
                            content: 'Label'
                        },
                        {
                            tag: 'div',
                            props: {
                                'class': 'list-group',
                                items: '{controlVM.layout.types}',
                                template: {
                                    tag: 'a',
                                    content: '{label}',
                                    props: {
                                        'class': ['list-group-item', '{activated,converter=ENC.TW.layout.activated}']
                                    },
                                    events: {
                                        'click': '{#owner.model.controlVM.layout.switchLayout}'
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