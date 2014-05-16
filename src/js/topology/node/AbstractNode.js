(function (nx, global) {

    var Vector = nx.geometry.Vector;
    /**
     * Abstract node class
     * @class nx.graphic.Topology.AbstractNode
     * @extend nx.graphic.Group
     * @module nx.graphic.Topology
     */
    nx.define("nx.graphic.Topology.AbstractNode", nx.graphic.Group, {
        events: ['updateNodeCoordinate', 'selectNode', 'remove'],
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
                    if (obj.x != null && obj.x !== this._x && !this._lockXAxle) {
                        this._x = obj.x;
                        this.notify("x");
                        isModified = true;
                    }

                    if (obj.y != null && obj.y !== this._y && !this._lockYAxle) {
                        this._y = obj.y;
                        this.notify("y");
                        isModified = true;
                    }

                    if (isModified) {
                        var model = this.model();
                        model.position({
                            x: this._x,
                            y: this._y
                        });

                        this.view().setTransform(this._x, this._y);
                        this.update();
                    }
                    return isModified;
                }
            },
            absolutePosition: {
                dependencies: ['position'],
                get: function () {
                    var position = this.position();
                    var topoMatrix = this.topology().matrix();
                    var stageScale = topoMatrix.scale();
                    return {
                        x: position.x * stageScale + topoMatrix.x(),
                        y: position.y * stageScale + topoMatrix.y()
                    };
                }
            },
            matrix: {
                dependencies: ['position'],
                get: function () {
                    var position = this.position();
                    var stageScale = this.stageScale();
                    return [
                        [stageScale, 0, 0],
                        [0, stageScale, 0],
                        [position.x, position.y, 1]
                    ];
                }
            },
            /**
             * Get  node's vector
             * @property  vector
             */
            vector: {
                dependencies: ['position'],
                get: function () {
                    return new Vector(this.x(), this.y());
                }
            },
            /**
             * Get/set  node's x position, suggest use position
             * @property  x
             */
            x: {
                dependencies: ['position'],
                get: function () {
                    return this._x || 0;
                },
                set: function (value) {
                    return this.position({x: parseFloat(value)});
                }
            },
            /**
             * Get/set  node's y position, suggest use position
             * @property  y
             */
            y: {
                dependencies: ['position'],
                get: function () {
                    return this._y || 0;
                },
                set: function (value) {
                    return this.position({y: parseFloat(value)});
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
             * Get topology stage scale
             * @property scale
             */
            stageScale: {
                set: function (value) {
                    this.view().setTransform(null, null, value);
                }
            },
            /**
             * Get topology instance
             * @property  topology
             */
            topology: {},
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
            showIcon: {
                value: true
            }
        },
        view: {
            type: 'nx.graphic.Group'
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
                this.model(model);
                model.upon('updateCoordinate', function (sender, position) {
                    this.position({
                        x: position.x,
                        y: position.y
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

                //initialize position
                this.position({
                    x: model.get("x"),
                    y: model.get("y")
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
             * @param isAnimated {Boolean}
             * @param duration {Number}
             */
            moveTo: function (x, y, callback, isAnimated, duration) {
                if (isAnimated !== false) {
                    var obj = {to: {}, duration: duration || 400};
                    obj.to.x = x;
                    obj.to.y = y;

                    if (callback) {
                        obj.complete = callback;
                    }
                    this.animate(obj);
                } else {
                    this.position({x: x, y: y});
                }
            },
            /**
             * Use css translate to move node for high performance, when use this method, related link can't recive notification. Could hide links during transition.
             * @method translateTo
             * @param x {Number}
             * @param y {Number}
             * @param callback {Function}
             */
            translateTo: function (x, y, callback) {

            },
            /**
             * Iterate  all connected links to this node
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
             * Get all links connect to this node
             * @returns {Array}
             * @method getLinks
             */
            getLinks: function () {
                var ary = [];
                this.eachLink(function (link) {
                    ary[ary.length] = link;
                }, this);
                return ary;
            },
            eachLinkSet: function (fn, context) {
                var model = this.model();
                var topo = this.topology();
                model.eachEdgeSet(function (edgeSet, linkKey) {
                    var linkSet = topo.getLinkSetByLinkKey(linkKey);
                    if (linkSet) {
                        fn.call(context || this, linkSet, edgeSet);
                    }
                }, this);
                model.eachEdgeSetCollection(function (edgeSetCollection, linkKey) {
                    var linkSet = topo.getLinkSetByLinkKey(linkKey);
                    if (linkSet) {
                        fn.call(context || this, linkSet, edgeSetCollection);
                    }
                }, this);
            },
            /**
             * Get all connected linkSet
             * @method getLinkSet
             * @returns {Array}
             */
            getLinkSet: function () {
                var linkSetAry = [];
                this.eachLinkSet(function (linkSet, edgeSet) {
                    linkSetAry[linkSetAry.length] = linkSet;
                }, this);
                return linkSetAry;
            },
            eachVisibleLinkSet: function (fn, context) {
                var model = this.model();
                var topo = this.topology();
                model.eachVisibleEdgeSet(function (edgeSet, linkKey) {
                    var linkSet = topo.getLinkSetByLinkKey(linkKey);
                    if (linkSet) {
                        fn.call(context || this, linkSet, edgeSet);
                    }
                }, this);
            },
            /**
             * Iterate all connected node
             * @method eachConnectedNode
             * @param fn {Function}
             * @param context {Object}
             */
            eachConnectedNode: function (fn, context) {
                var model = this.model();
                var topo = this.topology();
                model.eachConnectedVertices(function (vertex) {
                    var id = vertex.id();
                    var node = topo.getNode(id);
                    if (node) {
                        fn.call(context || this, topo.getNode(id), id);
                    } else {
                        //console.log(id);
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
                this.eachConnectedNode(function (node) {
                    nodes.push(node);
                }, this);
                return nodes;
            },
            dispose: function () {
                var model = this.model();
                if (model) {
                    model.upon('updateCoordinate', null);
                }
                this.fire('remove');
                this.inherited();
            }
        }
    });


})(nx, nx.global);