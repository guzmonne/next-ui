(function (nx, global) {


    nx.define("ENC.TW.View", nx.ui.Component, {
        events: [],
        view: {
            props: {
                'class': 'tw'
            },
            content: [
                {
                    type: 'ENC.TW.View.ControlView',
                    props: {
                        'class': 'btn-group'
                    }
                },
                {
                    type: 'ENC.TW.View.TopologyView',
                    props: {
                        'class': ' tw_topologyContainer'
                    }
                }
            ]
        },
        properties: {
        },
        methods: {
            init: function (args) {
                this.inherited(args);
            },
            attach: function (args) {
                this.inherited(args);
            }
        }
    });


})(nx, nx.global);