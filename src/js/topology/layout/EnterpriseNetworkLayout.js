(function (nx, global) {

    nx.define("nx.graphic.Topology.EnterpriseNetworkLayout", {
        properties: {
            topology: {},
            groupBy: {
                value: function () {
                    return function (inNode) {
                        return inNode.get("role");
                    }
                }
            },
            sortOrder: {
                value: function () {
                    return ['Core', 'Distribution', 'Access'];
                }
            }
        },
        methods: {
            init: function (args) {
                this.inherited(args);
                this.sets(args);

                var el = this._element = new nx.graphic.Group();
                el.setAttribute("data-nx-type", "EnterpriseNetworkLayout");


            },
            activate: function () {
                //var groupBy = this.groupBy();
                var topo = this.topology();

                topo.paddingLeft(200);


                topo.on("beforeSetData", this.deactivate, this);
                topo.on("updating", this._drawRect, this);
                topo.on("zoomend", this._drawRect, this);


                this._element.empty();

                topo.stage().prependChild(this._element);

                this._group();
                //this._drawRect();

            },

            deactivate: function () {
                var topo = this.topology();
                this._element.empty();
                topo.stage().removeChild(this._element);

                topo.off("updating", this._drawRect, this);
                topo.off("zoomend", this._drawRect, this);

            },


            _group: function () {
                var topo = this.topology();
                var groupBy = this.groupBy();
                var groups = util.groupBy(topo.graph().vertices, groupBy);

                var keyAry = [];
                var sortOrder = this.sortOrder();


                // build data with order
                var orderAry = [];
                nx.each(sortOrder, function (key) {
                    if (groups[key]) {
                        orderAry.push(groups[key]);
                        keyAry.push(key);
                        delete groups[key];
                    }
                });

                nx.each(groups, function (group, key) {
                    orderAry.push(group);
                    keyAry.push(key);
                });

                this.groupsInfo = {
                    orderAry: orderAry,
                    keyAry: keyAry
                };

                if (orderAry.length == 0) {
                    return;
                }

                this._order(orderAry);

                this._layout(orderAry, keyAry);




            },

            _order: function (inGroup) {

                var topo = this.topology();
                var model = topo.graph();


                inGroup[0].sort(function (a, b) {
                    return a.edges.length < b.edges.length;
                });


                for (var i = 0; i < inGroup.length - 1; i++) {

                    var firstGroup = inGroup[i];

                    var secondGroup = inGroup[i + 1];


                    var ary = [];
                    nx.each(firstGroup, function (fNode) {
                        var tempary = [];
                        nx.each(secondGroup, function (sNode, index) {
                            if (model.getEdgesBySourceAndTarget(fNode, sNode) !== undefined) {
                                tempary.push(sNode);
                            }
                        });

                        tempary.sort(function (a, b) {
                            return a.edges.length < b.edges.length;
                        });


                        ary = ary.concat(tempary);


                    });


                    inGroup[i + 1] = util.uniq(ary.concat(secondGroup), function (item) {
                        return item.id();
                    });
                }
            },
            _layout: function (inGroup, keyAry) {
                var topo = this.topology();
                //var stage = topo.stage();
//                var translateX = stage.translateX(), translateY = stage.translateY();


                var width = topo.width() - topo.paddingLeft() * 2 - 80;
                var height = topo.height() - topo.paddingTop() * 2;


                var VSPACE = height / (inGroup.length + 1);


                nx.each(inGroup, function (group, level) {

                    var vSpace = VSPACE * (level + 1);

                    var hSpace = width / (group.length + 1);


                    nx.each(group, function (vertex, index) {

                        var node = topo.getNode(vertex.id());
                        node.x(hSpace * (index + 1));
                        node.y(vSpace);
                        node.lockYAxle(true);

                    })
                });


                //when node in a same line and have connection , set link to curve
                var multipleLinkType = topo.multipleLinkType();
                topo.eachLink(function (link) {
                    if (link.sourceY() == link.targetY()) {
                        if (link.gutter() == 0) {
                            link.gutter(4);
                        }
                        link.linkType("curve");
                    } else {
                        link.linkType(multipleLinkType);
                    }

                    link.update();
                });


                var el = this._element;

                this.rects = [];
                this.texts = [];


                nx.each(inGroup, function (group, index) {

                    var rect = new nx.graphic.Rect({
                        'class': 'group',
                        stroke: "#b2e47f",
                        "stroke-width": 2,
                        opacity: 0.6,
                        'stroke-linejoin': 'round'
                    });


                    var text = new nx.graphic.Text({
                        text: keyAry[index],
                        fill: "#b2e47f",
                        stroke: "#b2e47f",
                        'class': 'groupLabel'
                        //'text-anchor': "left",

                    });


                    text.on("click", function () {
                        this.fire("clickGroupLabel");
                    }, this);


                    el.appendChild(text);
                    el.appendChild(rect);

                    this.texts.push(text);
                    this.rects.push(rect);


                }, this);


            },
            _drawRect: function () {
                var topo = this.topology();
                var scale = Math.min(topo.scale(), 1);
                var orderAry = this.groupsInfo.orderAry;
                var maxX = 0 , minX = 9999999;


                nx.each(orderAry, function (group) {
                    //minX = topo.getNode(group[0].id()).x();
                    nx.each(group, function (vertex) {
                        var node = topo.getNode(vertex.id());
                        minX = Math.min(minX, node.x());
                        maxX = Math.max(maxX, node.x());
                    });
                });

                var width = maxX - minX;
                //var width = topo.width() - topo.paddingLeft() * 2;
                //width = Math.max(width, maxX - minX);


                var size = 40 * scale;
                nx.each(orderAry, function (group, index) {
                    var firstNode = topo.getNode(group[0].id());


                    var rect = this.rects[index];

                    rect.sets({
                        "x": minX - size,
                        "y": firstNode.y() - size,
                        "width": width + size * 2,
                        height: size * 2
                    });


                    var text = this.texts[index];
                    text.sets({
                        "x": minX + size + width + 5,
                        "y": firstNode.y() + 12 * scale,
                        'font-size': 24 * scale
                    });


                }, this);

            }
        }
    });


})(nx, nx.global);