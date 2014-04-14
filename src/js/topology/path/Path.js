(function (nx, global) {

    var Vector = nx.math.Vector;
    var Line = nx.math.Line;
    var colorIndex = 0;
    var colorTable = ['#b2e47f', '#e4e47f', '#bec2f9', '#b6def7', '#89f0de'];
    /**
     * A topology path class
     Path's background colors : ['#b2e47f', '#e4e47f', '#bec2f9', '#b6def7', '#89f0de']
     * @class nx.graphic.Topology.Path
     * @extend nx.graphic.Component
     * @module nx.graphic.Topology
     */

    nx.define("nx.graphic.Topology.Path", nx.graphic.Component, {
        view: {
            type: 'nx.graphic.Group',
            content: {
                name: 'path',
                type: 'nx.graphic.Path'
            }
        },
        properties: {
            /**
             * get/set links's style ,default value is
             value: {
                    'stroke': '#666',
                    'stroke-width': '1px'
                }

             * @property pathStyle
             */
            pathStyle: {
                value: {
                    'stroke': '#666',
                    'stroke-width': '0px'
                }
            },
            /**
             * Get/set a path's width
             * @property pathWidth
             */
            pathWidth: {
                value: "auto"
            },
            /**
             * Get/set a path's offset
             * @property pathGutter
             */
            pathGutter: {
                value: 13
            },
            /**
             * Get/set a path's padding to a node
             * @property pathPadding
             */
            pathPadding: {
                value: "auto"
            },
            /**
             * Get/set path arrow type , 'none'/'cap'/'full'/'end'
             * @property
             */
            arrow: {
                value: 'none'
            },
            /**
             * Get/set links to draw a path pver it
             * @property links
             */
            links: {
                value: function () {
                    return [];
                }

            },
            /**
             * Reverse path direction
             * @property reverse
             */
            reverse: {
                value: false
            },
            owner: {

            },
            topology: {}
        },
        methods: {
            init: function (props) {
                this.inherited(props);
                var pathStyle = this.pathStyle();
                this.resolve("path").sets(pathStyle);

                if (!pathStyle.fill) {
                    this.resolve("path").setStyle("fill", colorTable[colorIndex++ % 5]);
                }


                var nodes = this.nodes = {};
                nx.each(this.links(), function (link) {
                    nodes[link.sourceNodeID()] = link.sourceNode();
                    nodes[link.targetNodeID()] = link.targetNode();
                });

                nx.each(nodes, function (node) {
                    node.on('updateNodeCoordinate', this.draw, this);
                }, this);


            },
            /**
             * Draw a path,internal
             * @method draw
             */
            draw: function () {
                var link, line1, line2, pt, d1 = [], d2 = [];
                var pathWidth = this.pathWidth();
                var pathPadding = this.pathPadding();
                var paddingStart, paddingEnd;
                var arrow = this.arrow();
                var v1, v2;


                var links = this.links();
                var linksSequentialArray = this._serializeLinks();
                var count = links.length;

                //first
                var firstLink = links[0];

                var offset = firstLink.getOffset();
                if (firstLink.reverse()) {
                    offset *= -1;
                }

                offset = new Vector(0, this.reverse() ? offset * -1 : offset);

                line1 = linksSequentialArray[0].translate(offset);

                if (pathPadding === "auto") {
                    paddingStart = Math.min(firstLink.sourceNode().showIcon() ? 24 : 4, line1.length() / 4);
                    paddingEnd = Math.min(firstLink.targetNode().showIcon() ? 24 : 4, line1.length() / 4);
                }
                else if (nx.is(pathPadding, 'Array')) {
                    paddingStart = pathPadding[0];
                    paddingEnd = pathPadding[1];
                }
                else {
                    paddingStart = paddingEnd = pathPadding;
                }
                if (typeof paddingStart == 'string' && paddingStart.indexOf('%') > 0) {
                    paddingStart = line1.length() * parseInt(paddingStart, 10) / 100;
                }

                if (pathWidth === "auto") {
                    pathWidth = Math.min(10, Math.max(3, Math.round(firstLink.topology().scale() * 3)));
                }
                v1 = new Vector(0, pathWidth / 2);
                v2 = new Vector(0, -pathWidth / 2);

                pt = line1.translate(v1).pad(paddingStart, 0).start;
                d1.push('M', pt.x, pt.y);
                pt = line1.translate(v2).pad(paddingStart, 0).start;
                d2.unshift('L', pt.x, pt.y, 'Z');

                if (links.length > 1) {
                    for (var i = 1; i < count; i++) {
                        link = links[i];
                        line2 = linksSequentialArray[i].translate(new Vector(0, link.getOffset()));
                        pt = line1.translate(v1).intersection(line2.translate(v1));

                        if (isFinite(pt.x) && isFinite(pt.y)) {
                            d1.push('L', pt.x, pt.y);
                        }
                        pt = line1.translate(v2).intersection(line2.translate(v2));
                        if (isFinite(pt.x) && isFinite(pt.y)) {
                            d2.unshift('L', pt.x, pt.y);
                        }
                        line1 = line2;
                    }
                } else {
                    line2 = line1;
                }

                if (typeof paddingEnd == 'string' && paddingEnd.indexOf('%') > 0) {
                    paddingEnd = line2.length() * parseInt(paddingEnd, 10) / 100;
                }

                if (arrow == 'cap') {
                    pt = line2.translate(v1).pad(0, 2.5 * pathWidth + paddingEnd).end;
                    d1.push('L', pt.x, pt.y);
                    pt = pt.add(line2.normal().multiply(pathWidth / 2));
                    d1.push('L', pt.x, pt.y);

                    pt = line2.translate(v2).pad(0, 2.5 * pathWidth + paddingEnd).end;
                    d2.unshift('L', pt.x, pt.y);
                    pt = pt.add(line2.normal().multiply(-pathWidth / 2));
                    d2.unshift('L', pt.x, pt.y);

                    pt = line2.pad(0, paddingEnd).end;
                    d1.push('L', pt.x, pt.y);
                }
                else if (arrow == 'end') {
                    pt = line2.translate(v1).pad(0, 2 * pathWidth + paddingEnd).end;
                    d1.push('L', pt.x, pt.y);

                    pt = line2.translate(v2).pad(0, 2 * pathWidth + paddingEnd).end;
                    d2.unshift('L', pt.x, pt.y);

                    pt = line2.pad(0, paddingEnd).end;
                    d1.push('L', pt.x, pt.y);
                }
                else if (arrow == 'full') {
                    pt = line2.pad(0, paddingEnd).end;
                    d1.push('L', pt.x, pt.y);
                }
                else {
                    pt = line2.translate(v1).pad(0, paddingEnd).end;
                    d1.push('L', pt.x, pt.y);
                    pt = line2.translate(v2).pad(0, paddingEnd).end;
                    d2.unshift('L', pt.x, pt.y);
                }

                this.resolve("path").set('d', d1.concat(d2).join(' '));
                //this.resolve("path").setTransform(null, null, this.topology().stageScale());

                //todo
//                if (links.length == 1) {
//                    firstLink.resolve().watch("opacity", function (prop, value) {
//                        if (this.$ && this.resolve("path") && this.resolve("path").opacity) {
//                            this.resolve("path").opacity(value);
//                        }
//                    }, this);
//                }
            },

            _serializeLinks: function () {
                var value = this.links();
                var linksSequentialArray = [];

                var isEqual = this.isEqual;


                var firstItem = value[0];
                var secondItem = value[1];

                var firstItemSourceVector, firstItemTargetVector;

                firstItemSourceVector = firstItem.sourceVector();
                firstItemTargetVector = firstItem.targetVector();

//                if (firstItem.reverse()) {
//                    firstItemTargetVector = firstItem.sourceVector();
//                    firstItemSourceVector = firstItem.targetVector();
//                } else {
//
//                }


                if (secondItem) {
                    // todo reverse

                    var secondItemSourceVector, secondItemTargetVector;

                    if (secondItem.reverse()) {
                        secondItemTargetVector = secondItem.sourceVector();
                        secondItemSourceVector = secondItem.targetVector();
                    } else {
                        secondItemSourceVector = secondItem.sourceVector();
                        secondItemTargetVector = secondItem.targetVector();
                    }


                    if (isEqual(firstItemTargetVector, secondItemSourceVector) || isEqual(firstItemTargetVector, secondItemTargetVector)) {
                        linksSequentialArray.push(new Line(firstItemSourceVector, firstItemTargetVector));
                    } else {
                        linksSequentialArray.push(new Line(firstItemTargetVector, firstItemSourceVector));
                    }


                    if (isEqual(linksSequentialArray[0].end, secondItemSourceVector)) {
                        linksSequentialArray.push(new Line(secondItemSourceVector, secondItemTargetVector));
                    } else {
                        linksSequentialArray.push(new Line(secondItemTargetVector, secondItemSourceVector));
                    }

                    var lastTargetVector = linksSequentialArray[1].end;


                    for (var i = 2; i < value.length; i++) {

                        var link = value[i];


                        var sourceVector, targetVector;

                        if (link.reverse()) {
                            targetVector = link.sourceVector();
                            sourceVector = link.targetVector();
                        } else {
                            sourceVector = link.sourceVector();
                            targetVector = link.targetVector();
                        }

                        if (isEqual(sourceVector, lastTargetVector)) {
                            linksSequentialArray.push(new Line(sourceVector, targetVector));
                            lastTargetVector = targetVector;
                        } else {
                            linksSequentialArray.push(new Line(targetVector, sourceVector));
                            lastTargetVector = sourceVector;
                        }


                    }


                } else {
                    if (!this.reverse()) {
                        linksSequentialArray.push(new Line(firstItemSourceVector, firstItemTargetVector));
                    } else {
                        linksSequentialArray.push(new Line(firstItemTargetVector, firstItemSourceVector));
                    }

                }

                return linksSequentialArray;

            },
            isEqual: function (pos1, pos2) {

                return pos1.x == pos2.x && pos1.y == pos2.y;


            },
            dispose: function () {
                nx.each(this.nodes, function (node) {
                    node.off('updateNodeCoordinate', this.draw, this);
                }, this);
                this.dispose.__super__.apply(this, arguments);
            }


        }


    });


})(nx, nx.global);