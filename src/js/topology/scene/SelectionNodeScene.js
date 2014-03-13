(function (nx, global) {

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
            pressStage: function () {
                var selectedNodes = this.selectedNodes();
                var multi = this._multi = event.metaKey || event.ctrlKey;
                if (!multi) {
                    selectedNodes.clear();
                }
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
                        var bound = node.getIconBound();
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


            pressNode: function (sender, node) {
                if (node.enable()) {
                    var selectedNodes = this.selectedNodes();
                    var multi = this._multi = event.metaKey || event.ctrlKey;
                    if (!this._multi) {
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

})(nx, nx.global);