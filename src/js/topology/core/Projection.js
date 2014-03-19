(function (nx, util, global) {

    nx.define("nx.graphic.Topology.Projection", {
        events: ['projectionChange', 'zooming', 'zoomend', 'resetzooming'],
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
                get: function () {
                    return this._revisionScale !== undefined ? this._revisionScale : 1;
                },
                set: function (value) {
                    if (this._revisionScale !== value) {
                        this._revisionScale = value;
                        return true;
                    } else {
                        return false;
                    }
                }
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
            },
            enableSmartNode: {
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
                var scale = Math.max(Math.min(this._maxScale, this._scale), this._minScale);
                var _scale = this._prevScale || 1;
                var step = scale - _scale;
                var translateX = stage.translateX();
                var translateY = stage.translateY();
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

                    stage.off('transitionend', completeFN, this);
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
                var scale = this._scale = Math.max(Math.min(this._maxScale, this.scale()), this._minScale);
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

                    if(this.enableGradualScaling()){
                        if ((++this.__zoomIndex) % 10 !== 0) {
                            stage.setTransform(translate.x, translate.y, scale / finialScale, 0);
                        } else {
                            resetScaleFN.call(this);
                            this.fire("resetzooming");
                        }
                    }else{
                        stage.setTransform(translate.x, translate.y, scale / finialScale, 0);
                    }

                    this.fire("zooming");



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
                delete this._zoomCenterPoint;
                this._zoom(value, 0.6);
            },

            /**
             * Make topology fit stage
             * @method fit
             */
            fit: function (callback) {
                this.zoomByBound(null, function () {
                    this._scale = 1;
                    this._recoverStageScale(this.paddingLeft(), this.paddingTop());
                    this.__originalStageBound = this.getInsideBound();
                    if (callback) {
                        callback.call(this);
                    }

                }, {x: 30, y: 30}); //for fix
            },
            zoomByBound: function (inBound, callback, offset, duration) {
                var stage = this.stage();
                var width = this.visibleContainerWidth();
                var height = this.visibleContainerHeight();
                var bound = inBound || this.getInsideBound();
                var stageTranslate = stage.translate();
                var _offset = offset || {x: 0, y: 0};
                var wScale = width / (bound.width - _offset.x);
                var hScale = height / (bound.height - _offset.y);
                var _scale = Math.min(wScale, hScale);
                var tx, ty;


                //avoid repeatily
                if (this.__originalStageBound) {
                    if (this.__originalStageBound.left == bound.left &&
                        this.__originalStageBound.top == bound.top &&
                        this.__originalStageBound.width == bound.width &&
                        this.__originalStageBound.height == bound.height) {
                        return;
                    }
                }


                _scale = Math.max(Math.min(this._maxScale, _scale), this._minScale);


                if (width / height < bound.width / bound.height) {
                    tx = this.paddingLeft() - (bound.left - stageTranslate.x) * _scale;
                    ty = (this.paddingTop() + height / 2 - bound.height * _scale / 2 ) - (bound.top - stageTranslate.y) * _scale;

                } else {
                    tx = (this.paddingLeft() + width / 2 - bound.width * _scale / 2 ) - (bound.left - stageTranslate.x) * _scale;
                    ty = this.paddingTop() - (bound.top - stageTranslate.y) * _scale;
                }

                stage.upon('transitionend', function zoomByBoundCallback() {
                    if (callback) {
                        callback.call(this);
                    }

                    this.fire("zoomend");

                    stage.off('transitionend', zoomByBoundCallback, this);
                }, this);

                this.fire("zooming");

                stage.setTransform(tx, ty, _scale, duration || 0.5);

                this._scale = _scale * this.scale();

                this.__originalStageBound = bound;

                this.notify('scale');

            },

            zoomByNodes: function (nodes, callback) {
                var bound = this.getBoundByNodes(nodes);
                this.zoomByBound(bound, this._recoverStageScale.bind(this));

            },
            _recoverStageScale: function (translateX, translateY) {
                var tx = translateX !== undefined ? translateX : this.stage().translateX();
                var ty = translateY !== undefined ? translateY : this.stage().translateY();
                this._setProjection(true);
                this.stage().setTransform(tx, ty, 1, 0);
                this._finialScale = this._prevScale = this._scale;
            },

            /**
             * Detect nodes overlap and notify appropriate scale value
             * @method adjustLayout
             */

            getAbsolutePosition: function (point) {
                var tx = this.stage().translateX();
                var ty = this.stage().translateY();
                var offset = this.view().dom().getOffset();
                return {
                    x: tx + point.x + offset.left,
                    y: ty + point.y + offset.top
                };
            },
            adjustLayout: function () {


                if (!this.enableSmartNode()) {
                    return;
                }

                if (this._adjustLayoutTimer) {
                    clearTimeout(this._adjustLayoutTimer);
                }
                this._adjustLayoutTimer = setTimeout(function () {

                    var model = this.graph();

                    if (model) {
                        var nodesLayer = this.getLayer('nodes');
                        var length = nodesLayer.nodes().length;


                        if (length !== 0) {
                            var bound = nodesLayer.getBound();
                            var threshold = 12000;
                            var percell = (bound.width * bound.height) / length;
                            var revisionScale;

                            if (length < 3) {
                                revisionScale = 1;
                            } else if (percell < threshold / 2) {
                                revisionScale = 0.4;
                            } else if (percell < threshold / 1.5) {
                                revisionScale = 0.6;
                            } else if (percell < threshold) {
                                revisionScale = 0.8;
                            } else {
                                revisionScale = 1;
                            }

                            this.revisionScale(revisionScale);
                        }
                    }
                }.bind(this), 60);
            },
            __drawBG: function (inBound) {
                var bound = inBound || this.stage().getContentBound();
                var bg = this.stage().resolve('bg').root();
                bg.sets({
                    x: bound.left,
                    y: bound.top,
                    width: bound.width,
                    height: bound.height,
                    visible: true
                });
                this.stage().resolve('bg').set('visible', true);
            }


        }
    });

})(nx, nx.util, nx.global);