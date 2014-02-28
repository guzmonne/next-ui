(function (nx,global) {
    var zIndexMgr = nx.widget.ZIndexManager;
    nx.define('nx.widget.AbstractPopup',nx.ui.Component,{
        view: {
            props: {
                'class': 'nx-widget-AbstractPopup'
            }
        },
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
                    this[this._getDirectionAction(this._direction)].call(this);
                },
                get: function () {
                    return this._direction;
                }
            },
            _opened: {}
        },
        methods: {
            init: function () {
                this.inherited();
                this._root = this.resolve('@root');
                this._boxSizing = this._root.getStyle('box-sizing');
                this._root.setStyles({
                    'z-index': zIndexMgr.getIndex(),
                    position: 'absolute'
                });
                nx.dom.Document.body().appendChild(this._root);
            },
            open: function () {
                if (!this._opened()) {
                    this.onBeforeOpen();
                }
                this.onOpen();
                this.onAfterOpen();
            },
            close: function () {
                this.onBeforeClose();
                this.onClose();
                this.onAfterClose();
            },
            onBeforeOpen: function () {
                this._hide();
                this._opened(true);
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
            _show: function () {
                this._root.setStyles({
                    display: 'block',
                    'z-index': zIndexMgr.getIndex()
                });
            },
            _hide: function () {
                this._root.setStyle('display','none');
            },
            _getDirectionAction: function (inDirection) {
            }
        }
    });
}(nx,nx.global));
