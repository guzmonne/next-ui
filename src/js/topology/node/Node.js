(function (nx, util, global) {
    /**
     * Node class
     * @class nx.graphic.Topology.Node
     * @extend nx.graphic.Topology.AbstractNode
     */
    nx.define('nx.graphic.Topology.Node', nx.graphic.Topology.AbstractNode, {
        events: ['nodemousedown', 'nodemouseup', 'nodemouseenter', 'nodemouseleave', 'nodedragstart', 'nodedrag', 'nodedragend', 'nodeselected'],
        properties: {
            nodeScale: {
                value: 1
            },
            radius: {
                value: 4
            },
            iconType: {
                value: 'unknown'
            },
            fontSize: {
                value: 12
            },
            /**
             * Get node's label
             * @property text
             */
            label: {
                set: function (label) {
                    var el = this.resolve('label');
                    if (label !== undefined) {
                        el.set('text', label);
                        el.append();
                        this.calcLabelPosition();
                    } else {
                        el.remove();
                    }
                    this._label = label;
                }
            },
            labelVisible: {
                set: function (value) {
                    var el = this.resolve('label');
                    el.visible(value);
                    this._labelVisible = value;
                }
            },
            showIcon: {
                set: function (value) {
                    var icon = this.resolve('iconContainer');
                    var dot = this.resolve('dot');
                    if (value) {
                        icon.set('iconType', this.iconType());
                        icon.append();
                        dot.remove();
                    } else {
                        icon.remove();
                        dot.append();
                    }

                    this._showIcon = value;
                    this.calcLabelPosition();


                }
            },

            /**
             * Get/set node's selected statues
             * @property selected
             */
            selected: {
                get: function () {
                    return this._selected || false;
                },
                set: function (value) {
                    var el = this.resolve('selectedBG');
                    if (value) {
                        var radius;
                        if (this.showIcon()) {
                            var size = this.resolve('icon').size();
                            radius = Math.max(size.height, size.width) / 2;
                        } else {
                            radius = this._radius;
                        }
                        el.set('r', radius * 1.5);
                        el.append();
                    } else {
                        el.remove();
                    }

                    this._selected = value;

                    this.fire('nodeselected', value);
                }
            },
            color: {
                set: function (value) {
                    this.$('dot').setStyle('fill', value);
                    this.$('label').setStyle('fill', value);
                }
            },
            parentNodeSet: {
                get: function () {
//                    var parentVertexSet = this.model().parentVertexSet();
//                    if (parentVertexSet) {
//                        return this.owner().getNode(parentVertexSet.id());
//                    } else {
//                        return null;
//                    }

                }
            },
            useSmartLabel: {
                value: true
            }
        },
        view: {
            type: 'nx.graphic.Group',
            props: {
                translate: '{#position}',
                'node-x': '{#x}',
                'node-y': '{#y}',
                'class': 'node'
            },
            content: [
                {
                    type: 'nx.graphic.Group',
                    name: 'graphic',
                    props: {
                        scale: '{#nodeScale}'
                    },
                    content: [
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
                            content: {
                                name: 'icon',
                                type: 'nx.graphic.Icon',
                                props: {
                                    'class': 'icon',
                                    iconType: 'unknown'
                                }
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
                },
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
                }
            ]
        },
        methods: {
            setModel: function (model) {
                this.inherited(model);
            },
            setProperty: function (key, value) {
                var propValue;
                var rpatt = /(?={)\{([^{}]+?)\}(?!})/;
                if (value !== undefined) {
                    var model = this.model();
                    if (nx.is(value, 'Function')) {
                        propValue = value.call(this, model, this);
                    } else if (nx.is(value, 'String') && rpatt.test(value)) {
                        this.setBinding(key, 'model.' + RegExp.$1.slice(0), this);
                    } else {
                        propValue = value;
                    }
                    this.set(key, propValue);
                }
            },
            /**
             * Get node's size beside label
             * @returns {*}
             * @method getSize
             */
            getSize: function () {
                var showIcon = this.showIcon();
                var scale = this.nodeScale();
                if (showIcon) {
                    var size = this.resolve('icon').size();
                    return {
                        width: size.width * scale,
                        height: size.height * scale
                    };
                } else {
                    return {
                        width: this.radius() * scale * 2,
                        height: this.radius() * scale * 2
                    };
                }
            },
            _mousedown: function (sender, event) {
                this._prevPosition = this.position();
                event.captureDrag(this.resolve('graphic'));
                this.fire('nodemousedown', event);
            },
            _mouseup: function (sender, event) {
                var _position = this.position();
                if (_position.x === this._prevPosition.x && _position.y === this._prevPosition.y) {
                    this.fire('nodemouseup', event);
                }
            },
            _mouseenter: function (sender, event) {
                if (!this.__enter) {
                    this.fire('nodemouseenter', event);
                    this.__enter = true;
                }


            },
            _mouseleave: function (sender, event) {
                if (this.__enter) {
                    this.fire('nodemouseleave', event);
                    this.__enter = false;
                }
            },
            _dragstart: function (sender, event) {
                this.fire('nodedragstart', event);
            },
            _drag: function (sender, event) {
                this.fire('nodedrag', event);
            },
            _dragend: function (sender, event) {
                this.fire('nodedragend', event);
                this._updateConnectedNodeLabelPosition();
            },

            _updateConnectedNodeLabelPosition: function () {
                this.calcLabelPosition();
                this.eachConnectedNodes(function (node) {
                    node.calcLabelPosition();
                });
            },
            /**
             * Set label to a node
             * @method calcLabelPosition
             */
            calcLabelPosition: function () {
                if (this.useSmartLabel()) {
                    if (this._centralizedTextTimer) {
                        clearTimeout(this._centralizedTextTimer);
                    }
                    this._centralizedTextTimer = setTimeout(function () {
                        this._centralizedText();
                        //this._setHintPosition();
                    }.bind(this), 100);
                } else {
                    this.updateByMaxObtuseAngle(90);
                }
            },
            _centralizedText: function () {


                //
                var vertex = this.model();

                if (vertex === undefined) {
                    return;
                }

                var vectors = [];

                // get all lines

                vertex.eachDirectedEdge(function (edge) {
                    vectors.push(edge.line().dir);
                });

                vertex.eachReverseEdge(function (edge) {
                    vectors.push(edge.line().dir.negate());
                });


                //sort line by angle;
                vectors = vectors.sort(function (a, b) {
                    return a.circumferentialAngle() - b.circumferentialAngle();
                });


                // get the min incline angle

                var startVector = new nx.math.Vector(1, 0);
                var maxAngle = 0, labelAngle;

                if (vectors.length === 0) {
                    labelAngle = 90;
                } else {
                    //add first item to vectors, for compare last item with first

                    vectors.push(vectors[0].rotate(359.9));

                    //find out the max incline angle
                    for (var i = 0; i < vectors.length - 1; i++) {
                        var inclinedAngle = vectors[i + 1].circumferentialAngle() - vectors[i].circumferentialAngle();
                        if (inclinedAngle < 0) {
                            inclinedAngle += 360;
                        }
                        if (inclinedAngle > maxAngle) {
                            maxAngle = inclinedAngle;
                            startVector = vectors[i];
                        }
                    }

                    // bisector angle
                    labelAngle = maxAngle / 2 + startVector.circumferentialAngle();

                    // if max that 360, reduce 360
                    labelAngle %= 360;
                }


                this._labelAngle = labelAngle;
                this.updateByMaxObtuseAngle(labelAngle);
            },
            /**
             * @method updateByMaxObtuseAngle
             * @param angle
             */
            updateByMaxObtuseAngle: function (angle) {

                var el = this.resolve('label');

                // find out the quadrant
                var quadrant = Math.floor(angle / 60);
                var anchor = 'middle';
                if (quadrant === 5 || quadrant === 0) {
                    anchor = 'start';
                } else if (quadrant === 2 || quadrant === 3) {
                    anchor = 'end';
                }

                //
                var size = this.getSize();
                var radius = Math.max(size.width / 2, size.height / 2) + (this.showIcon() ? 12 : 8);
                var labelVector = new nx.math.Vector(radius, 0).rotate(angle);


                el.set('x', labelVector.x);
                el.set('y', labelVector.y);
                //

                el.set('text-anchor', anchor);

            }
        }
    });
})(nx, nx.graphic.util, nx.global);