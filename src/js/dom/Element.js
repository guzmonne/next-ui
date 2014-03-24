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
            /**
             * Get an attribute from element
             * @param name
             * @returns {*}
             */
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
            /**
             * Set an attribute for an element
             * @param name
             * @param value
             */
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
            /**
             * Get an element by selector.
             * @param inSelector
             * @returns {HTMLElement}
             */
            select: function (inSelector) {
                var element = this.$dom.querySelector(inSelector);
                return new Element(element);
            },
            /**
             * Get a collection by selector
             * @param inSelector
             * @returns {nx.data.Collection}
             */
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
            /**
             * Focus an element
             */
            focus: function () {
                this.$dom.focus();
            },
            /**
             * Blur form an element
             */
            blur: function () {
                this.$dom.blur();
            },
            /**
             * Show an element
             */
            show: function () {
                this.setAttribute('nx-status','');
            },
            /**
             * Hide an element
             */
            hide: function () {
                this.setAttribute('nx-status','hidden');
            },
            /**
             * Whether the element has the class
             * @param inClassName
             * @returns {boolean}
             */
            hasClass: function (inClassName) {
                return this.$dom.classList.contains(inClassName);
            },
            /**
             * Add class for element
             * @returns {*}
             */
            addClass: function () {
                var args = arguments,
                    classList = this.$dom.classList;
                if (args.length === 1 && args[0].search(rBlank) > -1) {
                    args = args[0].split(rBlank);
                }
                return classList.add.apply(classList,args);
            },
            /**
             * Remove class from element
             * @returns {*}
             */
            removeClass: function () {
                var classList = this.$dom.classList;
                return classList.remove.apply(classList,arguments);
            },
            /**
             * Toggle a class on element
             * @param inClassName
             * @returns {*}
             */
            toggleClass: function (inClassName) {
                return  this.$dom.classList.toggle(inClassName);
            },
            /**
             * Get document
             * @returns {*}
             */
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
            /**
             * Get window
             * @returns {DocumentView|window|*}
             */
            getWindow: function () {
                var doc = this.getDocument();
                return doc.defaultView || doc.parentWindow || global;
            },
            /**
             * Get root element
             * @returns {Element}
             */
            getRoot: function () {
                return env.strict() ? document.documentElement : document.body;
            },
            /**
             * Get element position information
             * @returns {{top: number, right: Number, bottom: Number, left: number, width: Number, height: Number}}
             */
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
            /**
             * Get margin distance information
             * @param inDirection
             * @returns {*}
             */
            margin: function (inDirection) {
                return this._getBoxWidth(MARGIN,inDirection);
            },
            /**
             * Get padding distance information
             * @param inDirection
             * @returns {*}
             */
            padding: function (inDirection) {
                return this._getBoxWidth(PADDING,inDirection);
            },
            /**
             * Get border width information
             * @param inDirection
             * @returns {*}
             */
            border: function (inDirection) {
                return this._getBoxWidth(BORDER,inDirection);
            },
            /**
             * Get offset information
             * @returns {{top: number, left: number}}
             */
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
            /**
             * Set offset style
             * @param inStyleObj
             */
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
            /**
             * Has in line style
             * @param inName
             * @returns {boolean}
             */
            hasStyle: function (inName) {
                var cssText = this.$dom.style.cssText;
                return cssText.indexOf(inName + ':') > -1;
            },
            /**
             * Get computed style
             * @param inName
             * @returns {*|string}
             */
            getStyle: function (inName) {
                var styles = getComputedStyle(this.$dom,null);
                var property = util.getStyleProperty(inName);
                return styles[property] || '';
            },
            /**
             * Set style for element
             * @param inName
             * @param inValue
             */
            setStyle: function (inName,inValue) {
                var property = util.getStyleProperty(inName);
                this.$dom.style[property] = util.getStyleValue(inName,inValue);
            },
            /**
             * Remove inline style
             * @param inName
             */
            removeStyle: function (inName) {
                var property = util.getStyleProperty(inName,true);
                this.$dom.style.removeProperty(property);
            },
            /**
             * Set style by style object
             * @param inStyles
             */
            setStyles: function (inStyles) {
                this.$dom.style.cssText += util.getCssText(inStyles);
            },
            /**
             * Get attribute
             * @param inName
             * @returns {*}
             */
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
            /**
             * Set attribute
             * @param inName
             * @param inValue
             * @returns {*}
             */
            setAttribute: function (inName,inValue) {
                if (inValue !== null && inValue !== undefined) {
                    var hook = attrHooks[inName];
                    if (hook) {
                        if (hook.set) {
                            return hook.set(this.$dom,inValue);
                        } else {
                            return this.$dom.setAttribute(hook,inValue);
                        }
                    }
                    return this.$dom.setAttribute(inName,inValue);
                }
            },
            /**
             * Remove attribute
             * @param inName
             */
            removeAttribute: function (inName) {
                this.$dom.removeAttribute(baseAttrHooks[inName] || inName);
            },
            /**
             * Get all attributes
             * @returns {{}}
             */
            getAttributes: function () {
                var attrs = {};
                nx.each(this.$dom.attributes,function (attr) {
                    attrs[attr.name] = attr.value;
                });
                return attrs;
            },
            /**
             * Set attributes
             * @param attrs
             */
            setAttributes: function (attrs) {
                nx.each(attrs,function (value,key) {
                    this.setAttribute(key,value);
                },this);
            },
            /**
             * Get inner text
             * @returns {*}
             */
            getText: function () {
                return this.$dom.textContent;
            },
            /**
             * Set inner text
             * @param text
             */
            setText: function (text) {
                this.$dom.textContent = text;
            },
            /**
             * Get inner html
             * @returns {*|string}
             */
            getHtml: function () {
                return this.$dom.innerHTML;
            },
            /**
             * Set inner html
             * @param html
             */
            setHtml: function (html) {
                this.$dom.innerHTML = html;
            },
            /**
             * Add event listener
             * @param name
             * @param listener
             * @param useCapture
             */
            addEventListener: function (name,listener,useCapture) {
                this.$dom.addEventListener(name,listener,useCapture || false);
            },
            /**
             * Remove event listener
             * @param name
             * @param listener
             * @param useCapture
             */
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