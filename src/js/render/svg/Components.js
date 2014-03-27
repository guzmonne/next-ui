(function (nx, util, global) {
    var NS = "http://www.w3.org/2000/svg";
    var xlink = 'http://www.w3.org/1999/xlink';


    /**
     * SVG group component
     * @class nx.graphic.Group
     * @extend nx.graphic.Component
     * @module nx.graphic
     */
    nx.define("nx.graphic.Group", nx.graphic.Component, {
        view: {
            tag: 'svg:g'
        }
    });
    /**
     * SVG rect component
     * @class nx.graphic.Rect
     * @extend nx.graphic.Component
     * @module nx.graphic
     */

    nx.define("nx.graphic.Rect", nx.graphic.Component, {
        view: {
            tag: 'svg:rect'
        }
    });

    /**
     * SVG circle component
     * @class nx.graphic.Circle
     * @extend nx.graphic.Component
     * @module nx.graphic
     */
    nx.define("nx.graphic.Circle", nx.graphic.Component, {
        view: {
            tag: 'svg:circle'

        }
    });

    /**
     * SVG text component
     * @class nx.graphic.Text
     * @extend nx.graphic.Component
     * @module nx.graphic
     */
    nx.define("nx.graphic.Text", nx.graphic.Component, {
        properties: {
            /**
             * Set/get text
             * @property text
             */
            text: {
                get: function () {
                    return this._text !== undefined ? this._text : 0;
                },
                set: function (value) {
                    if (this._text !== value) {
                        this._text = value;

                        if (this.resolve('@root') && value !== undefined) {
                            var el = this.resolve("@root").$dom;
                            if ((el.nodeName == "text" || el.nodeName == "#text")) {
                                if (el.firstChild) {
                                    el.removeChild(el.firstChild);
                                }
                                el.appendChild(document.createTextNode(value));
                            }
                        }
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        },
        view: {
            tag: 'svg:text'
        }
    });

    /**
     * SVG image component
     * @class nx.graphic.Image
     * @extend nx.graphic.Component
     * @module nx.graphic
     */
    nx.define("nx.graphic.Image", nx.graphic.Component, {
        properties: {
            /**
             * Set/get image src
             * @property src
             */
            src: {
                get: function () {
                    return this._src !== undefined ? this._src : 0;
                },
                set: function (value) {
                    if (this._src !== value) {
                        this._src = value;
                        if (this.resolve('@root') && value !== undefined) {
                            var el = this.resolve("@root").$dom;
                            el.setAttributeNS(xlink, 'href', value);
                        }
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        },
        view: {
            tag: 'svg:image'
        }
    });
    /**
     * SVG path component
     * @class nx.graphic.Path
     * @extend nx.graphic.Component
     * @module nx.graphic
     */

    nx.define("nx.graphic.Path", nx.graphic.Component, {
        view: {
            tag: 'svg:path'
        }
    });
    /**
     * SVG polygon component
     * @class nx.graphic.Polygon
     * @extend nx.graphic.Path
     * @module nx.graphic
     */

    nx.define("nx.graphic.Polygon", nx.graphic.Path, {
        properties: {
            nodes: {
                /**
                 * Set/get point array to generate a polygon shape
                 * @property nodes
                 */
                get: function () {
                    return this._nodes || [];
                },
                set: function (value) {
                    this._nodes = value;
                    var vertices = value;
                    if (vertices.length !== 0) {
                        if (vertices.length == 1) {
                            var point = vertices[0];
                            vertices.push({x: point.x - 1, y: point.y - 1});
                            vertices.push({x: point.x + 1, y: point.y - 1});
                        } else if (vertices.length == 2) {
                            vertices.push([vertices[0].x + 1, vertices[0].y + 1]);
                            vertices.push(vertices[1]);
                        }

                        var nodes = nx.data.Convex.process(vertices);
                        var path = [];
                        path.push('M ', nodes[0].x, ' ', nodes[0].y);
                        for (var i = 1; i < nodes.length; i++) {
                            if (!nx.is(nodes[i], 'Array')) {
                                path.push(' L ', nodes[i].x, ' ', nodes[i].y);
                            }

                        }
                        path.push(' Z');
                        this.set("d", path.join(''));
                    }

                }
            }
        }
    });

    nx.define("nx.graphic.Triangle", nx.graphic.Path, {
        properties: {
            width: {
                get: function () {
                    return this._width !== undefined ? this._width : 0;
                },
                set: function (value) {
                    if (this._width !== value) {
                        this._width = value;
                        this._draw();
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            height: {
                get: function () {
                    return this._height !== undefined ? this._height : 0;
                },
                set: function (value) {
                    if (this._height !== value) {
                        this._height = value;
                        this._draw();
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        },
        methods: {
            _draw: function () {
                if (this._width && this._height) {
                    var path = [];
                    path.push('M ', this._width / 2, ' ', 0);
                    path.push(' L ', this._width, ' ', this._height);
                    path.push(' L ', 0, ' ', this._height);
                    path.push(' Z');
                    this.set("d", path.join(''));
                }


            }
        }
    });


    /**
     * SVG BezierCurves component
     * @class nx.graphic.BezierCurves
     * @extend nx.graphic.Path
     * @module nx.graphic
     */

    nx.define("nx.graphic.BezierCurves", nx.graphic.Path, {
        properties: {
            /**
             * set/get start point'x
             * @property x1
             */
            x1: {
                set: function (value) {
                    this._x1 = value;
                    this._buildPath();
                },
                get: function () {
                    return this._x1 || 0;
                }
            },
            /**
             * set/get start point'y
             * @property y1
             */
            y1: {
                set: function (value) {
                    this._y1 = value;
                    this._buildPath();
                },
                get: function () {
                    return this._y1 || 0;
                }
            },
            /**
             * set/get end point'x
             * @property x2
             */
            x2: {
                set: function (value) {
                    this._x2 = value;
                    this._buildPath();
                },
                get: function () {
                    return this._x2 || 0;
                }
            },
            /**
             * set/get end point'x
             * @property y2
             */
            y2: {
                set: function (value) {
                    this._y2 = value;
                    this._buildPath();
                },
                get: function () {
                    return this._y2 || 0;
                }
            },
            isClockwise: {
                value: true
            },
            straight: {
                value: false
            }
        },
        methods: {
            _buildPath: function () {
                var x1 = this.x1();
                var x2 = this.x2();
                var y1 = this.y1();
                var y2 = this.y2();

                var d;

                if (x1 !== null && x2 !== null && y1 !== null && y2 !== null) {
                    var dx = (x1 - x2);
                    var dy = (y2 - y1);
                    var dr = Math.sqrt((dx * dx + dy * dy));


                    if (this.straight()) {
                        d = "M" + x1 + "," + y1 + " " + x2 + "," + y2;
                    } else if (this.isClockwise()) {
                        d = "M" + x2 + "," + y2 +
                            "A " + dr + " " + dr + ", 0, 0, 1, " + x1 + "," + y1 +
                            "A " + (dr - 0) + " " + (dr - 0) + ", 0, 0, 0, " + x2 + "," + y2;
                    } else {
                        d = "M" + x2 + "," + y2 +
                            "A " + dr + " " + dr + ", 0, 0, 0, " + x1 + "," + y1 +
                            "A " + (dr - 0) + " " + (dr - 0) + ", 0, 0, 1, " + x2 + "," + y2;
                    }

                    return this.set("d", d);

                } else {
                    return null;
                }
            }
        }
    });

    /**
     * SVG line component
     * @class nx.graphic.Line
     * @extend nx.graphic.Component
     * @module nx.graphic
     */
    nx.define("nx.graphic.Line", nx.graphic.Component, {
        view: {
            tag: 'svg:line'
        }
    });

    /**
     * SVG icon component, which icon's define in nx framework
     * @class nx.graphic.Icon
     * @extend nx.graphic.Component
     * @module nx.graphic
     */
    nx.define("nx.graphic.Icon", nx.graphic.Component, {
        view: {
            tag: 'svg:use',
            props: {
                style: 'fill:orange'
            }
        },
        properties: {
            /**
             * set/get icon's type
             * @property iconType
             */
            iconType: {
                get: function () {
                    return this._iconType;
                },
                set: function (value) {
                    var icon = nx.graphic.Icons.get(value);
                    var size = icon.size;
                    this.size(size);
                    this._iconType = icon.name;

                    this.view().dom().$dom.setAttributeNS(xlink, 'xlink:href', '#' + value);
                }
            },
            /**
             * set/get icon size
             * @property size
             */
            size: {
                get: function () {
                    return this._size || {
                        width: 36,
                        height: 36
                    };
                },
                set: function (value) {
                    this._size = value;
                    this.setTransform(value.width / -2, value.height / -2);
                }
            }
        }
    });
    /**
     * SVG root component
     * @class nx.graphic.Stage
     * @extend nx.ui.Component
     * @module nx.graphic
     */
    nx.define("nx.graphic.Stage", nx.ui.Component, {
        events: ['dragStageStart', 'dragStage', 'dragStageEnd'],
        view: {
            tag: 'svg:svg',
            props: {
                'class': 'n-svg',
                version: '1.1',
                xmlns: "http://www.w3.org/2000/svg",
                'xmlns:xlink': 'http://www.w3.org/1999/xlink',
                style: {
                    width: '{#width}',
                    height: '{#height}'
                }
            },
            content: [
                {
                    name: 'defs',
                    tag: 'svg:defs'
                },
                {
                    name: 'bg',
                    type: 'nx.graphic.Rect',
                    props: {
                        visible: false,
                        fill: '#f00'
                    }
                },
                {
                    name: 'stage',
                    type: 'nx.graphic.Group',
                    props: {
                        'class': 'stage',
                        scale: '{#scale,direction=<>}',
                        translateX: '{#translateX,direction=<>}',
                        translateY: '{#translateY,direction=<>}'
                    }
                }
            ],
            events: {
                'mousedown': '{#_mousedown}',
                'dragstart': '{#_dragstart}',
                'dragmove': '{#_drag}',
                'dragend': '{#_dragend}'
            }
        },
        properties: {
            /**
             * set/get stage's width
             * @property width
             */
            width: {value: 0},
            /**
             * set/get stage's height
             * @property height
             */
            height: {value: 0},
            /**
             * set/get content's scale
             * @property scale
             */
            scale: {value: 1},
            /**
             * set/get content's x translate
             * @property translateX
             */
            translateX: {value: 0},
            /**
             * set/get content's y translate
             * @property translateY
             */
            translateY: {value: 0},
            /**
             * set/get content translate object
             * @property translate
             */
            translate: {
                get: function () {
                    return{
                        x: this._translateX,
                        y: this._translateY
                    };
                },
                set: function (value) {
                    if (value && value.x != null && value.y != null) {
                        this.setTransform(value.x, value.y);
                    }
                }
            },
            /**
             * get content group element
             * @property stage
             */
            stage: {
                get: function () {
                    return this.resolve("stage");
                }
            }
        },
        methods: {
            getContainer: function () {
                return this.resolve('stage').resolve("@root");
            },
            /**
             * Add svg def element into the stage
             * @method addDef
             * @param el {SVGDOM}
             */
            addDef: function (el) {
                this.resolve("defs").resolve("@root").$dom.appendChild(el);
            },
            /**
             * Add svg def element into the stage in string format
             * @method addDefString
             * @param str {String}
             */
            addDefString: function (str) {
                this.resolve("defs").resolve("@root").$dom.appendChild(new DOMParser().parseFromString(str, "text/xml").documentElement);
            },
            /**
             * Get content's relative bound
             * @method getContentBound
             * @returns {{left: number, top: number, width: Number, height: Number}}
             */
            getContentBound: function () {
                var stageBound = this.stage().getBound();
                var topoBound = this.view().dom().getBound();

                return {
                    left: stageBound.left - topoBound.left,
                    top: stageBound.top - topoBound.top,
                    width: stageBound.width,
                    height: stageBound.height
                };
            },
            /**
             * set/get content's transform
             * @method setTransform
             * @param [translateX] {Number} x axle translate
             * @param [translateY] {Number} y axle translate
             * @param [scale] {Number} element's scale
             * @param [duration=0] {Number} transition time, unite is second
             */
            setTransform: function (translateX, translateY, scale, duration) {

                var stage = this.stage();
                stage.setTransform(translateX, translateY, scale, duration);
                stage.notify('translateX');
                stage.notify('translateY');
                stage.notify('scale');
            },
            _mousedown: function (sender, event) {
                event.captureDrag(sender);
            },
            _dragstart: function (sender, event) {
                this.resolve("stage").resolve("@root").setStyle('pointer-events', 'none');
                this.fire('dragStageStart', event);
            },
            _drag: function (sender, event) {
                this.fire('dragStage', event);
            },
            _dragend: function (sender, event) {
                this.fire('dragStageEnd', event);
                this.resolve("stage").resolve("@root").setStyle('pointer-events', 'all');
            }
        }
    });

    /**
     * SVG topology svg component, add all icon's to svg's def.
     * @class nx.graphic.TopologyStage
     * @extend nx.graphic.Stage
     * @module nx.graphic
     */
    nx.define("nx.graphic.TopologyStage", nx.graphic.Stage, {
        events: [],
        methods: {
            init: function (args) {
                this.inherited(args);


                var linearGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
                linearGradient.setAttribute("id", "disable");
                linearGradient.setAttribute("x1", "0%");
                linearGradient.setAttribute("y1", "0%");
                linearGradient.setAttribute("x2", "100%");
                linearGradient.setAttribute("y2", "100%");


                var stop = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                stop.setAttribute("offset", "0%");
                stop.setAttribute("style", "stop-color:rgb(255,255,0);stop-opacity:1");


                var stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                stop2.setAttribute("offset", "100%");
                stop2.setAttribute("style", "stop-color:rgb(255,0,0);stop-opacity:1");


                linearGradient.appendChild(stop);
                linearGradient.appendChild(stop2);

                this.resolve("defs").resolve("@root").$dom.appendChild(linearGradient);


                nx.each(nx.graphic.Icons.icons, function (iconObj, key) {
                    if (iconObj.icon) {
                        var icon = iconObj.icon.cloneNode(true);
                        icon.setAttribute("height", iconObj.size.height);
                        icon.setAttribute("width", iconObj.size.width);
                        icon.setAttribute("data-device-type", key);
                        icon.setAttribute("id", key);
                        icon.setAttribute("class", 'deviceIcon');
                        this.addDef(icon);
                    }
                }, this);

            }
        }
    });
})(nx, nx.util, nx.global);