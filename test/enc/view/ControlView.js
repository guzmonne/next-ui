(function (nx, global) {
    nx.define("ENC.TW.View.ControlView", nx.ui.Component, {
        events: [],
        view: {
            props: {
                'class': 'btn-group'
            },
            content: [
                {
                    tag: 'button',
                    props: {
                        'class': 'btn btn-default'
                    },
                    content: 'Optimize Label',
                    events: {
                        'click': '{controlVM.viewSetting.optimizeLabel}'
                    }
                },
                {
                    tag: 'button',
                    content: 'Expand All',
                    props: {
                        'class': 'btn btn-default'
                    },
                    events: {
                        'click': '{topologyVM.expandAll}'
                    }
                }
            ]
        },
        properties: {
        },
        methods: {
        }
    });
})(nx, nx.global);