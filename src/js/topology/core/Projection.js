(function (nx, util, global) {

    nx.define("nx.graphic.Topology.Projection", {
        events: ['projectionChange', 'zooming', 'zoomend'],
        properties: {
            /**
             * @property maxScale
             */
            maxScale: {
                value: 12
            },
            /**
             * @property minScale
             */
            minScale: {
                value: 0.2
            },
            /**
             * @property scalable
             */
            scalable: {
                value: true
            },
            /**
             * @property scale
             */
            scale: {
                set: function (value) {
                    var scale = Math.max(Math.min(this.maxScale(), value), this.minScale());
                    if (scale !== this._scale) {
                        this._zoom(scale, this._scale || 1);
                        this._scale = scale;
//                        this.adjustLayout();
                    }
                },
                get: function () {
                    return this._scale || 1;
                }
            },
            /**
             * Auto detect node overlap
             * @property autoRevision
             */
            revisionScale: {
                value: 1
            },
            scaleX: {
                get: function () {
                    return this.projectionX();
                }
            },
            scaleY: {
                get: function () {
                    return this.projectionY();
                }
            },
            /**
             * @property projectionX
             */
            projectionX: {
                value: function () {
                    return new nx.data.Projection();
                }
            },
            /**
             * @property projectionY
             */
            projectionY: {
                value: function () {
                    return new nx.data.Projection();
                }
            },
            useProjection: {
                value: true
            },
            projectionXRange: {
            },
            projectionYRange: {
            },
            _zoomCenterPointX: {
                value: 0
            },
            _zoomCenterPointY: {
                value: 0
            },
            useZoomingAnimation: {
                value: true
            }
        },
        methods: {
            /**
             * Set input of topology scaling, input is from data,output is stage
             * @private
             */
            _setProjection: function (force, isNotify) {
                var graph = this.model();
                var visibleContainerWidth = this.containerWidth();
                var visibleContainerHeight = this.containerHeight();

                //

                if (graph.vertices.length === 0 || (visibleContainerWidth === 0 && visibleContainerWidth === 0)) {
                    return;
                }


                var projectionX = this.projectionX();
                var projectionY = this.projectionY();


                var useProjection = this.useProjection();
                var projectionXRange = this.projectionXRange();
                var projectionYRange = this.projectionYRange();

                var bound;

                if (force || !this._dataBound) {
                    bound = this._dataBound = graph.getBound();
                } else {
                    bound = this._dataBound;
                }


                var xInput, xOutput, yInput, yOutput;


                if (useProjection) {

                    if (projectionXRange) {
                        bound.x = Math.min(projectionXRange[0], projectionXRange[1]);
                        bound.maxX = Math.max(projectionXRange[0], projectionXRange[1]);
                        bound.width = Math.abs(projectionXRange[0] - projectionXRange[1]);

                    }

                    if (projectionYRange) {
                        bound.y = Math.min(projectionYRange[0], projectionYRange[1]);
                        bound.maxY = Math.max(projectionYRange[0], projectionYRange[1]);
                        bound.height = Math.abs(projectionYRange[0] - projectionYRange[1]);
                    }


                    if (bound.width === 0 && bound.height === 0) {
                        xInput = [bound.x - visibleContainerWidth / 2, bound.x + visibleContainerWidth / 2];
                        xOutput = [0, visibleContainerWidth];

                        yInput = [bound.y - visibleContainerHeight / 2, bound.y + visibleContainerHeight / 2];
                        yOutput = [0, visibleContainerHeight];
                    } else if (bound.width === 0) {
                        xInput = [bound.x - visibleContainerWidth / 2, bound.x + visibleContainerWidth / 2];
                        xOutput = [0, visibleContainerWidth];

                        yInput = [bound.y, bound.maxY];
                        yOutput = [0, visibleContainerHeight];
                    } else if (bound.height === 0) {
                        xInput = [bound.x, bound.maxX];
                        xOutput = [0, visibleContainerWidth];

                        yInput = [bound.y - visibleContainerHeight / 2, bound.y + visibleContainerHeight / 2];
                        yOutput = [0, visibleContainerHeight];
                    } else {
                        var heightRate = visibleContainerHeight / bound.height;
                        var widthRate = visibleContainerWidth / bound.width;
                        if (heightRate < widthRate) {
                            var _width = bound.width * heightRate;

                            xInput = [bound.x, bound.maxX];
                            xOutput = [visibleContainerWidth / 2 - _width / 2, visibleContainerWidth / 2 + _width / 2];

                            yInput = [bound.y, bound.maxY];
                            yOutput = [0, visibleContainerHeight];
                        } else {
                            var _height = bound.height * widthRate;
                            xInput = [bound.x, bound.maxX];
                            xOutput = [0, visibleContainerWidth];

                            yInput = [bound.y, bound.maxY];
                            yOutput = [visibleContainerHeight / 2 - _height / 2, visibleContainerHeight / 2 + _height / 2];
                        }
                    }


                } else {
                    this.padding(0);

                    visibleContainerWidth = this.width();
                    visibleContainerHeight = this.height();
                    var scale = this.scale();


                    if (projectionXRange) {
                        xInput = [projectionXRange[0], projectionXRange[1]];
                        xOutput = [0, scale * visibleContainerWidth];
                    } else {
                        xInput = [0, visibleContainerWidth];
                        xOutput = [0, scale * visibleContainerWidth];
                    }

                    if (projectionYRange) {
                        yInput = [projectionYRange[0], projectionYRange[1]];
                        yOutput = [0, scale * visibleContainerHeight];
                    } else {
                        yInput = [0, visibleContainerHeight];
                        yOutput = [0, scale * visibleContainerHeight];
                    }

                }

                var isUpdate = false;
                var _xInput = projectionX.input(), _xOutput = projectionX.output(), _yInput = projectionY.input(), _yOutput = projectionY.output();


                if (_xInput[0] !== xInput[0] || _xInput[1] !== xInput[1]) {
                    projectionX.input(xInput);
                    isUpdate = true;
                }

                if (_xOutput[0] !== xOutput[0] || _xOutput[1] !== xOutput[1]) {
                    projectionX.output(xOutput);
                    isUpdate = true;
                }

                if (_yInput[0] !== yInput[0] || _yInput[1] !== yInput[1]) {
                    projectionY.input(yInput);
                    isUpdate = true;
                }

                if (_yOutput[0] !== yOutput[0] || _yOutput[1] !== yOutput[1]) {
                    projectionY.output(yOutput);
                    isUpdate = true;
                }


                if (isNotify !== false && isUpdate) {
                    this.fire("projectionChange");
                }
            },
            getX: function (value) {
                return this.projectionX().get(value) || value;
            },
            getY: function (value) {
                return this.projectionY().get(value) || value;
            },


            _zoom: (function () {
                var timer;
                var prevScale = 1;
                var ani;
                return function (newValue, oldValue) {
                    var stage = this.stage();
                    var width = this.width() - this.paddingLeft() * 2;
                    var height = this.height() - this.paddingTop() * 2;
                    var translateX = stage.translateX();
                    var translateY = stage.translateY();
                    var _translateX, _translateY;

                    var step = newValue - oldValue;

                    var _zoomCenterPointX = this._zoomCenterPointX();
                    var _zoomCenterPointY = this._zoomCenterPointY();


                    if (_zoomCenterPointX && _zoomCenterPointY) {
                        var x = (_zoomCenterPointX - translateX) / oldValue * step;
                        var y = (_zoomCenterPointY - translateY) / oldValue * step;

                        _translateX = translateX - x;
                        _translateY = translateY - y;

                    } else {

                        var pl = (width) * step / 2;
                        var pt = (height) * step / 2;

                        _translateX = translateX - pl;
                        _translateY = translateY - pt;
                    }


                    stage.setTransform(_translateX, _translateY, newValue / prevScale);


                    this.fire("zooming");


                    //return;


                    clearTimeout(timer);
                    timer = setTimeout(function () {


//                        if (ani) {
//                            ani.stop();
//                        }
//                        if (this.useZoomingAnimation()) {
//                            if (Math.abs(newValue - prevScale) < 1.4) {
//                                this._setProjection();
//                                stage.scale(1);
//                                this.adjustLayout();
//                                this.fire("zoomend");
//                                stage.setStyle("opacity", 1);
//
//                            } else {
//                                new nx.util.Animation({
//                                    duration: 600,
//                                    autoStart: true,
//                                    context: this,
//                                    callback: function (index) {
//                                        stage.setStyle("opacity", 1 - index);
//                                    },
//                                    complete: function () {
//                                        this._setProjection();
//                                        stage.scale(1);
//                                        this.adjustLayout();
//                                        this.fire("zoomend");
//                                        stage.setStyle("opacity", 1);
//                                    }
//                                });
//                            }
//
//                        } else {
//
//                            this.adjustLayout();
//                            this.fire("zoomend");
//                            stage.setStyle("opacity", 1);
//                        }

//

                        this._setProjection();
                        stage.setTransform(null, null, 1, 0);
                        this.fire("zoomend");
                        prevScale = newValue;
                    }.bind(this), 300);
                };
            })(),
            /**
             * Zoom topology
             * @param value
             * @method zoom
             */
            zoom: function (value) {
                var scale = this.scale();
                var gap = value - scale;
                var index = 0;
                var self = this;

                if (gap) {

                    new nx.util.Animation({
                        duration: 600,
                        autoStart: true,
                        context: this,
                        callback: function (index) {
                            self.scale(scale + gap * index);
                        }
                    });
                }
            },

            zoomByBound: function (bound) {

                var self = this;
                var offset = Math.max(bound.width, bound.height) * 0.05;
                var scale = this.scale();
                var tx = this.stage().translateX();
                var ty = this.stage().translateY();
                var bt = bound.top - offset;
                var bl = bound.left - offset;
                var bw = bound.width + offset * 2;
                var bh = bound.height + offset * 2;

                var scaleH = this.height() / (bh / scale);
                var scaleW = this.width() / (bw / scale);


                scaleH = Math.max(Math.min(this.maxScale(), scaleH), this.minScale());
                scaleW = Math.max(Math.min(this.maxScale(), scaleW), this.minScale());

                var scaleI;

                if (this.rect) {
                    this.rect.destroy();
                }

                //for debugger
//                if (1) {
//
//                    var rect = this.rect = new nx.graphic.Rect({
//                        x: bound.left - tx,
//                        y: bound.top - ty,
//                        opacity: 0.3,
//                        width: bw,
//                        height: bh,
//                        fill: "#f00"
//                    });
//
//
//                    this.stage().prependChild(rect);
//                }


                if (scaleH > scaleW) {
                    scaleI = scaleW;
                    this._zoomCenterPointX(((bl - tx) / scale * scaleI + tx) / (scaleI - scale) * scale + tx);
                    this._zoomCenterPointY(( ty + (bt - ty + bh / 2) / scale * scaleI - this.height() / 2) / (scaleI - scale) * scale + ty);


                } else {
                    scaleI = scaleH;
                    this._zoomCenterPointY(((bt - ty) / scale * scaleI + ty) / (scaleI - scale) * scale + ty);
                    this._zoomCenterPointX(( tx + (bl - tx + bw / 2) / scale * scaleI - this.width() / 2) / (scaleI - scale) * scale + tx);

                }

                // console.log(bound, scaleI);

                var index = 0.1;
                if (this._zoomAnimation) {
                    this.stopZoomAnimation();
                }


                this._zoomAnimation = new nx.util.Animation({
                    duration: 900,
                    autoStart: true,
                    context: this,
                    callback: function (index) {
                        //topo.scale(scale + (scaleI - scale) * index);
                        //topo.scale(scale + (scaleI - scale) * Math.sqrt(index));
                        // var rate = Math.pow(index, 3);
                        //this.scale(scale + (scaleI - scale) * rate);
                        var rate;
                        if (( index *= 2 ) < 1) {
                            rate = 0.5 * index * index;
                        } else {
                            rate = -0.5 * ( --index * ( index - 2 ) - 1 );
                        }

                        this.scale(scale + (scaleI - scale) * rate);

                        //this.scale(scale + (scaleI - scale) * Math.sin(index * Math.PI / 2));
                    },
                    complete: function () {
                        this._zoomAnimation = null;
                        this._zoomCenterPointX(0);
                        this._zoomCenterPointY(0);
                    }
                });

            },
            stopZoomAnimation: function () {
                this._zoomAnimation.stop();
                this._zoomAnimation = null;
                this._zoomCenterPointX(0);
                this._zoomCenterPointY(0);
            },

            zoomByNodes: function (nodes) {
                var bound = this.getBoundByNodes(nodes);
                this.zoomByBound(bound);
            },
            /**
             * Detect nodes overlap and notify appropriate scale value
             * @method adjustLayout
             */

            adjustLayout: function () {

                return;

//                clearTimeout(this._adjustLayoutTimer);
//                this._adjustLayoutTimer = util.timeout(function () {
//
//                    var model = this.model();
//
//                    if (model) {
//                        var length = this.model().getVisibleVertices().length;
//
//                        if (length !== 0 && this.stage) {
//                            var bound = this.getLayer("nodes").getBBox();
//                            var threshold = 12000;
//                            var percell = (bound.width * bound.height) / length;
//                            var revisionScale;
//
//                            if (length < 3) {
//                                revisionScale = 1;
//                            } else if (percell < threshold / 2) {
//                                revisionScale = 0.4;
//                            } else if (percell < threshold / 1.5) {
//                                revisionScale = 0.6;
//                            } else if (percell < threshold) {
//                                revisionScale = 0.8;
//                            } else {
//                                revisionScale = 1;
//                            }
//
//
//                            if (this.autoToggleIcon()) {
//                                if (revisionScale < 0.5) {
//                                    this.showIcon(false);
//                                } else {
//                                    this.showIcon(true);
//                                }
//                            } else {
//                                this.showIcon(false);
//                            }
//
//                            this.revisionScale(revisionScale);
//                        }
//                    }
//                }, 60, this);
            }


        }
    });

})(nx, nx.graphic.util, nx.global);