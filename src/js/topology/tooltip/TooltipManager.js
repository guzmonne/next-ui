(function (nx, util, global) {


    /**
     * Tooltip manager for topology
     * @class nx.graphic.Topology.TooltipManager
     * @extend nx.data.ObservableObject
     */
    nx.define("nx.graphic.Topology.TooltipManager", nx.data.ObservableObject, {
        /**
         * @event openNodeToolTip
         */
        /**
         * @event closeNodeToolTip
         */
        /**
         * @event openLinkToolTip
         */
        /**
         * @event closeLinkToolTip
         */
        events: ['openNodeToolTip', 'closeNodeToolTip', 'openLinkToolTip', 'closeLinkToolTip','closeLinkSetToolTip'],
        properties: {
            /**
             * Get topology
             * @property  topology
             */
            topology: {
                value: null
            },
            /**
             * Get node's tooltip
             * @property nodeTooltip
             */
            nodeTooltip: {
                value: null
            },
            /**
             * Get link's tooltip
             * @property linkTooltip
             */
            linkTooltip: {
                value: null
            },
            linkSetTooltip:{

            },
            /**
             * Show/hide node's tooltip
             * @type Boolean
             * @property showNodeTooltip
             */
            showNodeTooltip: {
                value: true
            },
            /**
             * Show/hide link's tooltip
             * @type Boolean
             * @property
             */
            showLinkTooltip: {
                value: true
            },
            showLinkSetTooltip:{
                value:true
            }
        },
        methods: {

            init: function (args) {
                this.sets(args);

                return;

//                var nodeTooltip = new nx.graphic.NodeTooltip;
//
//                nodeTooltip.on("close", function () {
//                    this.fire("closeNodeToolTip");
//                }, this);
//
//                this.nodeTooltip(nodeTooltip);
//
//
//                var linkTooltip = new nx.graphic.LinkTooltip();
//                linkTooltip.on("close", function () {
//                    this.fire("closeLinkToolTip", linkTooltip);
//                }, this);
//                this.linkTooltip(linkTooltip);
//
//
//
//                var linkSetTooltip = new nx.graphic.LinkSetTooltip();
//                linkSetTooltip.on("close", function () {
//                    this.fire("closeLinkSetToolTip", linkSetTooltip);
//                }, this);
//                this.linkSetTooltip(linkSetTooltip);


            },
            /**
             * Open a node's tooltip
             * @param node
             * @method openNodeTooltip
             */
            openNodeTooltip: function (node) {
                var nodeTooltip = this.nodeTooltip();
                nodeTooltip.close(true);


                if (this.showNodeTooltip() === false) {
                    return;
                }


                var topo = this.topology();
                var position = node.getPosition();
                var size = node.getSize();

                var topologyOffset = nx.position.getOffset(topo._element);
                var stageTranslate = topo.stage().getTranslate();

                this._nodeToolTipContentGenerator.call(this, node, nodeTooltip);

                nodeTooltip.open({
                    target: {
                        x: position.x + topologyOffset.left,
                        y: position.y + topologyOffset.top
                    },
                    offset: Math.max(size.height, size.width) / 2,
                    offsetX: stageTranslate.x,
                    offsetY: stageTranslate.y
                });

                this.fire("openNodeToolTip", node);
            },
            /**
             * Get node's tooltip content
             * @param fn
             * @method setNodeToolTipContent
             */
            setNodeToolTipContent: function (fn) {
                this._nodeToolTipContentGenerator = fn;
            },
            _nodeToolTipContentGenerator: function (node, nodeTooltip) {
                var model = node.model();
                var tooltipContent = new nx.graphic.NodeTooltipContent();
                tooltipContent.model(model);
                nodeTooltip.setContent(tooltipContent);
            },

            /**
             * open a link's tooltip
             * @param link
             * @param position
             * @method openLinkTooltip
             */
            openLinkTooltip: function (link, position) {
                var topo = this.topology();
                var linkTooltip = this.linkTooltip();
                linkTooltip.close(true);


                if (this.showLinkTooltip() === false) {
                    return;
                }


                if (!position) {
                    position = nx.eventObject.getPageXY();
                }


                this._linkToolTipContentGenerator.call(this, link, linkTooltip);
                linkTooltip.open({
                    target: {
                        x: position.x,
                        y: position.y
                    },
                    offset: 4
                });


                this.fire("openLinkToolTip", link);


            },
            /**
             * Set link's tooltip's content
             * @param fn
             * @method setLinkToolTipContent
             */
            setLinkToolTipContent: function (fn) {
                this._linkToolTipContentGenerator = fn;
            },
            _linkToolTipContentGenerator: function (link, linkTooltip) {
                var model = link.model();
                var tooltipContent = new nx.graphic.LinkTooltipContent();
                tooltipContent.model(model);
                linkTooltip.setContent(tooltipContent);
            },
            openLinkSetTooltip: function (linkSet, position) {
                var topo = this.topology();
                var linkSetTooltip = this.linkSetTooltip();
                linkSetTooltip.close(true);


                if (this.showLinkSetTooltip() === false) {
                    return;
                }


                if (!position) {
                    position = nx.eventObject.getPageXY();
                }


                this._linkSetToolTipContentGenerator.call(this, linkSet, linkSetTooltip);

                linkSetTooltip.title(linkSet.model().linkKey());


                linkSetTooltip.open({
                    target: {
                        x: position.x,
                        y: position.y
                    },
                    offset: 4
                });


                this.fire("openLinkSetToolTip", linkSet);


            },
            /**
             * Set link's tooltip's content
             * @param fn
             * @method setLinkToolTipContent
             */
            setLinkSetToolTipContent: function (fn) {
                this._linkSetToolTipContentGenerator = fn;
            },
            _linkSetToolTipContentGenerator: function (linkSet, linkSetTooltip) {
                var model = linkSet.model();
                var tooltipContent = new nx.graphic.LinkSetTooltipContent();
                tooltipContent.linkSet(linkSet);
                linkSetTooltip.setContent(tooltipContent);
            }
        }
    });


    /**
     * Basic tooltip class for topology
     * @class nx.graphic.Tooltip
     * @extend nx.ui.Popover
     */
    nx.define("nx.graphic.Tooltip", nx.ui.Component, {
//        view: function () {
//            var root = this.resolve();
//            root.props.class += " n-topology-node-tootltip";
//        },
        properties: {
            /**
             * Lazy closing a tooltip
             * @type Boolean
             * @property lazyClose
             */
            lazyClose: {
                value: false
            },
            /**
             * Pin a tooltip
             * @type Boolean
             * @property pin
             */
            pin: {
                value: false
            },
            /**
             * Is tooltip response to resize event
             * @type Boolean
             * @property listenWindow
             */
            listenWindow: {
                value: true
            }
        }
    });


})(nx, nx.graphic.util, nx.global);