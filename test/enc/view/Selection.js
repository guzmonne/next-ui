(function (nx, global) {
    nx.Binding.converters.objectToArray = {
        convert: function (value) {
            return nx.util.values(value);
        }
    };

    ENC.TW.aggregation = {
        activated: {
            convert: function (value) {
                return 'tw-aggregation-list-item-activated ' + (value ? 'fa  fa-caret-right' : 'fa  fa-caret-down')
            }
        },
        icon: {
            convert: function (value) {
                return 'n-icon-' + deviceTypeMapping[value];
            }
        },
        subVertices: {
            convert: function (value) {
                return value ? Object.keys(value).length : 0;
            }
        },
        child: {
            convert: function (value) {
                return value ? 'n-hidden' : '';
            }
        },
        num: {
            convert: function (value) {
                if (value < 2) {
                    return  value + " node has"
                } else {
                    return  value + " nodes have"
                }
            }
        }

    };


    nx.define("ENC.TW.View.Selection", nx.ui.Component, {
        events: [],
        view: {
            content: {
                props: {
                    'class': 'tw-aggregation'
                },
                content: [
//                    {
//                        tag: 'h5',
//                        content: 'List'
//                    },
                    {
                        tag: 'h5',
                        content: 'Action'
                    },
                    {
                        props: {
                            'class': 'tw-aggregation-action'
                        },
                        content: [
                            {
                                tag: 'span',
                                content: '{controlVM.aggregation.selectedNodes.count,converter=ENC.TW.aggregation.num}'
                            },
                            {
                                tag: 'span',
                                props: {

                                },
                                content: ' been selected.'
                            },
                            {
                                content: [
                                    {
                                        tag: 'button',
                                        props: {
                                            'class': 'btn btn-warning btn-xs',
                                            disabled: '{controlVM.aggregation.selectedNodes.count,converter=inverted}'
                                        },
                                        content: 'Aggregate',
                                        events: {
                                            'click': '{controlVM.aggregation.aggregate}'
                                        }
                                    },
                                    {
                                        tag: 'button',
                                        props: {
                                            'class': 'btn btn-warning btn-xs',
                                            disabled: '{controlVM.aggregation.selectedNodes.count,converter=inverted}'
                                        },
                                        content: 'Add Tag',
                                        events: {
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]

            }
        },
        properties: {
            item: {}
        },
        methods: {
            _activated: function (sender, events) {
                var vertexSet = sender.model();
                vertexSet.activated(!vertexSet.activated());
            }
        }
    });

})(nx, nx.global);