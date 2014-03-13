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
                get: function () {
                    return this._scale || 1;
                },
                set: function (value) {
                    var scale = Math.max(Math.min(this._maxScale, value), this._minScale);
                    if (scale !== this._scale) {
                        this._zoom(scale);
                    }
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
            enableGradualScaling: {
                value: true
            }
        },
        methods: {
            /**
             * Set input of topology scaling, input is from data,output is stage
             * @private
             */
            _setProjection: function (force, isNotify) {
                var graph = this.graph();
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
            getProjectedX: function (value) {
                return this.projectionX().get(value) || value;
            },
            getProjectedY: function (value) {
                return this.projectionY().get(value) || value;
            },
            getProjectedPosition: function (position) {
                return{
                    x: this.projectionX().get(position.x),
                    y: this.projectionY().get(position.y)
                };
            },
            _getScaleTranslate: function () {
                var stage = this.stage();
                var width = this.width();
                var height = this.height();
                var scale = this._scale = Math.max(Math.min(this._maxScale, this._scale), this._minScale);
                var _scale = this._prevScale || 1;
                var finialScale = this._finialScale || 1;
                var step = scale - _scale;
                var translateX = stage.translateX();
                var translateY = stage.translateY();
                var _translateX, _translateY;
                var _zoomCenterPoint = this._zoomCenterPoint;

                if (!_zoomCenterPoint) {
                    _zoomCenterPoint = {
                        x: width / 2,
                        y: height / 2
                    };
                }

                var x = (_zoomCenterPoint.x - translateX) / _scale * step;
                var y = (_zoomCenterPoint.y - translateY) / _scale * step;

                return{
                    x: translateX - x,
                    y: translateY - y
                };
            },

            _zoom: function (inScale, inAnimationTime, inFN) {
                var stage = this.stage();
                var scale = this._scale = Math.max(Math.min(this._maxScale, inScale), this._minScale);
                var finialScale = this._finialScale || 1;
                var translate = this._getScaleTranslate();

                if (this.__zoomTimer) {
                    clearTimeout(this.__zoomTimer);
                }

                var completeFN = function () {
                    this._setProjection();
                    stage.setTransform(translate.x, translate.y, 1, 0);
                    this._finialScale = this._scale;
                    if (inFN) {
                        inFN.call(this);
                    }
                    this.fire("zoomend");
                }.bind(this);

                this.fire("zooming");

                stage.setTransform(translate.x, translate.y, scale / finialScale, inAnimationTime || 0);

                if (inAnimationTime) {
                    stage.upon('transitionend', completeFN, this);
                } else {
                    this.__zoomTimer = setTimeout(completeFN, 50);
                }
                this._prevScale = scale;


                this.notify('scale');
            },
            _gradualZoom: function () {
                var stage = this.stage();
                var scale = this._scale = Math.max(Math.min(this._maxScale, this._scale), this._minScale);
                var finialScale = this._finialScale || 1;
                var translate = this._getScaleTranslate();

                if (this.__zoomTimer) {
                    clearTimeout(this.__zoomTimer);
                }


                if (!this.__zoomIndex) {
                    this.__zoomIndex = 1;
                }


                var resetScaleFN = function () {
                    this._setProjection();
                    stage.setTransform(translate.x, translate.y, 1, 0);
                    this._finialScale = this._scale;
                };


                if (this.__zooming) {
                    this.fire("zooming");
                    if ((++this.__zoomIndex) % 10 !== 0) {
                        stage.setTransform(translate.x, translate.y, scale / finialScale, 0);
                    } else {
                        resetScaleFN.call(this);
                    }


                    this.__zoomTimer = setTimeout(this._gradualZoom.bind(this), 50);
                    this._prevScale = this._scale;
                } else {
                    resetScaleFN.call(this);
                    this.__zoomIndex = 0;
                    this.fire('zoomend');
                }

                this.notify('scale');
            },

            /**
             * Zoom topology
             * @param value
             * @method zoom
             */
            zoom: function (value) {
                this._zoom(value, 0.6);
            },

            /**
             * Make topology fit stage
             * @method fit
             */
            fit: function (isNotify) {

                var proX = this.projectionX();
                var proY = this.projectionY();
                var bound = this.graph().getBound();

                var _x = proX.get(bound.x);
                var _y = proY.get(bound.y);
                var _width = proX.get(bound.maxX) - _x;
                var _height = proY.get(bound.maxY) - _y;

                var stage = this.stage();
                var width = this.visibleContainerWidth();
                var height = this.visibleContainerHeight();

                stage.upon('transitionend', this._fit, this);


                var wScale = width / _width;
                var hScale = height / _height;
                var scale = Math.min(wScale, hScale);


                if (width / height < _width / _height) {
                    var paddingTop = this.paddingTop() + (height - height * scale) / 2;
                    stage.setTransform(this.paddingLeft() - proX.get(bound.x) * scale, paddingTop, scale, 0.3);
                } else {
                    var paddingLeft = this.paddingLeft() + (width - width * scale) / 2 - (width - _width) / 2;
                    stage.setTransform(paddingLeft, this.paddingTop() - proY.get(bound.y) * scale, scale, 0.3);
                }


                delete  this._prevScale;
                delete this._finialScale;

            },
            _fit: function (inForce) {
                var force = inForce != null ? inForce : true;
                this._scale = 1;
                this.stage().setTransform(this.paddingLeft(), this.paddingTop(), 1, 0);
                this._setProjection(force);
            },
            zoomByBound: function (bound) {


//                this._zoomCenterPoint = {
//                    x: bound.left + bound.width / 2,
//                    y: bound.top + bound.height / 2
//                };
//
//                var width = this.visibleContainerWidth();
//                var height = this.visibleContainerHeight();
//
//                var scale = Math.min(width / bound.width, height / bound.height);
//
//
//                this._zoom(scale, 0.6);
//                this._zoomCenterPoint = null;


                var offset = Math.max(bound.width, bound.height) * 0.05;
                var scale = this.scale();
                var tx = this.stage().translateX();
                var ty = this.stage().translateY();
                var bt = bound.top - offset;
                var bl = bound.left - offset;
                var bw = bound.width + offset * 2;
                var bh = bound.height + offset * 2;

                var scaleH = this.visibleContainerHeight() / (bh / scale);
                var scaleW = this.visibleContainerWidth() / (bw / scale);


                scaleH = Math.max(Math.min(this._maxScale, scaleH), this._minScale);
                scaleW = Math.max(Math.min(this._maxScale, scaleW), this._minScale);

                var scaleI, x, y;

//                if (this.rect) {
//                    this.rect.destroy();
//                }
//
//
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
//                    rect.attach(this.stage());
//                }


                if (scaleH > scaleW) {
                    scaleI = scaleW;
                    x = ((bl - tx) / scale * scaleI + tx) / (scaleI - scale) * scale + tx;
                    y = ( ty + (bt - ty + bh / 2) / scale * scaleI - this.visibleContainerHeight() / 2) / (scaleI - scale) * scale + ty;


                } else {
                    scaleI = scaleH;
                    x = ((bt - ty) / scale * scaleI + ty) / (scaleI - scale) * scale + ty;
                    y = ( tx + (bl - tx + bw / 2) / scale * scaleI - this.visibleContainerWidth() / 2) / (scaleI - scale) * scale + tx;

                }


                this._zoomCenterPoint = {x: x, y: y};

                this._zoom(scaleI, 0.6);

                this._zoomAnimation = null;

                delete  this._prevScale;
                delete this._finialScale;

            },
            zoomByNodes: function (nodes) {
                var bound = this.getBoundByNodes(nodes);
                this.zoomByBound(bound);
            },
            /**
             * Detect nodes overlap and notify appropriate scale value
             * @method adjustLayout
             */

            getAbsolutePosition: function (point) {
                var tx = this.stage().translateX();
                var ty = this.stage().translateY();
                var bound = this.view().dom().getBound();
                return {
                    x: tx + point.x + bound.left,
                    y: ty + point.y + bound.top
                };
            },
            adjustLayout: function () {

                return;

//                clearTimeout(this._adjustLayoutTimer);
//                this._adjustLayoutTimer = util.timeout(function () {
//
//                    var model = this.graph();
//
//                    if (model) {
//                        var length = this.graph().getVisibleVertices().length;
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