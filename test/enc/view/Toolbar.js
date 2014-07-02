(function (nx, global) {

    nx.define("ENC.TW.View.Toolbar", nx.ui.Component, {
        events: [],
        view: {
            props: {
                'class': 'tw-toolbar'
            },
            content: [
                {
                    tag: 'ul',
                    props: {
                    },
                    content: [
                        {
                            tag: 'li',
                            content: [
                                {
                                    tag: 'span',
                                    content: 'Optimize Label',
                                    events: {
                                        'click': '{controlVM.viewSetting.optimizeLabel}'
                                    }
                                }
                            ]
                        },
                        {
                            tag: 'li',
                            content: [
                                {
                                    tag: 'span',
                                    content: 'Expand All',
                                    events: {
                                        'click': '{topologyVM.expandAll}'
                                    }
                                }
                            ]
                        },
                        {
                            tag: 'li',
                            content: [
                                {
                                    tag: 'span',
                                    content: 'Inventory',
                                    events: {
                                        'click': '{#_toggleInventory}'
                                    }
                                },
                                {
                                    name: 'inventory',
                                    type: 'ENC.TW.View.Inventory',
                                    props: {
                                        'class': 'tw-toolbar-body n-hidden'
                                    }
                                }
                            ]
                        },
                        {
                            tag: 'li',
                            content: [
                                {
                                    tag: 'span',
                                    content: 'Aggregation',
                                    events: {
                                        'click': '{#_toggleAggregation}'
                                    }
                                },
                                {
                                    name: 'aggregation',
                                    type: 'ENC.TW.View.Aggregation',
                                    props: {
                                        'class': 'tw-toolbar-body n-hidden'
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        properties: {
        },
        methods: {
            _toggleInventory: function (sender, events) {
                this.view('aggregation').dom().addClass('n-hidden');
                this.view('inventory').dom().toggleClass('n-hidden');
            },
            _toggleAggregation: function (sender, events) {
                this.view('inventory').dom().addClass('n-hidden');
                this.view('aggregation').dom().toggleClass('n-hidden');
            },
            _closeAll: function () {
                this.view('inventory').dom().addClass('n-hidden');
                this.view('aggregation').dom().addClass('n-hidden');
            }
        }
    });


})(nx, nx.global);