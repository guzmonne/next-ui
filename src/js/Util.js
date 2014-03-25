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
        float: 'cssFloat'
    };

    var util = nx.define('nx.Util',{
        static: true,
        methods: {
            /**
             * Get a string which is join by an style object.
             * @param inStyles
             * @returns {string}
             */
            getCssText: function (inStyles) {
                var cssText = [''];
                nx.each(inStyles,function (styleValue,styleName) {
                    cssText.push(this.getStyleProperty(styleName,true) + ':' + this.getStyleValue(styleName,styleValue));
                },this);
                return cssText.join(';');
            },
            /**
             * Get real value of the style name.
             * @param inName
             * @param inValue
             * @returns {*}
             */
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
            /**
             * Get compatible css property.
             * @param inName
             * @param isLowerCase
             * @returns {*}
             */
            getStyleProperty: function (inName,isLowerCase) {
                var property = this.lowerCamelCase(inName);
                if (property in tempStyle) {
                    if (isLowerCase) {
                        property = this.deCamelCase(inName);
                    }
                } else {
                    if (isLowerCase) {
                        property = env.prefix()[1] + inName;
                    } else {
                        property = env.prefix()[0] + this.upperCamelCase(inName);
                    }
                }
                return styleHooks[inName] || property;
            },
            /**
             * Lower camel case.
             * @param inName
             * @returns {string}
             */
            lowerCamelCase: function (inName) {
                var _camelizeString = this.upperCamelCase(inName);
                return _camelizeString.charAt(0).toLowerCase() + _camelizeString.substring(1);
            },
            /**
             * Upper camel case.
             * @param inName
             * @returns {*|string|void}
             */
            upperCamelCase: function (inName) {
                return inName.replace(rUpperCameCase,function (match,group1) {
                    return group1.toUpperCase();
                });
            },
            /**
             * Decode camel case to '-' model.
             * @param inName
             * @returns {*|string|void}
             */
            deCamelCase: function (inName) {
                return inName.replace(rDeCameCase,function (match,group1) {
                    return '-' + group1.toLowerCase();
                });
            },
            /**
             * Upper first word of a string.
             * @param inString
             * @returns {string}
             */
            capitalize: function (inString) {
                return inString.charAt(0).toUpperCase() + inString.slice(1);
            }
        }
    });
})(nx);