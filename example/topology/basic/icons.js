(function (nx, global) {

    var strokeIndex;

    nx.define('Base.ICONS', nx.ui.Component, {
        properties: {
            color: {
                get: function () {
                    return this._color !== undefined ? this._color : '#1F6EEE'
                },
                set: function (value) {
                    this._color = value;
                    if (strokeIndex) {
                        nx.dom.Document.deleteRule(strokeIndex - 1);
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
                            fill: '{#color}'
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
            init: function (args) {
                this.inherited(args);
                strokeIndex = nx.dom.Document.addRule('.stroke', 'stroke:' + '#1F6EEE');
            },
            _enter: function (sender, args) {
                setTimeout(function () {
                    var model = sender.model().value();
                    var svg = model.icon;
                    svg.setAttribute('width', model.size.width);
                    svg.setAttribute('height', model.size.height);
                    sender.dom().$dom.appendChild(svg);

                    //                    var serializer = new XMLSerializer();
//                    var str = serializer.serializeToString(svg);
//                    str = str.replace(/class="bg"/gi, 'fill="#1F6EEE"');
//                    str = str.replace(/class="stroke"/gi, 'stroke="#1F6EEE"');
//                    var b64 = "data:image/svg+xml;base64," + btoa(str);
//                    sender.dom().$dom.innerHTML += "<img src='" + b64 + "'/>";
                }, 0)
            }
        }
    });

})(nx, nx.global);


