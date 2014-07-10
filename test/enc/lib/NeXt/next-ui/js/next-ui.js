(function (nx) {
    //@https://github.com/yui/yui3/blob/master/src/yui/js/yui-ua.js
    var window = nx.global,
        document = window.document,
        documentMode = document.documentMode || 0,
        compatMode = document.compatMode,
        navigator = window.navigator,
        location = window.location,
        userAgent = navigator.userAgent.toLowerCase(),
        protocol = location.protocol.toLowerCase();
    var tempElement = document.createElement('div'),
        tempStyle = tempElement.style,
        result,
        ie = (result = userAgent.match(/msie (\d+)\./)) && result[1];

    //test opacity:
    tempStyle.cssText = "opacity:.55";

    var vendorPrefixMap = {
        'webkit': ['webkit', '-webkit-'],
        'gecko': ['Moz', '-moz-'],
        'presto': ['O', '-o-'],
        'trident': ['ms', '-ms-']
    };

    var osPatternMap = {
        'windows': /windows|win32/,
        'macintosh': /macintosh|mac_powerpc/,
        'linux': /linux/
    };

    var supportMap = {
        addEventListener: !! document.addEventListener,
        dispatchEvent: !! document.dispatchEvent,
        getBoundingClientRect: !! document.documentElement.getBoundingClientRect,
        onmousewheel: 'onmousewheel' in document,
        XDomainRequest: !! window.XDomainRequest,
        crossDomain: !! (window.XDomainRequest || window.XMLHttpRequest),
        getComputedStyle: 'getComputedStyle' in window,
        iePropertyChange: !! (ie && ie < 9),
        w3cChange: !ie || ie > 8,
        w3cFocus: !ie || ie > 8,
        w3cInput: !ie || ie > 9,
        innerText: 'innerText' in tempElement,
        firstElementChild: 'firstElementChild' in tempElement,
        cssFloat: 'cssFloat' in tempStyle,
        opacity: (/^0.55$/).test(tempStyle.opacity),
        filter: 'filter' in tempStyle,
        classList: !! tempElement.classList,
        removeProperty: 'removeProperty' in tempStyle
    };

    var engineMap = {
        firefox: function () {
            return {
                name: 'gecko',
                version: getVersion('rv:')
            };
        },
        opera: function () {
            var version = getVersion('presto\\/');
            var engineName = 'presto';
            if (!version) {
                engineName = 'webkit';
                version = getVersion('webkit\\/');
            }
            return {
                name: engineName,
                version: version
            };
        },
        ie: function () {
            return {
                name: 'trident',
                version: getVersion('trident\\/') || 4
            };
        },
        'default': function () {
            return {
                name: 'webkit',
                version: getVersion('webkit\\/')
            };
        }
    };

    function getVersion(pattern) {
        var regexp = new RegExp(pattern + '(\\d+\\.\\d+)');
        var regexResult;
        return (regexResult = regexp.exec(userAgent)) ? parseFloat(regexResult[1]) : 0;
    }

    var os = (function () {
        var osName;
        for (osName in osPatternMap) {
            if (osPatternMap[osName].test(userAgent)) {
                break;
            }
        }
        return {
            name: osName
        };
    })();

    var browser = (function () {
        var browserName,
            item,
            checkIs,
            checkExclude,
            browserVersion = 0;

        for (browserName in browserPatternMap) {
            item = browserPatternMap[browserName];
            checkIs = (new RegExp(item.is)).test(userAgent);
            checkExclude = (new RegExp(item.exclude)).test(userAgent);
            if (checkIs && !checkExclude) {
                if (userAgent.indexOf('opr/') > -1) {
                    browserName = 'opera';
                    item.version = '\\bopr\/';
                }
                browserVersion = getVersion(item.version);
                break;
            }
        }

        return {
            name: browserName,
            version: browserVersion
        };
    })();

    var browserPatternMap = {
        ie: {
            is: 'msie',
            exclude: 'opera',
            version: 'msie '
        },
        firefox: {
            is: 'gecko',
            exclude: 'webkit',
            version: '\\bfirefox\/'
        },
        chrome: {
            is: '\\bchrome\\b',
            exclude: null,
            version: '\\bchrome\/'
        },
        safari: {
            is: 'safari',
            exclude: '\\bchrome\\b',
            version: 'version\/'
        },
        opera: {
            is: 'opera',
            exclude: null,
            version: 'version\/'
        }
    };


    var keyMap = {
        BACKSPACE: 8,
        TAB: 9,
        CLEAR: 12,
        ENTER: 13,
        SHIFT: 16,
        CTRL: 17,
        ALT: 18,
        META: (browser.name === "chrome" || browser.name === "webkit" || browser.name === "safari") ? 91 : 224, // the apple key on macs
        PAUSE: 19,
        CAPS_LOCK: 20,
        ESCAPE: 27,
        SPACE: 32,
        PAGE_UP: 33,
        PAGE_DOWN: 34,
        END: 35,
        HOME: 36,
        LEFT_ARROW: 37,
        UP_ARROW: 38,
        RIGHT_ARROW: 39,
        DOWN_ARROW: 40,
        INSERT: 45,
        DELETE: 46,
        HELP: 47,
        LEFT_WINDOW: 91,
        RIGHT_WINDOW: 92,
        SELECT: 93,
        NUMPAD_0: 96,
        NUMPAD_1: 97,
        NUMPAD_2: 98,
        NUMPAD_3: 99,
        NUMPAD_4: 100,
        NUMPAD_5: 101,
        NUMPAD_6: 102,
        NUMPAD_7: 103,
        NUMPAD_8: 104,
        NUMPAD_9: 105,
        NUMPAD_MULTIPLY: 106,
        NUMPAD_PLUS: 107,
        NUMPAD_ENTER: 108,
        NUMPAD_MINUS: 109,
        NUMPAD_PERIOD: 110,
        NUMPAD_DIVIDE: 111,
        F1: 112,
        F2: 113,
        F3: 114,
        F4: 115,
        F5: 116,
        F6: 117,
        F7: 118,
        F8: 119,
        F9: 120,
        F10: 121,
        F11: 122,
        F12: 123,
        F13: 124,
        F14: 125,
        F15: 126,
        NUM_LOCK: 144,
        SCROLL_LOCK: 145
    };


    var engine = (engineMap[browser] || engineMap['default'])();

    /**
     * Environment and check behavior support
     * @class nx.Env
     * @constructor
     */
    nx.define('nx.Env', {
        static: true,
        properties: {
            /**
             * Document mode
             * @property documentMode
             * @type {Number}
             * @default 0
             */
            documentMode: {
                value: documentMode
            },
            /**
             * Document compatMode
             * @property compatMode
             * @type {String}
             * @default "CSS1Compat"
             */
            compatMode: {
                value: compatMode
            },
            /**
             * User agent string
             * @property userAgent
             * @type {String}
             * @default ""
             */
            userAgent: {
                value: userAgent
            },
            /**
             * Browser render model CSS1Compat
             * @property strict
             * @type {Boolean}
             * @default true
             */
            strict: {
                value: compatMode === 'CSS1Compat'
            },
            /**
             * If it is secure
             * @property strict
             * @type {Boolean}
             * @default false
             */
            secure: {
                value: protocol.indexOf('https') === 0
            },
            /**
             * Get operating system information
             * @property os
             * @type {Object}
             * @default {}
             */
            os: {
                value: os
            },
            /**
             * Get specific prefix
             * @property prefix
             * @type {Array}
             * @default ['webkit','-webkit-']
             */
            prefix: {
                value: vendorPrefixMap[engine.name]
            },
            /**
             * Get browser's render engine information
             * @property engine
             * @type {Object}
             * @default {}
             */
            engine: {
                value: engine
            },
            /**
             * Get basic browser information
             * @property browser
             * @type {Object}
             * @default {}
             */
            browser: {
                value: browser
            },
            /**
             * Get keyboard key code map.
             * @property keyMap
             * @type {Object}
             * @default {}
             */
            keyMap: {
                value: keyMap
            }
        },
        methods: {
            /**
             * Whether the property is support
             * @method support
             * @param inName
             * @returns {*}
             */
            support: function (inName) {
                return supportMap[inName];
            },
            /**
             * Support map for debug
             * @method getSupportMap
             * @returns {{addEventListener: boolean, dispatchEvent: boolean, getBoundingClientRect: boolean, onmousewheel: boolean, XDomainRequest: boolean, crossDomain: boolean, getComputedStyle: boolean, iePropertyChange: boolean, w3cChange: boolean, w3cFocus: boolean, w3cInput: boolean, innerText: boolean, firstElementChild: boolean, cssFloat: boolean, opacity: boolean, filter: boolean, removeProperty: boolean}}
             */
            getSupportMap: function () {
                return supportMap;
            },
            /**
             * Register a support item
             * @method registerSupport
             * @param inName
             * @param inValue
             */
            registerSupport: function (inName, inValue) {
                if (!(inName in supportMap)) {
                    supportMap[inName] = inValue;
                }
            }
        }
    });

})(nx);

