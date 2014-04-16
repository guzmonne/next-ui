(function (nx,global) {
    var xlink = 'http://www.w3.org/1999/xlink';
    /**
     * SVG icon component, which icon's define in nx framework
     * @class nx.graphic.Icon
     * @extend nx.graphic.Component
     * @module nx.graphic
     */
    nx.define("nx.graphic.Icon", nx.graphic.Component, {
        view: {
            tag: 'svg:use'
        },
        properties: {
            /**
             * set/get icon's type
             * @property iconType
             */
            iconType: {
                get: function () {
                    return this._iconType;
                },
                set: function (value) {
                    var icon = nx.graphic.Icons.get(value);
                    var size = icon.size;
                    this.size(size);
                    this._iconType = icon.name;

                    this.view().dom().$dom.setAttributeNS(xlink, 'xlink:href', '#' + value);
                }
            },
            /**
             * set/get icon size
             * @property size
             */
            size: {
                get: function () {
                    return this._size || {
                        width: 36,
                        height: 36
                    };
                },
                set: function (value) {
                    this._size = value;
                    this.setTransform(value.width / -2, value.height / -2);
                }
            }
        }
    });
})(nx, nx.global);