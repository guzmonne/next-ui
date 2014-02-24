(function (nx) {
    var global = nx.global,
        document = global.document;

    function extendMethods(inTarget,inMethods) {
        nx.each(inMethods,function (name,method) {
            nx.Object.extendMethod(inTarget,name,method);
        });
    }


    extendMethods(nx.dom.Element,{
        setAttribute: function (inName,inValue) {
        },
        getAttribute: function (inName) {

        },
        setText: function (inText) {
        },
        getText: function () {
        },
        setHtml: function (inHtml) {
        },
        getHtml: function () {
        },
        addEventListener: function (inName,inHandler,inUseCapture) {
        },
        removeEventListener: function (inName,inHandler,inUseCapture) {
        }
    });

    extendMethods(nx.dom.Node,{
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
            return new Collection(this.$dom.children);
        }
    });

}(nx));