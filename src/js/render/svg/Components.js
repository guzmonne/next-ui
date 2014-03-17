(function (nx, util, global) {


    nx.define("nx.graphic.Group", nx.graphic.SVGComponent, {
        view: {
            tag: 'svg:g'
        },
        methods: {
            move: function (x, y) {
                if (x) {
                    this.set("translateX", parseFloat(this.get("translateX")) + parseFloat(x));
                }
                if (y) {
                    this.set("translateY", parseFloat(this.get("translateY")) + parseFloat(y));
                }
            }
        }
    });


    nx.define("nx.graphic.Rect", nx.graphic.SVGComponent, {
        view: {
            tag: 'svg:rect'
        }
    });


    nx.define("nx.graphic.Circle", nx.graphic.SVGComponent, {
        view: {
            tag: 'svg:circle'

        }
    });


    nx.define("nx.graphic.Text", nx.graphic.SVGComponent, {
        view: {
            tag: 'svg:text'
        }
    });


    nx.define("nx.graphic.Image", nx.graphic.SVGComponent, {
        view: {
            tag: 'svg:image'
        }
    });

    nx.define("nx.graphic.Path", nx.graphic.SVGComponent, {
        view: {
            tag: 'svg:path'
        }
    });


    nx.define("nx.graphic.Polygon", nx.graphic.Path, {
        properties: {
            nodes: {
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

    nx.define("nx.graphic.BezierCurves", nx.Path, {
        properties: {
            x1: {
                set: function (value) {
                    this._x1 = value;
                    this._buildPath();
                },
                get: function () {
                    return this._x1 || 0;
                }
            },
            y1: {
                set: function (value) {
                    this._y1 = value;
                    this._buildPath();
                },
                get: function () {
                    return this._y1 || 0;
                }
            },
            x2: {
                set: function (value) {
                    this._x2 = value;
                    this._buildPath();
                },
                get: function () {
                    return this._x2 || 0;
                }
            },
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


    nx.define("nx.graphic.Line", nx.graphic.SVGComponent, {
        view: {
            tag: 'svg:line'
        }
    });

    nx.define("nx.graphic.Icon", nx.graphic.SVGComponent, {
        view: {
            tag: 'svg:use'
        },
        properties: {
            iconType: {
                get: function () {
                    return this._iconType;
                },
                set: function (value) {
                    var icon = nx.graphic.Icons.get(value);
                    var size = icon.size;
                    this.size(size);
                    this._iconType = icon.name;
                    this.set('xlink:href', "#" + icon.name);
                }
            },
            size: {
                get: function () {
                    return this._size || {
                        width: 36,
                        height: 36
                    };
                },
                set: function (value) {
                    this._size = value;
                    this.set("translateX", value.width / -2);
                    this.set("translateY", value.height / -2);
                }
            }
        }
    });

    nx.define("nx.graphic.Stage", nx.ui.Component, {
        events: ['dragStageStart', 'dragStage', 'dragStageEnd'],
        view: {
            tag: 'svg:svg',
            props: {
                'class': 'n-svg',
                width: '{#width}',
                height: '{#height}',
                version: '1.1',
                xmlns: "http://www.w3.org/2000/svg",
                'xmlns:xlink': 'http://www.w3.org/1999/xlink'
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
            width: {value: 0},
            height: {value: 0},
            scale: {value: 1},
            translateX: {value: 0},
            translateY: {value: 0},
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
            addDef: function (el) {
                this.resolve("defs").resolve("@root").$dom.appendChild(el);
            },
            addDefString: function (str) {
                this.resolve("defs").resolve("@root").$dom.appendChild(new DOMParser().parseFromString(str, "text/xml").documentElement);
            },
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
            setTransform: function (translateX, translateY, scale, durition) {

                var stage = this.stage();
                stage.setTransform(translateX, translateY, scale, durition);
                stage.notify('translateX');
                stage.notify('translateY');
                stage.notify('scale');


//                var tx = translateX != null ? translateX : this._translateX;
//                var ty = translateY != null ? translateY : this._translateY;
//                var scl = scale != null ? scale : this._scale;
//                //var rot = rotate != null ? rotate : this._rotate || 0;
//
//
//                var cssText = '-webkit-transform: translate(' + tx + 'px, ' + ty + 'px) scale(' + scl + ');';
//                if (durition) {
//                    cssText += '-webkit-transition: all ' + durition + 's ease;' + 'transition: all ' + durition + 's ease;';
//                }
//                this.stage().view().dom().$dom.style.cssText = cssText;
//                this._translateX = tx;
//                this._translateY = ty;
//                this._scale = scl;
                //this._rotate = rot;
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