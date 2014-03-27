(function (nx, global) {

    var topologyData = {
        nodes: [
            {"id": 0, "x": 410, "y": 100, "name": "12K-1"},
            {"id": 1, "x": 410, "y": 280, "name": "12K-2"},
            {"id": 2, "x": 660, "y": 280, "name": "Of-9k-03"},
            {"id": 3, "x": 660, "y": 100, "name": "Of-9k-02"},
            {"id": 4, "x": 180, "y": 190, "name": "Of-9k-01"}
        ],
        links: [
            {"source": 0, "target": 1},
            {"source": 1, "target": 2},
            {"source": 1, "target": 3},
            {"source": 4, "target": 1},
            {"source": 2, "target": 3},
            {"source": 2, "target": 0},
            {"source": 3, "target": 0},
            {"source": 3, "target": 0},
            {"source": 3, "target": 0},
            {"source": 0, "target": 4},
            {"source": 0, "target": 4},
            {"source": 0, "target": 3}
        ]
    };

    nx.define('Base.Icon', nx.ui.Component, {
        view: {
            content: {
                tag: 'ul',
                name: 'iconContainer',
                props: {
                    'class': 'iconlist',
                    style: {
                        fill: '#1F6EEE',
                        margin:20
                    },
                    items: new nx.data.Dictionary(nx.graphic.Icons.icons),
                    template: {
                        tag: 'li',
                        content: [
                            {
                                tag: 'label',
                                content: '{key}'
                            },
                            {
                                tag: 'b',
                                content: 'Width:'
                            },
                            {
                                tag: 'span',
                                content: '{value.size.width}px'
                            },
                            {
                                tag: 'b',
                                content: ' Height:'
                            },
                            {
                                tag: 'span',
                                content: '{value.size.height}'
                            },
                            {
                                name: 'icon',
                                tag: 'p',
                                content: '{value.icon}',
                                events: {
                                    'enter': '{#_enter}'
                                }
                            }
                        ]
                    }
                }
            }
        },
        methods: {
            _enter: function (sender, args) {
                setTimeout(function () {
                    var model = sender.model().value;
                    var svg = sender.model().value.icon;
                    svg.setAttribute('width', model.size.width);
                    svg.setAttribute('height', model.size.height);
                    sender.dom().$dom.appendChild(svg);
                }, 0)
            }
        }
    });

})(nx, nx.global);


