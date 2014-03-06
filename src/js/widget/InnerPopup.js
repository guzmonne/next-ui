(function (nx,global) {
    /**
     * @class   InnerPopup
     * @namespace nx.widget
     * @description inner popup,must be extend.
     */
    nx.define('nx.widget.InnerPopup',nx.widget.AbstractPopup,{
        properties: {
            /**
             * Container is the wrapper of the popup,every inner popup should have a container.
             */
            container: {
                set: function (inValue) {
                    if (inValue) {
                        this._container = inValue || global.document;
                        this._container.setStyle('position','relative');
                    }
                },
                get: function () {
                    return this._container;
                }
            },
            /**
             * Get document rect information.
             */
            docRect: {
                get: function () {
                    return nx.dom.Document.docRect();
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
                    top: 0,
                    left: 0
                };
            },
            /**
             * Get top,center position coordinate.
             * @returns {{top: number, left: number}}
             * @private
             */
            _directionT: function () {
                return {
                    top: 0,
                    left: 0.5 * (this.docRect().width - this.size().width)
                };
            },
            /**
             * Get top,right position coordinate.
             * @returns {{top: number, left: number}}
             * @private
             */
            _directionTr: function () {
                return {
                    top: 0,
                    left: this.docRect().width - this.size().width
                };
            },
            /**
             * Get right,center position coordinate.
             * @returns {{top: number, left: number}}
             * @private
             */
            _directionR: function () {
                return {
                    top: 0.5 * (this.docRect().height - this.size().height),
                    left: this.docRect().width - this.size().width
                };
            },

            /**
             * Get bottom,left position coordinate.
             * @returns {{top: number, left: number}}
             * @private
             */
            _directionBl: function () {
                return {
                    top: this.docRect().height - this.size().height,
                    left: 0
                };
            },
            /**
             * Get bottom,center position coordinate.
             * @returns {{top: number, left: number}}
             * @private
             */
            _directionB: function () {
                return {
                    top: this.docRect().height - this.size().height,
                    left: 0.5 * (this.docRect().width - this.size().width)
                };
            },
            /**
             * Get bottom,right position coordinate.
             * @returns {{top: number, left: number}}
             * @private
             */
            _directionBr: function () {
                return {
                    top: this.docRect().height - this.size().height,
                    left: this.docRect().width - this.size().width
                };
            },

            /**
             * Get left,center position coordinate.
             * @returns {{top: number, left: number}}
             * @private
             */
            _directionL: function () {
                return {
                    top: 0.5 * (this.docRect().height - this.size().height),
                    left: 0
                };
            },
            /**
             * Get center position coordinate.
             * @returns {{top: number, left: number}}
             * @private
             */
            _directionCenter: function () {
                return {
                    top: 0.5 * (this.docRect().height - this.size().height),
                    left: 0.5 * (this.docRect().width - this.size().width)
                };
            }
        }
    });
}(nx,nx.global));