(function (nx) {
    var global = nx.global,
        document = global.document,
        env = nx.Env;

    var tempElement = document.createElement('div'),
        tempStyle = tempElement.style;
    var rsizeElement = /width|height|top|right|bottom|left|size|margin|padding/i,
        rHasUnit = /[c-x%]/,
        PX = 'px',
        rUpperCameCase = /(?:^|-)([a-z])/g,
        rDeCameCase = /([A-Z])/g;

    var cssNumber = {
        'lineHeight': true,
        'zIndex': true,
        'zoom': true
    };


    var styleHooks = {
        float: 'cssFloat'
    };

    var stylePropCache = {};
    var styleNameCache = {};

    /**
     * This is Util
     * @class nx.Util
     * @constructor
     */
    var util = nx.define('nx.Util', {
        static: true,
        methods: {
            /**
             * Get a string which is join by an style object.
             * @method getCssText
             * @param inStyles
             * @returns {string}
             */
            getCssText: function (inStyles) {
                var cssText = [''];
                nx.each(inStyles, function (styleValue, styleName) {
                    cssText.push(this.getStyleProperty(styleName, true) + ':' + this.getStyleValue(styleName, styleValue));
                }, this);
                return cssText.join(';');
            },
            /**
             * Get real value of the style name.
             * @method getStyleValue
             * @param inName
             * @param inValue
             * @returns {*}
             */
            getStyleValue: function (inName, inValue) {
                var property = this.getStyleProperty(inName);
                var value = inValue;
                if (rsizeElement.test(property)) {
                    if (!rHasUnit.test(inValue) && !cssNumber[property]) {
                        value += PX;
                    }
                }
                return value;
            },
            /**
             * Get compatible css property.
             * @method getStyleProperty
             * @param inName
             * @param isLowerCase
             * @returns {*}
             */
            getStyleProperty: function (inName, isLowerCase) {
                if (isLowerCase) {
                    if (inName in styleNameCache) {
                        return styleNameCache[inName];
                    }
                }
                else {
                    if (inName in stylePropCache) {
                        return stylePropCache[inName];
                    }
                }

                var property = styleHooks[inName] || this.lowerCamelCase(inName);
                if (property in tempStyle) {
                    if (isLowerCase) {
                        property = this.deCamelCase(inName);
                        styleNameCache[inName] = property;
                    }
                } else {
                    if (isLowerCase) {
                        property = env.prefix()[1] + inName;
                        styleNameCache[inName] = property;
                    } else {
                        property = env.prefix()[0] + this.upperCamelCase(inName);
                        stylePropCache[inName] = property;
                    }
                }
                return property;
            },
            /**
             * Lower camel case.
             * @method lowerCamelCase
             * @param inName
             * @returns {string}
             */
            lowerCamelCase: function (inName) {
                var _camelizeString = this.upperCamelCase(inName);
                return _camelizeString.charAt(0).toLowerCase() + _camelizeString.substring(1);
            },
            /**
             * Upper camel case.
             * @method upperCamelCase
             * @param inName
             * @returns {*|string|void}
             */
            upperCamelCase: function (inName) {
                return inName.replace(rUpperCameCase, function (match, group1) {
                    return group1.toUpperCase();
                });
            },
            /**
             * Decode camel case to '-' model.
             * @method deCamelCase
             * @param inName
             * @returns {*|string|void}
             */
            deCamelCase: function (inName) {
                return inName.replace(rDeCameCase, function (match, group1) {
                    return '-' + group1.toLowerCase();
                });
            },
            /**
             * Upper first word of a string.
             * @method capitalize
             * @param inString
             * @returns {string}
             */
            capitalize: function (inString) {
                return inString.charAt(0).toUpperCase() + inString.slice(1);
            }
        }
    });
})(nx);
(function (nx) {
    /**
     * Ajax http client
     * @class nx.HttpClient
     * @constructor
     */
    var HttpClient = nx.define('nx.HttpClient',{
        static: true,
        methods: {
            /**
             * Ajax send.
             * @method send
             * @param options
             */
            send: function (options) {
                var xhr = new XMLHttpRequest();
                var callback = options.callback || function () {
                };

                xhr.open(
                    options.method || 'GET',
                    options.url,
                    true
                );

                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        var type = xhr.getResponseHeader('Content-Type');
                        var result = (type.indexOf('application/json') >= 0) ? JSON.parse(xhr.responseText) : xhr.responseText;
                        callback(result);
                    }
                };

                xhr.setRequestHeader('Content-Type','application/json');
                xhr.send(nx.is(options.data,'Object') ? JSON.stringify(options.data) : options.data);
            },
            /**
             * Get request
             * @method GET
             * @param url
             * @param callback
             * @constructor
             */
            GET: function (url,callback) {
                this.send({
                    url: url,
                    method: 'GET',
                    callback: callback
                });
            },
            /**
             * Post request
             * @method POST
             * @param url
             * @param data
             * @param callback
             * @constructor
             */
            POST: function (url,data,callback) {
                this.send({
                    url: url,
                    method: 'POST',
                    data: data,
                    callback: callback
                });
            },
            /**
             * Put request
             * @method PUT
             * @param url
             * @param data
             * @param callback
             * @constructor
             */
            PUT: function (url,data,callback) {
                this.send({
                    url: url,
                    method: 'PUT',
                    data: data,
                    callback: callback
                });
            },
            /**
             * Delete request
             * @method DELETE
             * @param url
             * @param callback
             * @constructor
             */
            DELETE: function (url,callback) {
                this.send({
                    url: url,
                    method: 'DELETE',
                    callback: callback
                });
            }
        }
    });
})(nx);
(function (nx) {
    var Collection = nx.data.Collection;
    /**
     * Dom Node
     * @class nx.dom.Node
     * @constructor
     */
    var Node = nx.define('nx.dom.Node',nx.Comparable,{
        methods: {
            /**
             * Set $dom as an attribute for node
             * @param node
             */
            init: function (node) {
                this.$dom = node;
            },
            /**
             * Whether target is current dom element
             * @param target
             * @returns {number}
             */
            compare: function (target) {
                if (target && this.$dom === target.$dom) {
                    return 0;
                }
                else {
                    return -1;
                }
            },
            /**
             * Whether target is a element
             * @returns {boolean}
             */
            isElement: function () {
                return this.$dom.nodeType === 1;
            },
            /**
             * Get current element's index
             * @returns {number}
             */
            index: function () {
                var node,
                    index = 0;
                if (this.parentNode() !== null) {
                    while ((node = this.previousSibling()) !== null) {
                        ++index;
                    }
                } else {
                    index = -1;
                }
                return index;
            },
            /**
             * Get the index child element
             * @param inIndex
             * @returns {null}
             */
            childAt: function (inIndex) {
                var node = null;
                if (inIndex >= 0) {
                    node = this.firstChild();
                    while (node && --inIndex >= 0) {
                        node = node.nextSibling();
                        break;
                    }
                }
                return node;
            },
            /**
             * Compare dom element position
             * @param inTarget
             * @returns {*}
             */
            contains: function (inTarget) {
                return this.$dom.contains(inTarget.$dom);
            },
            /**
             * Get first element child
             * @returns {this.constructor}
             */
            firstChild: function () {
                return new this.constructor(this.$dom.firstElementChild);
            },
            /**
             * Get last element child
             * @returns {this.constructor}
             */
            lastChild: function () {
                return new this.constructor(this.$dom.lastElementChild);
            },
            /**
             * Get previous element
             * @returns {this.constructor}
             */
            previousSibling: function () {
                return new this.constructor(this.$dom.previousElementSibling);
            },
            /**
             * Get next element
             * @returns {this.constructor}
             */
            nextSibling: function () {
                return new this.constructor(this.$dom.nextElementSibling);
            },
            /**
             * Get parent element
             * @returns {this.constructor}
             */
            parentNode: function () {
                return new this.constructor(this.$dom.parentNode);
            },
            /**
             * Get element children
             * @returns {nx.data.Collection}
             */
            children: function () {
                var result = new Collection();
                nx.each(this.$dom.children, function (child) {
                    result.add(new this.constructor(child));
                }, this);
                return result;
            },
            /**
             * Clone an element node
             * @param deep
             * @returns {this.constructor}
             */
            cloneNode: function (deep) {
                return new this.constructor(this.$dom.cloneNode(deep));
            },
            /**
             * Whether the element has child.
             * @param child
             * @returns {boolean}
             */
            hasChild: function (child) {
                return child.$dom.parentNode == this.$dom;
            },
            /**
             * Adds a node to the end of the list of children of a specified parent node
             * @param child
             */
            appendChild: function (child) {
                this.$dom.appendChild(child.$dom);
            },
            /**
             * Inserts the specified node before a reference element as a child of the current node
             * @param child
             * @param ref
             */
            insertBefore: function (child,ref) {
                this.$dom.insertBefore(child.$dom,ref.$dom);
            },
            /**
             * Removes a child node from the DOM
             * @param child
             */
            removeChild: function (child) {
                if (this.hasChild(child)) {
                    this.$dom.removeChild(child.$dom);
                }
            },
            /**
             * Remove all child nodes
             */
            empty: function () {
                this.children().each(function (child) {
                    this.removeChild(child);
                },this);
            }
        }
    });
})(nx);
(function (nx) {
    /**
     * Text Node
     * @class nx.dom.Text
     * @constructor
     */
    nx.define('nx.dom.Text', nx.dom.Node);
})(nx);
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
            set: function (inElement, inValue) {
                var type = inElement.type;
                switch (type) {
                case 'checkbox':
                case 'radio':
                    inElement.checked = !! inValue;
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
                    value = !! inElement.checked;
                    break;
                default:
                    value = inElement.value;
                }
                return value;
            }
        }
    };
    var baseAttrHooks = {
        'class': 'className',
        'for': 'htmlFor'
    };
    var booleanAttrHooks = {
        disabled: 'disabled',
        readonly: 'readonly',
        checked: 'checked'
    };
    //registerAttrHooks for Element
    (function registerAttrHooks() {

        //baseAttrHooks
        nx.each(baseAttrHooks, function (hookValue, hookKey) {
            attrHooks[hookKey] = {
                set: function (inElement, inValue) {
                    inElement[hookValue] = inValue;
                },
                get: function (inElement) {
                    return inElement[hookValue];
                }
            };
        });

        //booleanAttrHooks
        nx.each(booleanAttrHooks, function (hookValue, hookKey) {
            attrHooks[hookKey] = {
                set: function (inElement, inValue) {
                    if (!inValue) {
                        inElement.removeAttribute(hookKey);
                    }
                    else {
                        inElement.setAttribute(hookKey, hookKey);
                    }
                    inElement[hookValue] = !! inValue;
                },
                get: function (inElement) {
                    return !!inElement[hookValue];
                }
            };
        });
    }());


    function getClsPos(inElement, inClassName) {
        return (' ' + inElement.className + ' ').indexOf(' ' + inClassName + ' ');
    }

    //======attrHooks end ======//
    /**
     * Dom Element
     * @class nx.dom.Element
     * @constructor
     */
    var Element = nx.define('nx.dom.Element', nx.dom.Node, {
        methods: {
            /**
             * Get an attribute from element
             * @method get
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
             * @method set
             * @param name
             * @param value
             */
            set: function (name, value) {
                if (name === 'text') {
                    this.setText(value);
                }
                else if (name == 'html') {
                    this.setHtml(value);
                }
                else {
                    this.setAttribute(name, value);
                }
            },
            /**
             * Get an element by selector.
             * @method get
             * @param inSelector
             * @returns {HTMLElement}
             */
            select: function (inSelector) {
                var element = this.$dom.querySelector(inSelector);
                return new Element(element);
            },
            /**
             * Get a collection by selector
             * @method selectAll
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
             * @method focus
             */
            focus: function () {
                this.$dom.focus();
            },
            /**
             * Blur form an element
             * @method blur
             */
            blur: function () {
                this.$dom.blur();
            },
            /**
             * Show an element
             * @method show
             */
            show: function () {
                this.setAttribute('nx-status', '');
            },
            /**
             * Hide an element
             * @method hide
             */
            hide: function () {
                this.setAttribute('nx-status', 'hidden');
            },
            /**
             * Whether the element has the class
             * @method hasClass
             * @param inClassName
             * @returns {boolean}
             */
            hasClass: function (inClassName) {
                var element = this.$dom;
                if (nx.Env.support('classList')) {
                    return this.$dom.classList.contains(inClassName);
                }
                else {
                    return getClsPos(element, inClassName) > -1;
                }
            },
            /**
             * Set css class existence for element
             * @method setClass
             * @param className the class name
             * @param has existence
             * @returns {*}
             */
            setClass: function (inClassName, inHas) {
                if (!inHas) {
                    this.removeClass(inClassName);
                }
                else {
                    this.addClass(inClassName);
                }
            },
            /**
             * Add class for element
             * @method addClass
             * @returns {*}
             */
            addClass: function () {
                var element = this.$dom;
                var args = arguments,
                    classList = element.classList;
                if (nx.Env.support('classList')) {
                    if (args.length === 1 && args[0].search(rBlank) > -1) {
                        args = args[0].split(rBlank);
                    }
                    return classList.add.apply(classList, args);
                }
                else {
                    if (!this.hasClass(args[0])) {
                        var curCls = element.className;
                        /* jslint -W093 */
                        return element.className = curCls ? (curCls + ' ' + args[0]) : args[0];
                    }
                }
            },
            /**
             * Remove class from element
             * @method removeClass
             * @returns {*}
             */
            removeClass: function () {
                var element = this.$dom;
                if (nx.Env.support('classList')) {
                    var classList = this.$dom.classList;
                    return classList.remove.apply(classList, arguments);
                }
                else {
                    var curCls = element.className,
                        index = getClsPos(element, arguments[0]),
                        className = arguments[0];
                    if (index > -1) {
                        if (index === 0) {
                            if (curCls !== className) {
                                className = className + ' ';
                            }
                        }
                        else {
                            className = ' ' + className;
                        }
                        element.className = curCls.replace(className, '');
                    }
                }
            },
            /**
             * Toggle a class on element
             * @method toggleClass
             * @param inClassName
             * @returns {*}
             */
            toggleClass: function (inClassName) {
                var element = this.$dom;
                if (nx.Env.support('classList')) {
                    return this.$dom.classList.toggle(inClassName);
                }
                else {
                    if (this.hasClass(inClassName)) {
                        this.removeClass(inClassName);
                    }
                    else {
                        this.addClass(inClassName);
                    }
                }
            },
            /**
             * Get document
             * @method getDocument
             * @returns {*}
             */
            getDocument: function () {
                var element = this.$dom;
                var doc = document;
                if (element) {
                    doc = (element.nodeType === 9) ? element : // element === document
                    element.ownerDocument || // element === DOM node
                    element.document; // element === window
                }
                return doc;
            },
            /**
             * Get window
             * @method getWindow
             * @returns {DocumentView|window|*}
             */
            getWindow: function () {
                var doc = this.getDocument();
                return doc.defaultView || doc.parentWindow || global;
            },
            /**
             * Get root element
             * @method getRoot
             * @returns {Element}
             */
            getRoot: function () {
                return env.strict() ? document.documentElement : document.body;
            },
            /**
             * Get element position information
             * @method getBound
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
             * @method margin
             * @param inDirection
             * @returns {*}
             */
            margin: function (inDirection) {
                return this._getBoxWidth(MARGIN, inDirection);
            },
            /**
             * Get padding distance information
             * @method padding
             * @param inDirection
             * @returns {*}
             */
            padding: function (inDirection) {
                return this._getBoxWidth(PADDING, inDirection);
            },
            /**
             * Get border width information
             * @method border
             * @param inDirection
             * @returns {*}
             */
            border: function (inDirection) {
                return this._getBoxWidth(BORDER, inDirection);
            },
            /**
             * Get offset information
             * @method getOffset
             * @returns {{top: number, left: number}}
             */
            getOffset: function () {
                var box = this.$dom.getBoundingClientRect(),
                    root = this.getRoot(),
                    clientTop = root.clientTop || 0,
                    clientLeft = root.clientLeft || 0;
                return {
                    'top': box.top + (global.pageYOffset || root.scrollTop) - clientTop,
                    'left': box.left + (global.pageXOffset || root.scrollLeft) - clientLeft
                };
            },
            /**
             * Set offset style
             * @method setOffset
             * @param inStyleObj
             */
            setOffset: function (inStyleObj) {
                var elPosition = this.getStyle(POSITION),
                    styleObj = inStyleObj;
                var scrollXY = {
                    left: Math.max((global.pageXOffset || 0), root.scrollLeft),
                    top: Math.max((global.pageYOffset || 0), root.scrollTop)
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
             * @method hasStyle
             * @param inName
             * @returns {boolean}
             */
            hasStyle: function (inName) {
                var cssText = this.$dom.style.cssText;
                return cssText.indexOf(inName + ':') > -1;
            },
            /**
             * Get computed style
             * @method getStyle
             * @param inName
             * @param isInline
             * @returns {*}
             */
            getStyle: function (inName, isInline) {
                var property = util.getStyleProperty(inName);
                if (isInline) {
                    return this.$dom.style[property];
                }
                else {
                    var styles = getComputedStyle(this.$dom, null);
                    return styles[property] || '';
                }
            },
            /**
             * Set style for element
             * @method setStyle
             * @param inName
             * @param inValue
             */
            setStyle: function (inName, inValue) {
                var property = util.getStyleProperty(inName);
                this.$dom.style[property] = util.getStyleValue(inName, inValue);
            },
            /**
             * Remove inline style
             * @method removeStyle
             * @param inName
             */
            removeStyle: function (inName) {
                var property = util.getStyleProperty(inName, true);
                this.$dom.style.removeProperty(property);
            },
            /**
             * Set style by style object
             * @method setStyles
             * @param inStyles
             */
            setStyles: function (inStyles) {
                this.$dom.style.cssText += util.getCssText(inStyles);
            },
            /**
             * Get attribute
             * @method getAttribute
             * @param inName
             * @returns {*}
             */
            getAttribute: function (inName) {
                var hook = attrHooks[inName];
                if (hook) {
                    if (hook.get) {
                        return hook.get(this.$dom);
                    }
                    else {
                        return this.$dom.getAttribute(hook);
                    }
                }
                return this.$dom.getAttribute(inName);
            },
            /**
             * Set attribute
             * @method setAttribute
             * @param inName
             * @param inValue
             * @returns {*}
             */
            setAttribute: function (inName, inValue) {
                if (inValue !== null && inValue !== undefined) {
                    var hook = attrHooks[inName];
                    if (hook) {
                        if (hook.set) {
                            return hook.set(this.$dom, inValue);
                        }
                        else {
                            return this.$dom.setAttribute(hook, inValue);
                        }
                    }
                    return this.$dom.setAttribute(inName, inValue);
                }
            },
            /**
             * Remove attribute
             * @method removeAttribute
             * @param inName
             */
            removeAttribute: function (inName) {
                this.$dom.removeAttribute(baseAttrHooks[inName] || inName);
            },
            /**
             * Get all attributes
             * @method getAttributes
             * @returns {{}}
             */
            getAttributes: function () {
                var attrs = {};
                nx.each(this.$dom.attributes, function (attr) {
                    attrs[attr.name] = attr.value;
                });
                return attrs;
            },
            /**
             * Set attributes
             * @method setAttributes
             * @param attrs
             */
            setAttributes: function (attrs) {
                nx.each(attrs, function (value, key) {
                    this.setAttribute(key, value);
                }, this);
            },
            /**
             * Get inner text
             * @method getText
             * @returns {*}
             */
            getText: function () {
                return this.$dom.textContent;
            },
            /**
             * Set inner text
             * @method setText
             * @param text
             */
            setText: function (text) {
                this.$dom.textContent = text;
            },
            /**
             * Get inner html
             * @method getHtml
             * @returns {*|string}
             */
            getHtml: function () {
                return this.$dom.innerHTML;
            },
            /**
             * Set inner html
             * @method setHtml
             * @param html
             */
            setHtml: function (html) {
                this.$dom.innerHTML = html;
            },
            /**
             * Add event listener
             * @method addEventListener
             * @param name
             * @param listener
             * @param useCapture
             */
            addEventListener: function (name, listener, useCapture) {
                this.$dom.addEventListener(name, listener, useCapture || false);
            },
            /**
             * Remove event listener
             * @method removeEventListener
             * @param name
             * @param listener
             * @param useCapture
             */
            removeEventListener: function (name, listener, useCapture) {
                this.$dom.removeEventListener(name, listener, useCapture || false);
            },
            _getBoxWidth: function (inBox, inDirection) {
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

(function (nx) {

    var Collection = nx.data.Collection;
    /**
     * Dom Fragment
     * @class nx.dom.Fragment
     * @constructor
     */
    nx.define('nx.dom.Fragment', nx.dom.Node, {
        methods: {
            /**
             * Get collection child nodes.
             * @returns {nx.data.Collection}
             */
            children: function () {
                var result = new Collection();
                nx.each(this.$dom.childNodes, function (child) {
                    result.add(new this.constructor(child));
                }, this);
                return result;
            }
        }
    });
})(nx);
(function (nx) {
    var Element = nx.dom.Element;
    var Fragment = nx.dom.Fragment;
    var Text = nx.dom.Text,
        global = nx.global,
        document = global.document,
        util = nx.Util;

    var readyModel = {
        topFrame: null,
        hasReady: false,
        queue: []
    };

    var readyService = {
        setHasReady: function (inValue) {
            readyModel.hasReady = inValue;
        },
        getHasReady: function () {
            return readyModel.hasReady;
        },
        addQueue: function (inHandler) {
            readyModel.queue.push(inHandler);
        },
        clearQueue: function () {
            readyModel.queue.length = 0;
        },
        execQueue: function () {
            var i = 0,
                length = readyModel.queue.length;
            for (; i < length; i++) {
                readyModel.queue[i]();
            }
        },
        setTopFrame: function (inValue) {
            readyModel.topFrame = inValue;
        },
        getTopFrame: function () {
            return readyModel.topFrame;
        }
    };

    var readyController = {
        initReady: function (inHandler) {
            readyService.addQueue(inHandler);//save the event
            return readyController.isReady();
        },
        fireReady: function () {
            readyService.execQueue();
            readyService.clearQueue();
        },
        setTopFrame: function () {
            // If IE and not a frame
            // continually check to see if the document is ready
            try {
                readyService.setTopFrame(global.frameElement === null && document.documentElement);
            } catch (e) {
            }
        },
        doScrollCheck: function () {
            var topFrame = readyService.getTopFrame();
            if (topFrame && topFrame.doScroll) {
                try {
                    // Use the trick by Diego Perini
                    // http://javascript.nwbox.com/IEContentLoaded/
                    topFrame.doScroll("left");
                } catch (e) {
                    return setTimeout(readyController.doScrollCheck, 50);
                }

                // and execute any waiting functions
                readyController.fireReady();
            }
        },
        isOnLoad: function (inEvent) {
            return (inEvent || global.event).type === 'load';
        },
        isReady: function () {
            return readyService.getHasReady() || document.readyState === "complete";
        },
        detach: function () {
            if (document.addEventListener) {
                document.removeEventListener("DOMContentLoaded", readyController.completed, false);
                global.removeEventListener("load", readyController.completed, false);
            } else {
                document.detachEvent("onreadystatechange", readyController.completed);
                global.detachEvent("onload", readyController.completed);
            }
        },
        w3cReady: function () {
            document.addEventListener('DOMContentLoaded', readyController.completed, false);
            global.addEventListener('load', readyController.completed, false);
        },
        ieReady: function () {
            document.attachEvent("onreadystatechange", readyController.completed);
            global.attachEvent("onload", readyController.completed);
            readyController.setTopFrame();
            readyController.doScrollCheck();
        },
        readyMain: function () {
            if (document.readyState === "complete") {
                return setTimeout(readyController.readyMain);
            } else {
                if (document.addEventListener) {
                    //w3c
                    readyController.w3cReady();
                } else {
                    //old ie
                    readyController.ieReady();
                }
            }
        },
        completed: function (inEvent) {
            if (readyController.isReady() || readyController.isOnLoad(inEvent)) {
                readyService.setHasReady(true);
                readyController.detach();
                readyController.fireReady();
            }
        }
    };

    var nsMap = {
        svg: "http://www.w3.org/2000/svg",
        xlink: "http://www.w3.org/1999/xlink",
        xhtml: "http://www.w3.org/1999/xhtml"
    };

    /**
     * Document Element
     * @class nx.dom.Document
     * @constructor
     */
    var Document = nx.define('nx.dom.Document', {
        static: true,
        properties: {
            /**
             * Get/set next cssStyle sheet
             * @property cssStyleSheet
             * @type {Object}
             * @default {}
             */
            cssStyleSheet: {
                get: function () {
                    var nxCssStyleSheet = this._cssStyleSheet;
                    if (!nxCssStyleSheet) {
                        var styleNode = document.getElementById('nx-style') || this._createStyleNode();
                        nxCssStyleSheet = this._cssStyleSheet = this._getCSSStyleSheetInstance(styleNode);
                    }
                    return nxCssStyleSheet;
                }
            },
            /**
             * Get document root element
             * @property root
             * @type {Object}
             * @default {}
             */
            root: {
                get: function () {
                    return document.documentElement;
                }
            },
            /**
             * Get next body element
             * @property body
             * @type {Object}
             * @default {}
             */
            body: {
                get: function () {
                    return new Element(document.body);
                }
            },
            html: {
                get: function () {
                    return new Element(document.getElementsByTagName('html')[0]);
                }
            }
        },
        methods: {
            /**
             * Add an event listener
             * @method on
             * @param name
             * @param handler
             * @param context
             */
            on: function (name, handler, context) {
                this._attachDocumentListeners(name);
                this.inherited(name, handler, context);
            },
            /**
             * Add an event listener when you need not remove it.
             * @method upon
             * @param name
             * @param handler
             * @param context
             */
            upon: function (name, handler, context) {
                this._attachDocumentListeners(name);
                this.inherited(name, handler, context);
            },
            /**
             * Register html tag namespace
             * @method registerNS
             * @param key
             * @param value
             */
            registerNS: function (key, value) {
                nsMap[key] = value;
            },
            /**
             * Get a tag namespace value
             * @method resolveNS
             * @param key
             * @returns {*}
             */
            resolveNS: function (key) {
                return nsMap[key];
            },
            /**
             * Create document fragment
             * @method createFragment
             * @returns {nx.dom.Fragment}
             */
            createFragment: function () {
                return new Fragment(document.createDocumentFragment());
            },
            /**
             * Create element
             * @method createElement
             * @param tag
             * @returns {nx.dom.Element}
             */
            createElement: function (tag) {
                return new Element(document.createElement(tag));
            },
            /**
             * Create text node.
             * @method createText
             * @param text
             * @returns {nx.dom.Text}
             */
            createText: function (text) {
                return new Text(document.createTextNode(text));
            },
            /**
             * Create element by namespace
             * @method createElementNS
             * @param ns
             * @param tag
             * @returns {nx.dom.Element}
             */
            createElementNS: function (ns, tag) {
                var uri = Document.resolveNS(ns);
                if (uri) {
                    return new Element(document.createElementNS(uri, tag));
                }
                else {
                    throw new Error('The namespace ' + ns + ' is not registered.');
                }
            },
            /**
             * Wrap dom element to next element
             * @method wrap
             * @param dom
             * @returns {*}
             */
            wrap: function (dom) {
                if (nx.is(dom, Node)) {
                    return dom;
                }
                else {

                }
            },
            /**
             * Get document position information
             * @method docRect
             * @returns {{width: (Function|number), height: (Function|number), scrollWidth: *, scrollHeight: *, scrollX: *, scrollY: *}}
             */
            docRect: function () {
                var root = this.root(),
                    height = global.innerHeight || 0,
                    width = global.innerWidth || 0,
                    scrollW = root.scrollWidth,
                    scrollH = root.scrollHeight,
                    scrollXY = {
                        left: Math.max((global.pageXOffset || 0), root.scrollLeft),
                        top: Math.max((global.pageYOffset || 0), root.scrollTop)
                    };
                scrollW = Math.max(scrollW, width);
                scrollH = Math.max(scrollH, height);
                return {
                    width: width,
                    height: height,
                    scrollWidth: scrollW,
                    scrollHeight: scrollH,
                    scrollX: scrollXY.left,
                    scrollY: scrollXY.top
                };
            },
            /**
             * Dom ready
             * @method ready
             * @param inHandler
             */
            ready: function (inHandler) {
                //add handler to queue:
                if (readyController.initReady(inHandler)) {
                    setTimeout(readyController.fireReady, 1);
                } else {
                    readyController.readyMain();
                }
            },
            /**
             * Add a rule to next style sheet
             * @method addRule
             * @param inSelector
             * @param inCssText
             * @param inIndex
             * @returns {*}
             */
            addRule: function (inSelector, inCssText, inIndex) {
                return this._ruleAction('add', [inSelector, inCssText, inIndex]);
            },
            /**
             * insert a rule to next style sheet
             * @method insertRule
             * @param inFullCssText
             * @param inIndex
             * @returns {*}
             */
            insertRule: function (inFullCssText, inIndex) {
                return this._ruleAction('insert', [inFullCssText, inIndex]);
            },
            /**
             * Delete a rule from next style sheet at last line
             * @method deleteRule
             * @param inIndex
             * @returns {*}
             */
            deleteRule: function (inIndex) {
                return this._ruleAction('delete', [inIndex]);
            },
            /**
             * Remove a rule from next style sheet
             * @method removeRule
             * @param inSelector
             * @param inIndex
             * @returns {*}
             */
            removeRule: function (inSelector, inIndex) {
                return this._ruleAction('remove', [inSelector, inIndex]);
            },
            /**
             * Add multi rules
             * @method addRules
             * @param inRules
             */
            addRules: function (inRules) {
                nx.each(inRules, function (rule, selector) {
                    this.addRule(selector, util.getCssText(rule), null);
                }, this);
            },
            /**
             * Delete all rules
             * @method deleteRules
             */
            deleteRules: function () {
                var defLength = this.cssStyleSheet().rules.length;
                while (defLength--) {
                    this.deleteRule(0);
                }
            },
            _ruleAction: function (inAction, inArgs) {
                var styleSheet = this.cssStyleSheet();
                var lastIndex = inArgs.length - 1;
                //set default index
                inArgs[lastIndex] = this._defRuleIndex(styleSheet, inArgs[lastIndex]);
                styleSheet[inAction + 'Rule'].apply(styleSheet, inArgs);
                return this._defRuleIndex(styleSheet, null);
            },
            _defRuleIndex: function (inStyleSheet, inIndex) {
                return inIndex === null ? inStyleSheet.rules.length : inIndex;
            },
            _createStyleNode: function () {
                var styleNode = document.createElement("style");
                styleNode.type = "text/css";
                styleNode.id = "nx-style";
                (document.head || document.getElementsByTagName("head")[0] || document.documentElement).appendChild(styleNode);
                return styleNode;
            },
            _getCSSStyleSheetInstance: function (inStyleNode) {
                var styleSheets = document.styleSheets,
                    key,
                    sheet = null;
                for (key in styleSheets) {
                    sheet = styleSheets[key];
                    if (sheet.ownerNode === inStyleNode) {
                        break;
                    }
                }
                return sheet;
            },
            _attachDocumentListeners: function (name) {
                var documentListeners = this._documentListeners;
                if (!(name in documentListeners)) {
                    var self = this;
                    var listener = documentListeners[name] = function (event) {
                        self.fire(name, event);
                    };

                    document.addEventListener(name, listener);
                }
            }
        }
    });
})(nx);
(function (nx) {

    var Document = nx.dom.Document;

    function createElement(tag, text) {
        var tokens = tag.split(':');
        if (tokens.length === 2) {
            var ns = tokens[0];
            tag = tokens[1];
            return Document.createElementNS(ns, tag);
        }
        else if (tag === 'text') {
            return Document.createText(text);
        }
        else if (tag === 'fragment') {
            return  Document.createFragment();
        }
        else {
            return Document.createElement(tag);
        }
    }

    function createComponent(view, owner) {
        var comp = null;
        if (view) {
            if (nx.is(view, 'Array')) {
                comp = createElement('fragment');

                nx.each(view, function (v) {
                    comp.appendChild(createComponent(v, owner));
                });
            }
            else if (nx.is(view, 'Object')) {
                comp = createElement(view.tag || 'div');
            }
            else if (nx.is(view, 'String')) {
                comp = createElement('text', view);
            }

            nx.each(view.events, function (value, name) {
                comp.addEventListener(name, function (e) {
                    value.call(owner, comp, e);
                });
            });

            nx.each(view.props, function (value, name) {
                comp.set(name, value);
            });

            if (view.content !== undefined) {
                comp.appendChild(createComponent(view.content, owner));
            }
        }

        return comp;
    }

    var SimpleComponent = nx.define('nx.ui.SimpleComponent', {
        properties: {
            owner: null,
            dom: null
        },
        methods: {
            init: function () {
                var view = this['@view'];
                if (view) {
                    this.dom(createComponent(view, this));
                }
            },
            attach: function (parent, index) {
                var container = parent.getContainer(this);
                var dom = this.dom();
                if (container && dom) {
                    if (index >= 0) {
                        container.insertChild(dom);
                    }
                    else {
                        container.appendChild(dom);
                    }
                }
            },
            detach: function () {
                var container = parent.getContainer(this);
                var dom = this.dom();
                if (container && dom) {
                    container.removeChild(dom);
                }
            }
        }
    });
})(nx);
(function (nx) {
    var global = nx.global;
    var Binding = nx.Binding;
    var Collection = nx.data.Collection;
    var Document = nx.dom.Document;

    function extractBindingExpression(value) {
        if (nx.is(value, 'String')) {
            var start = value.indexOf('{');
            var end = value.indexOf('}');

            if (start >= 0 && end > start) {
                return value.slice(start + 1, end);
            }
        }

        return null;
    }

    function setProperty(target, name, value, source, owner) {
        if (nx.is(value, Binding)) {
            target.setBinding(name, nx.extend(value.gets(), {
                bindingType: 'property'
            }));
        }
        else {
            var expr = extractBindingExpression(value);
            if (expr !== null) {
                if (expr[0] === '#') {
                    target.setBinding(name, expr.slice(1) + ',bindingType=property', owner || target);
                }
                else {
                    target.setBinding(name, (expr ? 'model.' + expr : 'model') + ',bindingType=property', source || target);
                }
            }
            else {
                target.set(name, value);
            }
        }
    }

    function setEvent(target, name, value, source, owner) {
        if (nx.is(value, Binding)) {
            target.setBinding(name, value.gets());
        }
        else {
            var expr = extractBindingExpression(value);
            if (expr !== null) {
                if (expr[0] === '#') {
                    target.setBinding(name, expr.slice(1) + ',bindingType=event', owner || target);
                }
                else {
                    target.setBinding(name, (expr ? 'model.' + expr : 'model') + ',bindingType=event', source || target);
                }
            }
            else {
                target.on(name, value, owner || target);
            }
        }
    }

    function createComponent(view, owner) {
        if (view) {
            var comp;
            if (nx.is(view, 'Array')) {
                comp = new DOMComponent('fragment');

                nx.each(view, function (child) {
                    createComponent(child, owner).attach(comp);
                });
            }
            else if (nx.is(view, 'Object')) {
                var type = view.type;
                if (type) {
                    var clazz = nx.is(type, 'String') ? nx.path(global, type) : type;
                    if (nx.is(clazz, 'Function')) {
                        comp = new clazz();
                    }
                    else {
                        throw new Error('Component "' + type + '" is not defined.');
                    }
                }
                else {
                    comp = new DOMComponent(view.tag || 'div');
                }

                var name = view.name;
                var props = view.props;
                var events = view.events;
                var content = view.content;

                if (name) {
                    comp.register('@name', name);
                }

                if (owner) {
                    comp.owner(owner);
                }

                nx.each(events, function (value, name) {
                    setEvent(comp, name, value, comp, owner);
                });

                nx.each(props, function (value, name) {
                    if (nx.is(value, 'Array')) {
                        nx.each(value, function (item) {
                            if (nx.is(item, 'Object')) {
                                item.__owner__ = owner;
                            }
                        });
                    }

                    if (nx.is(value, 'Object')) {
                        value.__owner__ = owner;
                    }

                    setProperty(comp, name, value, comp, owner);
                });

                if (content !== undefined) {
                    setProperty(comp, 'content', content, comp, owner);
                }
            }
            else if (view !== undefined) {
                comp = new DOMComponent('text', view);
            }

            return comp;
        }

        return null;
    }

    /**
     * @class Collection
     * @namespace nx.ui
     * @extends nx.Observable
     */
    var AbstractComponent = nx.define('nx.ui.AbstractComponent', nx.Observable, {
        abstract: true,
        statics: {
            /**
             * Create component by json view.
             * @method createComponent
             * @static
             */
            createComponent: createComponent
        },
        events: ['enter', 'leave', 'contententer', 'contentleave'],
        properties: {
            /**
             * @property count
             * @type {nx.data.Collection}
             */
            content: {
                get: function () {
                    return this._content;
                },
                set: function (value) {
                    nx.each(this._content.toArray(), function (c) {
                        c.destroy();
                    });
                    if (nx.is(value, AbstractComponent)) {
                        value.attach(this);
                    }
                    else if (nx.is(value, 'Array')) {
                        nx.each(value, function (v) {
                            createComponent(v, this.owner()).attach(this);
                        }, this);
                    }
                    else if (value) {
                        createComponent(value, this.owner()).attach(this);
                    }
                }
            },
            /**
             * @property model
             * @type {Any}
             */
            model: {
                get: function () {
                    return this._model || this._inheritedModel;
                },
                set: function (value, inherited) {
                    if (inherited) {
                        this._inheritedModel = value;
                    }
                    else {
                        this._model = value;
                    }

                    this._content.each(function (c) {
                        if (!nx.is(c, 'String')) {
                            c.model(value, true);
                        }
                    });

                    if (inherited && this._model) {
                        return false;
                    }
                }
            },
            /**
             * @property owner
             * @type {nx.ui.AbstractComponent}
             */
            owner: {
                value: null
            },
            /**
             * @property parent
             * @type {nx.ui.AbstractComponent}
             */
            parent: {
                value: null
            }
        },
        methods: {
            init: function () {
                this.inherited();
                this._resources = {};
                this._content = new Collection();
            },
            /**
             * Attach the component to parent.
             * @method attach
             * @param parent
             * @param index
             */
            attach: function (parent, index) {
                this.detach();

                if (nx.is(parent, AbstractComponent)) {
                    var name = this.resolve('@name');
                    var owner = this.owner() || parent;

                    if (name) {
                        owner.register(name, this);
                    }

                    this.onAttach(parent, index);
                    parent.onChildAttach(this, index);

                    if (index >= 0) {
                        parent.content().insert(this, index);
                    }
                    else {
                        parent.content().add(this);
                    }

                    this.parent(parent);
                    this.owner(owner);
                    parent.fire('contententer', {
                        content: this,
                        owner: owner
                    });
                    this.fire('enter', {
                        parent: parent,
                        owner: owner
                    });

                    this._attached = true;
                }
            },
            /**
             * Detach the component from parent.
             * @method detach
             */
            detach: function () {
                if (this._attached) {
                    var name = this.resolve('@name');
                    var owner = this.owner();
                    var parent = this.parent();

                    if (name) {
                        owner.unregister(name);
                    }

                    this.onDetach(parent);
                    parent.onChildDetach(this);
                    parent.content().remove(this);
                    this.parent(null);
                    this.owner(null);
                    parent.fire('contentleave', {
                        content: this,
                        owner: owner
                    });
                    this.fire('leave', {
                        parent: parent,
                        owner: owner
                    });
                    this._attached = false;
                }
            },
            /**
             * Register a resource.
             * @method register
             * @param name
             * @param value
             * @param force
             */
            register: function (name, value, force) {
                var resources = this._resources;
                if (resources && !(name in resources) || force) {
                    resources[name] = value;
                }
            },
            /**
             * Unregister a resource.
             * @method unregister
             * @param name
             */
            unregister: function (name) {
                var resources = this._resources;
                if (resources && name in resources) {
                    delete resources[name];
                }
            },
            /**
             * Resolve a resource.
             * @method resolve
             * @param name
             * @returns {Any}
             */
            resolve: function (name) {
                var resources = this._resources;
                if (resources && name in resources) {
                    return resources[name];
                }
            },
            /**
             * Get the container for component.
             * @method getContainer
             * @param comp
             * @returns {nx.dom.Element}
             */
            getContainer: function (comp) {
                if (this.resolve('@tag') === 'fragment') {
                    var parent = this.parent();
                    if (parent) {
                        return parent.getContainer(comp);
                    }
                }

                return this.resolve('@root');
            },
            /**
             * Dispose the component.
             * @method dispose
             */
            dispose: function () {
                this.inherited();
                if (this._content) {
                    this._content.each(function (content) {
                        content.dispose();
                    });
                }

                this._resources = null;
                this._content = null;
                this._model = null;
                this._inheritedModel = null;
                this.dispose = function () {};
            },
            /**
             * Destroy the component.
             * @method destroy
             */
            destroy: function () {
                this.detach();
                this.inherited();
            },
            /**
             * Template method for component attach.
             * @method onAttach
             */
            onAttach: function (parent, index) {},
            /**
             * Template method for component detach.
             * @method onDetach
             */
            onDetach: function (parent) {},
            /**
             * Template method for child component attach.
             * @method onChildAttach
             */
            onChildAttach: function (child, index) {},
            /**
             * Template method for child component detach.
             * @method onChildDetach
             */
            onChildDetach: function (child) {}
        }
    });

    /**
     * @class CssClass
     * @extends nx.Observable
     * @internal
     */
    var CssClass = nx.define(nx.Observable, {
        methods: {
            init: function (comp) {
                this.inherited();
                this._comp = comp;
                this._classList = [];
            },
            has: function (name) {
                return name in this._classList;
            },
            get: function (name) {
                return this._classList[name];
            },
            set: function (name, value) {
                this._classList[name] = value;
                this._comp.resolve('@root').set('class', this._classList.join(' '));
            },
            hasClass: function (name) {
                return this._classList.indexOf(name) >= 0;
            },
            addClass: function (name) {
                if (!this.hasClass(name)) {
                    this._classList.push(name);
                    this._comp.resolve('@root').set('class', this._classList.join(' '));
                }
            },
            removeClass: function (name) {
                var index = this._classList.indexOf(name);
                if (index >= 0) {
                    this._classList.splice(index, 1);
                    this._comp.resolve('@root').set('class', this._classList.join(' '));
                }
            },
            toggleClass: function (name) {
                var index = this._classList.indexOf(name);
                if (index >= 0) {
                    this._classList.splice(index, 1);
                }
                else {
                    this._classList.push(name);
                }

                this._comp.resolve('@root').set('class', this._classList.join(' '));
            },
            dispose: function () {
                this.inherited();
                this._comp = null;
                this._classList = null;
            }
        }
    });

    /**
     * @class CssStyle
     * @extends nx.Observable
     * @internal
     */
    var CssStyle = nx.define(nx.Observable, {
        methods: {
            init: function (comp) {
                this.inherited();
                this._comp = comp;
            },
            get: function (name) {
                return this._comp.resolve('@root').getStyle(name);
            },
            set: function (name, value) {
                this._comp.resolve('@root').setStyle(name, value);
            },
            dispose: function () {
                this.inherited();
                this._comp = null;
            }
        }
    });

    /**
     * @class DOMComponent
     * @extends nx.ui.AbstractComponent
     * @internal
     */
    var DOMComponent = nx.define(AbstractComponent, {
        final: true,
        events: ['generated'],
        properties: {
            /**
             * @property class
             * @type {CssClass}
             */
            'class': {
                get: function () {
                    return this._class;
                },
                set: function (value) {
                    var cssClass = this._class;
                    if (nx.is(value, 'Array')) {
                        nx.each(value, function (item, index) {
                            setProperty(cssClass, '' + index, item, this, value.__owner__ || this.owner());
                        }, this);
                    }
                    else if (nx.is(value, 'Object')) {
                        if (value.add) {
                            this._class.addClass(value.add);
                        }
                        if (value.remove) {
                            this._class.addClass(value.remove);
                        }
                        if (value.toggle) {
                            this._class.addClass(value.toggle);
                        }
                    }
                    else {
                        this.resolve('@root').set('class', value);
                    }
                }
            },
            /**
             * @property style
             * @type {CssStyle}
             */
            style: {
                get: function () {
                    return this._style;
                },
                set: function (value) {
                    if (nx.is(value, 'Object')) {
                        var cssStyle = this._style;
                        nx.each(value, function (v, k) {
                            setProperty(cssStyle, k, v, this, value.__owner__ || this.owner());
                        }, this);
                    }
                    else {
                        this.resolve('@root').set('style', value);
                    }
                }
            },
            /**
             * @property template
             */
            template: {
                get: function () {
                    return this._template;
                },
                set: function (value) {
                    this._template = value;
                    this._generateContent();
                }
            },
            /**
             * @property items
             */
            items: {
                get: function () {
                    return this._items;
                },
                set: function (value) {
                    var items = this._items;
                    if (items && items.off) {
                        items.off('change', this._onItemsChange, this);
                    }
                    items = this._items = value;
                    if (items && items.on) {
                        items.on('change', this._onItemsChange, this);
                    }

                    this._generateContent();
                }
            },
            /**
             * @property value
             */
            value: {
                get: function () {
                    return this.resolve('@root').get('value');
                },
                set: function (value) {
                    return this.resolve('@root').set('value', value);
                },
                binding: {
                    direction: '<>'
                }
            },
            /**
             * @property states
             */
            states: {
                value: null
            },
            /**
             * @property dom
             */
            dom: {
                get: function () {
                    return this.resolve('@root');
                }
            }
        },
        methods: {
            init: function (tag, text) {
                this.inherited();
                this._domListeners = {};
                this._resources = {};
                this._content = new Collection();
                this._class = new CssClass(this);
                this._style = new CssStyle(this);

                if (tag) {
                    var tokens = tag.split(':');
                    if (tokens.length === 2) {
                        var ns = tokens[0];
                        tag = tokens[1];
                        this.register('@ns', ns);
                        this.register('@root', Document.createElementNS(ns, tag));
                    }
                    else if (tag === 'text') {
                        this.register('@root', Document.createText(text));
                    }
                    else if (tag === 'fragment') {
                        this.register('@root', Document.createFragment());
                    }
                    else {
                        this.register('@root', Document.createElement(tag));
                    }

                    this.register('@tag', tag);
                }

                //Temp
                switch (tag) {
                case 'input':
                case 'textarea':
                    this.on('change', function (sender, event) {
                        switch (event.target.type) {
                        case 'checkbox':
                        case 'radio':
                            this.notify('checked');
                            break;
                        default:
                            this.notify('value');
                            break;
                        }
                    }, this);
                    this.on('input', function (sender, event) {
                        this.notify('value');
                    }, this);
                    break;
                case 'select':
                    this.on('change', function (sender, event) {
                        this.notify('selectedIndex');
                        this.notify('value');
                    }, this);
                    break;
                }
            },
            get: function (name) {
                if (this.has(name) || name.indexOf(':') >= 0) {
                    return this.inherited(name);
                }
                else {
                    return this.resolve('@root').get(name);
                }
            },
            set: function (name, value) {
                if (this.has(name) || name.indexOf(':') >= 0) {
                    this.inherited(name, value);
                }
                else {
                    this.resolve('@root').set(name, value);
                    this.notify(name);
                }
            },
            on: function (name, handler, context) {
                this._attachDomListener(name);
                this.inherited(name, handler, context);
            },
            upon: function (name, handler, context) {
                this._attachDomListener(name);
                this.inherited(name, handler, context);
            },
            dispose: function () {
                var root = this.resolve('@root');
                if (root) {
                    nx.each(this._domListeners, function (listener, name) {
                        if (name.charAt(0) === ':') {
                            root.removeEventListener(name.slice(1), listener, true);
                        }
                        else {
                            root.removeEventListener(name, listener);
                        }
                    });
                }
                this.items(null);
                this._class.dispose();
                this._style.dispose();
                this.inherited();
                this._domListeners = null;
            },
            onAttach: function (parent, index) {
                var root = this.resolve('@root');
                if (root) {
                    var container = parent.getContainer(this);

                    if (index >= 0) {
                        var ref = parent.content().getItem(index);

                        if (ref && ref.resolve('@tag') === 'fragment') {
                            ref = ref.content().getItem(0);
                        }

                        if (ref) {
                            container.insertBefore(root, ref.resolve('@root'));
                        }
                        else {
                            container.appendChild(root);
                        }
                    }
                    else {
                        container.appendChild(root);
                    }

                    var states = this.states();
                    var enterState = null;
                    if (states) {
                        enterState = states.enter;
                    }

                    if (enterState) {
                        var cssText = root.$dom.style.cssText;
                        var transition = 'all ' + (enterState.duration || 500) + 'ms';
                        root.setStyles(nx.extend({
                            transition: transition
                        }, enterState));
                        this.upon('transitionend', function () {
                            root.removeStyle('transition');
                        });
                        setTimeout(function () {
                            root.$dom.style.cssText = cssText + ';transition: ' + transition;
                        }, 10);
                    }
                }
            },
            onDetach: function (parent) {
                var root = this.resolve('@root');
                if (root) {
                    var tag = this.resolve('@tag');
                    var self = this;

                    if (tag === 'fragment') {
                        nx.each(self.content(), function (child) {
                            root.appendChild(child.resolve('@root'));
                        });
                    }
                    else {
                        var states = this.states();
                        var leaveState = null;
                        if (states) {
                            leaveState = states.leave;
                        }

                        if (leaveState) {
                            var cssText = root.$dom.style.cssText;
                            var transition = 'all ' + (leaveState.duration || 500) + 'ms';
                            root.setStyle('transition', transition);
                            setTimeout(function () {
                                root.setStyles(leaveState);
                            }, 10);
                            this.upon('transitionend', function () {
                                root.$dom.style.cssText = cssText;
                                parent.getContainer(this).removeChild(root);
                            });
                        }
                        else {
                            parent.getContainer(this).removeChild(root);
                        }
                    }
                }
            },
            _attachDomListener: function (name) {
                var domListeners = this._domListeners;
                if (!(name in domListeners)) {
                    var self = this;
                    var root = this.resolve('@root');
                    var listener = domListeners[name] = function (event) {
                        self.fire(name, event);
                    };

                    if (name.charAt(0) === ':') {
                        root.addEventListener(name.slice(1), listener, true);
                    }
                    else {
                        root.addEventListener(name, listener);
                    }
                }
            },
            _generateContent: function () {
                var template = this._template;
                var items = this._items;
                nx.each(this._content.toArray(), function (c) {
                    c.detach();
                    setTimeout(function () {
                        c.dispose();
                    }, 600);
                });

                if (template && items) {
                    nx.each(items, function (item) {
                        var comp = createComponent(template, this.owner());
                        comp.model(item);
                        comp.attach(this);
                    }, this);

                    this.fire('generated');
                }
            },
            _onItemsChange: function (sender, event) {
                var template = this._template;
                var action = event.action;
                var index = event.index;
                index = index >= 0 ? index : -1;
                if (action === 'add') {
                    nx.each(event.items, function (item, i) {
                        var comp = createComponent(template, this.owner());
                        comp.model(item);
                        comp.attach(this, index + i);
                    }, this);
                }
                else if (action === 'remove') {
                    nx.each(event.items, function (item) {
                        nx.each(this.content().toArray(), function (comp) {
                            if (comp.model() === item) {
                                comp.detach();
                            }
                        }, this);
                    }, this);
                }
                else if (action === 'replace') {
                    var oldItem = event.oldItem,
                        newItem = event.newItem;

                    nx.each(this.content().toArray(), function (comp) {
                        if (comp.model() === oldItem) {
                            comp.model(newItem);
                        }
                    }, this);
                }
                else if (action === 'sort') {
                    var comparator = event.comparator;
                    var sortedContent = this.content().toArray().sort(function (a, b) {
                        return comparator(a.model(), b.model());
                    });

                    nx.each(sortedContent, function (comp) {
                        comp.attach(this);
                    }, this);
                }
                else {
                    this._generateContent();
                }
            }
        }
    });
})(nx);

(function (nx) {
    var AbstractComponent = nx.ui.AbstractComponent;

    /**
     * @class Component
     * @namespace nx.ui
     * @extends nx.ui.AbstractComponent
     */
    nx.define('nx.ui.Component', AbstractComponent, {
        properties: {
            model: {
                get: function () {
                    return this._model || this._inheritedModel;
                },
                set: function (value, inherited) {
                    if (inherited) {
                        this._inheritedModel = value;
                    }
                    else {
                        this._model = value;
                    }

                    var view = this.view();
                    if (view) {
                        view.model(value, true);
                    }

                    var content = this._content;
                    if (content) {
                        content.each(function (c) {
                            if (!nx.is(c, 'String')) {
                                c.model(value, true);
                            }
                        });
                    }
                }
            },
            'class': {
                get: function () {
                    return this.view().get('class');
                },
                set: function (value) {
                    this.view().set('class', value);
                }
            },
            style: {
                get: function () {
                    return this.view().style();
                },
                set: function (value) {
                    this.view().style(value);
                }
            },
            dom: {
                get: function () {
                    return this.resolve('@root');
                }
            }
        },
        methods: {
            init: function () {
                this.inherited();
                var view = this['@view'];
                if (nx.is(view, 'Function')) {
                    var cls = this.constructor;
                    var superView;
                    while (cls) {
                        cls = cls.__super__;
                        superView = cls['@view'];
                        if (superView) {
                            break;
                        }
                    }
                    view = view.call(this, nx.clone(superView));
                }

                if (view) {
                    var comp = AbstractComponent.createComponent(view, this);
                    this.register('@root', comp.resolve('@root'));
                    this.register('@tag', comp.resolve('@tag'));
                    this.register('@comp', comp);
                }
            },
            view: function (name) {
                return this.resolve(name || '@comp');
            },
            get: function (name) {
                if (this.has(name)) {
                    return this.inherited(name);
                }
                else {
                    return this.view().get(name);
                }
            },
            set: function (name, value) {
                if (this.has(name)) {
                    this.inherited(name, value);
                }
                else {
                    this.view().set(name, value);
                    this.notify(name);
                }
            },
            onAttach: function (parent, index) {
                this.view().onAttach(parent, index);
            },
            onDetach: function () {
                this.view().onDetach(this.parent());
            },
            on: function (name, handler, context) {
                if (this.can(name)) {
                    this.inherited(name, handler, context);
                }
                else {
                    this.view().on(name, handler, context);
                }
            },
            upon: function (name, handler, context) {
                if (this.can(name)) {
                    this.inherited(name, handler, context);
                }
                else {
                    this.view().upon(name, handler, context);
                }
            },
            off: function (name, handler, context) {
                if (this.can(name)) {
                    this.inherited(name, handler, context);
                }
                else {
                    this.view().off(name, handler, context);
                }
            },
            dispose: function () {
                var comp = this.view();
                if (comp) {
                    comp.dispose();
                }

                this.inherited();
            }
        }
    });
})(nx);
(function (nx) {
    var global = nx.global;
    var Document = nx.dom.Document;

    /**
     * @class Application
     * @namespace nx.ui
     * @extends nx.ui.AbstractComponent
     */
    nx.define('nx.ui.Application', nx.ui.AbstractComponent, {
        properties: {
            container: {}
        },
        methods: {
            init: function () {
                this.inherited();
                var startFn = this.start;
                var stopFn = this.stop;
                var self = this;
                this.start = function (options) {
                    Document.ready(function () {
                        nx.app = self;
                        startFn.call(self, options);
                    });
                    return this;
                };

                this.stop = function () {
                    nx.app = null;
                    stopFn.call(self);
                };

                this._globalListeners = {};
            },
            /**
             * Start the application.
             * @method start
             */
            start: function () {
                throw new Error('Method "start" is not implemented');
            },
            /**
             * Stop the application.
             * @method stop
             */
            stop: function () {
                throw new Error('Method "stop" is not implemented');
            },
            getContainer: function () {
                if (this.container()) {
                    return new nx.dom.Element(this.container());
                } else {
                    return Document.body();
                }

            },
            on: function (name, handler, context) {
                if (!this.can(name)) {
                    this._attachGlobalListeners(name);
                }

                this.inherited(name, handler, context);
            },
            upon: function (name, handler, context) {
                if (!this.can(name)) {
                    this._attachGlobalListeners(name);
                }

                this.inherited(name, handler, context);
            },
            _attachGlobalListeners: function (name) {
                var globalListeners = this._globalListeners;
                if (!(name in globalListeners)) {
                    var self = this;
                    var listener = globalListeners[name] = function (event) {
                        self.fire(name, event);
                    };

                    window.addEventListener(name, listener);
                }
            }
        }
    });
})(nx);
