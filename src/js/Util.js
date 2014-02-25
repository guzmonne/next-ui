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
            }
        }
    });
})(nx);