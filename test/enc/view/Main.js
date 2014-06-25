(function (nx, global) {


    nx.define("ENC.TW.View", nx.ui.Component, {
        events: [],
        view: {
            props: {
                'class': 'tw row'
            },
            content: [
                {
                    type: 'ENC.TW.View.TopologyView',
                    props: {
                        'class': 'col-md-12 tw_topologyContainer'
                    }
                },
//                {
//                    type: 'ENC.TW.View.ControlView',
//                    props: {
//                        'class': 'col-md-4 '
//                    }
//                }
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