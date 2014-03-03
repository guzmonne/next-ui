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
            docRect: {
                get: function () {
                    return nx.dom.Document.docRect();
                }
            }
        },
        methods: {
            /*------top  start-------*/
            //tl
            _directionTl: function () {
                return {
                    top: 0,
                    left: 0
                };
            },
            //t
            _directionT: function () {
                return {
                    top: 0,
                    left: 0.5 * (this.docRect().width - this.size().width)
                };
            },
            //tr
            _directionTr: function () {
                return {
                    top: 0,
                    left: this.docRect().width - this.size().width
                };
            },
            /*------top  end-------*/

            /*------right  start-------*/
            //r
            _directionR: function () {
                return {
                    top: 0.5 * (this.docRect().height - this.size().height),
                    left: this.docRect().width - this.size().width
                };
            },
            /*------right  end-------*/

            /*------bottom  start-------*/
            //bl
            _directionBl: function () {
                return {
                    top: this.docRect().height - this.size().height,
                    left: 0
                };
            },
            //b
            _directionB: function () {
                return {
                    top: this.docRect().height - this.size().height,
                    left: 0.5 * (this.docRect().width - this.size().width)
                };
            },
            //br
            _directionBr: function () {
                return {
                    top: this.docRect().height - this.size().height,
                    left: this.docRect().width - this.size().width
                };
            },
            /*------bottom  end-------*/

            /*------left  start-------*/
            //l
            _directionL: function () {
                return {
                    top: 0.5 * (this.docRect().height - this.size().height),
                    left: 0
                };
            },
            /*------left  end-------*/

            /*------center  start-------*/
            //center
            _directionCenter: function () {
                return {
                    top: 0.5 * (this.docRect().height - this.size().height),
                    left: 0.5 * (this.docRect().width - this.size().width)
                };
            }
            /*------center  end-------*/
        }
    });
}(nx,nx.global));