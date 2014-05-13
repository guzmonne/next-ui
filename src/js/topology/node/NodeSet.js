(function (nx, global) {

    /**
     * NodeSet class
     * @class nx.graphic.Topology.NodeSet
     * @extend nx.graphic.Topology.Node
     * @module nx.graphic.Topology
     */

    nx.define("nx.graphic.Topology.NodeSet", nx.graphic.Topology.Node, {
        events: ['expandNode', 'collapseNode', 'beforeExpandNode', 'beforeCollapseNode'],
        properties: {
            /**
             * Get all sub nodes
             */
            nodes: {
                get: function () {
                    var nodes = {};
                    this.eachNode(function (node, id) {
                        nodes[id] = node;
                    }, this);
                    return nodes;
                }
            },
            subNodes: {
                get: function () {
                    var nodes = {};
                    this.eachSubNode(function (node, id) {
                        nodes[id] = node;
                    }, this);
                    return nodes;
                }
            },
            visibleSubNodes: {
                get: function () {
                    var nodes = {};
                    this.eachVisibleSubNode(function (node, id) {
                        nodes[id] = node;
                    }, this);
                    return nodes;
                }
            },
            /**
             * Collapsed statues
             * @property collapsed
             */
            collapsed: {
                get: function () {
                    return this._collapsed !== undefined ? this._collapsed : true;
                },
                set: function (inValue) {
                    var value = this._processPropertyValue(inValue);
                    if (this._collapsed !== value) {
                        this._collapsed = value;
                        if (value) {
                            this._collapse();
                        } else {
                            this._expand();
                        }
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            activated: {
                value: true
            },
            rootParentNodeSet: {
                get: function () {
                    var parentEdgeSet = this.model().getRootParentVertexSet();
                    if (parentEdgeSet) {
                        return this.topology().getNode(parentEdgeSet.id());
                    } else {
                        return null;
                    }
                }
            },
            /**
             * Show/hide node's icon
             * @property showIcon
             */
            showIcon: {
                set: function (inValue) {
                    var value = this._processPropertyValue(inValue);
                    this._showIcon = value;

                    this.view('icon').set('showIcon', value);
                    this.view('icon').set('visible', value);

                    if (this._label != null) {
                        this.calcLabelPosition();
                    }
                    if (this._selected) {
                        this.view('selectedBG').set('r', this.selectedRingRadius());
                    }

                    this._updateMinusIcon();
                }
            },
            revisionScale: {
                set: function (value) {
                    var topo = this.topology();
                    var icon = this.view('icon');
                    icon.set('scale', value);
                    if (topo.showIcon()) {
                        icon.showIcon(value > 0.2);
                        icon.set('visible', value > 0.2);
                    } else {
                        icon.showIcon(false);
                        icon.set('visible', false);
                    }
                    this._updateMinusIcon();
                    this.view('label').set('visible', value > 0.4);
                }
            }
        },
        view: {
            type: 'nx.graphic.Group',
            props: {
                'class': 'node'
            },
            content: [
                {
                    name: 'label',
                    type: 'nx.graphic.Text',
                    props: {
                        'class': 'node-label',
                        'alignment-baseline': 'central',
                        x: 0,
                        y: 12
                    }
                },
                {
                    name: 'selectedBG',
                    type: 'nx.graphic.Circle',
                    props: {
                        x: 0,
                        y: 0,
                        'class': 'selectedBG'
                    }
                },
                {
                    type: 'nx.graphic.Group',
                    name: 'graphic',
                    content: [
                        {
                            name: 'icon',
                            type: 'nx.graphic.Icon',
                            props: {
                                'class': 'icon',
                                'iconType': 'unknown',
                                'showIcon': false,
                                scale: 1
                            }
                        },
                        {
                            name: 'minus',
                            type: 'nx.graphic.Icon',
                            props: {
                                'class': 'indicator',
                                'iconType': 'expand',
                                scale: 1
                            }
                        }
                    ],
                    events: {
                        'mousedown': '{#_mousedown}',
                        'mouseup': '{#_mouseup}',

                        'mouseenter': '{#_mouseenter}',
                        'mouseleave': '{#_mouseleave}',

                        'dragstart': '{#_dragstart}',
                        'dragmove': '{#_drag}',
                        'dragend': '{#_dragend}'
                    }
                }


            ]
        },
        methods: {
            setModel: function (model) {
                this.inherited(model);
                //init
                this._activated = model.activated();
                //set binding
                this.setBinding('activated', 'model.activated,direction=<>', this);
            },
            _expand: function () {
                var position = this.position();

                this.visible(false);
                this.activated(false);

                this.fire('beforeExpandNode', this);


                var queueCounter = 0;
                var nodeLength = 0;
                var finish = function () {
                    if (queueCounter == nodeLength) {
                        this.fire('expandNode', this);
                    }
                }.bind(this);


                this.eachNode(function (node) {
                    var _position = node.position();
                    node.position(position);
                    node.parentNodeSet(this);
                    node.moveTo(_position.x, _position.y, function () {
                        queueCounter++;
                        finish();
                    }, true, 600);
                    nodeLength++;
                }, this);
            },

            _collapse: function (fn) {
                var positionMap = {};
                var position = this.position();
                var topo = this.topology();
                var graph = topo.graph();


                var queueCounter = 0;
                var nodeLength = 0;
                var finish = function () {
                    if (queueCounter == nodeLength) {
                        this.visible(true);
                        this.activated(true);


                        nx.each(positionMap, function (position, id) {
                            var vertex = graph.getVertex(id) || graph.getVertexSet(id);
                            if (vertex) {
                                vertex.position(position);
                            }
                        });
                        this.fire('collapseNode');
                    }
                }.bind(this);


                this.eachVisibleSubNode(function (node) {
                    nodeLength++;
                    positionMap[node.model().id()] = node.model().position();
                    node.moveTo(position.x, position.y, function () {
                        queueCounter++;
                        finish();
                    }, true, 600);

                }, this);

                this.fire('beforeCollapseNode');
            },

            /**
             * Iterate child nodes/nodeSet in this nodeSet
             * @method eachNode
             * @param callback
             * @param context
             */
            eachNode: function (callback, context) {
                var topo = this.topology();
                this.model().eachVertex(function (vertex, id) {
                    var node = topo.getNode(id);
                    if (node) {
                        callback.call(context || this, node, id);
                    }
                }, this);
            },
            /**
             * Iterate all sub nodes in this node set
             * @method eachSunNode
             * @param callback
             * @param context
             */
            eachSubNode: function (callback, context) {
                var topo = this.topology();
                this.model().eachSubVertex(function (vertex, id) {
                    var node = topo.getNode(id);
                    if (node) {
                        callback.call(context || this, node, id);
                    }
                }, this);
            },
            eachVisibleSubNode: function (callback, context) {
                var topo = this.topology();
                var vertices = this.model().visibleSubVertices();
                nx.each(vertices, function (vertex, id) {
                    var node = topo.getNode(vertex.id());
                    if (node) {
                        callback.call(context || this, node, id);
                    }
                });
            },
            _updateMinusIcon: function () {
                var icon = this.view('icon');
                var minus = this.view('minus');
                if (icon.showIcon()) {
                    var iconSize = icon.size();
                    var iconScale = icon.scale();
                    minus.setTransform(iconSize.width * iconScale / 2, iconSize.height * iconScale / 2);
                } else {
                    minus.setTransform(0, 0);
                }
            }
        }

    });

})(nx, nx.global);