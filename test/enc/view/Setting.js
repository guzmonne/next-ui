(function (nx, global) {


    ENC.TW.setting = {
        switcher: {
            convert: function (value) {
                return value ? true : false
            }
        },
        activated: {
            convert: function (value) {
                var cls = 'list-group-item';
                if (value && value == 'label') {
                    cls += ' active';
                }
                return cls;
            }
        }

    };


    nx.define("ENC.TW.View.Setting", nx.ui.Component, {
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
                                items: [
                                    {id: 'label'},
                                    {id: 'ip'},
                                    {id: 'none'}
                                ],
                                template: {
                                    tag: 'a',
                                    content: '{id}',
                                    props: {
                                        'class': '{id,converter=ENC.TW.setting.activated}'
                                    }
                                }
                            }
                        },
                        {
                            tag: 'button',
                            props: {
                                'class': 'btn btn-info btn-xs'
                            },
                            content: 'Optimize Label',
                            events: {
                                'click': '{controlVM.viewSetting.optimizeLabel}'
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