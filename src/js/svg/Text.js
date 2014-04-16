(function (nx, global) {
    /**
     * SVG text component
     * @class nx.graphic.Text
     * @extend nx.graphic.Component
     * @module nx.graphic
     */
    nx.define("nx.graphic.Text", nx.graphic.Component, {
        properties: {
            /**
             * Set/get text
             * @property text
             */
            text: {
                get: function () {
                    return this._text !== undefined ? this._text : 0;
                },
                set: function (value) {
                    if (this._text !== value) {
                        this._text = value;

                        if (this.resolve('@root') && value !== undefined) {
                            var el = this.resolve("@root").$dom;
                            if ((el.nodeName == "text" || el.nodeName == "#text")) {
                                if (el.firstChild) {
                                    el.removeChild(el.firstChild);
                                }
                                el.appendChild(document.createTextNode(value));
                            }
                        }
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        },
        view: {
            tag: 'svg:text'
        }
    });
})(nx, nx.global);