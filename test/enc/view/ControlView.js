(function (nx, global) {
    nx.define("ENC.TW.View.ControlView", nx.ui.Component, {
        events: [],
        view: {
            content: [
                {
                    tag: 'button',
                    content: 'Optimize Label',
                    events: {
                        'click': '{controlVM.viewSetting.optimizeLabel}'
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