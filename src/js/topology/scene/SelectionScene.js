(function (nx, global) {


    /**
     * Selection scene
     * @class nx.graphic.Topology.SelectionScene
     * @extend nx.graphic.Topology.Scene
     */
    nx.define("nx.graphic.Topology.SelectionScene", nx.graphic.Topology.DefaultScene, {
        methods: {
            /**
             * Entry
             * @method activate
             */

            activate: function (args) {
                this.appendRect();
                this.inherited(args);
                nx.dom.Document.html().addClass('n-crosshairCursor');
            },
            deactivate: function () {
                this.inherited();
                this.rect.dispose();
                delete this.rect;
                nx.dom.Document.html().removeClass('n-crosshairCursor');
            },
            _dispatch: function (eventName, sender, data) {
                if (this[eventName]) {
                    this[eventName].call(this, sender, data);
                }
            },
            appendRect: function () {
                var topo = this.topology();
                if (this.rect) {
                    this.rect.dispose();
                }
                var rect = this.rect = new nx.graphic.Rect({
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0,
                    'class': 'selectionRect'
                });
                rect.attach(topo.stage().staticLayer());
            },
            dragStageStart: function (sender, event) {
                this._offset = {
                    x: event.clientX,
                    y: event.clientY
                };
                var topo = this.topology();
                var stage = topo.stage();
                var rect = this.rect;
                this._stageBound = stage.view().dom().getBound();
                rect.set('x', event.clientX - this._stageBound.left);
                rect.set('y', event.clientY - this._stageBound.top);
                this.rect.set('visible', true);
                this._blockEvent(true);



            },
            dragStage: function (sender, event) {
                var rect = this.rect;
                var width = event.clientX - this._offset.x;
                var height = event.clientY - this._offset.y;
                if (width < 0) {
                    rect.set('x', this._offset.x - this._stageBound.left + width);
                    rect.set('width', width * -1);
                } else {
                    rect.set('width', width);
                }

                if (height < 0) {
                    rect.set('y', this._offset.y - this._stageBound.top + height);
                    rect.set('height', height * -1);
                } else {
                    rect.set('height', height);
                }
            },
            dragStageEnd: function (sender, event) {
                this._offset = null;
                this._stageTranslate = null;
                this.rect.set('visible', false);
                this._blockEvent(false);

            },
            _getRectBound: function () {
                var rectbound = this.rect.getBoundingClientRect();
                var topoBound = this.topology().getBound();
                return {
                    top: rectbound.top - topoBound.top,
                    left: rectbound.left - topoBound.left,
                    width: rectbound.width,
                    height: rectbound.height,
                    bottom: rectbound.bottom - topoBound.top,
                    right: rectbound.right - topoBound.left
                };
            },
            esc: {

            },
            _blockEvent: function (value) {
                if (value) {
                    nx.dom.Document.body().addClass('n-userselect n-blockEvent');
                } else {
                    nx.dom.Document.body().removeClass('n-userselect');
                    nx.dom.Document.body().removeClass('n-blockEvent');
                }
            }
        }
    });


})(nx, nx.global);