(function (nx, util, global) {
    var Vector = nx.math.Vector;
    var Line = nx.math.Line;

    /**
     * Abstract link class
     * @class nx.graphic.Topology.AbstractLink
     * @extend nx.graphic.Shape
     */
    nx.define("nx.graphic.Topology.AbstractLink", nx.graphic.Component, {
        events: ["hide", "show"],
        properties: {
            /**
             * Get source node instance
             * @property  sourceNode
             */
            sourceNode: {
                get: function () {
                    var topo = this.topology();
                    var id = this.model().source().id();
                    return topo.getNode(id);
                }
            },
            /**
             * Get target node instance
             * @property targetNode
             */
            targetNode: {
                get: function () {
                    var topo = this.topology();
                    var id = this.model().target().id();
                    return topo.getNode(id);
                }
            },
            /**
             * Get source node's x position
             * @property sourceX
             */
            sourceX: {
                get: function () {
                    return this.sourceNode().x();
                }
            },
            /**
             * Get source node's y position
             * @property sourceY
             */
            sourceY: {
                get: function () {
                    return this.sourceNode().y();
                }
            },
            /**
             * Get target node's x position
             * @property targetX
             */
            targetX: {
                get: function () {
                    return this.targetNode().x();
                }
            },
            /**
             * Get target node's x position
             * @property targetY
             */
            targetY: {
                get: function () {
                    return this.targetNode().y();
                }
            },
            /**
             * Get source node's vector
             * @property sourceVector
             */
            sourceVector: {
                get: function () {
                    return this.sourceNode().vector();
                }
            },
            /**
             * Get target node's vector
             * @property targetVector
             */
            targetVector: {
                get: function () {
                    return this.targetNode().vector();
                }
            },
            sourcePosition: {
                get: function () {
                    return this.sourceNode().position();
                }
            },
            targetPosition: {
                get: function () {
                    return this.targetNode().position();
                }
            },


            line: {
                get: function () {
                    return  new Line(this.sourceVector(), this.targetVector());
                }
            },
            /**
             * Get topology instance
             * @property topology
             */
            topology: {
                value: null
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
             * Get/set link's usability
             * @property enable
             */
            enable: {
                get: function () {
                    return this._enable !== undefined ? this._enable : true;
                },
                set: function (value) {
//                    this._enable = value;
//                    if (!value) {
//                        this.fadeOut();
//                    } else {
//                        this.fadeIn();
//                    }
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
            fadeValue: {
                value: 0.3
            },
            sourceNodeID: {
                get: function () {
                    return this.model().source().id();
                }
            },
            targetNodeID: {
                get: function () {
                    return this.model().target().id();
                }
            },
            id: {
                get: function () {
                    return this.model().id();
                }
            },
            linkKey: {
                get: function () {
                    return this.model().linkKey();
                }
            },
            centerPoint: {
                get: function () {
                    return this.line().center();
                }
            }

        },
        methods: {
            attach: function (args) {

                this.inherited(args);


                topo.on("projectionChange", this._projectionChangeFN = function (sender, event) {
                    this.update();
                }, this);

            },
            /**
             * Factory function , will be call when set model
             */
            setModel: function (model) {
                var topo = this.topology();

                this.model(model);


                model.source().watch("position", function (prop, value) {
                    this.notify("sourcePosition");
                    this.update();
                }, this);

                model.target().watch("position", function () {
                    this.notify("targetPosition");
                    this.update();
                }, this);

                this.watch("visible", function (prop, value) {
                    if (value) {
                        this.fire("show", this);
                    } else {
                        this.fire("hide", this);
                    }
                }, this);


                //bind model's visible with element's visible
                this.setBinding("visible", "visible");
                this.update();

            },


            /**
             * Factory function , will be call when relate data updated
             */
            update: function () {


            },
            getSourceNode: function () {
                return this.sourceNode();
            },
            getTargetNode: function () {
                return this.targetNode();
            },
            position: function () {
                var sourceNode = this.sourceNode().position();
                var targetNode = this.targetNode().position();
                return {
                    x1: sourceNode.x || 0,
                    x2: sourceNode.y || 0,
                    y1: targetNode.x || 0,
                    y2: targetNode.y || 0
                };
            },
            /**
             * Fade out a link
             * @param force
             * @method fadeOut
             */
            fadeOut: function (force) {
                var fadeValue = this.fadeValue();
                this.resolve().opacity(fadeValue);
                if (force) {
                    this.fade(true);
                }
            },
            /**
             * Fade in a link
             * @param force
             * @method fadeIn
             */
            fadeIn: function (force) {

                if (this.enable()) {
                    var sourceNode = this.sourceNode();
                    var targetNode = this.targetNode();

                    if (!sourceNode.enable() || !targetNode.enable() || sourceNode.fade() || targetNode.fade()) {
                        this.fadeOut();
                    } else if (this.fade() && !force) {
                        this.fadeOut();
                    } else {
                        this.lighting();
                    }

                    if (force) {
                        this.fade(false);
                    }

                } else {
                    this.fadeOut();
                }

            },
            /**
             * Just highlight link , not change it's statues
             * @method lighting
             */
            lighting: function () {
                this.resolve().opacity(1);
            },
            destroy: function () {

                this.inherited();

                var topo = this.topology();
                topo.unwatch("projectionX", this._watchScaleX, this);

                topo.unwatch("projectionY", this._watchScaleY, this);

            }
        }
    });


})(nx, nx.graphic.util, nx.global);