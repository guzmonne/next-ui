(function (nx, global) {

    nx.define("ENC.TW.ViewModel.TopologyVM", nx.Observable, {
        events: [],
        properties: {
            MVM: {
                watcher: function (prop, value) {
                    if (value) {
                        this.data().MVM(value);
                        this.event().MVM(value);
                        this.view().MVM(value);
                    }
                }
            },
            data: {
                value: function () {
                    return new ENC.TW.ViewModel.TopologyVM.Data();
                }
            },
            event: {
                value: function () {
                    return new ENC.TW.ViewModel.TopologyVM.Event();
                }
            },
            view: {
                value: function () {
                    return new ENC.TW.ViewModel.TopologyVM.View();
                }
            },
            status: {
                watcher: function (prop, value) {
                    if (this.MVM()) {
                        //generated
                        this.MVM().status().topologyGenerated(value == "generated");
                        this.MVM().status().topologyCleared(value == "generated");
                        if (value == 'generated') {
                            this._expandLastOpenedNodeSet();
                        }
                        if (value == "cleared") {
                            this._saveLastOpenedNodeSet();
                        }
                    }
                }
            },
            openedNodeSetIDs: {
                value: function () {
                    return []
                }
            },
            topology: {
                get: function () {
                    return this.MVM().topology();
                }
            }
        },
        methods: {
            expandAll: function () {
                var topo = this.topology();
                var nodeSetLayer = topo.getLayer('nodeSet');
                console.time('expandAll');
                var fn = function (callback) {
                    var isFinished = true;
                    nodeSetLayer.eachNodeSet(function (nodeSet) {
                        if (nodeSet.visible()) {
                            nodeSet.animation(false);
                            nodeSet.collapsed(false);
                            isFinished = false;
                        }
                    });
                    if (!isFinished) {
                        fn(callback);
                    } else {
                        callback();
                    }
                };

                topo.showLoading();

                setTimeout(function () {
                    fn(function () {

                        nodeSetLayer.eachNodeSet(function (nodeSet) {
                            nodeSet.animation(true);
                        });
                        topo.stage().resetFitMatrix();
                        topo.hideLoading();
                        topo.fit(function () {
                            topo.blockEvent(false);
                            console.timeEnd('expandAll');
                        }, this);
                    }.bind(this));
                }.bind(this), 100);

            },
            locateNode: function (id, isHighlight) {
                var topo = this.topology();
                var vertex = topo.graph().getVertex(id);
                if (vertex) {
                    var node = topo.getNode(id);
                    if (!node) {
                        var generatedRootVertexSet = vertex.generatedRootVertexSet();
                        while (generatedRootVertexSet) {
                            this.expandNodeSet(generatedRootVertexSet.id());
                            generatedRootVertexSet = vertex.generatedRootVertexSet();
                        }
                        topo.stage().resetFitMatrix();
                        topo.fit(null, null, false);
                        node = topo.getNode(id);
                    }
//                    topo.zoomByNodes([node]);
                    if (isHighlight !== false) {
                        topo.fadeOut(true);
                        topo.highlightedNodes([node]);
                    }
                }
            },
            locateNodeSet: function (id, isCollapse) {
                var topo = this.topology();
                var vertex = topo.graph().getVertexSet(id);
                if (vertex) {
                    var nodeSet = topo.getNode(id);
                    if (!nodeSet) {
                        var generatedRootVertexSet = vertex.generatedRootVertexSet();
                        while (generatedRootVertexSet) {
                            this.expandNodeSet(generatedRootVertexSet.id());
                            generatedRootVertexSet = vertex.generatedRootVertexSet();
                        }
                        topo.stage().resetFitMatrix();
                        topo.fit(null, null, false);
                        nodeSet = topo.getNode(id);
                    }
                    if (isCollapse !== false) {
                        this.expandNodeSet(id);
                    }
                }
            },
            expandNodeSet: function (id) {
                var topo = this.topology();
                var nodeSet = topo.getNode(id);
                if (nodeSet && nodeSet.visible()) {
                    nodeSet.animation(false);
                    nodeSet.collapsed(false);
                    nodeSet.animation(true);
                    topo.blockEvent(false);
                }
            },
            highlightedNodes: function (ids) {
                var topo = this.topology();
                topo.fadeOut(true);
                topo.highlightedNodes(ids);
            },
            recoverHighlighted: function () {
                var topo = this.topology();
                topo.fadeIn(true);
                topo.recoverHighlight();
            },
            adapt: function () {
                var topo = this.topology();
                if (topo) {
                    if (this._adaptTimer) {
                        clearTimeout(this._adaptTimer);
                    }
                    this._adaptTimer = setTimeout(function () {
                        topo.adaptToContainer();
                    }.bind(this), 300);
                }
            },
            highlightNodeSetGroup: function (id) {
                var topo = this.topology();
                var ns = topo.getNode(id);
                var groupsLayer = topo.getLayer('groups');
                var group = groupsLayer.getGroup(id);
                if (group) {
                    topo.activeNodes(nx.util.values(ns.nodes()));
                    topo.fadeOut();
                    groupsLayer.fadeOut();
                    groupsLayer.getGroup(id).dom().addClass('fade-active-item');
                }
            },
            recoverHighlightNodeSetGroup: function (id) {
                var topo = this.topology();
                var groupsLayer = topo.getLayer('groups');
                var group = groupsLayer.getGroup(id);
                if (group) {
                    topo.fadeIn();
                    topo.recoverActive();
                    groupsLayer.getGroup(id).dom().removeClass('fade-active-item');
                }
            },
            _saveLastOpenedNodeSet: function () {
                var topo = this.topology();
                var vertexSets = topo._graph.vertexSets();
                var openedNodeSetIDs = this._openedNodeSetIDs;
                var _closedNodeSets = [];
                nx.each(vertexSets, function (item, key) {
                    var vertexSet = item.value();
                    if (vertexSet.generated()) {
                        if (!vertexSet.activated()) {
                            openedNodeSetIDs.push(key);
                        } else {
                            _closedNodeSets.push(key);
                            _closedNodeSets = _closedNodeSets.concat(Object.keys(vertexSet.subVertexSet()));
                        }
                    }
                });

                nx.each(_closedNodeSets, function (id) {
                    if (openedNodeSetIDs.indexOf(id) !== -1) {
                        openedNodeSetIDs.splice(openedNodeSetIDs.indexOf(id), 1);
                    }

                });
            },
            showHost: function (boolean) {
                var topo = this.topology();
                var graph = topo.graph();
                graph.eachVertex(function (vertex) {
                    if (vertex.get('role') == 'host') {
                        vertex.visible(!!boolean);
                    }
                });
                topo.stage().resetFitMatrix();
                topo.fit();
            },
            selectNode: function (id, boolean) {
                var topo = this.topology();
                var node = topo.getNode(id);
                if (node) {
                    if (boolean !== undefined) {
                        node.selected(!!boolean);
                    }
                    return node.selected();
                } else {
                    return false;
                }
            },
            switchLayout: function (id) {
                var topo = this.topology();
                topo.showLoading();
                setTimeout(function () {
                    this.MVM().topoDataModel().layout(id);
                }.bind(this), 0)

            },
            _expandLastOpenedNodeSet: function () {
                var openedNodeSetIDs = this._openedNodeSetIDs;
                nx.each(openedNodeSetIDs, function (id) {
                    this.locateNodeSet(id);
                }, this);
                topo.stage().resetFitMatrix();
                topo.fit(null, null, false);
            }
        }
    });
})(nx, nx.global);