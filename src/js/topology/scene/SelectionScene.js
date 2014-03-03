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
            activate: function () {
                this.topology().resolve("stageContainer").on('mousedown', this._mousedown, this);
                this.topology().resolve("stageContainer").on('touchstart', this._mousedown, this);
                this.original_point = null;
            },
            deactivate: function () {
                var app = nx.app;
                var topo = this.topology();
                topo.resolve("stageContainer").off('mousedown', this._mousedown, this);
                topo.resolve("stageContainer").off('touchstart', this._mousedown, this);
                app.off('mousemove', this._mousemove, this);
                app.off('mouseup', this._mouseup, this);
                app.off('touchmove', this._mousemove, this);
                app.off('touchend', this._mouseup, this);
            },
            appendRect: function () {
                var topo = this.topology();
                if (this.rect) {
                    this.rect.destroy();
                }
                var rect = this.rect = new nx.graphic.Rect({
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0,
                    'class': 'selectionRect'
                });
                topo.stage().appendChild(rect);
            },
            redrawRect: function (x, y, w, h) {
                this.rect.x(x);
                this.rect.y(y);
                this.rect.width(w);
                this.rect.height(h);
            },
            removeRect: function () {
                this.rect.destroy();
            },
            _mousedown: function (sender, event) {
                var app = nx.app;
                this.appendRect();
                this.original_point = event.getPageXY();
                this.topoBound = this.topology().getBound();
                app.off('mousemove', this._mousemove, this);
                app.off('mouseup', this._mouseup, this);
                app.on('mousemove', this._mousemove, this);
                app.on('mouseup', this._mouseup, this);


                app.off('touchmove', this._mousemove, this);
                app.off('touchend', this._mouseup, this);
                app.on('touchmove', this._mousemove, this);
                app.on('touchend', this._mouseup, this);


                //
                this.fire("startSelection", event);
                //
                nx.dom.addClass(document.body, "n-userselect n-dragCursor");

                event.stop();
            },
            _mousemove: function (sender, event) {
                if (this.original_point) {
                    var stageTranslate = this.topology().stage().getTranslate();
                    var originalXY = this.original_point;
                    var pageXY = event.getPageXY();
                    var x = Math.min(originalXY.x, pageXY.x) - stageTranslate.x - this.topoBound.left;
                    var y = Math.min(originalXY.y, pageXY.y) - stageTranslate.y - this.topoBound.top;
                    var width = Math.abs(pageXY.x - originalXY.x);
                    var height = Math.abs(pageXY.y - originalXY.y);
                    this.redrawRect(x, y, width, height);
                    this.fire("selecting", this._getRectBound());
                }
            },
            _mouseup: function (sender, event) {
                if (this.original_point) {
                    this.original_point = null;
                    this.fire("endSelection", this._getRectBound());
                    this.removeRect();
                }
                nx.dom.removeClass(document.body, "n-userselect n-dragCursor");
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

    /**
     * Selection node scene
     * @class nx.graphic.Topology.SelectionNodeScene
     * @extend nx.graphic.Topology.SelectionScene
     */

    nx.define("nx.graphic.Topology.SelectionNodeScene", nx.graphic.Topology.SelectionScene, {
        /**
         * @event selectNode
         */
        events: ["selectNode"],
        properties: {
            /**
             * Get all selected nodes
             * @property selectedNodes
             */
            selectedNodes: {
                get: function () {
                    return this.topology().selectedNodes();
                }
            }
        },
        methods: {
            activate: function () {
                this.inherited();

                this.topology().on('clickNode', this._click, this);

                this.on("startSelection", this._startSelectionFN = function (sender, event) {
                    this.ctrlKey = event.ctrlKey;
                    if (!this.ctrlKey) {
                        this.selectedNodes().clear();
                    } else {
                        this.prevSelectedNodes = this.selectedNodes().clone();
                    }

                    var bounds = this.bounds = [];
                    var topoBound = this.topology().getBound();

                    this.topology().eachNode(function (node) {
                        var bound = node.getIconBound();
                        bounds.push({
                            bound: {
                                top: bound.top - topoBound.top,
                                left: bound.left - topoBound.left,
                                width: bound.width,
                                height: bound.height,
                                bottom: bound.bottom - topoBound.top,
                                right: bound.right - topoBound.left
                            },
                            node: node
                        });

                    }, this);


                }, this);


                this.on('selecting', this._selectingFN = function (sender, bound) {
                    this.selectNodeByRect(bound);
                }, this);


                this.on('endSelection', this._endSelectionFN = function (sender, bound) {
                    this.selectNodeByRect(bound);
                    this.fire("selectNode", this.selectedNodes());
                }, this);

            },
            deactivate: function () {
                this.topology().off('clickNode', this._click, this);
                this.off("startSelection", this._startSelectionFN, this);
                this.off('selecting', this._selectingFN, this);
                this.off('endSelection', this._endSelectionFN, this);
                this.prevSelectedNodes = [];

                this.inherited();
            },
            _click: function (sender, node) {
                if (node.enable()) {
                    var event = nx.eventObject;
                    var selectedNodes = this.selectedNodes();
                    if (!event.ctrlKey) {
                        selectedNodes.clear();
                    }
                    node.selected(!node.selected());
                }
            },
            selectNodeByRect: function (bound) {
                nx.each(this.bounds, function (item) {
                    var nodeBound = item.bound;
                    var node = item.node;
                    var nodeSelected = node.selected();


                    if (this._hittest(bound, nodeBound)) {
                        if (!nodeSelected) {
                            node.selected(true);
                        }
                    } else {
                        if (this.ctrlKey) {
                            if (util.indexOf(this.prevSelectedNodes._data, node) == -1) {
                                if (nodeSelected) {
                                    node.selected(false);
                                }
                            }
                        } else {
                            if (nodeSelected) {
                                node.selected(false);
                            }
                        }
                    }


                }, this);
            },
            _hittest: function (rect, nodeBound) {
                var t = rect.top <= nodeBound.top && nodeBound.top <= rect.bottom,
                    l = rect.left <= nodeBound.left && nodeBound.left <= rect.right,
                    b = rect.bottom >= nodeBound.bottom && nodeBound.bottom >= rect.top,
                    r = rect.right >= nodeBound.right && nodeBound.right >= rect.left,
                    hm = rect.top >= nodeBound.top && rect.bottom <= nodeBound.bottom,
                    vm = rect.left >= nodeBound.left && rect.right <= nodeBound.right;

                return (t && l) || (b && r) || (t && r) || (b && l) || (t && vm) || (b && vm) || (l && hm) || (r && hm);
            }
        }
    });


})(nx, nx.graphic.util, nx.global);