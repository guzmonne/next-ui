(function (nx,global) {
    var zIndexMgr = nx.widget.ZIndexManager,
        util = nx.Util;
    nx.define('nx.widget.AbstractPopup',nx.ui.Component,{
        properties: {
            /**
             * Popup's style.position ==='fixed'
             */
            fixed: {
                set: function (inValue) {
                    this._fixed = inValue ? 'fixed' : 'absolute';
                    this._root.setStyle('position',this._fixed);
                },
                get: function () {
                    return this._fixed === 'fixed';
                }
            },
            /**
             * Popup's real size.
             */
            size: {
                set: function (inValue) {
                    var root = this._root,
                        paddingX = root.padding('left') + root.padding('right'),
                        paddingY = root.padding('top') + root.padding('bottom'),
                        borderX = root.border('left') + root.border('right'),
                        borderY = root.border('top') + root.border('bottom'),
                        width = inValue.width,
                        height = inValue.height;
                    if (this._boxSizing === 'content-box') {
                        width = width - paddingX - borderX;
                        height = height - paddingY - borderY;
                    }
                    root.setStyles({
                        width: width,
                        height: height
                    });
                    this._size = inValue;
                },
                get: function () {
                    return this._size;
                }
            },
            /**
             * Use string to set/get the popup's position.
             */
            direction: {
                set: function (inValue) {
                    this._direction = inValue || 'center';
                    this.position(this._getDirectionPosition(this._direction));
                },
                get: function () {
                    return this._direction;
                }
            },
            /**
             * Use object to set/get popup's position.
             */
            position: {
                set: function (inValue) {
                    this._root.setStyles(this._getPosition(inValue));
                    this._position = inValue;
                },
                get: function () {
                    return this._position;
                }
            },
            /**
             * If a popup is opened.
             */
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
            /**
             * Init some variable.
             */
            init: function () {
                this.inherited();
                this._root = this.resolve('@root');
                this._boxSizing = this._root.getStyle('box-sizing');
                this._init();
            },
            /**
             * Open a popup.
             */
            open: function () {
                this.onBeforeOpen();
                this.onOpen();
                this.onAfterOpen();
            },
            /**
             * Close a popup.
             */
            close: function () {
                this.onBeforeClose();
                this.onClose();
                this.onAfterClose();
            },
            /**
             * Before a popup open.
             */
            onBeforeOpen: function () {
            },
            /**
             * When a popup open.
             */
            onOpen: function () {
                this._show();
            },
            /**
             * Template method
             * After a popup open.
             */
            onAfterOpen: function () {
            },
            /**
             * Before a popup close.
             */
            onBeforeClose: function () {
            },
            /**
             * When a popup close.
             */
            onClose: function () {
                this.hide();
            },
            /**
             * After a popup close.
             */
            onAfterClose: function () {
            },
            /**
             * Destroy unused variable.
             */
            dispose: function () {
                this._root = null;
                this._boxSizing = null;
            },
            /**
             * When popup init.
             * @private
             */
            _init: function () {
                this._root.setStyles({
                    'display': 'none',
                    'z-index': zIndexMgr.getIndex(),
                    position: 'absolute'
                });
                nx.dom.Document.body().appendChild(this._root);
            },
            /**
             * Display popup.
             * @private
             */
            _show: function () {
                this._root.setStyles({
                    display: 'block',
                    'z-index': zIndexMgr.getIndex()
                });
            },
            /**
             * Hide popup.
             * @private
             */
            _hide: function () {
                this._root.setStyle('display','none');
            },
            /**
             * Get direction position action.
             * @param inDirection
             * @returns {*}
             * @private
             */
            _getDirectionPosition: function (inDirection) {
                var action = '_direction' + util.capitalize(inDirection);
                return this[action]();
            },
            /**
             * Get style position information.
             * @param inValue
             * @returns {*}
             * @private
             */
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
