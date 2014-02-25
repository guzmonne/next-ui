(function (nx, util, global) {


    var NS = "http://www.w3.org/2000/svg";
    var xlink = 'http://www.w3.org/1999/xlink';
    var attrList = ['class'];

    nx.define('nx.graphic.SVGComponent', nx.graphic.Component, {
        events: [],
        properties: {
            translateX: {
                value: 0,
                binding: {
                    direction: '<>',
                    converter: nx.Binding.converters.number
                }
            },
            translateY: {
                value: 0,
                binding: {
                    direction: '<>',
                    converter: nx.Binding.converters.number
                }
            },
            scale: {
                value: 1,
                binding: {
                    direction: '<>',
                    converter: nx.Binding.converters.number
                }
            },
            rotate: {
                value: 0,
                binding: {
                    direction: '<>',
                    converter: nx.Binding.converters.number
                }
            }
        },
        methods: {
            init: function (args) {
                this.inherited(args);
                this.watch(['translateX', 'translateY', 'scale', 'rotate'], function (prop, value) {
                    var transform = 'translate(' + this.translateX() + ' ' + this.translateY() + ') scale(' + this.scale() + ') rotate(' + this.rotate() + ')';
                    this.set('transform', transform);
                }, this);
            },
            set: function (key, value) {
                if (this.resolve('@root')) {
                    var el = this.resolve("@root").$dom;
                    if ((el.nodeName == "text" || el.nodeName == "#text") && key == "text") {
                        if (el.firstChild) {
                            el.removeChild(el.firstChild);
                        }
                        return el.appendChild(document.createTextNode(value));
                    } else if (el.nodeName == "image" && key == "src") {
                        return el.setAttributeNS(xlink, 'href', value);
                    } else if (key == "xlink:href") {
                        return el.setAttributeNS(xlink, 'xlink:href', value);
                    } else if (!this.has(key) || attrList.indexOf(key) != -1) {
                        el.setAttribute(key, value);
                    }
                }
                return this.inherited(key, value);
            }
        }
    });

})(nx, nx.graphic.util, nx.global);