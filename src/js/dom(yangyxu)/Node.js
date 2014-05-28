(function (nx) {
    var Collection = nx.data.Collection;

    function _findTargetElement (target, path, ifCheckSelf){
        if (!target){ return; };
        if (ifCheckSelf&&target.nodeType===1){ return target; };
        var _ele = target[path];
        if (_ele.nodeType!==1){
            return _findTargetElement(_ele, path);
        }else {
            return _ele;
        }
    }
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
                console.log(_findTargetElement(this.$dom.firstChild, 'nextSibling', true));
                return new this.constructor(this.$dom.firstElementChild||_findTargetElement(this.$dom.firstChild, 'nextSibling', true));
            },
            /**
             * Get last element child
             * @returns {this.constructor}
             */
            lastChild: function () {
                return new this.constructor(this.$dom.lastElementChild||_findTargetElement(this.$dom.lastChild, 'previousSibling', true));
            },
            /**
             * Get previous element
             * @returns {this.constructor}
             */
            previousSibling: function () {
                return new this.constructor(this.$dom.previousElementSibling||_findTargetElement(this.$dom, 'previousSibling'));
            },
            /**
             * Get next element
             * @returns {this.constructor}
             */
            nextSibling: function () {
                return new this.constructor(this.$dom.nextElementSibling||_findTargetElement(this.$dom, 'nextSibling'));
            },
            /**
             * Get parent element
             * @returns {this.constructor}
             */
            parentNode: function (deep) {
                if(deep){
                    var _self = this;
                    while (deep) {
                        if (!_self){ return;}
                        _self = _self.parentNode();
                        deep--;
                    };
                    return _self;
                }else {
                    return new this.constructor(this.$dom.parentNode);
                }
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