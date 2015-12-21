(function (nx, global) {
    nx.define("ENC.TW.View.ControlView", nx.ui.Component, {
        events: [],
        view: {
            props: {
            },
            content: [
                {
                    type: 'ENC.TW.View.Toolbar'
                },
                {
                    type: 'ENC.TW.View.Search'
                }
            ]
        },
        properties: {
        },
        methods: {
        }
    });
})(nx, nx.global);