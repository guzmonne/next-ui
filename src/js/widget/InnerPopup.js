(function (nx,global) {
    var document = global.document,
        util = nx.Util;

    //todo:optimize...
    nx.define('nx.widget.InnerPopup',nx.widget.AbstractPopup,{
        view: {
            props: {
                'class': 'nx-widget-InnerPopup'
            }
        },
        properties: {
            container: {
                set: function (inValue) {
                    if (inValue) {
                        this._container = inValue || document;
                        this._container.setStyle('position','relative');
                    }
                },
                get: function () {
                    return this._container;
                }
            },
            position: {
                set: function (inValue) {
                    this.fixed() ? this._positionWithFix() : this._positionWithoutFix();
                    this._position = inValue;
                },
                get: function () {
                    return this._position;
                }
            },
            docRect: {
                get: function () {
                    return nx.dom.Document.docRect();
                }
            }
        },
        methods: {
            onBeforeOpen: function () {
                var size = this.size();
                this._root.setStyles({
                    width: size.width,
                    height: size.height
                });
            },
            /*------top  start-------*/
            //tl
            _directionTlWithFix: function () {
                this._root.setStyles({
                    top: 0,
                    left: 0
                });
            },
            _directionTlWithoutFix: function () {
                this._root.setStyles({
                    top: this.docRect().scrollY,
                    left: this.docRect().scrollX
                });
            },
            //t
            _directionTWithFix: function () {
                this._root.setStyles({
                    top: 0,
                    left: 0.5 * (this.docRect().width - this.size().width)
                });
            },
            _directionTWithoutFix: function () {
                this._root.setStyles({
                    top: this.docRect().scrollY,
                    left: 0.5 * (this.docRect().width - this.size().width) + this.docRect().scrollX
                });
            },
            //tr
            _directionTrWithFix: function () {
                this._root.setStyles({
                    top: 0,
                    left: this.docRect().width - this.size().width
                });
            },
            _directionTrWithoutFix: function () {
                this._root.setStyles({
                    top: this.docRect().scrollY,
                    left: this.docRect().width - this.size().width + this.docRect().scrollX
                });
            },
            /*------top  end-------*/

            /*------right  start-------*/
            //r
            _directionRWithFix: function () {
                this._root.setStyles({
                    top: 0.5 * (this.docRect().height - this.size().height),
                    left: this.docRect().width - this.size().width
                });
            },
            _directionRWithoutFix: function () {
                this._root.setStyles({
                    top: 0.5 * (this.docRect().height - this.size().height) + this.docRect().scrollY,
                    left: this.docRect().width - this.size().width + this.docRect().scrollX
                });
            },
            /*------right  end-------*/

            /*------bottom  start-------*/
            //bl
            _directionBlWithFix: function () {
                this._root.setStyles({
                    top: this.docRect().height - this.size().height,
                    left: 0
                });
            },
            _directionBlWithoutFix: function () {
                this._root.setStyles({
                    top: this.docRect().height - this.size().height + this.docRect().scrollY,
                    left: this.docRect().scrollX
                });
            },
            //b
            _directionBWithFix: function () {
                this._root.setStyles({
                    top: this.docRect().height - this.size().height,
                    left: 0.5 * (this.docRect().width - this.size().width)
                });
            },
            _directionBWithoutFix: function () {
                this._root.setStyles({
                    top: this.docRect().height - this.size().height + this.docRect().scrollY,
                    left: 0.5 * (this.docRect().width - this.size().width) + this.docRect().scrollX
                });
            },
            //br
            _directionBrWithFix: function () {
                this._root.setStyles({
                    top: this.docRect().height - this.size().height,
                    left: this.docRect().width - this.size().width
                });
            },
            _directionBrWithoutFix: function () {
                this._root.setStyles({
                    top: this.docRect().height - this.size().height + this.docRect().scrollY,
                    left: this.docRect().width - this.size().width + this.docRect().scrollX
                });
            },
            /*------bottom  end-------*/

            /*------left  start-------*/
            //l
            _directionLWithFix: function () {
                this._root.setStyles({
                    top: 0.5 * (this.docRect().height - this.size().height),
                    left: 0
                });
            },
            _directionLWithoutFix: function () {
                this._root.setStyles({
                    top: 0.5 * (this.docRect().height - this.size().height) + this.docRect().scrollY,
                    left: this.docRect().scrollX
                });
            },
            /*------left  end-------*/

            /*------center  start-------*/
            //center
            _directionCenterWithFix: function () {
                this._root.setStyles({
                    top: 0.5 * (this.docRect().height - this.size().height),
                    left: 0.5 * (this.docRect().width - this.size().width)
                });
            },
            _directionCenterWithoutFix: function () {
                this._root.setStyles({
                    top: 0.5 * (this.docRect().height - this.size().height) + this.docRect().scrollY,
                    left: 0.5 * (this.docRect().width - this.size().width) + this.docRect().scrollX
                });
            },
            /*------center  end-------*/

            _positionWithFix: function () {
                this._root.setStyles(this.position());
            },
            _positionWithoutFix: function () {
                var position = this.position(),
                    docRect = this.docRect();
                position.left = position.left + docRect.scrollX;
                position.top = position.top + docRect.scrollY;
                this._root.setStyles(position);
            },
            _getDirectionAction: function (inDirection) {
                var fixedSuffix = this.fixed() ? 'WithFix' : 'WithoutFix';
                return '_direction' + util.capitalize(inDirection) + fixedSuffix;
            }
        }
    });
}(nx,nx.global));