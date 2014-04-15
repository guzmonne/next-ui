(function (nx, util, global) {
    /**
     * Topology stage class
     * @class nx.graphic.Topology.StageMixin
     * @module nx.graphic.Topology
     */
    nx.define('nx.graphic.Topology.StageMixin', {
        events: ['ready', 'resizeStage'],
        properties: {
            /**
             * Set/get topology's width.
             * @property width {Number}
             */
            width: {
                value: 0
            },
            /**
             * height Set/get topology's height.
             * @property height {Number}
             */
            height: {
                value: 0
            },
            /**
             * Set/get stage's padding.
             * @property padding {Number}
             */
            padding: {
                value: 100
            },
            /**
             * Topology max scaling
             * @property maxScale {Number}
             */
            maxScale: {
                value: 12
            },
            /**
             * Topology min scaling
             * @property minScale {Number}
             */
            minScale: {
                value: 0.2
            },
            /**
             * Set/get topology's scalability
             * @property scalable {Boolean}
             */
            scalable: {
                value: true
            },
            /**
             * Set/get topology's current scale
             * @property scale {Number}
             */
            scale: {
                get: function () {
                    return this._scale || 1;
                },
                set: function (value) {
                    var scale = Math.max(Math.min(this._maxScale, value), this._minScale);
                    if (scale !== this._scale) {
                        this._scale = scale;
                    }
                }
            },
            stageScale: {
                value: 1
            },
            revisionScale: {
                value: 1
            },
            matrix: {
                value: function () {
                    return new nx.geometry.Matrix(nx.geometry.Matrix.I);
                }
            },
            /**
             * Set/get is topology use projection, or just use the data's original position information
             * @property enableProjection {Boolean}
             */
            enableProjection: {
                value: true
            },
            /**
             * Set the x projection input range e.g. [0,100]
             * @projectionXRange {Array}
             */
            projectionXRange: {
            },
            /**
             * Set the y projection input range e.g. [0,100]
             * @projectionYRange {Array}
             */
            projectionYRange: {
            },

            /**
             * Set to true will adapt to topology's outside container, set to ture will ignore width/height
             * @property adaptive {Boolean}
             */
            adaptive: {
                value: false
            },
            /**
             * Get the topology's stage component
             * @property stage {nx.graphic.Component}
             */
            stage: {
                get: function () {
                    return this.resolve('stage');
                }
            },
            /**
             * Enabling the smart node feature, set to false will improve the performance
             * @property enableSmartNode {Boolean}
             */
            enableSmartNode: {
                value: true
            }
        },

        methods: {
            initStage: function () {
                nx.each(nx.graphic.Icons.icons, function (iconObj, key) {
                    if (iconObj.icon) {
                        var icon = iconObj.icon.cloneNode(true);
                        icon.setAttribute("height", iconObj.size.height);
                        icon.setAttribute("width", iconObj.size.width);
                        icon.setAttribute("data-device-type", key);
                        icon.setAttribute("id", key);
                        icon.setAttribute("class", 'deviceIcon');
                        this.stage().addDef(icon);
                    }
                }, this);
            },
            _adaptiveTimer: function () {
                var self = this;
                if (!this.adaptive() && (this.width() !== 0 && this.height() !== 0)) {
                    this.status('appended');
//                    /**
//                     * Fired when topology appended to container with with& height
//                     * @event ready
//                     * @param sender{Object} trigger instance
//                     * @param event {Object} original event object
//                     */
                    setTimeout(function () {
                        this.fire('ready');
                    }.bind(this), 0);

                } else {
                    var timer = setInterval(function () {
                        if (nx.dom.Document.body().contains(self.resolve("@root"))) {
                            //
                            clearInterval(timer);
                            self._adaptToContainer();
                            self.status('appended');
                            self.fire('ready');
                        }
                    }, 10);
                }
            },
            _adaptToContainer: function () {
                var bound = this.resolve("@root").parentNode().getBound();
                if (bound.width === 0 || bound.height === 0) {
                    //nx.logger.log("Please set height*width to topology's parent container");
                }
                if (this._width !== bound.width || this._height !== bound.height) {
                    /**
                     * Fired when topology's stage changed
                     * @event resizeStage
                     * @param sender{Object} trigger instance
                     * @param event {Object} original event object
                     */
                    this.fire('resizeStage');
                    this.height(bound.height);
                    this.width(bound.width);
                }
            },
            /**
             * Make topology adapt to container,container should set width/height
             * @method adaptToContainer
             */
            adaptToContainer: function (callback) {
                if (!this.adaptive()) {
                    return;
                }
                this._adaptToContainer();

                if (this._fitTimer) {
                    clearTimeout(this._fitTimer);
                }

                this._fitTimer = setTimeout(function () {
                    //this.move(0.1);
                    this.fit();
                }.bind(this), 500);
            },


            /**
             * Get the passing bound's relative inside bound,if not passing param will return the topology graphic's bound
             * @param bound {JSON}
             * @returns {{left: number, top: number, width: number, height: number}}
             */
            getInsideBound: function (bound) {
                var _bound = bound || this.stage().view('stage').getBound();
                var topoBound = this.view().dom().getBound();

                return {
                    left: _bound.left - topoBound.left,
                    top: _bound.top - topoBound.top,
                    width: _bound.width,
                    height: _bound.height
                };
            },
            getAbsolutePosition: function (obj) {
                var matrix = this.matrix();
                return {
                    x: (obj.x || 1) * matrix.scale(),
                    y: (obj.y || 1) * matrix.scale()
                };
            },
            /**
             * Make topology graphic fit stage
             * @method fit
             */
            fit: function (callback, context, duration) {
                this.scale(1);
                this.stage().fit(function () {
                    this.adjustLayout();
                    /* jshint -W030 */
                    callback && callback.call(context || this);
                }, this, duration !== undefined ? duration : 0.6);

            },

            /**
             * Zoom topology
             * @param value {Number}
             * @method zoom
             */
            zoom: function (value) {
            },
            /**
             * Zoom topology by a bound
             * @method zoomByBound
             * @param inBound {Object} e.g {left:Number,top:Number,width:Number,height:Number}
             * @param [callback] {Function} callback function
             * @param [context] {Object} callback context
             * @param [duration] {Number} set the transition time, unit is second
             */
            zoomByBound: function (inBound, callback, context, duration) {
                this.stage().zoomByBound(inBound, function () {
                    this.adjustLayout();
                    /* jshint -W030 */
                    callback && callback.call(context || this);
                }, this, duration !== undefined ? duration : 0.6);
            },
            /**
             * Zoom topology to let the passing nodes just visible at the screen
             * @method zoomByNodes
             * @param [callback] {Function} callback function
             * @param [context] {Object} callback context
             * @param nodes {Array} nodes collection
             */
            zoomByNodes: function (nodes, callback, context) {
                var bound = this.getBoundByNodes(nodes);
                this.zoomByBound(bound, function () {
                    this.adjustLayout();
                    /* jshint -W030 */
                    callback && callback.call(context || this);
                }, this);
            },
            /**
             * Move topology
             * @method move
             * @param x {Number}
             * @param y {Number}
             * @param [duration] {Number} default is 0
             */
            move: function (x, y, duration) {
                var stage = this.stage();
                stage.applyTranslate(x || 0, y || 0, duration);
            },
            /**
             * Resize topology
             * @method resize
             * @param width {Number}
             * @param height {Number}
             */
            resize: function (width, height) {
                this.width(width);
                this.height(height);
                this.fire('resizeStage');
            },
            /**
             * If enable enableSmartNode, this function will auto adjust the node's overlapping and set the nodes to right size
             * @method adjustLayout
             */
            adjustLayout: function () {


                if (!this.enableSmartNode()) {
                    return;
                }

                if (this._adjustLayoutTimer) {
                    clearTimeout(this._adjustLayoutTimer);
                }
                this._adjustLayoutTimer = setTimeout(function () {
                    var graph = this.graph();
                    if (graph) {
                        var startTime = new Date();
                        var nodesLayer = this.getLayer('nodes');
                        var nodeSetLayer = this.getLayer('nodeSet');
                        var length = nodesLayer.nodes().length;
                        var topoMatrix = this.matrix();
                        var stageScale = topoMatrix.scale();
                        var positionAry = [];
                        this.eachVisibleNode(function (node) {
                            var position = node.position();
                            positionAry[positionAry.length] = {
                                x: position.x * stageScale + topoMatrix.x(),
                                y: position.y * stageScale + topoMatrix.y()
                            };
                        });
                        if (window.Blob && window.Worker) {


                            var fn = "onmessage = function(e) { self.postMessage(calc(e.data)); };";

                            //fn += 'calc=function(a){return a.length};';
                            fn += '                        var calc = function (positionAry) {' +
                                '                         var length = positionAry.length;' +
                                '                           var showIconRadius = 32 * 32;' +
                                '                           var radius = 16 * 16;' +
                                '' +
                                '                            var testOverlap = function (sourcePosition, targetPosition) {' +
                                '                                var distance = Math.pow(Math.abs(sourcePosition.x - targetPosition.x), 2) + Math.pow(Math.abs(sourcePosition.y - targetPosition.y), 2);' +
                                '                                return{' +
                                '                                    showIcon: distance < showIconRadius,' +
                                '                                    unshownIcon: distance < radius' +
                                '                                }' +
                                '                            };' +
                                '                            var showIconOverLapCounter = 0;' +
                                '                            var overLapCounter = 0;' +
                                '                            for (var i = 0; i < length; i++) {' +
                                '                                var sourcePosition = positionAry[i];' +
                                '                                var iconisoverlap = false;' +
                                '                                var isoverlap = false;' +
                                '                                for (var j = 0; j < length; j++) {' +
                                '                                    var targetPosition = positionAry[j];' +
                                '                                    if (i !== j) {' +
                                '                                        var result = testOverlap(sourcePosition, targetPosition);' +
                                '                                        result.showIcon && (iconisoverlap = true);' +
                                '                                        result.unshownIcon && (isoverlap = true);' +
                                '                                    }' +
                                '                                }' +
                                '                                iconisoverlap && showIconOverLapCounter++;' +
                                '                                isoverlap && overLapCounter++;' +
                                '                            }' +
                                '                            var overlapPercent = 1;' +
                                '                            if (showIconOverLapCounter / length > 0.2) {' +
                                '                                overlapPercent = 0.8;' +
                                '                                if (overLapCounter / length > 0.4) {' +
                                '                                    overlapPercent = 0.4;' +
                                '                                } else if (overLapCounter / length > 0.2) {' +
                                '                                    overlapPercent = 0.6;' +
                                '                                }' +
                                '                            }' +
                                '                            return overlapPercent;' +
                                '                        };';


                            if (!this.adjustWorker) {
                                var blob = new Blob([fn]);
                                // Obtain a blob URL reference to our worker 'file'.
                                var blobURL = window.URL.createObjectURL(blob);
                                var worker = this.adjustWorker = new Worker(blobURL);
                                worker.onmessage = function (e) {
                                    var overlapPercent = e.data;
                                    this.revisionScale(overlapPercent);
                                    nodesLayer.updateNodeRevisionScale(overlapPercent);
                                    nodeSetLayer.updateNodeRevisionScale(overlapPercent);
                                }.bind(this);
                            }
                            this.adjustWorker.postMessage(positionAry); // Start the worker.
                        }

//                        var calc = function (positionAry) {
//                            var length = positionAry.length;
//                            var showIconRadius = 32 * 32;
//                            var radius = 16 * 16;
//
//                            var testOverlap = function (sourcePosition, targetPosition) {
//                                var distance = Math.pow(Math.abs(sourcePosition.x - targetPosition.x), 2) + Math.pow(Math.abs(sourcePosition.y - targetPosition.y), 2);
//                                return{
//                                    showIcon: distance < showIconRadius,
//                                    unshownIcon: distance < radius
//                                }
//                            };
//
//
//                            var showIconOverLapCounter = 0;
//                            var overLapCounter = 0;
//
//                            for (var i = 0; i < length; i++) {
//                                var sourcePosition = positionAry[i];
//                                var iconisoverlap = false;
//                                var isoverlap = false;
//                                for (var j = 0; j < length; j++) {
//                                    var targetPosition = positionAry[j];
//                                    if (i !== j) {
//                                        var result = testOverlap(sourcePosition, targetPosition);
//                                        result.showIcon && (iconisoverlap = true);
//                                        result.unshownIcon && (isoverlap = true);
//                                    }
//                                }
//                                iconisoverlap && showIconOverLapCounter++;
//                                isoverlap && overLapCounter++;
//                            }
//
//                            //0.2,0.4,0.6.0.8,1
//                            var overlapPercent = 1;
//                            if (showIconOverLapCounter / length > 0.2) {
//                                overlapPercent = 0.8;
//                                if (overLapCounter / length > 0.4) {
//                                    overlapPercent = 0.4;
//                                } else if (overLapCounter / length > 0.2) {
//                                    overlapPercent = 0.6;
//                                }
//                            }
//
//
//                            return overlapPercent;
//                        };

//                        var overlapPercent = calc(positionAry);
//                        this.revisionScale(overlapPercent);
//                        nodesLayer.updateNodeRevisionScale(overlapPercent);
//                        console.log('overlapTime', new Date() - startTime);

                    }
                }.bind(this), 200);
            }
        }
    })
    ;
})
(nx, nx.util, nx.global);