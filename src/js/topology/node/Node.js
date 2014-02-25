(function (nx, util, global) {
    /**
     * Node class
     * @class nx.graphic.Topology.Node
     * @extend nx.graphic.Topology.AbstractNode
     */
    nx.define("nx.graphic.Topology.Node", nx.graphic.Topology.AbstractNode, {
        /**
         * @event mouseup
         */
        /**
         * @event mouseleave
         */
        /**
         * @event mouseenter
         */
        /**
         * @event dragstart
         */
        /**
         * @event drag
         */
        /**
         * @event dragend
         */
        events: ['mouseup', 'mouseleave', 'mouseenter', 'dragstart', 'drag', 'dragend', 'mousedown', 'hide', 'show'],
        properties: {
            /**
             * Get dot's radius
             * @property dotRadius
             */
            dotRadius: {
                value: 5
            },
            ringRadius: {
                get: function () {
                    var radius = 0;
                    if (this.selected() && this.enable()) {
                        var size = this.getSize();
                        radius = Math.min(size.height, size.width) * 0.75;
                    }
                    return radius;
                }
            },
            /**
             * Get node's iconType
             * @property iconType
             */
            iconType: {
                get: function () {
                    return this._iconType || 'unknown';
                },
                set: function (value) {
                    var type = value;
                    var model = this.model();
                    if (value) {
                        if (nx.is(value, 'Function')) {
                            type = value.call(this, model, this);
                        } else if (model.get(value) !== undefined) {
                            type = model.get(value);
                        }
                    }
                    this._iconType = type;
                }
            },
            /**
             * Get node's label
             * @property text
             */
            label: {
                get: function () {
                    return this._label;
                },
                set: function (value) {
                    var label = value;
                    var model = this.model();
                    var el = this.resolve("label");
                    if (value) {
                        if (nx.is(value, 'Function')) {
                            label = value.call(this, model, this);
                        } else if (model.get(value) !== undefined) {
                            label = model.get(value);
                        }
                    }

                    if (label !== undefined) {
                        el.set("text", label);
                        el.append();
                        this.calcLabelPosition();
                    } else {
                        el.remove();
                    }
                    this._label = label;
                }
            },
            /**
             * Get/set icon's show icon status
             * @property showIcon
             */
            showIcon: {
                watch: function (prop, value) {
                    var icon = this.resolve("iconContainer");
                    var dot = this.resolve("dot");
                    if (value) {
                        icon.set("iconType", this.iconType());
                        icon.append();
                        dot.remove();
                    } else {
                        icon.remove();
                        dot.append();
                    }
                    this.calcLabelPosition();
                }
            },
            /**
             * Get node's label size
             * @property fontSize
             */
            fontSize: {
                value: 12
            },
            /**
             * Get/set node's selected statues
             * @property selected
             */
            selected: {
                watch: function (prop, value) {
//                    var selectedNodes = this.topology().selectedNodes();
//                    if (value) {
//                        if (selectedNodes.indexOf(this) == -1) {
//                            selectedNodes.add(this);
//                        }
//                    } else {
//                        selectedNodes.remove(this);
//                    }

                    var el = this.resolve("selectedBG");
                    if (value) {
                        el.set("r", this.selectedBG());
                        el.append();
                        this.calcLabelPosition();
                    } else {
                        el.remove();
                    }
                }
            },
            parentNodeSet: {
                get: function () {
                    var parentVertexSet = this.model().parentVertexSet();
                    if (parentVertexSet) {
                        return this.owner().getNode(parentVertexSet.id());
                    } else {
                        return null;
                    }

                }
            },
            useSmartLabel: {
                value: true
            }
        },
        view: {
            type: "nx.graphic.Group",
            props: {
                translateX: "{#x}",
                translateY: "{#y}",
                'class': 'node'
            },
            content: [
                {
                    type: "nx.graphic.Group",
                    name: "graphic",
                    content: [
                        {
                            name: 'selectedBG',
                            type: "nx.graphic.Circle",
                            props: {
                                x: 0,
                                y: 0,
                                'class': 'selectedBG'
                            }
                        },
                        {
                            name: 'dot',
                            type: "nx.graphic.Circle",
                            props: {
                                r: '{#dotRadius}',
                                x: 0,
                                y: 0,
                                'class': 'dot'
                            }
                        },
                        {
                            name: 'iconContainer',
                            type: "nx.graphic.Group",
                            content: {
                                name: 'icon',
                                type: "nx.graphic.Icon",
                                props: {
                                    'class': 'icon',
                                    iconType: 'unknown'
                                }
                            }
                        }
                    ],
                    events: {
//                            'mousedown': '{#_mousedown}',
//                            'mouseup': '{#_mouseup}',
//                            'touchstart': '{#_mousedown}',
//                            'mouseenter': '{#_mouseenter}',
//                            'mouseleave': '{#_mouseleave}'
                    }
                },
                {
                    name: "label",
                    type: "nx.graphic.Text",
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
                var topo = this.topology();
                this.useSmartLabel(topo.useSmartLabel());
                this.selected(false);
                this.iconType(topo.iconTypePath());
                this.showIcon(topo.showIcon());
                this.label(topo.nodeLabelPath());
            },
//            _setDotRadius: function () {
//                var radius = 0;
//                if (!this.showIcon()) {
//                    var scale = this.scale();
//                    if (scale <= 1) {
//                        radius = Math.floor(scale * 2 + 3);
//                    } else {
//                        radius = 5;
//                    }
//                }
//                this.resolve("dot").radius(radius);
//                this.dotRadius(radius);
//            },
//            _setLabelFontSize: function (size) {
//                this.resolve("label").setStyle("fontSize", size);
//            },


            /**
             * Get node's size beside label
             * @returns {*}
             * @method getSize
             */
            getSize: function () {
                var showIcon = this.showIcon();
                if (showIcon) {
                    var icon = this.resolve("icon");
                    return icon.size();
                } else {
                    return {
                        width: this.dotRadius() * 2,
                        height: this.dotRadius() * 2
                    };
                }
            },

            /**
             * Set hit to a node
             * @param inText
             * @param direction
             * @param inConfig
             * @returns {*}
             * @method setHint
             */
            setHint: function (inText, direction, inConfig) {

                var hint = this._hint;

                if (!hint) {
                    hint = this._hint = new nx.graphic.Hint();
                    this.appendChild(hint);
                }

                hint.sets({
                    text: inText,
                    direction: direction,
                    style: inConfig
                });

                hint.update();

                this._setHintPosition();

                return hint;

            },
            _setHintPosition: function () {
                var hint = this._hint;
                if (!hint) {
                    return;
                }


                var size = this.getSize();
                hint.offset({x: size.width, y: size.height});

                var textDirection = ["right", "bottom", "bottom", "left", "left", "top", "top", "right"][parseInt(this._labelAngle / 45, 10)];
                if (hint.direction() === textDirection) {
                    hint.gap(25);
                } else {
                    hint.gap(12);
                }

                hint.update();
            },
            _mouseup: function (sender, event) {
                if (this.topology().nodeDraggable() === false) {
                    if (this.enable()) {
                        this.fire("mouseup", event);
                    }
                }
            },
            mouseup: function (sender, event) {
                if (!this._isMoving()) {
                    if (this.enable()) {
                        this.fire("mouseup", event);
                    }
                }
            },
            _mouseleave: function (sender, event) {
                this.fire("mouseleave", event);
                event.stop();
            },
            _mouseenter: function (sender, event) {
                this.fire("mouseenter", event);
                event.stop();
            },
            _mousedown: function (sender, event) {
                if (this.enable()) {
                    if (this.topology().nodeDraggable() !== false) {
                        var self = this;
                        var _nodeX = self.x();
                        var _nodeY = self.y();

                        var _pageXY = event.getPageXY();
                        var px = _nodeX - _pageXY.x;
                        var py = _nodeY - _pageXY.y;
                        var startDrag = true;
                        var isFireDragStart = false;


                        console.log(_nodeX, _nodeY);

                        var lockXAxle = this.lockXAxle();
                        var lockYAxle = this.lockYAxle();

                        var fn = function (sender, event) {
                            if (startDrag) {
                                if (!isFireDragStart) {
                                    self.fire("dragstart", event);
                                    self._isMoving(true);
                                    isFireDragStart = true;
                                }
                                var pageXY = event.getPageXY();

                                if (!lockXAxle) {
                                    self.move(pageXY.x - _pageXY.x);
                                }

                                if (!lockYAxle) {
                                    self.move(null, pageXY.y - _pageXY.y);
                                }


                                _pageXY = pageXY;
                            }
                            self.fire("drag", event);
                            event.stop();
                        };
                        var fn2 = function (sender, event) {
                            startDrag = false;
                            if (_nodeX !== self.x() || _nodeY !== self.y()) {
                                self.fire("dragend", event);
                                self._updateConnectedNodeLabelPosition();
                            } else {
                                self.mouseup(sender, event);
                            }


                            nx.app.off("mousemove", fn);
                            nx.app.off("mouseup", fn2);

                            nx.app.off("touchmove", fn);
                            nx.app.off("touchend", fn2);

                            nx.dom.removeClass(document.body, "n-userselect n-dragCursor");

                            self._isMoving(false);

                            event.stop();
                        };

                        nx.app.on("mousemove", fn);
                        nx.app.on("mouseup", fn2);

                        nx.app.on("touchmove", fn);
                        nx.app.on("touchend", fn2);

                        nx.dom.addClass(document.body, "n-userselect n-dragCursor");

                        event.stop();
                    }
                }
                this.fire("mousedown", event);
                event.stop();
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
                        this._setHintPosition();
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
            updateByMaxObtuseAngle: function (angle) {

                var el = this.resolve("label");

                // find out the quadrant
                var quadrant = Math.floor(angle / 60);
                var anchor = "middle";
                if (quadrant === 5 || quadrant === 0) {
                    anchor = "start";
                } else if (quadrant === 2 || quadrant === 3) {
                    anchor = "end";
                }

                //
                var size = this.getSize();
                var radius = Math.max(size.width / 2, size.height / 2) + (this.showIcon() ? 12 : 8);
                var labelVector = new nx.math.Vector(radius, 0).rotate(angle);


                el.set("x", labelVector.x);
                el.set("y", labelVector.y);
                //

                el.set("text-anchor", anchor);

            },
            destroy: function () {
//                var topo = this.topology();
//                topo.unwatch("revisionScale", this._watchRevisionScale, this);
//                topo.unwatch("showIcon", this._watchShowIcon, this);
//                topo.unwatch("scale", this._watchScale, this);
//                this.inherited();
            }
        }
    })
    ;
})(nx, nx.graphic.util, nx.global);


//fill="#1F6EEE"
//fill="#1F6EEE" class="bg"
//stroke="#1F6EEE"
//stroke="#1F6EEE" class="stroke"