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
        'webkit': ['webkit','-webkit-'],
        'gecko': ['Moz','-moz-'],
        'presto': ['O','-o-']
    };

    var osPatternMap = {
        'windows': /windows|win32/,
        'macintosh': /macintosh|mac_powerpc/,
        'linux': /linux/
    };

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


    var supportMap = {
        addEventListener: !!document.addEventListener,
        dispatchEvent: !!document.dispatchEvent,
        getBoundingClientRect: !!document.documentElement.getBoundingClientRect,
        onmousewheel: 'onmousewheel' in document,
        XDomainRequest: !!window.XDomainRequest,
        crossDomain: !!( window.XDomainRequest || window.XMLHttpRequest),
        getComputedStyle: 'getComputedStyle' in window,
        iePropertyChange: !!(ie && ie < 9),
        w3cChange: !ie || ie > 8,
        w3cFocus: !ie || ie > 8,
        w3cInput: !ie || ie > 9,
        innerText: 'innerText' in tempElement,
        firstElementChild: 'firstElementChild' in tempElement,
        cssFloat: 'cssFloat' in tempStyle,
        opacity: (/^0.55$/).test(tempStyle.opacity),
        filter: 'filter' in tempStyle,
        removeProperty: 'removeProperty' in tempStyle
    };

    nx.define('nx.Env',{
        static: true,
        properties: {
            documentMode: {
                value: documentMode
            },
            compatMode: {
                value: compatMode
            },
            userAgent: {
                value: userAgent
            },
            strict: {
                get: function () {
                    return compatMode === 'CSS1Compat';
                }
            },
            secure: {
                get: function () {
                    return protocol.indexOf('https') === 0;
                }
            },
            os: {
                get: function () {
                    var osName;
                    for (osName in osPatternMap) {
                        if (osPatternMap[osName].test(userAgent)) {
                            break;
                        }
                    }
                    return {
                        name: osName
                    };
                }
            },
            prefix: {
                get: function () {
                    return vendorPrefixMap[this.engine().name];
                }
            },
            engine: {
                get: function () {
                    return (this[this.browser().name + 'Engine'] || this.defaultEngine).call(this);
                }
            },
            browser: {
                get: function () {
                    var browserName,
                        item,
                        checkIs,
                        checkExclude,
                        browserVersion = 0,
                        check = this._check;

                    for (browserName in browserPatternMap) {
                        item = browserPatternMap[browserName];
                        checkIs = check(new RegExp(item.is));
                        checkExclude = check(new RegExp(item.exclude));
                        if (checkIs && !checkExclude) {
                            if (userAgent.indexOf('opr/') > -1) {
                                browserName = 'opera';
                                item.version = '\\bopr\/';
                            }
                            browserVersion = this._versionByKeyRegexp(item.version);
                            break;
                        }
                    }

                    return {
                        name: browserName,
                        version: browserVersion
                    };
                }
            }
        },
        methods: {
            firefoxEngine: function () {
                return {
                    name: 'gecko',
                    version: this._versionByKeyRegexp('rv:')
                };
            },
            operaEngine: function () {
                var version = this._versionByKeyRegexp('presto\\/');
                var engineName = 'presto';
                if (!version) {
                    engineName = 'webkit';
                    version = this._versionByKeyRegexp('webkit\\/');
                }
                return {
                    name: engineName,
                    version: version
                };
            },
            ieEngine: function () {
                return {
                    name: 'trident',
                    version: this._versionByKeyRegexp('trident\\/') || 4
                };
            },
            defaultEngine: function () {
                return {
                    name: 'webkit',
                    version: this._versionByKeyRegexp('webkit\\/')
                };
            },
            support: function (inName) {
                return supportMap[inName];
            },
            getSupportMap: function () {
                return supportMap;
            },
            registerSupport: function (inName,inValue) {
                if (!(inName in supportMap)) {
                    supportMap[inName] = inValue;
                }
            },
            _versionByKeyRegexp: function (inKeyRegexp) {
                var regexp = new RegExp(inKeyRegexp + '(\\d+\\.\\d+)');
                return this._version(true,regexp);
            },
            _version: function (is,inRegex) {
                var regexResult;
                return (is && (regexResult = inRegex.exec(userAgent))) ? parseFloat(regexResult[1]) : 0;
            },
            _check: function (inRegex) {
                return inRegex.test(userAgent);
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
    var rsizeElement = /width|height|top|right|bottom|left|size|margin|padding/,
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
        float: 'styleFloat'
    };

    var util = nx.define('nx.Util',{
        static: true,
        methods: {
            getCssText: function (inStyles) {
                var cssText = [''];
                nx.each(inStyles,function (styleValue,styleName) {
                    cssText.push(this.getStyleProperty(styleName,true) + ':' + this.getStyleValue(styleName,styleValue));
                },this);
                return cssText.join(';');
            },
            getStyleValue: function (inName,inValue) {
                var property = this.getStyleProperty(inName);
                var value = inValue;
                if (rsizeElement.test(property)) {
                    if (!rHasUnit.test(inValue) && !cssNumber[property]) {
                        value += PX;
                    }
                }
                return value;
            },
            getStyleProperty: function (inName,isLowerCase) {
                var property = this.lowerCamelCase(inName);
                if (property in tempStyle) {
                    property = this.deCamelCase(inName);
                } else {
                    if (isLowerCase) {
                        property = env.prefix()[1] + inName;
                    } else {
                        property = env.prefix()[0] + this.upperCamelCase(inName);
                    }
                }
                return styleHooks[inName] || property;
            },
            lowerCamelCase: function (inName) {
                var _camelizeString = this.upperCamelCase(inName);
                return _camelizeString.charAt(0).toLowerCase() + _camelizeString.substring(1);
            },
            upperCamelCase: function (inName) {
                return inName.replace(rUpperCameCase,function (match,group1) {
                    return group1.toUpperCase();
                });
            },
            deCamelCase: function (inName) {
                return inName.replace(rDeCameCase,function (match,group1) {
                    return '-' + group1.toLowerCase();
                });
            },
            capitalize: function (inString) {
                return inString.charAt(0).toUpperCase() + inString.slice(1);
            }
        }
    });
})(nx);
(function (nx) {
    var Collection = nx.data.Collection;

    var Node = nx.define('nx.dom.Node',nx.Comparable,{
        methods: {
            compare: function (target) {
                if (target && this.$dom === target.$dom) {
                    return 0;
                }
                else {
                    return -1;
                }
            },
            init: function (node) {
                this.$dom = node;
            },
            isElement: function () {
                return this.$dom.nodeType === 1;
            },
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
            contains: function (inTarget) {
                return this.$dom.contains(inTarget.$dom);
            },
            firstChild: function () {
                return new this.constructor(this.$dom.firstElementChild);
            },
            lastChild: function () {
                return new this.constructor(this.$dom.lastElementChild);
            },
            previousSibling: function () {
                return new this.constructor(this.$dom.previousElementSibling);
            },
            nextSibling: function () {
                return new this.constructor(this.$dom.nextElementSibling);
            },
            parentNode: function () {
                return new this.constructor(this.$dom.parentNode);
            },
            children: function () {
                var result = new Collection();
                nx.each(this.$dom.children, function (child) {
                    result.add(new this.constructor(child));
                }, this);
                return result;
            },
            cloneNode: function (deep) {
                return new this.constructor(this.$dom.cloneNode(deep));
            },
            hasChild: function (child) {
                return child.$dom.parentNode == this.$dom;
            },
            appendChild: function (child) {
                this.$dom.appendChild(child.$dom);
            },
            insertBefore: function (child,ref) {
                this.$dom.insertBefore(child.$dom,ref.$dom);
            },
            removeChild: function (child) {
                if (this.hasChild(child)) {
                    this.$dom.removeChild(child.$dom);
                }
            },
            empty: function () {
                this.children().each(function (child) {
                    this.removeChild(child);
                },this);
            }
        }
    });
})(nx);
(function (nx) {
    nx.define('nx.dom.Text', nx.dom.Node);
})(nx);
(function (nx) {
    var global = nx.global,
        document = global.document,
        env = nx.Env,
        util = nx.Util;
    var rTableElement = /^t(?:able|d|h)$/i,
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
                    if (inValue) {
                        inElement[hookValue] = !!inValue;
                    } else {
                        inElement.removeAttribute(hookKey);
                    }
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
                var classList = this.$dom.classList;
                return classList.add.apply(classList,arguments);
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
                var element=this.$dom;
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

    nx.define('nx.dom.Fragment', nx.dom.Node, {
        methods: {
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
                    return setTimeout(readyController.doScrollCheck,50);
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
                document.removeEventListener("DOMContentLoaded",readyController.completed,false);
                global.removeEventListener("load",readyController.completed,false);
            } else {
                document.detachEvent("onreadystatechange",readyController.completed);
                global.detachEvent("onload",readyController.completed);
            }
        },
        w3cReady: function () {
            document.addEventListener('DOMContentLoaded',readyController.completed,false);
            global.addEventListener('load',readyController.completed,false);
        },
        ieReady: function () {
            document.attachEvent("onreadystatechange",readyController.completed);
            global.attachEvent("onload",readyController.completed);
            readyController.setTopFrame();
            readyController.doScrollCheck();
        },
        readyMain: function () {
            if (!document.body) {
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
        xlink: "http://www.w3.org/1999/xlink"
    };

    var Document = nx.define('nx.dom.Document',{
        static: true,
        properties: {
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
            root: {
                get: function () {
                    return document.documentElement;
                }
            },
            body: {
                get: function () {
                    return new Element(document.body);
                }
            }
        },
        methods: {
            on: function (name,handler,context) {
                this._attachDocumentListeners(name);
                this.inherited(name,handler,context);
            },
            upon: function (name,handler,context) {
                this._attachDocumentListeners(name);
                this.inherited(name,handler,context);
            },
            _attachDocumentListeners: function (name) {
                var documentListeners = this._documentListeners;
                if (!(name in documentListeners)) {
                    var self = this;
                    var listener = documentListeners[name] = function (event) {
                        self.fire(name,event);
                    };

                    document.addEventListener(name,listener);
                }
            },
            registerNS: function (key,value) {
                nsMap[key] = value;
            },
            resolveNS: function (key) {
                return nsMap[key];
            },
            createFragment: function () {
                return new Fragment(document.createDocumentFragment());
            },
            createElement: function (tag) {
                return new Element(document.createElement(tag));
            },
            createText: function (text) {
                return new Text(document.createTextNode(text));
            },
            createElementNS: function (ns,tag) {
                var uri = Document.resolveNS(ns);
                if (uri) {
                    return new Element(document.createElementNS(uri,tag));
                }
                else {
                    throw new Error('The namespace ' + ns + ' is not registered.');
                }
            },
            wrap: function (dom) {
                if (nx.is(dom,Node)) {
                    return dom;
                }
                else {

                }
            },
            docRect: function () {
                var root = this.root(),
                    height = global.innerHeight || 0,
                    width = global.innerWidth || 0,
                    scrollW = root.scrollWidth,
                    scrollH = root.scrollHeight,
                    scrollXY = {
                        left: Math.max((global.pageXOffset || 0),root.scrollLeft),
                        top: Math.max((global.pageYOffset || 0),root.scrollTop)
                    };
                scrollW = Math.max(scrollW,width);
                scrollH = Math.max(scrollH,height);
                return {
                    width: width,
                    height: height,
                    scrollWidth: scrollW,
                    scrollHeight: scrollH,
                    scrollX: scrollXY.left,
                    scrollY: scrollXY.top
                };
            },
            ready: function (inHandler) {
                //add handler to queue:
                if (readyController.initReady(inHandler)) {
                    setTimeout(readyController.fireReady,1);
                } else {
                    readyController.readyMain();
                }
            },
            addRule: function (inSelector,inCssText,inIndex) {
                return this._ruleAction('add',[inSelector,inCssText,inIndex]);
            },
            insertRule: function (inFullCssText,inIndex) {
                return this._ruleAction('insert',[inFullCssText,inIndex]);
            },
            deleteRule: function (inIndex) {
                return this._ruleAction('delete',[inIndex]);
            },
            removeRule: function (inSelector,inIndex) {
                return this._ruleAction('remove',[inSelector,inIndex]);
            },
            addRules: function (inRules) {
                nx.each(inRules,function (rule,selector) {
                    this.addRule(selector,util.getCssText(rule),null);
                },this);
            },
            deleteRules: function () {
                var defLength = this.cssStyleSheet().rules.length;
                while (defLength--) {
                    this.deleteRule(0);
                }
            },
            _ruleAction: function (inAction,inArgs) {
                var styleSheet = this.cssStyleSheet();
                var lastIndex = inArgs.length - 1;
                //set default index
                inArgs[lastIndex] = this._defRuleIndex(styleSheet,inArgs[lastIndex]);
                styleSheet[inAction + 'Rule'].apply(styleSheet,inArgs);
                return this._defRuleIndex(styleSheet,null);
            },
            _defRuleIndex: function (inStyleSheet,inIndex) {
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
            }
        }
    });
})(nx);

(function (nx) {
    var global = nx.global;
    var Binding = nx.Binding;
    var Collection = nx.data.Collection;
    var Document = nx.dom.Document;
    var rpatt = /(?={)\{([^{}]+?)\}(?!})/;

    function setProperty(target, name, value, owner) {
        if (nx.is(value, Binding)) {
            target.setBinding(name, nx.extend(value.gets(), {
                bindingType: 'property'
            }));
        }
        else if (nx.is(value, 'String') && rpatt.test(value)) {
            var expr = RegExp.$1 + ',bindingType=property';
            if (expr[0] === '#') {
                target.setBinding(name, 'owner.' + expr.slice(1), owner || target);
            }
            else {
                target.setBinding(name, expr ? 'model.' + expr : 'model', owner || target);
            }
        }
        else {
            target.set(name, value);
        }
    }

    function setEvent(target, name, value, owner) {
        if (nx.is(value, Binding)) {
            target.setBinding(name, value.gets());
        }
        else if (nx.is(value, 'String') && rpatt.test(value)) {
            var expr = RegExp.$1 + ',bindingType=event';
            if (expr[0] === '#') {
                target.setBinding(name, 'owner.' + expr.slice(1), owner || target);
            }
            else {
                target.setBinding(name, expr ? 'model.' + expr : 'model', owner || target);
            }
        }
        else {
            target.on(name, value, owner || target);
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

                nx.each(props, function (value, name) {
                    setProperty(comp, name, value);
                });

                nx.each(events, function (value, name) {
                    setEvent(comp, name, value);
                });

                if (content !== undefined) {
                    setProperty(comp, 'content', content);
                }
            }
            else if (view !== undefined) {
                comp = new DOMComponent('text', view);
            }

            return comp;
        }

        return null;
    }

    var AbstractComponent = nx.define('nx.ui.AbstractComponent', nx.Observable, {
        abstract: true,
        statics: {
            createComponent: createComponent
        },
        events: ['enter', 'leave'],
        properties: {
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
                    else if (value) {
                        createComponent(value, this.owner()).attach(this);
                    }
                }
            },
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
                }
            },
            owner: {
                value: null
            },
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
            attach: function (parent, index) {
                this.detach();

                if (nx.is(parent, AbstractComponent)) {
                    var container = parent.getContainer();

                    if (container) {
                        var name = this.resolve('@name');
                        var owner = this.owner() || parent;

                        if (name) {
                            owner.register(name, this);
                        }

                        this.onAttach(parent, index);

                        if (index >= 0) {
                            parent.content().insert(this, index);
                        }
                        else {
                            parent.content().add(this);
                        }

                        this.parent(parent);
                        this.owner(owner);
                        this.fire('enter', {
                            parent: parent,
                            owner: owner
                        });

                        this._attached = true;
                    }
                    else {
                        throw new Error(parent.__type__ + ' can not be used as a container.');
                    }
                }
            },
            detach: function () {
                if (this._attached) {
                    var name = this.resolve('@name');
                    var owner = this.owner();
                    var parent = this.parent();

                    if (name) {
                        owner.unregister(name);
                    }

                    this.onDetach(parent);
                    parent.content().remove(this);
                    this.parent(null);
                    this.owner(null);
                    this.fire('leave', {
                        parent: parent,
                        owner: owner
                    });
                    this._attached = false;
                }
            },
            onAttach: function (parent, index) {
                throw new Error('Not Implemented');
            },
            onDetach: function (parent) {
                throw new Error('Not Implemented');
            },
            register: function (name, value, force) {
                var resources = this._resources;
                if (!(name in resources) || force) {
                    resources[name] = value;
                }
            },
            unregister: function (name) {
                var resources = this._resources;
                if (name in resources) {
                    delete resources[name];
                }
            },
            resolve: function (name) {
                var resources = this._resources;
                if (name in resources) {
                    return resources[name];
                }
            },
            getContainer: function () {
                if (this.resolve('@tag') === 'fragment') {
                    var parent = this.parent();
                    if (parent) {
                        return parent.getContainer();
                    }
                }

                return this.resolve('@root');
            },
            dispose: function () {
                this.inherited();
                this.content().each(function (content) {
                    content.dispose();
                });
                this._resources = null;
                this._content = null;
                this._model = null;
                this._inheritedModel = null;
            },
            destroy: function () {
                this.detach();
                this.inherited();
            }
        }
    });

    var CssClass = nx.define(nx.Observable, {
        methods: {
            init: function (owner) {
                this.inherited();
                this._owner = owner;
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
                this._owner.resolve('@root').set('class', this._classList.join(' '));
            },
            hasClass: function (name) {
                return this._classList.indexOf(name) >= 0;
            },
            addClass: function (name) {
                if (!this.hasClass(name)) {
                    this._classList.push(name);
                    this._owner.resolve('@root').set('class', this._classList.join(' '));
                }
            },
            removeClass: function (name) {
                var index = this._classList.indexOf(name);
                if (index >= 0) {
                    this._classList.splice(index, 1);
                    this._owner.resolve('@root').set('class', this._classList.join(' '));
                }
            },
            dispose: function () {
                this.inherited();
                this._owner = null;
                this._classList = null;
            }
        }
    });

    var CssStyle = nx.define(nx.Observable, {
        methods: {
            init: function (owner) {
                this.inherited();
                this._owner = owner;
            },
            get: function (name) {
                return this._owner.resolve('@root').getStyle(name);
            },
            set: function (name, value) {
                this._owner.resolve('@root').setStyle(name, value);
            },
            dispose: function () {
                this.inherited();
                this._owner = null;
            }
        }
    });

    var DOMEvent = nx.define({

    });

    var DOMComponent = nx.define(AbstractComponent, {
        final: true,
        properties: {
            'class': {
                get: function () {
                    return this._class;
                },
                set: function (value) {
                    if (nx.is(value, 'Array')) {
                        var cssClass = this._class;
                        nx.each(value, function (item, index) {
                            setProperty(cssClass, '' + index, item, this);
                        }, this);
                    }
                    else {
                        this.resolve('@root').set('class', value);
                    }
                }
            },
            style: {
                get: function () {
                    return this._style;
                },
                set: function (value) {
                    if (nx.is(value, 'Object')) {
                        var cssStyle = this._style;
                        nx.each(value, function (v, k) {
                            setProperty(cssStyle, k, v, this);
                        }, this);
                    }
                    else {
                        this.resolve('@root').set('style', value);
                    }
                }
            },
            template: {
                get: function () {
                    return this._template;
                },
                set: function (value) {
                    this._template = value;
                    this._generateContent();
                }
            },
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
            states: {
                value: null
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
                if (this.has(name)) {
                    return this.inherited(name);
                }
                else {
                    return this.resolve('@root').get(name);
                }
            },
            set: function (name, value) {
                if (this.has(name)) {
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
            /**
             * Trigger an event.
             * @method fire
             * @param name {String}
             * @param [data] {*}
             */
            fire: function (name, data) {
                var listeners = this.__listeners__[name], listener, result;
                if (listeners) {
                    for (var i = 0, length = listeners.length; i < length; i++) {
                        listener = listeners[i];
                        if (listener && listener.handler) {
                            result = listener.handler.call(listener.context, listener.owner, data);
                            if (result === false) {
                                return false;
                            }
                        }
                    }
                }
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
                    var container = parent.getContainer();

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
                        }, 0);
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
                            }, 0);
                            this.upon('transitionend', function () {
                                root.$dom.style.cssText = cssText;
                                parent.getContainer().removeChild(root);
                            });
                        }
                        else {
                            parent.getContainer().removeChild(root);
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
                    c.destroy();
                });

                if (template && items) {
                    nx.each(items, function (item) {
                        var comp = createComponent(template, this.owner());
                        comp.model(item);
                        comp.attach(this);
                    }, this);
                }
            },
            _onItemsChange: function (sender, event) {
                var action = event.action;
                var index = event.index || -1;
                if (action === 'add') {
                    nx.each(event.items, function (item) {
                        var comp = createComponent(this._template, this.owner());
                        comp.model(item);
                        comp.attach(this, index);
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

                    this._innerComp.model(value, true);

                    this._content.each(function (c) {
                        if (!nx.is(c, 'String')) {
                            c.model(value, true);
                        }
                    });
                }
            }
        },
        methods: {
            init: function () {
                this.inherited();
                var view = this['@view'];
                if (view) {
                    var comp = this._innerComp = AbstractComponent.createComponent(view, this);
                    this.register('@root', comp.resolve('@root'));
                    this.register('@tag', comp.resolve('@tag'));
                }
            },
            onAttach: function (parent, index) {
                this._innerComp.onAttach(parent, index);
            },
            onDetach: function () {
                this._innerComp.onDetach(this.parent());
            },
            on: function (name, handler, context) {
                if (this.can(name)) {
                    this.inherited(name, handler, context);
                }
                else {
                    this._innerComp.on(name, handler, context);
                }
            },
            upon: function (name, handler, context) {
                if (this.can(name)) {
                    this.inherited(name, handler, context);
                }
                else {
                    this._innerComp.upon(name, handler, context);
                }
            },
            off: function (name, handler, context) {
                if (this.can(name)) {
                    this.inherited(name, handler, context);
                }
                else {
                    this._innerComp.off(name, handler, context);
                }
            },
            dispose: function () {
                var innerComp = this._innerComp;
                if (innerComp) {
                    innerComp.dispose();
                }
                this._innerComp = null;
                this.inherited();
            }
        }
    });
})(nx);
(function (nx) {
    var global = nx.global;
    var Document = nx.dom.Document;

    nx.define('nx.ui.Application', nx.ui.AbstractComponent, {
        methods: {
            init: function () {
                this.inherited();
                var startFn = this.start;
                var self = this;
                this.start = function () {
                    Document.ready(function () {
                        startFn.call(self);
                    });
                    return this;
                };

                this._globalListeners = {};
            },
            start: function () {
                throw new Error('Method "start" is not implemented');
            },
            stop: function () {
                throw new Error('Method "stop" is not implemented');
            },
            getContainer: function () {
                return Document.body();
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
