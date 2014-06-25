(function (nx, global) {
    nx.define("ENC.TW.View.ControlView", nx.ui.Component, {
        events: [],
        view: {
            content: [
                {
                    props: {
                        'class': 'col-xs-1'
                    },
                    content: {
                        tag: 'ul',
                        props: {
                            'class': 'nav nav-tabs tabs-right',
                            items: ['fa fa-sitemap', 'View', 'Dict'],
                            template: {
                                tag: 'li',
                                content: {
                                    tag: 'a',
                                    props:{
                                        'class':'{}'
                                    }
                                }
                            }
                        }
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