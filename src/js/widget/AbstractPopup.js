(function (nx,global) {
    var zIndexMgr = nx.widget.ZIndexManager,
        util = nx.Util;
    nx.define('nx.widget.AbstractPopup',nx.ui.Component,{
        properties: {
            fixed: {
                set: function (inValue) {
                    this._fixed = inValue ? 'fixed' : 'absolute';
                    this._root.setStyle('position',this._fixed);
                },
                get: function () {
                    return this._fixed === 'fixed';
                }
            },
            size: {
                set: function (inValue) {
                    var paddingX = this._root.padding('left') + this._root.padding('right'),
                        paddingY = this._root.padding('top') + this._root.padding('bottom'),
                        borderX = this._root.border('left') + this._root.border('right'),
                        borderY = this._root.border('top') + this._root.border('bottom'),
                        width = inValue.width,
                        height = inValue.height;
                    if (this._boxSizing === 'content-box') {
                        width = width - paddingX - borderX;
                        height = height - paddingY - borderY;
                    }
                    this._root.setStyles({
                        width: width,
                        height: height
                    });
                    this._size = inValue;
                },
                get: function () {
                    return this._size;
                }
            },
            direction: {
                set: function (inValue) {
                    this._direction = inValue || 'center';
                    this.position(this._getDirectionPosition(this._direction));
                },
                get: function () {
                    return this._direction;
                }
            },
            position: {
                set: function (inValue) {
                    this._root.setStyles(this._getPosition(inValue));
                    this._position = inValue;
                },
                get: function () {
                    return this._position;
                }
            },
            opened: {
                set: function (inValue) {
                    if (inValue) {
                        this.open();
                    } else {
                        this.close();
                    }
                    this._opened = inValue;
                },
                get: function () {
                    return this._opened;
                }
            }
        },
        methods: {
            init: function () {
                this.inherited();
                this._root = this.resolve('@root');
                this._boxSizing = this._root.getStyle('box-sizing');
                this._init();
            },
            open: function () {
                this.onBeforeOpen();
                this.onOpen();
                this.onAfterOpen();
            },
            close: function () {
                this.onBeforeClose();
                this.onClose();
                this.onAfterClose();
            },
            onBeforeOpen: function () {
            },
            onOpen: function () {
                this._show();
            },
            onAfterOpen: function () {
            },
            onBeforeClose: function () {
            },
            onClose: function () {
                this.hide();
            },
            onAfterClose: function () {
            },
            dispose: function () {
                this._root = null;
                this._boxSizing = null;
            },
            _init: function () {
                this._root.setStyles({
                    'display': 'none',
                    'z-index': zIndexMgr.getIndex(),
                    position: 'absolute'
                });
                nx.dom.Document.body().appendChild(this._root);
            },
            _show: function () {
                this._root.setStyles({
                    display: 'block',
                    'z-index': zIndexMgr.getIndex()
                });
            },
            _hide: function () {
                this._root.setStyle('display','none');
            },
            _getDirectionPosition: function (inDirection) {
                var action = '_direction' + util.capitalize(inDirection);
                return this[action]();
            },
            _getPosition: function (inValue) {
                var positionStyle = inValue,
                    docRect = nx.dom.Document.docRect();
                if (!this.fixed()) {
                    positionStyle.top = inValue.top + docRect.scrollY;
                    positionStyle.left = inValue.left + docRect.scrollX;
                }
                return positionStyle;
            }
        }
    });
}(nx,nx.global));
