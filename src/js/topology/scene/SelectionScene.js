(function (nx, util, global) {


    /**
     * Selection scene
     * @class nx.graphic.Topology.SelectionScene
     * @extend nx.graphic.Topology.Scene
     */
    nx.define("nx.graphic.Topology.SelectionScene", nx.graphic.Topology.Scene, {

        /**
         * @event startSelection
         */
        /**
         * @event selecting
         */
        /**
         * @event endSelection
         */

        events: ["startSelection", "selecting", "endSelection"],
        methods: {
            /**
             * Entry
             * @method activate
             */

            activate: function (args) {
                this.appendRect();
                var topo = this._topo = this.topology();

                nx.each(topo.__events__, this._aop = function (eventName) {
                    topo.upon(eventName, function (sender, data) {
                        this._dispatch(eventName, sender, data);
                    }, this);
                }, this);
            },
            /**
             * Deactivate scene
             */
            deactivate: function () {
                var topo = this.topology();
                nx.each(topo.__events__, function (eventName) {
                    topo.off(eventName, this._aop, this);
                }, this);

                this.rect.dispose();
                delete this.rect;
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
                rect.attach(topo.stage());
            },
            dragStageStart: function (sender, event) {
                this._offset = {
                    x: event.offsetX,
                    y: event.offsetY
                };
                var topo = this.topology();
                var stage = topo.stage();
                var rect = this.rect;
                this._stageTranslate = stage.translate();
                rect.set('x', event.offsetX - this._stageTranslate.x);
                rect.set('y', event.offsetY - this._stageTranslate.y);
                this.rect.set('visible', true);

            },
            dragStage: function (sender, event) {
                var rect = this.rect;
                var width = event.offsetX - this._offset.x;
                var height = event.offsetY - this._offset.y;
                if (width < 0) {
                    rect.set('x', this._offset.x - this._stageTranslate.x + width);
                    rect.set('width', width * -1);
                } else {
                    rect.set('width', width);
                }

                if (height < 0) {
                    rect.set('y', this._offset.y - this._stageTranslate.y + height);
                    rect.set('height', height * -1);
                } else {
                    rect.set('height', height);
                }
            },
            dragStageEnd: function (sender, event) {
                this._offset = null;
                this._stageTranslate = null;
                this.rect.set('visible', false);
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
            }
        }
    });


})(nx, nx.graphic.util, nx.global);