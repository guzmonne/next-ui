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
        }
    };


    nx.define("ENC.TW.View.Aggregation", nx.ui.Component, {
        events: [],
        view: {

            content: {
                props: {
                    'class': 'tw-aggregation'
                },
                content: [
                    {
                        type: 'ENC.TW.View.Aggregation.List',
                        props: {
                            vertexSets: '{controlVM.aggregation.vertexSets}',
                            root: '{#owner}'
                        }
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

    nx.define('ENC.TW.View.Aggregation.List', nx.ui.Component, {
        view: {
            tag: 'ul',
            props: {
                'class': 'tw-aggregation-list',
                items: '{#vertexSets,converter=objectToArray}',
                template: {
                    tag: 'li',
                    props: {
                        'class': 'tw-aggregation-list-item'
                    },
                    content: [
                        {
                            tag: 'span',
                            props: {
                                'class': '{activated,converter=ENC.TW.aggregation.activated}'
                            },
                            events: {
                                'click': '{#root.model.controlVM.aggregation.expand}'
//                                'click': '{#_activated}'
                            }
                        },
                        {
                            tag: 'span',
                            props: {
                                'class': 'n-icon-GroupL tw-aggregation-list-item-icon',
                                type: '{value.deviceType}'
                            }
                        },
                        {
                            tag: 'span',
                            props: {
                                'class': 'tw-aggregation-list-item-label'
                            },
                            content: '{name}' //converter
                        },
                        {
                            tag: 'span',
                            props: {
                                'class': 'tw-aggregation-list-item-info'
                            },
                            content: '{subVertices,converter=ENC.TW.aggregation.subVertices}' //converter
                        },
                        {
                            type: 'ENC.TW.View.Aggregation.List',
                            props: {
                                vertexSets: '{vertexSet}',
                                root: '{#root}',
                                'visible': '{activated,converter=inverted}'
                            }
                        },
                        {
                            props: {
                                'class': 'tw-aggregation-list-item-devices',
                                'visible': '{activated,converter=inverted}',
                                items: '{vertices,converter=objectToArray}',
                                template: {
                                    content: [
                                        {
                                            tag: 'span',
                                            props: {
                                                'class': '{deviceType,converter=ENC.TW.inventory.icon}',
                                                type: '{deviceType}'
                                            }
                                        },
                                        {
                                            tag: 'span',
                                            props: {
                                                'class': 'tw-aggregation-list-item-devices-label',
                                                type: '{label}'
                                            },
                                            content: '{label}'
                                        },
                                    ]
                                }
                            }
                        }
                    ]
                }
            }
        },
        properties: {
            vertexSets: {

            },
            root: {}
        },
        methods: {
            _activated: function (sender, events) {
                var vertexSet = sender.model();
                var expand = nx.path(this, 'owner.model.controlVM.aggregation.expand');
                debugger;
                vertexSet.activated(!vertexSet.activated());
                debugger;
            }
        }
    });


})(nx, nx.global);