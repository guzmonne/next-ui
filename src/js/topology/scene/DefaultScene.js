(function (nx, util, global) {
    /**
     * Default Scene for topology
     * @class nx.graphic.Topology.DefaultScene
     * @extend nx.graphic.Topology.Scene
     */

    nx.define("nx.graphic.Topology.DefaultScene", nx.graphic.Topology.Scene, {
        events: [],
        methods: {
            __construct: function () {
                this._topo = this.topology();
                this._tooltipManager = this._topo.tooltipManager();
                this._linkTooltip = this._tooltipManager.linkTooltip();
                this._nodeTooltip = this._tooltipManager.nodeTooltip();
                this._linkSetTooltip = this._tooltipManager.linkSetTooltip();
                this._sceneTimer = null;
                this._updatingTimer = null;
                this._interval = 800;
            },
            __destruct: function () {
                this._topo = null;
                this._tooltipManager = null;
                this._linkTooltip = null;
                this._nodeTooltip = null;
                this._sceneTimer = null;
                this._updatingTimer = null;
                this._interval = null;
                this._linkSetTooltip = null;
            },
            /**
             * Entry
             * @method activate
             */
            activate: function (args) {
                this.__construct();
                var topo = this._topo;
                topo.on("clickStage", this.clickStage, this);
                topo.on("enterNode", this.node_enterNode, this);
                topo.on("clickNode", this.node_clickNode, this);
                topo.on("leaveNode", this.node_leaveNode, this);
                topo.on("hideNode", this.node_hideNode, this);
                topo.on("dragNodeStart", this.node_dragNodeStart, this);
                topo.on("dragNode", this.node_dragNode, this);
                topo.on("dragNodeEnd", this.node_dragNodeEnd, this);
                topo.on("updating", this.node_updating, this);
                topo.on("enterLink", this.link_enterLink, this);
                topo.on("leaveLink", this.link_leaveLink, this);

                topo.on("clickLinkSetNumber", this.linkSet_click, this);
                topo.on("leaveLinkSetNumber", this.linkSet_leave, this);

                topo.resolve("stageContainer").on("mousedown", this._dragStage, this);
                topo.resolve("stageContainer").on("touchstart", this._dragStage, this);

            },
            /**
             * Deactivate scene
             */
            deactivate: function () {
                var topo = this._topo;
                topo.off("clickStage", this.clickStage, this);
                topo.off("enterNode", this.node_enterNode, this);
                topo.off("clickNode", this.node_clickNode, this);
                topo.off("leaveNode", this.node_leaveNode, this);
                topo.off("hideNode", this.node_hideNode, this);
                topo.off("dragNodeStart", this.node_dragNodeStart, this);
                topo.off("dragNode", this.node_dragNode, this);
                topo.off("dragNodeEnd", this.node_dragNodeEnd, this);
                topo.off("updating", this.node_updating, this);
                topo.off("enterLink", this.link_enterLink, this);
                topo.off("leaveLink", this.link_leaveLink, this);

                topo.off("clickLinkSetNumber", this.linkSet_click, this);
                topo.off("leaveLinkSetNumber", this.linkSet_leave, this);

                topo.resolve("stageContainer").off("mousedown", this._dragStage, this);
                topo.resolve("stageContainer").off("touchstart", this._dragStage, this);
                this.__destruct();
            },
            /**
             * Click stage handler
             * @method clickStage
             */
            clickStage: function () {
//                clearTimeout(this._sceneTimer);
//                this._linkTooltip.close(true);
//                this._nodeTooltip.close();
//                this._topo.recover();
//                this._topo.selectedNodes().clear();

            },
            /**
             * Enter node handler
             * @param sender
             * @param node
             * @method node_enterNode
             */
            node_enterNode: function (sender, node) {
                clearTimeout(this._sceneTimer);
                this._linkTooltip.close(true);
                this._sceneTimer = util.timeout(function () {
                    this._topo.highlightNode(node);
                    this._tooltipManager.openNodeTooltip(node);
                }, this._interval, this);
            },
            /**
             * Leave node handler
             * @param sender
             * @param node
             * @method node_leaveNode
             */
            node_leaveNode: function (sender, node) {
                //console.log("node_leaveNode");
                clearTimeout(this._sceneTimer);
                this._nodeTooltip.close();
                this._topo.recover();
            },
            /**
             * Click node
             * @param sender
             * @param node
             * @method node_clickNode
             */
            node_clickNode: function (sender, node) {
                ////console.log("node_clickNode");
                clearTimeout(this._sceneTimer);
                clearTimeout(this._updatingTimer);
                this._blockEvents(false);
                this._linkTooltip.close(true);
                this._topo.highlightNode(node);
                this._tooltipManager.openNodeTooltip(node);

                //todo clean

                var selectedNodes = this._topo.selectedNodes();
                if (!nx.eventObject.ctrlKey) {
                    selectedNodes.clear();
                }
                node.selected(!node.selected());


                //nx.eventObject.stop();

            },
            node_hideNode: function (sender, node) {
                clearTimeout(this._sceneTimer);
                clearTimeout(this._updatingTimer);
                this._nodeTooltip.close(true);
                this._linkTooltip.close(true);
                this._topo.recover();
            },
            /**
             * Start drag node handler
             * @param sender
             * @param node
             * @method node_dragNodeStart
             */
            node_dragNodeStart: function (sender, node) {
                //////console.log("node_dragNodeStart");
                clearTimeout(this._sceneTimer);
            },
            /**
             * Drag node handler
             * @method node_dragNode
             */
            node_dragNode: function () {
                //////console.log("node_dragNode");
                this._blockEvents(true);
                this._topo.recover();
            },
            /**
             * Drag node end handler
             * @method node_dragNodeEnd
             */
            node_dragNodeEnd: function () {
                //////console.log("node_dragNodeEnd");
                this._blockEvents(false);
            },

            node_updating: function () {
                //////console.log("node_updating");
                this._blockEvents(true);
                if (this._updatingTimer) {
                    clearTimeout(this._updatingTimer);
                }
                this._updatingTimer = util.timeout(function () {
                    this._blockEvents(false);
                }, 100, this);

            },
            /**
             * Enter link handler
             * @param sender
             * @param link
             * @method link_enterLink
             */
            link_enterLink: function (sender, link) {
                var self = this;
                clearTimeout(this._sceneTimer);
                this._nodeTooltip.close(true);
                var position = nx.eventObject.getPageXY();
                self._tooltipManager.openLinkTooltip(link, {
                    x: position.x,
                    y: position.y
                });
            },
            /**
             * Leave link handler
             * @param sender
             * @param link
             * @method link_leaveLink
             */
            link_leaveLink: function (sender, link) {
                clearTimeout(this._sceneTimer);
                this._linkTooltip.close();
                link.selected(false);
            },


            linkSet_click: function (sender, linkSet) {
                var position = nx.eventObject.getPageXY();
                var centerPosition = linkSet.getCenterPosition()
                this._tooltipManager.openLinkSetTooltip(linkSet, {
                    x: position.x,
                    y: position.y
                });
            },
            linkSet_leave: function (sender, linkSet) {

                this._linkS

            },
            _blockNavBar: function (value) {
                var topo = this.topology();
                if (value) {
                    topo.resolve("nav").addClass('n-topology-nav-bar-disabled');
                } else {
                    topo.resolve("nav").removeClass('n-topology-nav-bar-disabled');
                }
            },
            _blockEvents: function (value) {
                var topo = this.topology();
                var tooltipManager = topo.tooltipManager();
                value = !!value;
                this._blockNavBar(value);
                topo.getLayer("nodes").onleaveNode.ignore = value;
                topo.getLayer("nodes").onenterNode.ignore = value;
                topo.getLayer("links").onenterLink.ignore = value;

                //topo.recover();
                tooltipManager.nodeTooltip().close(true);
                tooltipManager.linkTooltip().close(true);
            },
            _cleanSelectedNodes: function () {
                //////console.log("_cleanSelectedNodes");
                this._topo.selectedNodes().clear();
            },
            _dragStage: function (sender, event) {
                var self = this;
                var topo = this.topology();
                var stage = topo.stage();
                var translateX = stage.translateX();
                var translateY = stage.translateY();
                var offset = event.getPageXY();
                var px = translateX - offset.x;
                var py = translateY - offset.y;
                var startDrag = true;
                var fn = function (sender, event) {
                    //console.log("x");
                    if (startDrag) {
                        var offset = event.getPageXY();
                        stage.translateX(px + offset.x);
                        stage.translateY(py + offset.y);
                        topo.fire("dragStage");
                    }
                };
                var fn2 = function (sender, event) {
                    nx.app.off("mousemove", fn);
                    nx.app.off("mouseup", fn2);

                    nx.app.off("touchmove", fn);
                    nx.app.off("touchend", fn2);



                    var offset = event.getPageXY();
                    var _px = translateX - offset.x;
                    var _py = translateY - offset.y;
                    if (_px == px && _py == py) {
                        self._cleanSelectedNodes();
                    }

                    topo.fire("dragStageEnd");

                    nx.dom.removeClass(document.body, "n-userselect n-dragCursor");
                };
                nx.app.on("mousemove", fn);
                nx.app.on("mouseup", fn2);


                if (event.originalEvent.touches && event.originalEvent.touches.length != 2) {
                    nx.app.on("touchmove", fn);
                    nx.app.on("touchend", fn2);
                }



                topo.fire("dragStageStart");

                nx.dom.addClass(document.body, "n-userselect n-dragCursor");

                this._topo.recover();
                this._nodeTooltip.close();

                event.stop();
            }
        }
    });
})(nx, nx.graphic.util, nx.global);