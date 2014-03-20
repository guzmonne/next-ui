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
                this._nodesLayer = this._topo.getLayer("nodes");
                this._nodeSetLayer = this._topo.getLayer("nodes");
                this._linksLayer = this._topo.getLayer("links");
                this._linkSetLayer = this._topo.getLayer("linkSet");
                this._tooltipManager = this._topo.tooltipManager();
                this._nodeDragging = false;
                this._sceneTimer = null;
                this._interval = 300;
            },
            /**
             * Entry
             * @method activate
             */

            activate: function () {
                this.__construct();
                var topo = this._topo;
                var tooltipManager = this._tooltipManager;

                tooltipManager.activated(true);

                nx.each(topo.__events__, this._aop = function (eventName) {
                    topo.upon(eventName, function (sender, data) {
                        tooltipManager.executeAction(eventName, data);
                        if (this[eventName]) {
                            this[eventName].call(this, sender, data);
                        }
                    }, this);
                }, this);
            },
            /**
             * Deactivate scene
             */
            deactivate: function () {
                this._tooltipManager.closeAll();
            },

            _dispatch: function (eventName, sender, data) {
                if (this[eventName]) {
                    this._tooltipManager.executeAction(eventName, data);
                    this[eventName].call(this, sender, data);
                }
            },
            pressStage: function (sender, event) {
            },
            /**
             * Click stage handler
             * @method clickStage
             */
            clickStage: function (sender, event) {
                if (event.target == this._topo.stage().view().dom().$dom) {
                    this._topo.selectedNodes().clear();
                }
            },

            dragStageStart: function (sender, event) {
                var nodes = this._topo.getLayer('nodes').nodes().length;
                if (nodes > 300) {
                    this._topo.getLayer('links').root().setStyle('display', 'none');
                }
                this._recover();
                this._blockEvent(true);
                nx.dom.Document.body().addClass('n-moveCursor');
            },
            dragStage: function (sender, event) {
                var stage = this._topo.stage();
                stage.setTransform(stage._translateX + event.drag.delta[0], stage._translateY + event.drag.delta[1]);
            },
            dragStageEnd: function (sender, event) {
                this._topo.getLayer('links').root().setStyle('display', 'block');
                this._blockEvent(false);
                nx.dom.Document.body().removeClass('n-moveCursor');
            },
            projectionChange: function () {

            },


            zooming: function () {
                var nodes = this._topo.getLayer('nodes').nodes().length;
                if (nodes > 300) {
                    this._topo.getLayer('links').root().setStyle('display', 'none');
                }
                this._nodesLayer.recover();
                this._linksLayer.recover();
                this._linkSetLayer.recover();
                this._topo.adjustLayout();

            },

            zoomend: function () {
                this._topo.getLayer('links').root().setStyle('display', 'block');
                this._topo.adjustLayout();
            },

            beforeSetData: function () {

            },

            afterSetData: function () {

            },


            insertData: function () {

            },


            ready: function () {

            },
            enterNode: function (sender, node) {
                clearTimeout(this._sceneTimer);
                if (!this._nodeDragging) {
                    this._sceneTimer = setTimeout(function () {
                        this._nodesLayer.highlightNode(node);
                    }.bind(this), this._interval);
                    this._recover();
                }
                nx.dom.Document.body().addClass('n-dragCursor');
            },
            leaveNode: function (sender, node) {
                clearTimeout(this._sceneTimer);
                if (!this._nodeDragging) {
                    this._recover();
                }
                nx.dom.Document.body().removeClass('n-dragCursor');
            },

            hideNode: function (sender, node) {

            },
            /**
             * Start drag node handler
             * @param sender
             * @param node
             * @method dragNodeStart
             */
            dragNodeStart: function (sender, node) {
                this._nodeDragging = true;
                this._recover();
                this._blockEvent(true);
                nx.dom.Document.body().addClass('n-dragCursor');
            },
            /**
             * Drag node handler
             * @method dragNode
             */
            dragNode: function () {

            },
            /**
             * Drag node end handler
             * @method dragNodeEnd
             */
            dragNodeEnd: function () {
                this._nodeDragging = false;
                this._blockEvent(false);
                nx.dom.Document.body().removeClass('n-dragCursor');
            },

            pressNode: function (sender, node) {

            },
            clickNode: function (sender, node) {
                if (!this._nodeDragging) {
                    this._topo.selectedNodes().clear();
                    node.selected(!node.selected());
                }
            },
            selectNode: function (sender, node) {
                var selectedNodes = this._topo.selectedNodes();
                if (node.selected()) {
                    if (selectedNodes.indexOf(node) == -1) {
                        this._topo.selectedNodes().add(node);
                    }
                } else {
                    if (selectedNodes.indexOf(node) !== -1) {
                        this._topo.selectedNodes().remove(node);
                    }
                }
            },
            selectNodeSet: function (sender, nodeSet) {
                var selectedNodes = this._topo.selectedNodes();
                if (nodeSet.selected()) {
                    if (selectedNodes.indexOf(nodeSet) == -1) {
                        this._topo.selectedNodes().add(nodeSet);
                    }
                } else {
                    if (selectedNodes.indexOf(nodeSet) !== -1) {
                        this._topo.selectedNodes().remove(nodeSet);
                    }
                }
            },

            updateNodeCoordinate: function () {

            },

            pressNodeSet: function (sender, nodeSet) {

            },
            clickNodeSet: function (sender, nodeSet) {
                this._recover();
                nodeSet.collapsed(!!!nodeSet.collapsed());
            },

            enterNodeSet: function (sender, nodeSet) {
                clearTimeout(this._sceneTimer);
                if (!this._nodeDragging) {
                    this._sceneTimer = setTimeout(function () {
                        this._nodesLayer.highlightNode(nodeSet);
                    }.bind(this), this._interval);
                    this._recover();
                }
            },
            leaveNodeSet: function (sender, nodeSet) {
                clearTimeout(this._sceneTimer);
                if (!this._nodeDragging) {
                    this._recover();
                }
            },
            expandNodeSet: function (sender, nodeSet) {
                nodeSet.visible(false);
                clearTimeout(this._sceneTimer);
                this._recover();
                this.__activeNodeSet = nodeSet;
            },
            collapseNodeSet: function (sender, nodeSet) {
                nodeSet.visible(true);
            },
            right: function (sender, events) {
                this._topo.move(30, null, 0.5);
            },
            left: function (sender, events) {
                this._topo.move(-30, null, 0.5);
            },
            up: function () {
                this._topo.move(null, -30, 0.5);
            },
            down: function () {
                this._topo.move(null, 30, 0.5);
            },
            topologyGenerated: function () {
                this._topo.adjustLayout();
            },
            _recover: function () {
                this._nodesLayer.recover();
                this._nodeSetLayer.recover();
                this._linksLayer.recover();
                this._linkSetLayer.recover();
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
})(nx, nx.util, nx.global);