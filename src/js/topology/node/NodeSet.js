(function (nx, util, global) {


    nx.define("nx.graphic.Topology.NodeSet", nx.graphic.Topology.Node, {
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
                    return this._collapsed !== undefined ? this._collapsed : true;
                },
                set: function (value) {
                    if (this._collapsed != value) {
                        if (value) {
                            this._collapse();
                        } else {
                            this._expand();
                        }
                    }
                    this._collapsed = value
                }
            }
        },
        view: function () {
            var graphic = this.resolve("graphic");
            graphic.content.push({
                name: "plus",
                type: "nx.graphic.Text",
                props: {
                    text: "+",
                    x: -4,
                    y: 4,
                    'class': "plusIcon",
                    visible: "{#showIcon,converter=inverted}"
                }
            });

            graphic.content.push({
                name: 'plusIcon',
                type: "nx.graphic.Topology.NodeIcon",
                props: {
                    'class': 'icon',
                    iconType: 'expand'
                }
            })

        },
        methods: {

            onSetModel: function (model) {
                this.inherited(model);

                if (this.iconType() == "switch" || this.iconType() == "default") {
                    this.iconType("groupS");
                }
            },
            onAppend: function () {

                this.collapsed(true);

            },
            expand: function () {
                this.collapsed(false);
                var topo = this.topology();
                topo.getLayer("aggregationLayer").openItem(this);
            },
            collapse: function () {
                this.collapsed(true);
                this.topology().getLayer("aggregationLayer").closeItem(this);
            },
            _expand: function () {

                var parentNodeSet = this.parentNodeSet();
                if (parentNodeSet && parentNodeSet.collapsed()) {
                    parentNodeSet.collapsed(false);
                }

                this.visible(false);

                nx.each(this.getNodes(), function (node) {

                    node.enable(true);
                    node.visible(true);
                    //node.fadeIn(true);

                    node.fadeIn(true);
                });
            },

            _collapse: function () {
                this.visible(true);
                nx.each(this.getNodes(), function (node) {


                    if (node instanceof  nx.graphic.Topology.NodeSet) {
                        node.collapsed(true);
                    }
                    node.visible(false);
                    node.enable(false);

                });


            },

            /**
             * Get all sun nodes
             * @returns {Array}
             */
            getNodes: function () {
                var vertices = this.model().vertices();
                var layer = this.owner();
                var nodes = [];

                nx.each(vertices, function (vertex) {
                    nodes.push(layer.getNode(vertex.id()))
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
            getTopParentNodeSet: function () {
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

                var el = this.resolve("iconContainer");
                var size = this.resolve("icon").size();
                var radius = Math.max(size.width / 2, size.height / 2) + (this.showIcon() ? 12 : 8);
                var labelVector = new nx.math.Vector(radius, 0).rotate(angle);


                el.set("translateX", labelVector.x);
                el.set("translateY", labelVector.y);

                //debugger;


                var textel = this.resolve("text");

                if (this.showIcon()) {
                    radius = Math.max(size.width * 0.8, size.height * 0.8);
                } else {
                    radius = 10;
                }


                labelVector = new nx.math.Vector(radius, 0).rotate(angle);

                textel.set("translateX", labelVector.x);
                textel.set("translateY", labelVector.y);


                //el.x(labelVector.x);
                //el.y(labelVector.y);


            },
            mouseup: function (sender, event) {
                if (!this._isMoving()) {
                    this.expand();
                }
            }
        }

    })

})(nx, nx.graphic.util, nx.global);