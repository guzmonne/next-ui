(function (nx, util, global) {

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
            links: {
                value: function () {
                    return [];
                }
            },
            showIcon: {
                set: function (value) {
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
                set: function (value) {
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
                    return this._collapsed !== undefined ? this._collapsed : null;
                },
                set: function (value) {
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
                                        r: '{#radius}',
                                        x: 0,
                                        y: 0,
                                        'class': 'dot'
                                    }
                                },
                                {
                                    name: 'line1',
                                    type: 'nx.graphic.Rect',
                                    props: {
                                        translateX: -3,
                                        translateY: -0.5,
                                        width: 6,
                                        height: 1,
                                        'class': 'bg'
                                    }
                                },
                                {
                                    name: 'line2',
                                    type: 'nx.graphic.Rect',
                                    props: {
                                        translateX: -0.5,
                                        translateY: -3,
                                        width: 1,
                                        height: 6,
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
                this._collapsed = model._activated;
                this.setBinding('collapsed', 'model.activated,direction=<>', this);
            },
            /**
             * Expand nodeSet
             * @method expand
             */
            expand: function () {
                this.collapsed(false);
            },
            /**
             * Collapse nodeSet
             * @method collapse
             */
            collapse: function () {
                this.collapsed(true);
            },
            _expand: function () {

                this._originalVerteicesPosition = {};

                var vertices = this.model().vertices();

                nx.each(vertices, function (vertex) {
                    var postion = this.model().position();
                    this._originalVerteicesPosition[vertex.id()] = vertex.position();
                    vertex.position(postion);
                }, this);


                this.remove();


                setTimeout(function () {
                    var topo = this.topology();
                    nx.each(this.getNodes(), function (node) {
                        var position = topo.getProjectedPosition(this._originalVerteicesPosition[node.id()]);
                        node.moveTo(position.x, position.y, null, true, 300);
                    }, this);

//                    setTimeout(topo.fit.bind(topo), 1000);

                    this.fire('expandNode', this);

                }.bind(this), 0);
            },

            _collapse: function () {
                this.append();
                this.fire('collapseNode');
            },

            /**
             * Get all sub nodes
             * @returns {Array}
             */
            getNodes: function () {
                var vertices = this.model().vertices();
                var topo = this.topology();
                var nodes = [];

                nx.each(vertices, function (vertex) {
                    nodes.push(topo.getNode(vertex.id()));
                });

                return nodes;
            },
            getAllLeafNodes: function () {
                var vertices = this.model().vertices();
                var layer = this.owner();
                var nodes = [];

                nx.each(vertices, function (vertex) {
                    var node = layer.getNode(vertex.id());
                    if (node instanceof  nx.graphic.Topology.NodeSet) {
                        nodes = nodes.concat(node.getLeafNodes());
                    } else {
                        nodes.push(node);
                    }
                });
                return nodes;
            },
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
                if (this.showIcon()) {
                    var el = this.resolve("iconContainer");
                    var size = this.resolve("icon").size();
                    var radius = Math.max(size.width / 2, size.height / 2) + (this.showIcon() ? 12 : 8);
                    var labelVector = new nx.math.Vector(radius, 0).rotate(angle);
                    el.setTransform(labelVector.x, labelVector.y);
                    var labelEL = this.resolve("label");

                    radius = (radius - 10) * 2 + 12;
                    labelVector = new nx.math.Vector(radius, 0).rotate(angle);
                    labelEL.sets({
                        x: labelVector.x,
                        y: labelVector.y
                    });
                }
            }
        }

    });

})(nx, nx.util, nx.global);