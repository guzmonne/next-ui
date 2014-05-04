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
            showIcon: {
                set: function (inValue) {
                    var value = this._processPropertyValue(inValue);
                    var icon = this.view('iconContainer');
                    var dot = this.view('dot');
                    if (value) {
                        icon.set('iconType', this.iconType());
                        icon.append();
                        icon.visible(true);
                    } else {
                        icon.remove();
                        icon.visible(false);
                    }

                    this._showIcon = value;
                    this.calcLabelPosition();
                }
            },
            color: {
                set: function (inValue) {
                    var value = this._processPropertyValue(inValue);
                    this.$('dot').setStyle('stroke', value);
                    this.$('line1').setStyle('fill', value);
                    this.$('line2').setStyle('fill', value);
                    this.$('label').setStyle('fill', value);
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
            revisionScale: {
                set: function (value) {
                    var topo = this.topology();
                    var radius = 6;
                    if (value == 0.6) {
                        radius = 4;
                    } else if (value <= 0.4) {
                        radius = 2;
                    }
                    if (topo.showIcon()) {
                        this.showIcon(value == 1);
                    }
                    //this.radius(radius);
                    this.view('label').set('visible', value > 0.4);
                }
            },
            rootParentNodeSet: {
                get: function () {
                    var parentEdgeSet = this.model().getRootParentVertexSet();
                    if (parentEdgeSet) {
                        return this.owner().getNode(parentEdgeSet.id());
                    } else {
                        return null;
                    }
                }
            }
        },
        view: {
            type: 'nx.graphic.Group',
            props: {
                translate: '{#position}',
                'class': 'node nodeset'
            },
            content: [
                {
                    name: 'label',
                    type: 'nx.graphic.Text',
                    props: {
                        'class': 'node-label',
                        'alignment-baseline': 'central',
                        x: 0,
                        y: 12,
                        'font-size': '{#fontSize}'
                    }
                },
                {
                    name: 'disableLabel',
                    type: 'nx.graphic.Text',
                    props: {
                        'class': 'node-disable-label',
                        'alignment-baseline': 'central',
                        x: 12,
                        y: 12,
                        'font-size': '{#fontSize}'
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
                    props: {
                        scale: '{#scale}'
                    },
                    content: [
                        {
                            name: 'iconContainer',
                            type: 'nx.graphic.Group',
                            props: {
                                visible: false
                            }
                        },
                        {
                            type: "nx.graphic.Group",
                            props: {
                                'class': 'icon'
                            },
                            content: [
                                {
                                    name: 'dot',
                                    type: 'nx.graphic.Circle',
                                    props: {
                                        r: '7',
                                        x: 0,
                                        y: 0,
                                        'class': 'dot'
                                    }
                                },
                                {
                                    name: 'line1',
                                    type: 'nx.graphic.Rect',
                                    props: {
                                        translateX: -5,
                                        translateY: -0.5,
                                        width: 10,
                                        height: 1,
                                        'class': 'bg'
                                    }
                                },
                                {
                                    name: 'line2',
                                    type: 'nx.graphic.Rect',
                                    props: {
                                        translateX: -0.5,
                                        translateY: -5,
                                        width: 1,
                                        height: 10,
                                        'class': 'bg'
                                    }
                                }
                            ]
                        }
                    ],
                    events: {
                        'mousedown': '{#_mousedown}',
                        'mouseup': '{#_mouseup}',
                        'touchstart': '{#_mousedown}',
                        'touchend': '{#_mouseup}',

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


                this.eachNode(function (node) {
                    var _position = node.position();
                    node.position(position);
                    node.parentNodeSet(this);
                    node.moveTo(_position.x, _position.y, null, true, 600);
                }, this);
                setTimeout(function () {
                    this.fire('expandNode', this);
                }.bind(this), 600);
            },

            _collapse: function (fn) {
                var positionMap = {};
                var position = this.position();
                var graph = topo.graph();


                this.eachVisibleSubNode(function (node) {
                    positionMap[node.model().id()] = node.model().position();
                    node.moveTo(position.x, position.y, null, true, 600);
                }, this);
                setTimeout(function () {
                    this.visible(true);
                    this.activated(true);
                    this.fire('beforeCollapseNode');
                    nx.each(positionMap, function (position, id) {
                        var vertex = graph.getVertex(id) || graph.getVertexSet(id);
                        if (vertex) {
                            vertex.position(position);
                        }
                    });
                    this.fire('collapseNode');
                }.bind(this), 600);
            },

            /**
             * Iterate chi;ld nodes/nodeSet in this nodeSet
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
            updateByMaxObtuseAngle: function (angle) {
                this.inherited(angle);
                var el = this.view("iconContainer");
                var size = this._iconImg ? this._iconImg.size() : {widtg: 0, height: 0};
                var radius = this.showIcon() ? Math.max(size.width / 2, size.height / 2) + (this.showIcon() ? 12 : 8) : 12;
                var labelVector = new nx.geometry.Vector(radius, 0).rotate(angle);
                el.setTransform(labelVector.x, labelVector.y);
                var labelEL = this.view("label");

                radius = (radius - 10) * 2 + 12;
                labelVector = new nx.geometry.Vector(radius, 0).rotate(angle);
                labelEL.sets({
                    x: labelVector.x,
                    y: labelVector.y
                });

            }
        }

    });

})(nx, nx.global);