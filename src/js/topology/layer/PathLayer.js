(function (nx, util, global) {

    var Vector = nx.math.Vector;
    var Line = nx.math.Line;
    var colorIndex = 0;
    var colorTable = ['#b2e47f', '#e4e47f', '#bec2f9', '#b6def7', '#89f0de'];
    /**
     * A topology path class
     Path's background colors : ['#b2e47f', '#e4e47f', '#bec2f9', '#b6def7', '#89f0de']
     * @class nx.graphic.Topology.Path
     */

    nx.graphic.define("nx.graphic.Topology.Path", {
        view: {
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
             * Get/set a path's gutter
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
             * @property
             */
            links: {
                set: function (value) {
                    this._links = value;
                },
                get: function () {
                    return this._links || [];
                }

            },
            reverse: {
                value: false
            },
            owner: {

            }
        },
        methods: {

            init: function (props) {
                this.inherited(props);
                var pathStyle = this.pathStyle();
                this.resolve("path").sets(pathStyle);
                if (!pathStyle["fill"]) {
                    this.resolve("path").setAttribute("fill", colorTable[colorIndex++ % 5]);
                }
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

                this._serializeLinks();


                var links = this.links();
                var linksSequentialArray = this.linksSequentialArray;
                var count = links.length;

                //first
                var firstLink = links[0];
                var gutter = new Vector(0, this.reverse() ? firstLink.getGutter() * -1 : firstLink.getGutter());

                line1 = linksSequentialArray[0].translate(gutter);

                if (pathPadding === "auto") {
                    paddingStart = Math.min(firstLink.getSourceNode().showIcon() ? 24 : 4, line1.length() / 4);
                    paddingEnd = Math.min(firstLink.getTargetNode().showIcon() ? 24 : 4, line1.length() / 4);
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
                v1 = new Vector(0, pathWidth / 2), v2 = new Vector(0, -pathWidth / 2);

                pt = line1.translate(v1).pad(paddingStart, 0).start;
                d1.push('M', pt.x, pt.y);
                pt = line1.translate(v2).pad(paddingStart, 0).start;
                d2.unshift('L', pt.x, pt.y, 'Z');

                if (links.length > 1) {
                    for (var i = 1; i < count; i++) {
                        link = links[i];
                        line2 = linksSequentialArray[i].translate(new Vector(0, link.getGutter()));
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

                this.resolve("path").setAttribute('d', d1.concat(d2).join(' '));


                //todo
                if (links.length == 1) {
                    firstLink.resolve().watch("opacity", function (prop, value) {
                        if (this.$ && this.resolve("path") && this.resolve("path").opacity) {
                            this.resolve("path").opacity(value);
                        }
                    }, this);
                }
            },

            _serializeLinks: function () {
                var value = this.links();
                var linksSequentialArray = this.linksSequentialArray = [];

                var isEqual = this.isEqual;


                var firstItem = value[0];
                var secondItem = value[1];

                var firstItemsourceVector = firstItem.sourceVector();
                var firstItemtargetVector = firstItem.targetVector();


                if (secondItem) {
                    // todo reverse
                    var secondItemsourceVector = secondItem.sourceVector();
                    var secondItemtargetVector = secondItem.targetVector();

                    if (isEqual(firstItemtargetVector, secondItemsourceVector) || isEqual(firstItemtargetVector, secondItemtargetVector)) {
                        linksSequentialArray.push(new Line(firstItemsourceVector, firstItemtargetVector));
                    } else {
                        linksSequentialArray.push(new Line(firstItemtargetVector, firstItemsourceVector));
                    }


                    if (isEqual(linksSequentialArray[0].end, secondItemsourceVector)) {
                        linksSequentialArray.push(new Line(secondItemsourceVector, secondItemtargetVector));
                    } else {
                        linksSequentialArray.push(new Line(secondItemtargetVector, secondItemsourceVector));
                    }

                    var lastTargetVector = linksSequentialArray[1].end;


                    for (var i = 2; i < value.length; i++) {

                        var link = value[i];
                        var sourceVector = link.sourceVector();
                        var targetVector = link.targetVector();

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
                        linksSequentialArray.push(new Line(firstItemsourceVector, firstItemtargetVector));
                    } else {
                        linksSequentialArray.push(new Line(firstItemtargetVector, firstItemsourceVector));
                    }

                }

            },
            isEqual: function (pos1, pos2) {

                return pos1.x == pos2.x && pos1.y == pos2.y;


            }


        }



    });


    /**
     * Path layer class
     Could use topo.getLayer("pathLayer") get this
     * @class nx.graphic.Topology.PathLayer
     * @extend nx.graphic.Topology.Layer
     */
    nx.define("nx.graphic.Topology.PathLayer", nx.graphic.Topology.Layer, {
        properties: {
        },
        methods: {
            draw: function () {

                this._paths = [];

                this.topology().on("updating", this._draw, this);
                this.topology().on("zoomend", this._draw, this);
                this.topology().watch("showIcon", this._draw, this);
                this.topology().watch("scale", this._draw, this);

                this._draw();


            },
            _draw: function () {
                nx.each(this._paths, function (path) {
                    path.draw();
                });
            },
            /**
             * Add a path to topology
             * @param path {nx.graphic.Topology.Path}
             * @method addPath
             */
            addPath: function (path) {
                this._paths.push(path);
                this.appendChild(path);
                path.draw();

                //
            },
            removePath: function (path) {
                var index = util.indexOf(this._paths, path);
                this._paths.splice(index, 1);
                this.removeChild(path);

            },
            clear: function () {
                this._paths = [];

                this.topology().off("updating", this._draw, this);
                this.topology().off("zoomend", this._draw, this);
                this.topology().unwatch("internalShowIcon", this._draw, this);
                this.topology().unwatch("scale", this._draw, this);

                this.inherited();
            }
        }
    });


})(nx, nx.graphic.util, nx.global);