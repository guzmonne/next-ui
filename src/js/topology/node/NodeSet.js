(function (nx, global) {

    /**
     * NodeSet class
     * @class nx.graphic.Topology.NodeSet
     * @extend nx.graphic.Topology.Node
     * @module nx.graphic.Topology
     */

    nx.define("nx.graphic.Topology.NodeSet", nx.graphic.Topology.Node, {
        events: ['expandNode', 'collapseNode'],
        properties: {
            /**
             * Get all sub nodes
             */
            nodes: {
                value: function () {
                    return [];
                }
            },
            showIcon: {
                set: function (inValue) {
                    var value = this._processPropertyValue(inValue);
                    var icon = this.resolve('iconContainer');
                    var dot = this.resolve('dot');
                    if (value) {
                        icon.set('iconType', this.iconType());
                        icon.append();
                    } else {
                        icon.remove();
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
                        this.model().visible(value);
                        this.activated(value);
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
                            content: [
                                {
                                    name: 'icon',
                                    type: 'nx.graphic.Icon',
                                    props: {
                                        'class': 'icon',
                                        iconType: '{#iconType}'
                                    }
                                }
                            ]
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
                var nodesPositionMap = {};
                var position = this.position();
                this.set('visible', false);


                this.eachNode(function (node) {
                    nodesPositionMap[node.id()] = node.position();
                    node.position(position);
                }, this);
                this.eachNode(function (node) {
                    var position = nodesPositionMap[node.id()];
                    node.moveTo(position.x, position.y, null, true, 900);
                }, this);
                setTimeout(function () {
                    this.fire('expandNode', this);
                }.bind(this), 1200);
            },

            _collapse: function () {
                this.set('visible', true);
                this.fire('collapseNode');
            },

            /**
             * Iterate chi;ld nodes/nodeSet in this nodeSet
             * @method eachNode
             * @param callback
             * @param context
             */
            eachNode: function (callback, context) {
                var topo = this.topology();
                var vertices = this.model().vertices();
                var vertexSet = this.model().vertexSet();

                if (!callback) {
                    return;
                }
                nx.each(nx.extend({}, vertices, vertexSet), function (vertex) {
                    var node = topo.getNode(vertex.id());
                    if (node) {
                        callback.call(context || this, node);
                    }
                });

            },
            /**
             * Get all sub nodes
             * @method getNodes
             * @returns {Array}
             */
            getNodes: function () {
                var nodes = [];
                this.eachNode(function (node) {
                    nodes[nodes.length] = node;
                }, this);
                return nodes;
            },
            /**
             * Iterate all sub nodes in this node set
             * @method eachSunNode
             * @param callback
             * @param context
             */
            eachSunNode: function (callback, context) {
                if (!callback) {
                    return;
                }
                this.eachNode(function (node) {
                    if (nx.is(node, 'nx.graphic.Topology.NodeSet')) {
                        node.eachSunNode(callback, context);
                    } else {
                        callback.call(context || this, node);
                    }
                }, this);
            },
            /**
             * Get all sub nodes
             * @method getSubNodes
             * @returns {Array}
             */
            getSubNodes: function () {
                var nodes = [];
                this.eachSunNode(function (node) {
                    nodes[nodes.length] = node;
                }, this);
                return nodes;
            },
            /**
             * Get root parent node set
             * @returns {*}
             */
            getRootParentNodeSet: function () {
                var parentEdgeSet = this.model().getTopParentVertexSet();
                if (parentEdgeSet) {
                    return this.owner().getNode(parentEdgeSet.id());
                } else {
                    return null;
                }
            },
            getVisibleNodes: function () {
                var vertices = this.model().vertices();
                var layer = this.owner();
                var nodes = [];
                nx.each(vertices, function (vertex) {
                    var node = layer.getNode(vertex.id());
                    if (node instanceof  nx.graphic.Topology.NodeSet && !node.collapsed()) {
                        nodes = nodes.concat(node.getVisibleNodes());
                    } else {
                        nodes.push(node);
                    }
                });
                return nodes;
            },
            updateByMaxObtuseAngle: function (angle) {
                this.inherited(angle);
                var el = this.view("iconContainer");
                var size = this.view("icon").size();
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