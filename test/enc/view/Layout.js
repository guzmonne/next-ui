(function (nx, global) {


    ENC.TW.layout = {
        activated: {
            convert: function (value) {
                var model = this.target().model();
                var cls = 'list-group-item';
                if (value && value == 'Enterprise network layout') {
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
                                items: [
                                    {id: 'Enterprise network layout'},
                                    {id: 'Force layout'}
                                ],
                                template: {
                                    tag: 'a',
                                    content: '{id}',
                                    props: {
                                        'class': '{id,converter=ENC.TW.layout.activated}'
                                    }
                                }
                            }
                        },
                        {
                            tag: 'button',
                            props: {
                                'class': 'btn btn-info btn-xs'
                            },
                            content: 'Save Layout',
                            events: {
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