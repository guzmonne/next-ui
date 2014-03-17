(function (nx, util, global) {


    var NS = "http://www.w3.org/2000/svg";
    var xlink = 'http://www.w3.org/1999/xlink';
    var attrList = ['class'];

    nx.define('nx.graphic.SVGComponent', nx.graphic.Component, {
        events: ['mouseenter', 'mouseleave', 'dragstart', 'drag', 'dragmove', 'dragend'],
        properties: {
            translateX: {
                get: function () {
                    return this._translateX !== undefined ? this._translateX : 0;
                },
                set: function (value) {
                    if (this._translateX !== value) {
                        this._translateX = value;
                        this.setTransform(this._translateX);
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            translateY: {
                get: function () {
                    return this._translateY !== undefined ? this._translateY : 0;
                },
                set: function (value) {
                    if (this._translateY !== value) {
                        this._translateY = value;
                        this.setTransform(null, this._translateY);
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            scale: {
                get: function () {
                    return this._scale !== undefined ? this._scale : 1;
                },
                set: function (value) {
                    if (this._scale !== value) {
                        this._scale = value;
                        this.setTransform(null, null, this._scale);
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            translate: {
                get: function () {
                    return{
                        x: this._translateX,
                        y: this._translateY
                    };
                },
                set: function (value) {
                    this.setTransform(value.x, value.y);
                }
            },
            rotate: {
                get: function () {
                    return this._rotate !== undefined ? this._rotate : 0;
                },
                set: function (value) {
                    if (this._rotate !== value) {
                        this._rotate = value;
                        return true;
                    } else {
                        return false;
                    }
                }
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
                this.__el = this.resolve("@root").$dom;
            },
            setTransform: function (translateX, translateY, scale, durition) {

                var tx = translateX != null ? translateX : this._translateX || 0;
                var ty = translateY != null ? translateY : this._translateY || 0;
                var scl = scale != null ? scale : this.scale();


                this.setStyle('-webkit-transform', ' translate(' + tx + 'px, ' + ty + 'px) scale(' + scl + ')', durition);


                this._translateX = tx;
                this._translateY = ty;
                this._scale = scl;
            },
            setStyle: function (key, value, durition) {
                var el = this.resolve('@root');
                if (durition) {
                    el.setStyle('-webkit-transition', 'all ' + durition + 's ease');
                    el.setStyle('transition', 'all ' + durition + 's ease');
                } else {
                    el.setStyle('-webkit-transition', '');
                    el.setStyle('transition', '');
                }
                el.setStyle(key, value);
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
                    } else if (value !== undefined && (!this.has(key) || attrList.indexOf(key) != -1)) {
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

})(nx, nx.util, nx.global);