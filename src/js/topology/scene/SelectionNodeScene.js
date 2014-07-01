(function (nx, global) {

    /**
     * Selection node scene
     * @class nx.graphic.Topology.SelectionNodeScene
     * @extend nx.graphic.Topology.SelectionScene
     */

    nx.define('nx.graphic.Topology.SelectionNodeScene', nx.graphic.Topology.SelectionScene, {
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
                var tooltipManager = this._tooltipManager;
                tooltipManager.activated(false);
            },
            deactivate: function () {
                this.inherited();
                var tooltipManager = this._tooltipManager;
                tooltipManager.activated(true);
            },

            pressStage: function (sender, event) {
                var selectedNodes = this.selectedNodes();
                var multi = this._multi = event.metaKey || event.ctrlKey;
                if (!multi) {
                    selectedNodes.clear();
                }

                event.captureDrag(sender.stage().view());
            },
            enterNode: function () {

            },
            clickNode: function (sender, node) {
            },
            dragStageStart: function (sender, event) {
                this.inherited(sender, event);
                var selectedNodes = this.selectedNodes();
                var multi = this._multi = event.metaKey || event.ctrlKey;
                if (!multi) {
                    selectedNodes.clear();
                }
                this._prevSelectedNodes = this.selectedNodes().toArray().slice();
                var bounds = this.bounds = [];
                this.topology().eachNode(function (node) {
                    if (node.enable()) {
                        var bound = node.getBound(true);
                        bounds.push({
                            bound: bound,
                            node: node
                        });
                    }
                }, this);
            },
            dragStage: function (sender, event) {
                this.inherited(sender, event);
                this.selectNodeByRect(this.rect.getBound());
            },
            selectNode: function (sender, node) {
                if (node.selected()) {
                    this._topo.selectedNodes().add(node);
                } else {
                    this._topo.selectedNodes().remove(node);
                }
            },
            selectNodeSet: function (sender, nodeset) {
                if (nodeset.selected()) {
                    this._topo.selectedNodes().add(nodeset);
                } else {
                    this._topo.selectedNodes().remove(nodeset);
                }
            },


            pressNode: function (sender, node) {
                if (node.enable()) {
                    var selectedNodes = this.selectedNodes();
                    this._multi = event.metaKey || event.ctrlKey;
                    if (!this._multi) {
                        selectedNodes.clear();
                    }
                    node.selected(!node.selected());
                }
            },
            pressNodeSet: function (sender, nodeSet) {
                if (nodeSet.enable()) {
                    var selectedNodes = this.selectedNodes();
                    this._multi = event.metaKey || event.ctrlKey;
                    if (!this._multi) {
                        selectedNodes.clear();
                    }
                    nodeSet.selected(!nodeSet.selected());
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
                        if (this._multi) {
                            if (this._prevSelectedNodes.indexOf(node) == -1) {
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
            _hittest: function (sourceBound, targetBound) {
                var t = targetBound.top >= sourceBound.top && targetBound.top <= ((sourceBound.top + sourceBound.height)),
                    l = targetBound.left >= sourceBound.left && targetBound.left <= (sourceBound.left + sourceBound.width),
                    b = (sourceBound.top + sourceBound.height) >= (targetBound.top + targetBound.height) && (targetBound.top + targetBound.height) >= sourceBound.top,
                    r = (sourceBound.left + sourceBound.width) >= (targetBound.left + targetBound.width) && (targetBound.left + targetBound.width) >= sourceBound.left,
                    hm = sourceBound.top >= targetBound.top && (sourceBound.top + sourceBound.height) <= (targetBound.top + targetBound.height),
                    vm = sourceBound.left >= targetBound.left && (sourceBound.left + sourceBound.width) <= (targetBound.left + targetBound.width);

                return (t && l) || (b && r) || (t && r) || (b && l) || (t && vm) || (b && vm) || (l && hm) || (r && hm);
            }
        }
    });

})(nx, nx.global);