(function (nx, util, global) {


    var NS = "http://www.w3.org/2000/svg";
    var xlink = 'http://www.w3.org/1999/xlink';
    var attrList = ['class'];

    nx.define('nx.graphic.SVGComponent', nx.graphic.Component, {
        events: ['mouseenter', 'mouseleave', 'dragstart', 'drag', 'dragmove', 'dragend'],
        properties: {
            translateX: {
                value: 0,
//                binding: {
//                    direction: '<>',
//                    converter: nx.Binding.converters.number
//                }
            },
            translateY: {
                value: 0,
//                binding: {
//                    direction: '<>',
//                    converter: nx.Binding.converters.number
//                }
            },
            scale: {
                value: 1,
//                binding: {
//                    direction: '<>',
//                    converter: nx.Binding.converters.number
//                }
            },
            translate: {
                set: function (value) {
                    this.setTransform(value.x, value.y);
                }
            },
            rotate: {
                value: 0,
//                binding: {
//                    direction: '<>',
//                    converter: nx.Binding.converters.number
//                }
            },
            visible: {
                get: function () {
                    return this.resolve('@root').getStyle("display") != "none";
                },
                set: function (value) {
                    this.resolve('@root').setStyle("display", value ? "" : "none");
                    this.resolve('@root').setStyle("pointer-events", value ? "all" : "none");
                },
                binding: {
                    direction: "<>",
                    converter: nx.Binding.converters.boolean
                }
            }
        },
        methods: {
            init: function (args) {
                this.inherited(args);
                this.watch(['translateX', 'translateY', 'scale', 'rotate'], function (prop, value) {
                    this.setTransform();
                }, this);
            },
            setTransform: function (translateX, translateY, scale, rotate) {

                var tx = translateX != null ? translateX : this._translateX;
                var ty = translateY != null ? translateY : this._translateY;
                var scl = scale != null ? scale : this._scale;
                var rot = rotate != null ? rotate : this._rotate;


                var transform = 'translate(' + tx + 'px, ' + ty + 'px) scale(' + scl + ')  rotate(' + rot + ')';
                this.resolve("@root").$dom.style.cssText = "-webkit-transform:" + transform;
                this._translateX = tx;
                this._translateY = ty;
                this._scale = scl;
                this._rotate = rot;
            },
            set: function (key, value) {
                if (this.resolve('@root') && value !== undefined) {
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
                    } else if (value !== null && (!this.has(key) || attrList.indexOf(key) != -1)) {
                        el.setAttribute(key, value);
                    }
                }
                return this.inherited(key, value);
            },
            get: function (key) {
                var value = this.inherited(key);
                return value !== undefined ? value : this.resolve("@root").get(key);
            },
            upon: function (name, handler, context) {
                if (name == 'mouseenter') {
                    this.inherited('mouseover', this._mouseenter.bind(this), context);
                }
                if (name == 'mouseleave') {
                    this.inherited('mouseout', this._mouseleave.bind(this), context);
                }
                this.inherited(name, handler, context);
            },
            _mouseleave: function (sender, event) {
                var element = this.root().$dom;
                var target = event.target;
                var related = event.relatedTarget;
                if (!element.contains(related) && target !== related) {
                    this.fire("mouseleave", event);

                }
            },
            _mouseenter: function (sender, event) {
                var element = this.root().$dom;
                var target = event.target;
                var related = event.relatedTarget;
                if (target && !element.contains(related) && target !== related) {
                    this.fire("mouseenter", event);
                }
            }
        }
    });

})(nx, nx.graphic.util, nx.global);