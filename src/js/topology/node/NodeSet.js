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
                    if (this.activated()) {
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
                    if (this.activated()) {
                        return;
                    }
                    nx.each(model.vertexSet(), function (vertexSet, id) {
                        var nodeSet = topo.getNode(id);
                        if (nodeSet) {
                            if (nodeSet.activated()) {
                                nodeSets[id] = nodeSet;
                            } else {
                                nx.extend(nodeSets, nodeSet.nodeSets());
                            }
                        }
                    });
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
                    this._updateMinusIcon();

                    if (this._labelVisible) {
                        this.view('label').set('visible', value > 0.4);
                    }
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
                this.view().visible(this.activated() && this.model().inheritedVisible());
            },
            expand: function (isAnimation) {

            },
            collapse: function (isAnimation) {

            },
            _expand: function () {
                var position = this.position();
                this.view().visible(false);
                this.activated(false);
                var nodes = this.nodes();
                var nodeLength = nx.util.keys(nodes).length;


                if (nodeLength > 50 || nodeLength === 0 || !topo.enableNodeSetAnimation()) {
                    this.fire('beforeExpandNode', this);
                    this.fire('expandNode', this);
                } else {
                    var queueCounter = 0;
                    var finish = function () {
                        if (queueCounter == nodeLength) {
                            this.fire('expandNode', this);
                        }
                    }.bind(this);

                    nx.each(this.nodes(), function (node) {
                        var _position = node.position();
                        node.position(position);
                        node.moveTo(_position.x, _position.y, function () {
                            queueCounter++;
                            finish();
                        }, true, 600);
                    }, this);
                    this.fire('beforeExpandNode', this);
                }
            },

            _collapse: function (fn) {
                var positionMap = {};
                var position = this.position();
                var topo = this.topology();
                var graph = topo.graph();
                var nodes = this.nodes();
                var nodeLength = nx.util.keys(nodes).length;


                if (nodeLength > 50) {
                    this.view().visible(true);
                    this.activated(true);
                    this.fire('beforeCollapseNode');
                    this.fire('collapseNode');
                } else {
                    var queueCounter = 0;
                    var finish = function () {
                        if (queueCounter == nodeLength) {
                            this.view().visible(true);
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

                    nx.each(this.nodes(), function (node) {
                        positionMap[node.model().id()] = node.model().position();
                        node.moveTo(position.x, position.y, function () {
                            queueCounter++;
                            finish();
                        }, true, 600);

                    }, this);

                    this.fire('beforeCollapseNode');
                }
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