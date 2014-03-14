(function (nx) {
    var global = nx.global,
        document = global.document,
        env = nx.Env,
        util = nx.Util;
    var rTableElement = /^t(?:able|d|h)$/i,
        rBlank = /\s+/,
        borderMap = {
            thin: '2px',
            medium: '4px',
            thick: '6px'
        },
        isGecko = env.engine().name === 'gecko';
    var MARGIN = 'margin',
        PADDING = 'padding',
        BORDER = 'border',
        POSITION = 'position',
        FIXED = 'fixed';

    var Collection = nx.data.Collection;
    //======attrHooks start======//
    var attrHooks = {
        value: {
            set: function (inElement,inValue) {
                var type = inElement.type;
                switch (type) {
                    case 'checkbox':
                    case 'radio':
                        inElement.checked = !!inValue;
                        break;
                    default:
                        inElement.value = inValue;
                }
            },
            get: function (inElement) {
                var type = inElement.type;
                var value = inElement.value;
                switch (type) {
                    case 'checkbox':
                    case 'radio':
                        value = !!inElement.checked;
                        break;
                    default:
                        value = inElement.value;
                }
                return value;
            }
        }
    };
    var baseAttrHooks = {
        class: 'className',
        for: 'htmlFor'
    };
    var booleanAttrHooks = {
        disabled: 'disabled',
        readonly: 'readonly',
        checked: 'checked'
    };
    //registerAttrHooks for Element
    (function registerAttrHooks() {

        //baseAttrHooks
        nx.each(baseAttrHooks,function (hookValue,hookKey) {
            attrHooks[hookKey] = {
                set: function (inElement,inValue) {
                    inElement[hookValue] = inValue;
                },
                get: function (inElement) {
                    return inElement[hookValue];
                }
            };
        });

        //booleanAttrHooks
        nx.each(booleanAttrHooks,function (hookValue,hookKey) {
            attrHooks[hookKey] = {
                set: function (inElement,inValue) {
                    if (!inValue) {
                        inElement.removeAttribute(hookKey);
                    } else {
                        inElement.setAttribute(hookKey,hookKey);
                    }
                    inElement[hookValue] = !!inValue;
                },
                get: function (inElement) {
                    return !!inElement[hookValue];
                }
            };
        });
    }());

    //======attrHooks end ======//

    var Element = nx.define('nx.dom.Element',nx.dom.Node,{
        methods: {
            get: function (name) {
                if (name === 'text') {
                    return this.getText();
                }
                else if (name == 'html') {
                    return this.getHtml();
                }
                else {
                    return this.getAttribute(name);
                }
            },
            set: function (name,value) {
                if (name === 'text') {
                    this.setText(value);
                }
                else if (name == 'html') {
                    this.setHtml(value);
                }
                else {
                    this.setAttribute(name,value);
                }
            },
            select: function (inSelector) {
                var element = this.$dom.querySelector(inSelector);
                return new Element(element);
            },
            selectAll: function (inSelector) {
                var elements = this.$dom.querySelectorAll(inSelector),
                    i = 0,
                    element = elements[i];
                var nxElements = new Collection();
                for (; element; i++) {
                    element = elements[i];
                    nxElements.add(new Element(element));
                }
                return nxElements;
            },
            focus: function () {
                this.$dom.focus();
            },
            blur: function () {
                this.$dom.blur();
            },
            show: function () {
                this.setAttribute('nx-status','');
            },
            hide: function () {
                this.setAttribute('nx-status','hidden');
            },
            hasClass: function (inClassName) {
                return this.$dom.classList.contains(inClassName);
            },
            addClass: function () {
                var args = arguments,
                    classList = this.$dom.classList;
                if (args.length === 1 && args[0].search(rBlank) > -1) {
                    args = args[0].split(rBlank);
                }
                return classList.add.apply(classList,args);
            },
            removeClass: function () {
                var classList = this.$dom.classList;
                return classList.remove.apply(classList,arguments);
            },
            toggleClass: function (inClassName) {
                return  this.$dom.classList.toggle(inClassName);
            },
            getDocument: function () {
                var element = this.$dom;
                var doc = document;
                if (element) {
                    doc = (element.nodeType === 9) ? element : // element === document
                        element.ownerDocument || // element === DOM node
                            element.document;// element === window
                }
                return doc;
            },
            getWindow: function () {
                var doc = this.getDocument();
                return doc.defaultView || doc.parentWindow || global;
            },
            getRoot: function () {
                return env.strict() ? document.documentElement : document.body;
            },
            getBound: function () {
                var box = this.$dom.getBoundingClientRect(),
                    root = this.getRoot(),
                    clientTop = root.clientTop || 0,
                    clientLeft = root.clientLeft || 0;
                return {
                    top: box.top - clientTop,
                    right: box.right,
                    bottom: box.bottom,
                    left: box.left - clientLeft,
                    width: box.width,
                    height: box.height
                };
            },
            margin: function (inDirection) {
                return this._getBoxWidth(MARGIN,inDirection);
            },
            padding: function (inDirection) {
                return this._getBoxWidth(PADDING,inDirection);
            },
            border: function (inDirection) {
                return this._getBoxWidth(BORDER,inDirection);
            },
            getOffset: function () {
                var box = this.$dom.getBoundingClientRect(),
                    root = this.getRoot(),
                    clientTop = root.clientTop || 0,
                    clientLeft = root.clientLeft || 0;
                return {
                    'top': box.top + (global.pageYOffset || root.scrollTop ) - clientTop,
                    'left': box.left + (global.pageXOffset || root.scrollLeft ) - clientLeft
                };
            },
            setOffset: function (inStyleObj) {
                var elPosition = this.getStyle(POSITION), styleObj = inStyleObj;
                var scrollXY = {
                    left: Math.max((global.pageXOffset || 0),root.scrollLeft),
                    top: Math.max((global.pageYOffset || 0),root.scrollTop)
                };
                if (elPosition === FIXED) {
                    styleObj = {
                        left: parseFloat(styleObj) + scrollXY.scrollX,
                        top: parseFloat(styleObj) + scrollXY.scrollY
                    };
                }
                this.setStyles(styleObj);
            },
            hasStyle: function (inName) {
                var cssText = this.$dom.style.cssText;
                return cssText.indexOf(inName + ':') > -1;
            },
            getStyle: function (inName) {
                var styles = getComputedStyle(this.$dom,null);
                var property = util.getStyleProperty(inName);
                return styles[property] || '';
            },
            setStyle: function (inName,inValue) {
                var property = util.getStyleProperty(inName);
                this.$dom.style[property] = util.getStyleValue(inName,inValue);
            },
            removeStyle: function (inName) {
                var property = util.getStyleProperty(inName,true);
                this.$dom.style.removeProperty(property);
            },
            setStyles: function (inStyles) {
                this.$dom.style.cssText += util.getCssText(inStyles);
            },
            getAttribute: function (inName) {
                var hook = attrHooks[inName];
                if (hook) {
                    if (hook.get) {
                        return hook.get(this.$dom);
                    } else {
                        return this.$dom.getAttribute(hook);
                    }
                }
                return this.$dom.getAttribute(inName);
            },
            setAttribute: function (inName,inValue) {
                var hook = attrHooks[inName];
                if (hook) {
                    if (hook.set) {
                        return hook.set(this.$dom,inValue);
                    } else {
                        return this.$dom.setAttribute(hook,inValue);
                    }
                }
                return this.$dom.setAttribute(inName,inValue);
            },
            removeAttribute: function (inName) {
                this.$dom.removeAttribute(baseAttrHooks[inName] || inName);
            },
            getAttributes: function () {
                var attrs = {};
                nx.each(this.$dom.attributes,function (attr) {
                    attrs[attr.name] = attr.value;
                });
                return attrs;
            },
            setAttributes: function (attrs) {
                nx.each(attrs,function (value,key) {
                    this.setAttribute(key,value);
                },this);
            },
            getText: function () {
                return this.$dom.textContent;
            },
            setText: function (text) {
                this.$dom.textContent = text;
            },
            getHtml: function () {
                return this.$dom.innerHTML;
            },
            setHtml: function (html) {
                this.$dom.innerHTML = html;
            },
            addEventListener: function (name,listener,useCapture) {
                this.$dom.addEventListener(name,listener,useCapture || false);
            },
            removeEventListener: function (name,listener,useCapture) {
                this.$dom.removeEventListener(name,listener,useCapture || false);
            },
            _getBoxWidth: function (inBox,inDirection) {
                var boxWidth, styleResult;
                var element = this.$dom;
                switch (inBox) {
                    case PADDING:
                    case MARGIN:
                        styleResult = this.getStyle(inBox + "-" + inDirection);
                        boxWidth = parseFloat(styleResult);
                        break;
                    default:
                        styleResult = this.getStyle('border-' + inDirection + '-width');
                        if (isGecko) {
                            if (rTableElement.test(element.tagName)) {
                                styleResult = 0;
                            }
                        }
                        boxWidth = parseFloat(styleResult) || borderMap[styleResult];
                }
                return boxWidth || 0;
            }
        }
    });
})(nx);