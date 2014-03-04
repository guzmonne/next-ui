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
                topo.on("clickStage", this.clickStage, this);
                topo.on('projectionChange', this.projectionChange, this);
                topo.on('zooming', this.zooming, this);
                topo.on('zoomend', this.zoomend, this);
                topo.on('beforeSetData', this.beforeSetData, this);
                topo.on('afterSetData', this.afterSetData, this);
                topo.on('insertData', this.insertData, this);
                topo.on('ready', this.ready, this);

                this._nodesLayer.on("enterNode", this.enterNode, this);
                this._nodesLayer.on("clickNode", this.clickNode, this);
                this._nodesLayer.on("leaveNode", this.leaveNode, this);
                this._nodesLayer.on("hideNode", this.hideNode, this);
                this._nodesLayer.on("dragNodeStart", this.dragNodeStart, this);
                this._nodesLayer.on("dragNode", this.dragNode, this);
                this._nodesLayer.on("dragNodeEnd", this.dragNodeEnd, this);
                this._nodesLayer.on("pressNode", this.pressNode, this);
                this._nodesLayer.on("selectNode", this.selectNode, this);
                this._nodesLayer.on("updateNodeCoordinate", this.updateNodeCoordinate, this);


                this._linksLayer.on("enterLink", this.link_enterLink, this);
                this._linksLayer.on("leaveLink", this.link_leaveLink, this);


                topo.on("clickLinkSetNumber", this.linkSet_click, this);
                topo.on("leaveLinkSetNumber", this.linkSet_leave, this);

            },
            /**
             * Deactivate scene
             */
            deactivate: function () {
                var topo = this._topo;


                this.__destruct();
            },
            /**
             * Click stage handler
             * @method clickStage
             */
            clickStage: function () {
            },

            projectionChange: function () {

            },


            zooming: function () {

            },

            zoomend: function () {

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
                }
            },
            /**
             * Click node
             * @param sender
             * @param node
             * @method clickNode
             */
            clickNode: function (sender, node) {
                this._tooltipManager.executeAction('clickNode', node);
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

            pressNode: function () {

            },
            selectNode: function () {

            },

            updateNodeCoordinate: function () {

            },

            node_updating: function () {


            },
            /**
             * Enter link handler
             * @param sender
             * @param link
             * @method link_enterLink
             */
            link_enterLink: function (sender, link) {

            },
            /**
             * Leave link handler
             * @param sender
             * @param link
             * @method link_leaveLink
             */
            link_leaveLink: function (sender, link) {

            },


            linkSet_click: function (sender, linkSet) {

            },
            linkSet_leave: function (sender, linkSet) {


            },
            _blockNavBar: function (value) {
            },
            _blockEvents: function (value) {

            },
            _cleanSelectedNodes: function () {
                this._topo.selectedNodes().clear();
            }
        }
    });
})(nx, nx.graphic.util, nx.global);