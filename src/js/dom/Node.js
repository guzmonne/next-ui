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