/**
 * Created by bob on 14-2-27.
 */
(function (nx) {
    nx.define("topo.test.View", nx.ui.Component, {
        view: {
            content: [
                {
                    name: 'toolbar',
                    props: {
                        style: {
                            width: '100%',
                            height: 120,
                            'background-color': 'black'
                        }
                    },
                    content: [

                        {
                            props: {
                                style: {
                                    float: 'left',
                                    'margin-right': 40
                                }
                            },
                            content: [
                                {
                                    tag: 'div',
                                    content: [
                                        {
                                            tag: "button",
                                            props: {
                                                class: 'btn btn-success'

                                            },
                                            content: "pass",
                                            events: {
                                                click: '{casePass}'
                                            }
                                        },
                                        {
                                            props: {
                                                class: 'btn btn-danger'

                                            },
                                            tag: "button",
                                            content: "fail",
                                            events: {
                                                click: '{caseFail}'
                                            }
                                        },
                                        {
                                            props: {
                                                style: {
                                                    color: 'white'
                                                }
                                            },
                                            tag: "span",
                                            content: '{#model.index}'
                                        },
                                        {
                                            props: {
                                                style: {
                                                    color: 'white'
                                                }
                                            },
                                            tag: "span",
                                            content: '/'
                                        },
                                        {
                                            props: {
                                                style: {
                                                    color: 'white'
                                                }
                                            },
                                            tag: "span",
                                            content: '{#model.tcase.length}'
                                        }
                                    ]
                                },
                                {
                                    tag: 'div',
                                    props: {
                                        class: '{menustatus}'
                                    },
                                    content: [
                                        {
                                            tag: 'button',
                                            props: {
                                                type: 'button',
                                                class: 'btn btn-default dropdown-toggle',
                                                'data-toggle': 'dropdown'
                                            },
                                            events: {
                                                click: '{menuaction}'
                                            },
                                            content: [
                                                {
                                                    tag: 'span',
                                                    content: 'jump to'
                                                },
                                                {
                                                    tag: 'span',
                                                    props: {
                                                        class: 'caret'
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            tag: 'button',
                                            props: {
                                                type: 'button',
                                                class: 'btn btn-default dropdown-toggle',
                                                'data-toggle': 'dropdown'
                                            },
                                            events: {
                                                click: '{clearConsole}'
                                            },
                                            content: [
                                                {
                                                    tag: 'span',
                                                    content: 'clear Console'
                                                }
                                            ]
                                        },
                                        {
                                            tag: 'ul',
                                            name: 'menu',
                                            props: {
                                                class: 'dropdown-menu',
                                                style: {
                                                    'max-height': 300,
                                                    overflow: 'auto'
                                                },
                                                template: {
                                                    tag: 'li',
                                                    content: {
                                                        tag: 'a',
                                                        props: {
                                                            href: '#'
                                                        },
                                                        events: {
                                                            'click': function (sender, event) {
                                                                sender.owner().model().jumpTo(sender.model());
                                                            }
                                                        },
                                                        content: '{name}'
                                                    }
                                                },
                                                items: '{#items}'
                                            }
                                        }
                                    ]
                                }

                            ]
                        },
                        {
                            tag: 'span',
                            props: {
                                style: {
                                    width: '80%',
                                    height: 20,
                                    'float': 'right',
                                    color: 'white',
                                    'margin-left': '8px'
                                }
                            },
                            content: [
                                {
                                    props: {
                                        style: {
                                            color: 'red',
                                            float: 'left'
                                        }
                                    },
                                    content: 'TEST NAME:    '
                                },
                                {content: '{#model.testname}'}
                            ]
                        },
                        {
                            tag: 'span',
                            props: {
                                style: {
                                    width: '80%',
                                    height: 20,
                                    'float': 'left',
                                    color: 'white',
                                    'margin-left': '8px'
                                }
                            },
                            content: [
                                {
                                    props: {
                                        style: {
                                            color: 'red',
                                            float: 'left'
                                        }
                                    },
                                    content: 'TEST DESC:    '
                                },
                                {content: '{#model.description}'}
                            ]
                        },
                        {
                            tag: 'span',
                            props: {
                                style: {
                                    width: '80%',
                                    height: 80,
                                    'float': 'left',
                                    color: 'white',
                                    'margin-left': '8px',
                                    overflow: 'scroll'
                                }
                            },
                            content: [
                                {
                                    props: {
                                        style: {
                                            color: 'red',
                                            float: 'left'
                                        }
                                    },
                                    content: 'TEST OUTPUT:    '
                                },
                                {content: '{#model.output}'}
                            ]
                        },
                    ]
                },
                {
                    props: {
                        style: {
                            position: 'absolute',
                            left: 0,
                            top: 120,
                            right: 0,
                            bottom: 0
                        }
                    },
                    content: {
                        name: 'topo',
                        type: 'nx.graphic.Topology',
                        props: {
                            adaptive: true,
                            showIcon: true,
                            identityKey: 'id',
                            nodeConfig: {
                                label: 'model.name',
                                iconType: 'router'
                            },
                            autoLayout: true,
                            data: {
                                nodes: [
                                    {"id": 0, "x": 410, "y": 100, "name": "12K-1"},
                                    {"id": 1, "x": 410, "y": 280, "name": "12K-2"},
                                    {"id": 2, "x": 660, "y": 280, "name": "Of-9k-03"},
                                    {"id": 3, "x": 660, "y": 100, "name": "Of-9k-02"},
                                    {"id": 4, "x": 180, "y": 190, "name": "Of-9k-01"}
                                ],
                                links: [
                                    {"id": 0, "source": 0, "target": 1},
                                    {"id": 1, "source": 1, "target": 2},
                                    {"id": 2, "source": 1, "target": 3},
                                    {"id": 3, "source": 4, "target": 1},
                                    {"id": 4, "source": 2, "target": 3},
                                    {"id": 5, "source": 2, "target": 0},
                                    {"id": 6, "source": 3, "target": 0},
                                    {"id": 7, "source": 3, "target": 0},
                                    {"id": 8, "source": 3, "target": 0},
                                    {"id": 9, "source": 0, "target": 4},
                                    {"id": 10, "source": 0, "target": 4},
                                    {"id": 11, "source": 0, "target": 3}
                                ]
                            }

                        }
                    }
                }
            ]
        },
        properties: {
            items: null
        }
    });
})(nx)