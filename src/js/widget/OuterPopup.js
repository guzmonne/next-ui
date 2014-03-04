(function (nx,global) {
    /**
     * @class   OuterPopup
     * @namespace nx.widget
     * @description outer popup,must be extend.
     */
    nx.define('nx.widget.OuterPopup',nx.widget.AbstractPopup,{
        properties: {
            target: {
                set: function (inValue) {
                    var stylePosition = this._targetPosition = inValue.getStyle('position');
                    this._root.setStyle('position',stylePosition);
                    this._target = inValue;
                },
                get: function () {
                    return this._target;
                }
            },
            fixed: {
                get: function () {
                    return this._targetPosition === 'fixed';
                }
            },
            offset: {
                set: function (inValue) {
                    var rootBound = this._root.getBound();
                    this._root.setStyles({
                        top: rootBound.top + inValue.top,
                        left: rootBound.left + inValue.left
                    });
                    this._offset = inValue;
                },
                get: function () {
                    return this._offset;
                }
            },
            targetBound: {
                get: function () {
                    return this.target().getBound();
                }
            }
        },
        methods: {
            /**
             * Get top,left position coordinate.
             * @returns {{top: number, left: number}}
             * @private
             */
            _directionTl: function () {
                return {
                    top: this.targetBound().top - this.size().height,
                    left: this.targetBound().left
                };
            },
            /**
             * Get top,center position coordinate.
             * @returns {{top: number, left: number}}
             * @private
             */
            _directionT: function () {
                return {
                    top: this.targetBound().top - this.size().height,
                    left: this.targetBound().left + 0.5 * (this.targetBound().width - this.size().width)
                };
            },
            /**
             * Get top,right position coordinate.
             * @returns {{top: number, left: number}}
             * @private
             */
            _directionTr: function () {
                return {
                    top: this.targetBound().top - this.size().height,
                    left: this.targetBound().right + -this.size().width
                };
            },
            /**
             * Get right,top position coordinate.
             * @returns {{top: number, left: number}}
             * @private
             */
            _directionRt: function () {
                return {
                    top: this.targetBound().top,
                    left: this.targetBound().right
                };
            },
            /**
             * Get right,center position coordinate.
             * @returns {{top: number, left: number}}
             * @private
             */
            _directionR: function () {
                return {
                    top: this.targetBound().top + 0.5 * (this.targetBound().height - this.size().height),
                    left: this.targetBound().right
                };
            },
            /**
             * Get right,bottom position coordinate.
             * @returns {{top: number, left: number}}
             * @private
             */
            _directionRb: function () {
                return {
                    top: this.targetBound().bottom - this.size().height,
                    left: this.targetBound().right
                };
            },
            /**
             * Get bottom,left position coordinate.
             * @returns {{top: number, left: number}}
             * @private
             */
            _directionBl: function () {
                return {
                    top: this.targetBound().bottom,
                    left: this.targetBound().left
                };
            },
            /**
             * Get bottom,center position coordinate.
             * @returns {{top: number, left: number}}
             * @private
             */
            _directionB: function () {
                return {
                    top: this.targetBound().bottom,
                    left: this.targetBound().left + 0.5 * (this.targetBound().width - this.size().width)
                };
            },
            /**
             * Get bottom,right position coordinate.
             * @returns {{top: number, left: number}}
             * @private
             */
            _directionBr: function () {
                return {
                    top: this.targetBound().bottom,
                    left: this.targetBound().right + -this.size().width
                };
            },
            /**
             * Get left,top position coordinate.
             * @returns {{top: number, left: number}}
             * @private
             */
            _directionLt: function () {
                return {
                    top: this.targetBound().top,
                    left: this.targetBound().left - this.size().width
                };
            },
            /**
             * Get left,center position coordinate.
             * @returns {{top: number, left: number}}
             * @private
             */
            _directionL: function () {
                return {
                    top: this.targetBound().top + 0.5 * (this.targetBound().height - this.size().height),
                    left: this.targetBound().left - this.size().width
                };
            },
            /**
             * Get left,bottom position coordinate.
             * @returns {{top: number, left: number}}
             * @private
             */
            _directionLb: function () {
                return {
                    top: this.targetBound().bottom - this.size().height,
                    left: this.targetBound().left - this.size().width
                };
            },
            /**
             * Dispose the unused variable.
             * @returns {{top: number, left: number}}
             * @private
             */
            dispose: function () {
                this.inherited();
                this._targetPosition = null;
            }
        }
    });
}(nx,nx.global));