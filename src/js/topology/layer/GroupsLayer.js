(function (nx, util) {

    var colorTable = ['#C3A5E4', '#75C6EF', '#CBDA5C', '#ACAEB1 ', '#2CC86F'];


    /**
     * Group item class.

     Group background colors '#BFFDF6', '#B8F0B0', '#F6F3C0', '#DBD5FE', '#D1E4FC'
     * @class nx.graphic.Topology.GroupsItem
     * @extend nx.graphic.Shape
     */

    nx.define("nx.graphic.Topology.GroupsItem", nx.graphic.Component, {
        events: ["dragGroupStart", "dragGroup", "dragGroupEnd", "clickGroupLabel"],
        properties: {
            /**
             * Get topology
             * @property topology
             */
            topology: {},
            /**
             * Get group key
             * @property key
             */
            key: {},
            /**
             * Get group index
             * @property index
             */
            index: {},
            /**
             * Get group's label
             * @property label
             */
            label: {
                value: null
            },
            /**
             * Get group's vertices
             * @property vertices
             */
            vertices: {
                value: []
            },
            nodes: {
                get: function () {
                    var topo = this.topology();
                    var vertices = this.vertices();
                    var nodes = [];
                    nx.each(vertices, function (vertex) {
                        nodes.push(topo.getNode(vertex.id()));
                    });
                    return nodes;
                }
            },
            links: {
                get: function () {
                    var nodes = this.nodes();
                    var links = [];
                    nx.each(nodes, function (node) {
                        links = links.concat(node.getLinks());
                    });

                    links = util.uniq(links);
                    return links;
                }

            },
            /**
             * Get/set  shapeType
             * @property shapeType
             */
            shapeType: {
                value: 'polygon'
            }
        },
        view: {

        },
        methods: {
            onInit: function () {
                this.watch("shapeType", this.draw, this);
                this.watch("label", this.draw, this);

                this.resolve().on("mousedown", this._drag, this);
                this.resolve().on("touchstart", this._drag, this);
            },
            /**
             * Draw group
             * @method draw
             */
            draw: function () {
                var topo = this.topology();
                var shapeType = this.shapeType();

                this.resolve().empty();

                if (shapeType == "polygon") {
                    this._drawPolygon(topo);
                } else if (shapeType == "rect") {
                    this._drawRect(topo);
                } else if (shapeType == "borderRect") {
                    this._drawBorderRect(topo);
                } else if (shapeType == "circle") {
                    this._drawCircle(topo);
                }


            },
            _drawPolygon: function (topo) {
                var vectorArray = [];
                var index = this.index();
                var vertices = this.vertices();
                var scale = 1;//topo.scale();
                var key = this.key();
                var label = this.label();
                nx.each(vertices, function (vertex, index) {
                    var x = topo.projectionX().get(vertex.get("x"));
                    var y = topo.projectionY().get(vertex.get("y"));
                    vectorArray.push({x: x, y: y});
                });
                var el = new nx.graphic.Polygon({
                    'class': 'group',
                    fill: colorTable[index % colorTable.length],
                    stroke: colorTable[index % colorTable.length],
                    "stroke-width": 60 * scale,
                    'stroke-linejoin': 'round'
                });
                //
                el.nodes(vectorArray);
                this.appendChild(el);

                var bound = el.getBBox();
                var text = new nx.graphic.Text({
                    x: bound.x + bound.width / 2 - 10 * scale,
                    y: bound.y - 35 * scale,
                    text: label || key,
                    'class': 'groupLabel',
                    fill: colorTable[index % colorTable.length],
                    stroke: colorTable[index % colorTable.length],
                    'text-anchor': "middle"
                });

                text.on("click", function () {
                    this.fire("clickGroupLabel");
                }, this);

                this.prependChild(text);


            },
            _drawRect: function (topo) {
                var min_x, max_x, min_y, max_y;
                var index = this.index();
                var vertices = this.vertices();
                var scale = 1;//topo.scale();
                var key = this.key();
                var label = this.label();
                var firstItem = vertices[0];

                if (firstItem) {
                    min_x = max_x = firstItem.get("x") || 0;
                    min_y = max_y = firstItem.get("y") || 0;
                } else {
                    min_x = max_x = 0;
                    min_y = max_y = 0;
                }


                nx.each(vertices, function (vertex, index) {
                    min_x = Math.min(min_x, vertex.get("x") || 0);
                    max_x = Math.max(max_x, vertex.get("x") || 0);
                    min_y = Math.min(min_y, vertex.get("y") || 0);
                    max_y = Math.max(max_y, vertex.get("y") || 0);
                });

                var bound = {
                    x: topo.projectionX().get(min_x),
                    y: topo.projectionY().get(min_y),
                    width: topo.projectionX().get(max_x) - topo.projectionX().get(min_x),
                    height: topo.projectionY().get(max_y) - topo.projectionY().get(min_y)
                };

                var el = new nx.graphic.Rect({
                    'class': 'group',
                    x: bound.x,
                    y: bound.y,
                    width: Math.max(bound.width, 1),
                    height: Math.max(bound.height, 1),
                    fill: colorTable[index % colorTable.length],
                    stroke: colorTable[index % colorTable.length],
                    "stroke-width": 60 * scale,
                    opacity: 0.6,
                    'stroke-linejoin': 'round'
                });


                var text = new nx.graphic.Text({
                    x: bound.x + bound.width / 2 - 10 * scale,
                    y: bound.y - 35 * scale,
                    text: label || key,
                    'class': 'groupLabel',
                    fill: colorTable[index % colorTable.length],
                    stroke: colorTable[index % colorTable.length],
                    'text-anchor': "middle"
                });


                text.on("click", function () {
                    this.fire("clickGroupLabel");
                }, this);


                this.appendChild(text);
                this.appendChild(el);
            },
            _drawCircle: function (topo) {
                var min_x, max_x, min_y, max_y;
                var index = this.index();
                var vertices = this.vertices();
                var firstItem = vertices[0];
                var key = this.key();
                var label = this.label();
                // var step = this.topology().getNode(firstItem.id()).showIcon() ? 30 : 10;

                var step = 30;

                if (firstItem) {
                    min_x = max_x = firstItem.get("x") || 0;
                    min_y = max_y = firstItem.get("y") || 0;
                } else {
                    min_x = max_x = 0;
                    min_y = max_y = 0;
                }


                nx.each(vertices, function (vertex, index) {
                    min_x = Math.min(min_x, vertex.get("x") || 0);
                    max_x = Math.max(max_x, vertex.get("x") || 0);
                    min_y = Math.min(min_y, vertex.get("y") || 0);
                    max_y = Math.max(max_y, vertex.get("y") || 0);
                });


                var radius = 0;
                var centerPointX = topo.projectionX().get((min_x + max_x) / 2);
                var centerPointY = topo.projectionY().get((min_y + max_y) / 2);
                nx.each(vertices, function (vertex, index) {
                    radius = Math.max(Math.pow(topo.projectionX().get(vertex.get("x")) - centerPointX, 2) + Math.pow(topo.projectionY().get(vertex.get("y")) - centerPointY, 2), radius);
                });

                radius = Math.sqrt(radius);

                var el = new nx.graphic.Circle({
                    'class': 'group',
                    x: centerPointX,
                    y: centerPointY,
                    radius: radius + step,
                    fill: colorTable[index % colorTable.length],
                    stroke: colorTable[index % colorTable.length],
                    opacity: 0.6,
                    'stroke-linejoin': 'round'
                });


                var text = new nx.graphic.Text({
                    x: centerPointX,
                    y: centerPointY - radius - step - 6,
                    text: label || key,
                    'class': 'groupLabel',
                    fill: colorTable[index % colorTable.length],
                    stroke: colorTable[index % colorTable.length],
                    'text-anchor': "middle"
                });


                text.on("click", function () {
                    this.fire("clickGroupLabel");
                }, this);


                this.appendChild(text);

                this.appendChild(el);
            },
            _drag: function (sender, event) {
                var self = this;
                var topo = this.topology();
                var vertices = this.vertices();
                var offset = event.getPageXY();
                var px = offset.x;
                var py = offset.y;

                var _px = offset.x;
                var _py = offset.y;

                var startDrag = true;
                var fn = function (sender, event) {
                    if (startDrag) {
                        var offset = event.getPageXY();
                        var x = offset.x - px;
                        var y = offset.y - py;
                        nx.each(vertices, function (vertex, index) {
                            vertex.set("x", topo.projectionX().invert(topo.projectionX().get(vertex.get("x")) + x));
                            vertex.set("y", topo.projectionY().invert(topo.projectionY().get(vertex.get("y")) + y));
                        });

                        px = offset.x;
                        py = offset.y;
                        topo.fire("updating");
                        self.fire("dragGroup", self);
                    }
                };
                var fn2 = function (sender, event) {
                    nx.app.off("mousemove", fn);
                    nx.app.off("mouseup", fn2);

                    var offset = event.getPageXY();

                    if (_px != offset.x || _py != offset.y) {
                        self.fire("dragGroupEnd", self);
                    }

                    nx.dom.removeClass(document.body, "n-userselect n-dragCursor");
                    event.stop();
                };
                nx.app.on("mousemove", fn);
                nx.app.on("mouseup", fn2);
                this.fire("dragGroupStart");

                nx.dom.addClass(document.body, "n-userselect n-dragCursor");

                event.stop();
            },
            getInternalLinks: function () {
                var links = this.links();
                var nodes = this.nodes();
                var internalLinks = [];

                nx.each(links, function (link) {
                    if (util.indexOf(nodes, link.sourceNode()) != -1 && util.indexOf(nodes, link.targetNode()) != -1) {
                        internalLinks.push(link);
                    }
                });

                return internalLinks;

            }
        }
    });

    /**
     * Group Layer class
     * @class nx.graphic.Topology.GroupsLayer
     * @extend nx.graphic.Topology.Layer
     */
    nx.graphic.define("nx.graphic.Topology.GroupsLayer", nx.graphic.Topology.Layer, {
        events: ["dragGroupStart", "dragGroup", "dragGroupEnd", "clickGroupLabel"],
        view: {},
        properties: {
            /**
             * Get groups
             * @property groups
             */
            groups: {
                value: {}
            },
            /**
             * Get/set groups shape type
             */
            shapeType: {
                value: 'circle'
            }
        },
        methods: {
            init: function (args) {
                this.inherited(args);
                this.watch("shapeType", function (prop, value) {
                    nx.each(this.groups(), function (group) {
                        group.shapeType(value);
                    });

                }, this);


                var topo = this.topology();
                if (topo) {
                    topo.on("updating", this._draw, this);
                    topo.on("zoomend", this._draw, this);
                }


            },
            draw: function () {
                this.inherited();
                this.groups({});

                if (this.groupByHandler) {
                    this._groupBy();
                    this._draw();
                }

            },
            /**
             * Group by function, group vertices follow by the function
             * @param fn{function} return a group key
             * @method groupBy
             */
            groupBy: function (fn) {

                var topo = this.topology();
                //
                this.groupByHandler = fn;

                if (topo.status() == 2) {
                    this._groupBy();
                    this._draw();

                }
            },
            _groupByUtil: function (ary, fn) {
                var obj = {};

                nx.each(ary, function (item) {
                    var result = fn(item);
                    if (result) {
                        var group = obj[result] = obj[result] || [];
                        group.push(item);
                    }
                });

                return obj;

            },
            _groupBy: function () {
                var topo = this.topology();
                var model = topo.model();
                var vertices = model.vertices;
                var shapeType = this.shapeType();
                var fn = this.groupByHandler;
                var groups = this._groupByUtil(vertices, fn);
                var groupsObj = this.groups();
                var index = 0;


                nx.each(groups, function (vertices, key) {
                    var item = new nx.graphic.Topology.GroupsItem({
                        owner: this,
                        topology: topo,
                        vertices: vertices,
                        key: key,
                        shapeType: shapeType,
                        index: index++
                    });


                    //events: ["dragGroupStart", "dragGroup", "dragGroupEnd"],

                    item.on("dragGroupStart", function (sender, args) {
                        this.fire("dragGroupStart", item);
                    }, this);

                    item.on("dragGroup", function (sender, args) {
                        this.fire("dragGroup", item);
                    }, this);

                    item.on("dragGroupEnd", function (sender, args) {
                        this.fire("dragGroupEnd", item);
                    }, this);

                    item.on("clickGroupLabel", function (sender, args) {
                        this.fire("clickGroupLabel", item);
                    }, this);

                    groupsObj[key] = item;
                    this.appendChild(item);
                }, this);

            },
            /**
             * Get group item by key
             * @param key
             * @returns {nx.graphic.Topology.GroupsItem}
             * @method getGroup
             */
            getGroup: function (key) {
                var groups = this.groups();
                return groups[key];
            },
            _draw: function () {
                nx.each(this.groups(), function (group) {
                    group.draw();
                })
            },
            clear: function () {
                nx.each(this.groups(), function (group) {
                    group.off("dragGroupStart");
                    group.off("dragGroup");
                    group.off("dragGroupEnd");
                    group.off("clickGroupLabel");
                    group.destroy();
                });


                this.inherited();
            }
        }

    });


})(nx, nx.util);
