(function (nx, global) {

    var strokeIndex;

    nx.define('Base.Icon', nx.ui.Component, {
        properties: {
            color: {
                get: function () {
                    return this._color !== undefined ? this._color : '#1F6EEE'
                },
                set: function (value) {
                    this._color = value;
                    if (strokeIndex) {
                        nx.dom.Document.deleteRule(strokeIndex-1);
                    }
                    strokeIndex = nx.dom.Document.addRule('.stroke', 'stroke:' + value);
                }
            }
        },
        view: {
            content: [
                {
                    tag: 'span',
                    content: 'Select a color : '
                },
                {
                    tag: 'input',
                    props: {
                        type: 'color',
                        value: '{#color}'
                    }
                },
                {
                    tag: 'ul',
                    name: 'iconContainer',
                    props: {
                        'class': 'iconlist',
                        style: {
                            fill: '{#color}',
                            margin: 20
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
            ]
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


