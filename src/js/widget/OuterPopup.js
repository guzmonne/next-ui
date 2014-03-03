(function (nx,global) {
    //todo:optimize...
    nx.define('nx.widget.OuterPopup',nx.widget.AbstractPopup,{
        view: {
            props: {
                'class': 'nx-widget-OuterPopup'
            }
        },
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
            /*------top start-------*/
            //tl
            _directionTl: function () {
                this._root.setStyles({
                    top: this.targetBound().top - this.size().height,
                    left: this.targetBound().left
                });
            },
            //t
            _directionT: function () {
                this._root.setStyles({
                    top: this.targetBound().top - this.size().height,
                    left: this.targetBound().left + 0.5 * (this.targetBound().width - this.size().width)
                });
            },
            //tr
            _directionTr: function () {
                this._root.setStyles({
                    top: this.targetBound().top - this.size().height,
                    left: this.targetBound().right + -this.size().width
                });
            },
            /*------top end-------*/

            /*-----right start-------*/
            //rt
            _directionRt: function () {
                this._root.setStyles({
                    top: this.targetBound().top,
                    left: this.targetBound().right
                });
            },
            //r
            _directionR: function () {
                this._root.setStyles({
                    top: this.targetBound().top + 0.5 * (this.targetBound().height - this.size().height),
                    left: this.targetBound().right
                });
            },
            //rb
            _directionRb: function () {
                this._root.setStyles({
                    top: this.targetBound().bottom - this.size().height,
                    left: this.targetBound().right
                });
            },
            /*-----right end-------*/

            /*-----bottom start-------*/
            _directionBl:function(){
                this._root.setStyles({
                    top:this.targetBound().bottom,
                    left:this.targetBound().left
                });
            },
            _directionB:function(){
                this._root.setStyles({
                    top:this.targetBound().bottom,
                    left: this.targetBound().left + 0.5 * (this.targetBound().width - this.size().width)
                });
            },
            _directionBr:function(){
                this._root.setStyles({
                    top:this.targetBound().bottom,
                    left: this.targetBound().right + -this.size().width
                });
            },
            /*-----bottom end-------*/

            /*-----left start-------*/
            _directionLt: function () {
                this._root.setStyles({
                    top: this.targetBound().top,
                    left: this.targetBound().left - this.size().width
                });
            },
            _directionL: function () {
                this._root.setStyles({
                    top: this.targetBound().top + 0.5 * (this.targetBound().height - this.size().height),
                    left: this.targetBound().left - this.size().width
                });
            },
            _directionLb: function () {
                this._root.setStyles({
                    top: this.targetBound().bottom - this.size().height,
                    left: this.targetBound().left - this.size().width
                });
            },
            /*-----left end-------*/

            dispose: function () {
                this.inherited();
                this._targetPosition = null;
            },
            _getDirectionAction: function (inDirection) {
                return '_direction' + nx.Util.capitalize(inDirection);
            }
        }
    });
}(nx,nx.global));