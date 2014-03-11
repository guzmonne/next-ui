(function (nx, util, global) {


    /**
     * Tooltip manager for topology
     * @class nx.graphic.Topology.TooltipManager
     * @extend nx.data.ObservableObject
     */
    nx.define("nx.graphic.Topology.TooltipManager", {
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
        events: ['openNodeToolTip', 'closeNodeToolTip', 'openLinkToolTip', 'closeLinkToolTip', 'closeLinkSetToolTip'],
        properties: {
            /**
             * Get topology
             * @property  topology
             */
            topology: {
                value: null
            },
            tooltips: {
                value: function () {
                    return new nx.data.ObservableDictionary();
                }
            },
            /**
             * Get node's tooltip
             * @property nodeTooltip
             */
            nodeTooltip: {},
            /**
             * Get link's tooltip
             * @property linkTooltip
             */
            linkTooltip: {},
            linkSetTooltip: {},
            nodeSetTooltip: {},

            nodeTooltipClass: {
                value: 'nx.graphic.Topology.Tooltip'
            },

            linkTooltipClass: {
                value: 'nx.graphic.Topology.Tooltip'
            },
            linkSetTooltipClass: {
                value: 'nx.graphic.Topology.Tooltip'
            },

            nodeSetTooltipClass: {
                value: 'nx.graphic.Topology.Tooltip'
            },
            nodeTooltipContentClass: {
                value: 'nx.graphic.Topology.NodeTooltipContent'
            },

            linkTooltipContentClass: {
                value: 'nx.graphic.Topology.linkTooltipContent'
            },
            linkSetTooltipContentClass: {
                value: 'nx.graphic.Topology.linkSetTooltipContent'
            },

            nodeSetTooltipContentClass: {
                value: 'nx.graphic.Topology.nodeSetTooltipContent'
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
            showLinkSetTooltip: {
                value: true
            },
            showNodeSetTooltip: {
                value: true
            },
            tooltipPolicyClass: {
                value: 'nx.graphic.Topology.TooltipPolicy'
            },
            tooltipPolicy: {}
        },
        methods: {

            init: function (args) {

                this.inherited(args);

                this.sets(args);

                this.registerTooltip('nodeTooltip', this.nodeTooltipClass());
                this.registerTooltip('linkTooltip', this.linkTooltipClass());
                this.registerTooltip('linkSetTooltip', this.linkSetTooltipClass());
                this.registerTooltip('nodeSetTooltip', this.nodeSetTooltipClass());


                //build in tooltips


                var nodeTooltip = this.getTooltip('nodeTooltip');
                nodeTooltip.on("close", function () {
                    this.fire("closeNodeToolTip");
                }, this);
                nodeTooltip.resolve('@root').addClass('n-topology-node-tootltip');
                this.nodeTooltip(nodeTooltip);


                var linkTooltip = this.getTooltip('linkTooltip');
                linkTooltip.on("close", function () {
                    this.fire("closeLinkToolTip", linkTooltip);
                }, this);
                this.linkTooltip(linkTooltip);


                var linkSetTooltip = this.getTooltip('linkSetTooltip');
                linkSetTooltip.on("close", function () {
                    this.fire("closeLinkSetToolTip", linkSetTooltip);
                }, this);
                this.linkSetTooltip(linkSetTooltip);


                var nodeSetTooltip = this.getTooltip('nodeSetTooltip');
                nodeSetTooltip.on("close", function () {
                    this.fire("closeNodeSetToolTip");
                }, this);
                this.nodeSetTooltip(nodeSetTooltip);


                var topology = this.topology();
                var tooltipPolicyClass = nx.path(global, this.tooltipPolicyClass());
                if (tooltipPolicyClass) {
                    var tooltipPolicy = new tooltipPolicyClass({
                        topology: topology,
                        tooltipManager: this
                    });
                    this.tooltipPolicy(tooltipPolicy);
                }
            },

            registerTooltip: function (name, tooltipClass) {
                var tooltips = this.tooltips();
                var topology = this.topology();
                var clz = tooltipClass;
                if (nx.is(clz, 'String')) {
                    clz = nx.path(global, tooltipClass);
                }
                var instance = new clz();
                instance.sets({
                    topology: topology,
                    tooltipManager: this,
                    model: topology.graph()
                });
                tooltips.setItem(name, instance);
            },

            getTooltip: function (name) {
                var tooltips = this.tooltips();
                return tooltips.getItem(name);
            },

            executeAction: function (action, data) {
                var tooltipPolicy = this.tooltipPolicy();
                if (tooltipPolicy && tooltipPolicy[action]) {
                    tooltipPolicy[action].call(tooltipPolicy, data);
                }
            },
            _getNodeAbsolutePosition: function (node) {
                var topo = this.topology();
                var position = node.position();
                var topologyOffset = topo.resolve('@root').getOffset();
                var stageTranslate = topo.stage().translate();
                return {
                    x: position.x + topologyOffset.left + stageTranslate.x,
                    y: position.y + topologyOffset.top + stageTranslate.y
                };
            },
            /**
             * Open a node's tooltip
             * @param node {nx.graphic.Topology.Node}
             * @param position {Object}
             * @method openNodeTooltip
             */
            openNodeTooltip: function (node, position) {
                var topo = this.topology();
                var nodeTooltip = this.nodeTooltip();
                var content;

                nodeTooltip.close(true);

                if (this.showNodeTooltip() === false) {
                    return;
                }


                var pos = position || this._getNodeAbsolutePosition(node);

                var contentClass = nx.path(global, this.nodeTooltipContentClass());
                if (contentClass) {
                    content = new contentClass();
                    content.sets({
                        topology: topo,
                        node: node,
                        model: topo.model()
                    });
                }

                if (content) {
                    nodeTooltip.content(null);
                    content.attach(nodeTooltip);
                }

                var size = node.getSize();

                nodeTooltip.open({
                    target: pos,
                    offset: Math.max(size.height, size.width) / 2
                });

                this.fire("openNodeToolTip", node);
            },
            /**
             * Open a nodeSet's tooltip
             * @param nodeSet {nx.graphic.Topology.NodeSet}
             * @param position {Object}
             * @method openNodeTooltip
             */
            openNodeSetTooltip: function (nodeSet, position) {
                var topo = this.topology();
                var nodeSetTooltip = this.nodeSetTooltip();
                var content;

                nodeSetTooltip.close(true);

                if (this.showNodeSetTooltip() === false) {
                    return;
                }


                var pos = position || this._getNodeAbsolutePosition(nodeSet);

                var contentClass = nx.path(global, this.nodeSetTooltipContentClass());
                if (contentClass) {
                    content = new contentClass();
                    content.sets({
                        topology: topo,
                        nodeSet: nodeSet,
                        model: topo.graph()
                    });
                }

                if (content) {
                    content.attach(nodeSetTooltip);
                }

                var size = nodeSet.getSize();

                nodeSetTooltip.open({
                    target: pos,
                    offset: Math.max(size.height, size.width) / 2
                });

                this.fire("openNodeSetToolTip", nodeSet);
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
                var content;

                linkTooltip.close(true);

                if (this.showLinkTooltip() === false) {
                    return;
                }

                var pos = position || link.centerPoint();

                var contentClass = nx.path(global, this.linkTooltipContentClass());
                if (contentClass) {
                    content = new contentClass();
                    content.sets({
                        topology: topo,
                        link: link,
                        model: topo.graph()
                    });
                }

                if (content) {
                    content.attach(linkTooltip);
                }

                linkTooltip.open({
                    target: pos,
                    offset: 4
                });

                this.fire("openLinkToolTip", link);
            },
            openLinkSetTooltip: function (linkSet, position) {
                var topo = this.topology();
                var linkSetTooltip = this.linkSetTooltip();
                var content;

                linkSetTooltip.close(true);

                if (this.showLinkSetTooltip() === false) {
                    return;
                }

                var pos = position || linkSet.centerPoint();

                var contentClass = nx.path(global, this.linkSetTooltipContentClass());
                if (contentClass) {
                    content = new contentClass();
                    content.sets({
                        topology: topo,
                        linkSet: linkSet,
                        model: topo.graph()
                    });
                }

                if (content) {
                    content.attach(linkSetTooltip);
                }

                linkSetTooltip.open({
                    target: pos,
                    offset: 4
                });


                this.fire("openLinkSetToolTip", linkSet);
            },
            closeAll: function () {
                this.tooltips().each(function (obj, name) {
                    obj.value.close(true);
                }, this);
            }
        }
    });


})(nx, nx.graphic.util, nx.global);