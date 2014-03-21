(function (nx, util, global) {


    nx.define("nx.graphic.Topology.NodeSet", nx.graphic.Topology.Node, {
        events: ['expandNodeSet', 'collapseNodeSet'],
        properties: {
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
                        scale: '{#nodeScale}'
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
                            name: "plus",
                            type: "nx.graphic.Text",
                            props: {
                                text: "+",
                                x: -4,
                                y: 4,
                                'class': "plusIcon",
                                //visible: "{#showIcon,converter=inverted}",
                                visible: false
                            }
                        },
                        {
                            name: 'plusIcon',
                            type: "nx.graphic.Icon",
                            props: {
                                'class': 'icon',
                                iconType: 'expand'
                            }
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
            expand: function () {
                this.collapsed(false);
            },
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

                    this.fire('expandNodeSet', this);

                }.bind(this), 0);
            },

            _collapse: function () {
                this.append();
                this.fire('collapseNodeSet');
            },

            /**
             * Get all sun nodes
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
                this.updateByMaxObtuseAngle.__super__.apply(this, arguments);
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