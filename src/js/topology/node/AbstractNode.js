(function (nx, util, global) {

    var Vector = nx.math.Vector;
    /**
     * Abstract node class
     * @class nx.graphic.Topology.AbstractNode
     * @extend nx.graphic.Shape
     */
    nx.define("nx.graphic.Topology.AbstractNode", nx.graphic.Group, {
        properties: {
            /**
             * Get  node's absolute position
             * @property  position
             */
            position: {
                get: function () {
                    return {
                        x: this._x || 0,
                        y: this._y || 0
                    };
                },
                set: function (obj) {
                    var isModified = false;
                    var model = this.model();
                    if (obj.x != null) {
                        if (!this._lockXAxle && this._x !== obj.x) {
                            this._x = obj.x;
                            model.set("x", this.projectionX().invert(obj.x));
                            this.notify("x");
                            isModified = true;
                        }
                    }

                    if (obj.y != null) {
                        if (!this._lockYAxle && this._y !== obj.y) {
                            this._y = obj.y;
                            model.set("y", this.projectionY().invert(obj.y));
                            this.notify("y");
                            isModified = true;
                        }
                    }

                    if (isModified) {
                        //this.notify('position');
                        this.notify('vector');
                        this.update();
                    }


                    return isModified;

                }
            },
            /**
             * Get/set  node's x position
             * @property  x
             */
            x: {
                get: function () {
                    return this._x || 0;
                },
                set: function (value) {
                    return this.position({x: value});
                },
                binding: {
                    direction: "<>",
                    converter: nx.Binding.converters.number
                }
            },
            /**
             * Get/set  node's y position
             * @property  y
             */
            y: {
                get: function () {
                    return this._y || 0;
                },
                set: function (value) {
                    return this.position({y: value});
                },
                binding: {
                    direction: "<>",
                    converter: nx.Binding.converters.number
                }
            },

            lockXAxle: {
                value: false
            },
            lockYAxle: {
                value: false
            },
            /**
             * Get topology instance
             * @property  topology
             */
            topology: {},
            nodesLayer: {
                get: function () {
                    return this.owner();
                }
            },
            /**
             * Get topology's x scale object
             * @property projectionX
             */
            projectionX: {
                get: function () {
                    return this.topology().projectionX();
                }
            },
            /**
             * Get topology's y scale object
             * @property projectionY
             */
            projectionY: {
                get: function () {
                    return this.topology().projectionY();
                }
            },

            /**
             * Get topology's scale
             * @property scale
             */
            scale: {
                get: function () {
                    return this.topology().scale() || 1;
                }
            },
            /**
             * Get  node's vector
             * @property  position
             */
            vector: {
                get: function () {
                    return new Vector(this.x(), this.y());
                }
            },
            id: {
                get: function () {
                    return this.model().id();
                }
            },
            visible: {
                set: function (value) {
                    if (value) {
                        this.fire("show", this);
                    } else {
                        this.fire("hide", this);
                    }
                    this._visible = value;
                }
            },
            /**
             * Get/set node's usablity
             * @property enable
             */
            enable: {
                value: true
            },

            fade: {
                value: false
            },
            fadeValue: {
                value: 0.5
            }
        },
        methods: {
            /**
             * Factory function , will be call when set model
             */
            setModel: function (model) {
                var topo = this.topology();
                var projectionX = topo.projectionX();
                var projectionY = topo.projectionY();

                this.model(model);


//                model.watch("position", function (prop, value) {
//                    this.position({x: projectionX.get(value.x), y: projectionY.get(value.y)});
//                }, this);

//                topo.on("projectionChange", this._projectionChangeFN = function (sender, event) {
//                    this.position({
//                        x: projectionX.get(model.get("x")),
//                        y: projectionY.get(model.get("y"))
//                    });
//                }, this);


                this.setBinding("visible", "model.visible");

                this.position({
                    x: projectionX.get(model.get("x")),
                    y: projectionY.get(model.get("y"))
                });


            },
            update: function () {

            },

            move: function (x, y) {
                var position = this.position();
                this.position({x: position.x + x || 0, y: position.y + y || 0});
            },
            moveTo: function (inX, inY, callback, isAnimation, duration) {
                var x, y;
                if (nx.is(inX, 'Object')) {
                    x = inX.x;
                    y = inX.y;
                } else {
                    x = inX;
                    y = inY;
                }

                if (isAnimation !== false) {
                    var obj = {to: {}, duration: duration || 400};
                    if (x !== undefined) {
                        obj.to.x = x;
                    }

                    if (y !== undefined) {
                        obj.to.y = y;
                    }

                    if (callback) {
                        obj.complete = callback.bind(this);
                    }

                    this.animate(obj);
                } else {
                    this.position({x: x, y: y});
                }
            },
            /**
             * Fade out a node
             * @method fadeOut
             */
            fadeOut: function () {
                this.root().addClass('n-transition');
                this.resolve("@root").setStyle('opacity', this.fadeValue());
                this.fade(true);
            },
            /**
             * Fade in a node
             * @method fadeIn
             */
            fadeIn: function () {
                if (this.enable()) {
                    this.resolve("@root").setStyle('opacity', 1);
                    this.fade(false);
                }
            },
            /**
             * Get all links connect to this node
             * @returns {Array}
             * @method getLinks
             */
            getLinks: function () {
                return this.nodesLayer().getNodeConnectedLinks(this);
            },
            getConnectedLinkSet: function () {
                var model = this.model();
                var topo = this.topology();
                var selfID = model.id();
                var linkSetAry = [];
                model.eachConnectedVertices(function (vertex) {
                    var id = vertex.id();
                    var linkSet = topo.getLinkSet(selfID, id);
                    if (linkSet) {
                        linkSetAry.push(linkSet);
                    }
                }, this);

                return linkSetAry;

            },
            /**
             * Traverse all links connected to this node
             * @param fn
             * @param context
             */
            eachLink: function (fn, context) {
                var model = this.model();
                var topo = this.topology();
                model.eachEdge(function (edge) {
                    var id = edge.get('id');
                    var link = topo.getLink(id);
                    if (link) {
                        fn.call(context || topo, link);
                    }
                }, this);
            },
            getConnectedNodes: function () {
                var nodes = [];
                this.eachConnectedNodes(function (node) {
                    nodes.push(node);
                });
                return nodes;
            },
            eachConnectedNodes: function (fn, context) {
                var model = this.model();
                var topo = this.topology();
                model.eachConnectedVertices(function (vertex) {
                    var id = vertex.id();
                    fn.call(context || this, topo.getNode(id), id);
                }, this);
            }
        }
    });


})(nx, nx.graphic.util, nx.global);