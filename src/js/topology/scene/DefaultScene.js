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
                this._linksLayer = this._topo.getLayer("links");
                this._linkSetLayer = this._topo.getLayer("linkSet");
                this._tooltipManager = this._topo.tooltipManager();
                this._nodeDragging = false;
                this._sceneTimer = null;
                this._updatingTimer = null;
                this._interval = 300;
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
                var tooltipManager = this._tooltipManager;

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
                var topo = this._topo;

                nx.each(topo.__events__, function (eventName) {
                    topo.off(eventName, this._aop, this);
                }, this);

                this._tooltipManager.closeAll();

                this.__destruct();
            },

            _dispatch: function (eventName, sender, data) {
                if (this[eventName]) {
                    this._tooltipManager.executeAction(eventName, data);
                    this[eventName].call(this, sender, data);
                }
            },
            pressStage: function (sender, event) {
                this._topo.selectedNodes().clear();
            },
            /**
             * Click stage handler
             * @method clickStage
             */
            clickStage: function () {
            },

            dragStageStart: function (sender, event) {
                var nodes = this._topo.getLayer('nodes').nodes().length;
                if (nodes > 300) {
                    this._topo.getLayer('links').root().setStyle('display', 'none');
                }

            },
            dragStage: function (sender, event) {
                var stage = this._topo.stage();
                stage.setTransform(stage._translateX + event.drag.delta[0], stage._translateY + event.drag.delta[1]);
            },
            dragStageEnd: function (sender, event) {
                this._topo.getLayer('links').root().setStyle('display', 'block');
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

            },

            zoomend: function () {
                this._topo.getLayer('links').root().setStyle('display', 'block');
            },

            beforeSetData: function () {

            },

            afterSetData: function () {

            },


            insertData: function () {

            },


            ready: function () {

            },

            /**
             * Enter node handler
             * @param sender
             * @param node
             * @method enterNode
             */
            enterNode: function (sender, node) {
                clearTimeout(this._sceneTimer);
                if (!this._nodeDragging) {
                    this._sceneTimer = setTimeout(function () {
                        this._nodesLayer.highlightNode(node);
                    }.bind(this), this._interval);
                    this._nodesLayer.recover();
                    this._linksLayer.recover();
                }
            },
            /**
             * Leave node handler
             * @param sender
             * @param node
             * @method leaveNode
             */
            leaveNode: function (sender, node) {
                clearTimeout(this._sceneTimer);
                if (!this._nodeDragging) {
                    this._nodesLayer.recover();
                    this._linksLayer.recover();
                    this._linkSetLayer.recover();
                }
            },
            /**
             * Click node
             * @param sender
             * @param node
             * @method clickNode
             */
            clickNode: function (sender, node) {
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
                this._nodesLayer.recover();
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
            },

            pressNode: function (sender, node) {
                node.selected(!node.selected());
            },
            selectNode: function (sender, node) {
                this._topo.selectedNodes().clear();
                if (node.selected()) {
                    this._topo.selectedNodes().add(node);
                } else {
                    this._topo.selectedNodes().remove(node);
                }
            },

            updateNodeCoordinate: function () {

            }
        }
    });
})(nx, nx.graphic.util, nx.global);