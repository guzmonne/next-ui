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
