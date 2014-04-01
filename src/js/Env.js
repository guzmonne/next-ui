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
                get: function () {
                    return compatMode === 'CSS1Compat';
                }
            },
            /**
             * If it is secure
             * @property strict
             * @type {Boolean}
             * @default false
             */
            secure: {
                get: function () {
                    return protocol.indexOf('https') === 0;
                }
            },
            /**
             * Get operating system information
             * @property os
             * @type {Object}
             * @default {}
             */
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
            /**
             * Get specific prefix
             * @property prefix
             * @type {Array}
             * @default ['webkit','-webkit-']
             */
            prefix: {
                get: function () {
                    return vendorPrefixMap[this.engine().name];
                }
            },
            /**
             * Get browser's render engine information
             * @property engine
             * @type {Object}
             * @default {}
             */
            engine: {
                get: function () {
                    return (this[this.browser().name + 'Engine'] || this.defaultEngine).call(this);
                }
            },
            /**
             * Get basic browser information
             * @property browser
             * @type {Object}
             * @default {}
             */
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
            /**
             * Get firefox engine information
             * @method firefoxEngine
             * @returns {{name: string, version: *}}
             */
            firefoxEngine: function () {
                return {
                    name: 'gecko',
                    version: this._versionByKeyRegexp('rv:')
                };
            },
            /**
             * Get old opera engine information
             * @method operaEngine
             * @returns {{name: string, version: *}}
             */
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
            /**
             * Get IE engine information
             * @method ieEngine
             * @returns {{name: string, version: (*|number)}}
             */
            ieEngine: function () {
                return {
                    name: 'trident',
                    version: this._versionByKeyRegexp('trident\\/') || 4
                };
            },
            /**
             * Get Webkit engine information
             * @method defaultEngine
             * @returns {{name: string, version: *}}
             */
            defaultEngine: function () {
                return {
                    name: 'webkit',
                    version: this._versionByKeyRegexp('webkit\\/')
                };
            },
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
            },
            _versionByKeyRegexp: function (inKeyRegexp) {
                var regexp = new RegExp(inKeyRegexp + '(\\d+\\.\\d+)');
                return this._version(true, regexp);
            },
            _version: function (is, inRegex) {
                var regexResult;
                return (is && (regexResult = inRegex.exec(userAgent))) ? parseFloat(regexResult[1]) : 0;
            },
            _check: function (inRegex) {
                return inRegex.test(userAgent);
            }
        }
    });

})(nx);