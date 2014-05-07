(function (nx, global) {
    /**
     * Default Scene for topology
     * @class nx.graphic.Topology.DefaultScene
     * @extend nx.graphic.Topology.Scene
     */

    nx.define('nx.graphic.Topology.DefaultScene', nx.graphic.Topology.Scene, {
        events: [],
        methods: {
            /**
             * active scene
             * @method activate
             */

            activate: function () {
                this._topo = this.topology();
                this._nodesLayer = this._topo.getLayer('nodes');
                this._nodeSetLayer = this._topo.getLayer('nodeSet');
                this._linksLayer = this._topo.getLayer('links');
                this._linkSetLayer = this._topo.getLayer('linkSet');
                this._groupsLayer = this._topo.getLayer('groups');
                this._tooltipManager = this._topo.tooltipManager();
                this._nodeDragging = false;
                this._sceneTimer = null;
                this._interval = 600;
            },
            deactivate: function () {
                this._tooltipManager.closeAll();
            },
            dispatch: function (eventName, sender, data) {
                this._tooltipManager.executeAction(eventName, data);
            },
            pressStage: function (sender, event) {
            },
            clickStage: function (sender, event) {
                if (event.target == this._topo.stage().view().dom().$dom) {
                    this._topo.selectedNodes().clear();
                }
            },

            dragStageStart: function (sender, event) {
                var nodes = this._nodesLayer.nodes().length;
                if (nodes > 300) {
                    this._linksLayer.setStyle('display', 'none');
                }
                this._recover();
                this._blockEvent(true);
                nx.dom.Document.html().addClass('n-moveCursor');
            },
            dragStage: function (sender, event) {
                var stage = this._topo.stage();
                stage.applyTranslate(event.drag.delta[0], event.drag.delta[1]);
            },
            dragStageEnd: function (sender, event) {
                this._linksLayer.setStyle('display', 'block');
                this._blockEvent(false);
                nx.dom.Document.html().removeClass('n-moveCursor');
            },
            projectionChange: function () {

            },

            zoomstart: function () {
                var nodes = this._nodesLayer.nodes().length;
                if (nodes > 300) {
                    this._linksLayer.setStyle('display', 'none');
                }
                this._recover();
                //this._topo.adjustLayout();
            },
            zooming: function () {

            },
            zoomend: function () {
                this._linksLayer.setStyle('display', 'block');
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
                        this._topo.activeRelatedNode(node);
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
            dragNodeStart: function (sender, node) {
                this._nodeDragging = true;
                this._recover();
                this._blockEvent(true);
                nx.dom.Document.html().addClass('n-dragCursor');
            },
            dragNodeEnd: function () {
                this._nodeDragging = false;
                this._blockEvent(false);
                nx.dom.Document.html().removeClass('n-dragCursor');
            },

            pressNode: function (sender, node) {

            },
            clickNode: function (sender, node) {
                if (!this._nodeDragging) {
                    var selected = node.selected();
                    this._topo.selectedNodes().clear();
                    node.selected(!selected);
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

            updateNodeCoordinate: function () {

            },


            enterLink: function (sender, events) {
            },

            pressNodeSet: function (sender, nodeSet) {
            },
            clickNodeSet: function (sender, nodeSet) {
                clearTimeout(this._sceneTimer);
                this._recover();
                nodeSet.collapsed(!nodeSet.collapsed());
            },

            enterNodeSet: function (sender, nodeSet) {
                clearTimeout(this._sceneTimer);
                if (!this._nodeDragging) {
                    this._sceneTimer = setTimeout(function () {
                        this._topo.activeRelatedNode(nodeSet);
                    }.bind(this), this._interval);
                }
            },
            leaveNodeSet: function (sender, nodeSet) {
                clearTimeout(this._sceneTimer);
                if (!this._nodeDragging) {
                    this._recover();
                }
            },
            beforeExpandNodeSet: function (sender, nodeSet) {
                //update parent group
                var depth = 1;
                var parentNodeSet = nodeSet.parentNodeSet();
                while (parentNodeSet && parentNodeSet.group) {
                    var group = parentNodeSet.group;
                    group.nodes().clear();
                    group.nodes().addRange(nx.util.values(parentNodeSet.visibleSubNodes()));
                    parentNodeSet = parentNodeSet.parentNodeSet();

                    group.opacity(0.6 - depth * 0.2);
                    depth++;
                }
            },
            expandNodeSet: function (sender, nodeSet) {
                clearTimeout(this._sceneTimer);
                this._recover();
                this._topo.zoomByNodes(nodeSet.nodes(), function () {
                    var parentNodeSet = nodeSet.parentNodeSet();
                    while (parentNodeSet && parentNodeSet.group) {
                        parentNodeSet.group.draw();
                        parentNodeSet = parentNodeSet.parentNodeSet();
                    }
                    nodeSet.group = this._groupsLayer.addGroup({
                        shapeType: 'nodeSetPolygon',
                        nodeSet: nodeSet,
                        nodes: nx.util.values(nodeSet.visibleSubNodes()),
                        label: nodeSet.label()
                    });

                    this._topo.stage().resetZoomRate();

                }, this, 1.5);

                this._topo.adjustLayout();
            },
            beforeCollapseNodeSet: function (sender, nodeSet) {
                nodeSet.visible(true);
                var depth = 1;
                var parentNodeSet = nodeSet.parentNodeSet();
                while (parentNodeSet && parentNodeSet.group) {
                    var group = parentNodeSet.group;
                    group.nodes().clear();
                    group.nodes().addRange(nx.util.values(parentNodeSet.visibleSubNodes()));

                    parentNodeSet = parentNodeSet.parentNodeSet();

                    group.opacity(0.8 - depth * 0.2);
                    depth++;
                }
            },
            collapseNodeSet: function (sender, nodeSet) {
                if (nodeSet.group) {
                    this._groupsLayer.removeGroup(nodeSet.group);
                    delete  nodeSet.group;
                }
                this._topo.fit();

            },
            removeNodeSet: function (sender, nodeSet) {
                if (nodeSet.group) {
                    this._groupsLayer.removeGroup(nodeSet.group);
                    delete  nodeSet.group;
                }
            },
            updateNodeSet: function (sender, nodeSet) {
                if (nodeSet.group) {
                    nodeSet.group.nodes().clear();
                    nodeSet.group.nodes().addRange(nx.util.values(nodeSet.visibleSubNodes()));
                }

            },
            dragNodeSetStart: function (sender, nodeSet) {
                this._nodeDragging = true;
                this._recover();
                this._blockEvent(true);
                nx.dom.Document.html().addClass('n-dragCursor');
            },
            dragNodeSetEnd: function () {
                this._nodeDragging = false;
                this._blockEvent(false);
                nx.dom.Document.html().removeClass('n-dragCursor');
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

            addNode: function () {
                this._topo.adjustLayout();
            },
            addNodeSet: function () {
                this._topo.adjustLayout();
            },
            removeNode: function () {
                this._topo.adjustLayout();
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
            pressR: function () {
                if (nx.DEBUG) {
                    this._topo.activateLayout('force');
                }
            },
            pressA: function () {
                if (nx.DEBUG) {
                    var nodes = this._topo.selectedNodes().toArray();
                    this._topo.selectedNodes().clear();
                    this._topo.aggregationNodes(nodes);
                }
            },
            pressS: function () {
                if (nx.DEBUG) {
                    this._topo.activateScene('selection');
                }
            },
            pressM: function () {
                if (nx.DEBUG) {
                    this._topo.activateScene('default');
                }
            },
            pressF: function () {
                if (nx.DEBUG) {
                    this._topo.fit();
                }
            },
            topologyGenerated: function () {
                this._topo.adjustLayout();
            },
            _recover: function () {
                this._topo.fadeIn();
                this._topo.recoverActive();
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
})(nx, nx.global);