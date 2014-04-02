(function (nx, util, global) {

    var Vector = nx.math.Vector;
    /**
     * Abstract node class
     * @class nx.graphic.Topology.AbstractNode
     * @extend nx.graphic.Group
     * @module nx.graphic.Topology
     */
    nx.define("nx.graphic.Topology.AbstractNode", nx.graphic.Group, {
        events: ['updateNodeCoordinate', 'selectNode'],
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
                        this.notify('position');
                        this.notify('vector');
                        this.update();
                    }
                    return isModified;

                }
            },
            /**
             * Get/set  node's x position, suggest use position
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
             * Get/set  node's y position, suggest use position
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
            /**
             * Lock x axle, node only can move at y axle
             * @property lockXAxle {Boolean}
             */
            lockXAxle: {
                value: false
            },
            /**
             * Lock y axle, node only can move at x axle
             * @property lockYAxle
             */
            lockYAxle: {
                value: false
            },
            /**
             * Get topology instance
             * @property  topology
             */
            topology: {},
            /**
             * Get node's layer
             * @property nodesLayer
             */
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
             * @property  vector
             */
            vector: {
                get: function () {
                    return new Vector(this.x(), this.y());
                }
            },
            /**
             * Get node's id
             * @property id
             */
            id: {
                get: function () {
                    return this.model().id();
                }
            },
            /**
             * Node is been selected statues
             * @property selected
             */
            selected: {
                value: false
            },
            /**
             * Get/set node's usablity
             * @property enable
             */
            enable: {
                value: true
            },
            /**
             * Get node self reference
             * @property node
             */
            node: {
                get: function () {
                    return this;
                }
            },
            fade: {
                value: false
            },
            fadeValue: {
                value: 0.5
            }
        },
        methods: {
            init: function (args) {
                this.inherited(args);
                this.watch('selected', function (prop, value) {
                    /**
                     * Fired when node been selected or cancel selected
                     * @event selectNode
                     * @param sender{Object} trigger instance
                     * @param event {Object} original event object
                     */
                    this.fire('selectNode', value);
                }, this);
            },
            /**
             * Factory function , will be call when set model
             */
            setModel: function (model) {
                var topo = this.topology();
                var projectionX = topo.projectionX();
                var projectionY = topo.projectionY();

                this.model(model);

                model.on('updateCoordinate', function (sender, position) {
                    this.position({
                        x: projectionX.get(position.x),
                        y: projectionY.get(position.y)
                    });
                    this.notify('position');
                    /**
                     * Fired when node update coordinate
                     * @event updateNodeCoordinate
                     * @param sender{Object} trigger instance
                     * @param event {Object} original event object
                     */
                    this.fire('updateNodeCoordinate');
                }, this);


                this.setBinding("visible", "model.visible");

                this.position({
                    x: projectionX.get(model.get("x")),
                    y: projectionY.get(model.get("y"))
                });


            },
            update: function () {

            },
            /**
             * Move node certain distance
             * @method move
             * @param x {Number}
             * @param y {Number}
             */
            move: function (x, y) {
                var position = this.position();
                this.position({x: position.x + x || 0, y: position.y + y || 0});
            },
            /**
             * Move to a position
             * @method moveTo
             * @param x {Number}
             * @param y {Number}
             * @param callback {Function}
             * @param isAnimation {Boolean}
             * @param duration {Number}
             */
            moveTo: function (x, y, callback, isAnimation, duration) {
                if (isAnimation !== false) {
                    var obj = {to: {}, duration: duration || 400};
                    obj.to.x = x;
                    obj.to.y = y;

                    if (callback) {
                        obj.complete = callback.bind(this);
                    }

                    this.animate(obj);
                } else {
                    this.position({x: x, y: y});
                }
            },
            /**
             * Use css to move node for high performance, when use this method, related link can't recive notification. Could hide links during transition.
             * @method cssMoveTo
             * @param x {Number}
             * @param y {Number}
             * @param callback {Function}
             */
            cssMoveTo: function (x, y, callback) {

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
            /**
             * Get Connected linkSet
             * @method getConnectedLinkSet
             * @returns {Array}
             */
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
             * @method eachLink
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
            /**
             * Get all connected nodes
             * @method getConnectedNodes
             * @returns {Array}
             */
            getConnectedNodes: function () {
                var nodes = [];
                this.eachConnectedNodes(function (node) {
                    nodes.push(node);
                });
                return nodes;
            },
            /**
             * Iterate all connected nodes
             * @method eachConnectedNodes
             * @param fn {Function}
             * @param context {Object}
             */
            eachConnectedNodes: function (fn, context) {
                var model = this.model();
                var topo = this.topology();
                model.eachConnectedVertices(function (vertex) {
                    var id = vertex.id();
                    fn.call(context || this, topo.getNode(id), id);
                }, this);
            },
            _processPropertyValue: function (propertyValue) {
                var value = propertyValue;
                if (nx.is(propertyValue, 'Function')) {
                    value = propertyValue.call(this, this.model(), this);
                }
                return value;
            }
        }
    });


})(nx, nx.util, nx.global);