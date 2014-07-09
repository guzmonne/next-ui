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
                    var topo = this.topology();
                    var model = this.model();
                    if (this.model().activated()) {
                        return;
                    }
                    nx.each(model.vertices(), function (vertex, id) {
                        var node = topo.getNode(id);
                        if (node) {
                            nodes[id] = node;
                        }
                    });

                    nx.each(model.vertexSet(), function (vertexSet, id) {
                        var nodeSet = topo.getNode(id);
                        if (nodeSet) {
                            if (nodeSet.activated()) {
                                nodes[id] = nodeSet;
                            } else {
                                nx.extend(nodes, nodeSet.nodes());
                            }
                        }
                    });
                    return nodes;
                }
            },
            nodeSets: {
                get: function () {
                    var nodeSets = {};
                    var topo = this.topology();
                    var model = this.model();
                    model.eachSubVertexSet(function (vertexSet, id) {
                        var nodeSet = topo.getNode(id);
                        if (nodeSet) {
                            nodeSets[id] = nodeSet;
                        }
                    }, this);
                    return nodeSets;
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
                    this._updateMinusIcon(value);

                    if (this._labelVisible) {
                        this.view('label').set('visible', value > 0.4);
                    }
                }
            },
            animation: {
                value: true
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
                        y: 12
                    }
                },
                {
                    name: 'selectedBG',
                    type: 'nx.graphic.Circle',
                    props: {
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
                this.setBinding('activated', 'model.activated,direction=<>', this);
            },
            update: function () {
//                this.view().visible(this.model().activated() && this.model().inheritedVisible());
            },
            expand: function (isAnimation) {
                this._collapsed = false;
                if (isAnimation != null) {
                    this._animation = !!isAnimation;
                }
                this._expand();
            },
            collapse: function (isAnimation) {
                this._collapsed = true;
                if (isAnimation != null) {
                    this._animation = !!isAnimation;
                }
                this._collapse();
            },
            _expand: function () {
                this.selected(false);
                this.model().activated(false);
                this.fire('beforeExpandNode', this);
//                this.view().visible(false);

                this.topology().expandNodes(this.nodes(), this.position(), function () {
                    this.fire('expandNode', this);
                }, this, this._animation);

            },

            _collapse: function () {

                this.fire('beforeCollapseNode');

                this.topology().collapseNodes(this.nodes(), this.position(), function () {
                    this.model().activated(true);
//                    this.view().visible(true);
                    this.fire('collapseNode', this);
                }, this, this._animation);

            },

            expandNodes: function (callback, context) {
                if (!this.model().activated()) {
                    this.topology().expandNodes(this.nodes(), this.position(), callback, context);
                }
            },
            collapseNodes: function (callback, context) {
                this.topology().collapseNodes(this.nodes(), this.position(), callback, context);
            },
            _updateMinusIcon: function (revisionScale) {
                var icon = this.view('icon');
                var minus = this.view('minus');
                if (icon.showIcon()) {

                    if (revisionScale == 0.4) {
                        minus.scale(0.8);
                    } else {
                        minus.scale(1);
                    }

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