(function (nx, util, global) {

    /**
     * Topology projection class
     * @class nx.graphic.Topology.Projection
     * @module nx.graphic.Topology
     */

    nx.define("nx.graphic.Topology.Projection", {
        events: [],
        properties: {

        },
        methods: {
            _setProjection: function (force, isNotify) {

                return;


//                var graph = this.graph();
//                var containerWidth = this.containerWidth();
//                var containerHeight = this.containerHeight();
//
//                //
//
//                if (containerWidth === 0 && containerHeight === 0) {
//                    return;
//                }
//
//
//                var projectionX = this.projectionX();
//                var projectionY = this.projectionY();
//
//
//                var enableProjection = this.enableProjection();
//                var projectionXRange = this.projectionXRange();
//                var projectionYRange = this.projectionYRange();
//
//                var bound;
//
//                if (force || !this._dataBound) {
//                    bound = this._dataBound = graph.getBound();
//                } else {
//                    bound = this._dataBound;
//                }
//
//
//                var xInput, xOutput, yInput, yOutput;
//
//
//                if (enableProjection) {
//
//                    if (projectionXRange) {
//                        bound.x = Math.min(projectionXRange[0], projectionXRange[1]);
//                        bound.maxX = Math.max(projectionXRange[0], projectionXRange[1]);
//                        bound.width = Math.abs(projectionXRange[0] - projectionXRange[1]);
//
//                    }
//
//                    if (projectionYRange) {
//                        bound.y = Math.min(projectionYRange[0], projectionYRange[1]);
//                        bound.maxY = Math.max(projectionYRange[0], projectionYRange[1]);
//                        bound.height = Math.abs(projectionYRange[0] - projectionYRange[1]);
//                    }
//
//
//                    if (bound.width === 0 && bound.height === 0) {
//                        xInput = [bound.x - containerWidth / 2, bound.x + containerWidth / 2];
//                        xOutput = [0, containerWidth];
//
//                        yInput = [bound.y - containerHeight / 2, bound.y + containerHeight / 2];
//                        yOutput = [0, containerHeight];
//                    } else if (bound.width === 0) {
//                        xInput = [bound.x - containerWidth / 2, bound.x + containerWidth / 2];
//                        xOutput = [0, containerWidth];
//
//                        yInput = [bound.y, bound.maxY];
//                        yOutput = [0, containerHeight];
//                    } else if (bound.height === 0) {
//                        xInput = [bound.x, bound.maxX];
//                        xOutput = [0, containerWidth];
//
//                        yInput = [bound.y - containerHeight / 2, bound.y + containerHeight / 2];
//                        yOutput = [0, containerHeight];
//                    } else {
//                        var heightRate = containerHeight / bound.height;
//                        var widthRate = containerWidth / bound.width;
//                        if (heightRate < widthRate) {
//                            var _width = bound.width * heightRate;
//
//                            xInput = [bound.x, bound.maxX];
//                            xOutput = [containerWidth / 2 - _width / 2, containerWidth / 2 + _width / 2];
//
//                            yInput = [bound.y, bound.maxY];
//                            yOutput = [0, containerHeight];
//                        } else {
//                            var _height = bound.height * widthRate;
//                            xInput = [bound.x, bound.maxX];
//                            xOutput = [0, containerWidth];
//
//                            yInput = [bound.y, bound.maxY];
//                            yOutput = [containerHeight / 2 - _height / 2, containerHeight / 2 + _height / 2];
//                        }
//                    }
//
//
//                } else {
//                    this.padding(0);
//
//                    containerWidth = this.width();
//                    containerHeight = this.height();
//                    var scale = this.scale();
//
//
//                    if (projectionXRange) {
//                        xInput = [projectionXRange[0], projectionXRange[1]];
//                        xOutput = [0, scale * containerWidth];
//                    } else {
//                        xInput = [0, containerWidth];
//                        xOutput = [0, scale * containerWidth];
//                    }
//
//                    if (projectionYRange) {
//                        yInput = [projectionYRange[0], projectionYRange[1]];
//                        yOutput = [0, scale * containerHeight];
//                    } else {
//                        yInput = [0, containerHeight];
//                        yOutput = [0, scale * containerHeight];
//                    }
//
//                }
//
//                var isUpdate = false;
//                var _xInput = projectionX.input(), _xOutput = projectionX.output(), _yInput = projectionY.input(), _yOutput = projectionY.output();
//
//
//                if (_xInput[0] !== xInput[0] || _xInput[1] !== xInput[1]) {
//                    projectionX.input(xInput);
//                    isUpdate = true;
//                }
//
//                if (_xOutput[0] !== xOutput[0] || _xOutput[1] !== xOutput[1]) {
//                    projectionX.output(xOutput);
//                    isUpdate = true;
//                }
//
//                if (_yInput[0] !== yInput[0] || _yInput[1] !== yInput[1]) {
//                    projectionY.input(yInput);
//                    isUpdate = true;
//                }
//
//                if (_yOutput[0] !== yOutput[0] || _yOutput[1] !== yOutput[1]) {
//                    projectionY.output(yOutput);
//                    isUpdate = true;
//                }
//
//
//                if (isNotify !== false && isUpdate) {
//                    /**
//                     * Fired when topology projection changed
//                     * @event projectionChange
//                     * @param sender{Object} trigger instance
//                     * @param event {Object} original event object
//                     */
//                    this.fire("projectionChange");
//                }
//
//                var finialXOutPut = projectionX.output();
//                var finialYOutput = projectionY.output();
//
//                this.stage()._setSize(finialXOutPut[0], finialYOutput[0], finialXOutPut[1] - finialXOutPut[0], finialYOutput[1] - finialYOutput[0]);


            },
            /**
             * Get a x axle projected value, eg, you pass a model's x position value, will return the x position on the screen
             * @method getProjectedX
             * @param value {Number}
             * @returns {Number}
             */
            getProjectedX: function (value) {
                return this.projectionX().get(value) || value;
            },
            /**
             * Get a y axle projected value, eg, you pass a model's x position value, will return the y position on the screen
             * @method getProjectedY
             * @param value {Number}
             * @returns {Number}
             */
            getProjectedY: function (value) {
                return this.projectionY().get(value) || value;
            },
            /**
             * Get a projected positon object, eg, you pass a model's position value, will return the position on the screen
             * @method getProjectedPosition
             * @param position {Object} {x:Number,y:Number}
             * @returns {Object}  {x:Number,y:Number}
             */
            getProjectedPosition: function (position) {
                return{
                    x: this.projectionX().get(position.x),
                    y: this.projectionY().get(position.y)
                };
            }
        }
    });

})(nx, nx.util, nx.global);