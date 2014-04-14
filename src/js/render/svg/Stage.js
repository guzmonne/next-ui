(function (nx, global) {

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
                        visible: true,
                        fill: '#f00'
                    }
                },
                {
                    name: 'stage',
                    type: 'nx.graphic.Group',
                    props: {
                        'class': 'stage'
                    },
                    events: {
                        'transitionend': '{#_scaleEnd}'
                    }
                },
                {
                    name: 'floatingLayer',
                    type: 'nx.graphic.Group'
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
             * set/get stage's width
             * @property width
             */
            width: {value: 300},
            /**
             * set/get stage's height
             * @property height
             */
            height: {value: 300},
            /**
             * Stage scale
             * @property stageScale {Number}
             */
            stageScale: {value: 1},
            /**
             * Disable notify stageScale
             * @property disableUpdateStageScale {Boolean} false
             */
            disableUpdateStageScale: {value: false},
            /**
             * Stage padding
             * @property padding {number} 0
             */
            padding: {
                value: 0
            },
            /**
             * Stage transform matrix
             * @property matrix {nx.geometry.Math} nx.geometry.Matrix.I
             */
            matrix: {
                get: function () {
                    return this._matrix || nx.geometry.Matrix.I;
                },
                set: function (matrix) {
                    this.stage().view().dom().setStyle('transform', "matrix(" + nx.geometry.Matrix.toString(matrix) + ")");
                    this._matrix = matrix;
                }
            },
            /**
             * Matrix Object
             * @property matrixObject
             */
            matrixObject: {},
            /**
             * get content group element
             * @property stage
             */
            stage: {
                get: function () {
                    return this.resolve("stage");
                }
            },
            floatingLayer: {
                get: function () {
                    return this.resolve("floatingLayer");
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
            calcRectZoomMatrix: function (graph, rect) {
                var s = Math.min(graph.height / Math.abs(rect.height), graph.width / Math.abs(rect.width));
                var p = [(s * (rect.left + rect.width / 2) - (graph.left + graph.width / 2)) / (s - 1), (s * (rect.top + rect.height / 2) - (graph.top + graph.height / 2)) / (s - 1)];
                return nx.geometry.Matrix.multiply([
                    [1, 0, 0],
                    [0, 1, 0],
                    [-p[0], -p[1], 1]
                ], [
                    [s, 0, 0],
                    [0, s, 0],
                    [0, 0, 1]
                ], [
                    [1, 0, 0],
                    [0, 1, 0],
                    [p[0], p[1], 1]
                ]);
            },
            fit: function (callback, context, duration) {
                var contentBound = this.getContentBound();
                var padding = this.padding();
                var stageBound = {
                    left: padding,
                    top: padding,
                    height: this.height() - padding * 2,
                    width: this.width() - padding * 2
                };
                this.stage().setTransition(callback, context, duration);
                this.applyStageMatrix(this.calcRectZoomMatrix(stageBound, contentBound));
            },
            zoomByBound: function (inBound, callback, context, duration) {
                var padding = this.padding();
                var stageBound = {
                    left: padding,
                    top: padding,
                    height: this.height() - padding * 2,
                    width: this.width() - padding * 2
                };
                this.stage().setTransition(callback, context, duration);
                this.applyStageMatrix(this.calcRectZoomMatrix(stageBound, inBound));
            },
            applyTranslate: function (x, y, duration) {
                var matrix = this.matrixObject();
                matrix.applyTranslate(x, y);
                if (duration) {
                    this.stage().setTransition(null, null, duration);
                }
                this.matrix(matrix.matrix());
                this.matrixObject(matrix);
            },
            applyStageMatrix: function (matrix, according) {
                this._setStageMatrix(nx.geometry.Matrix.multiply(this.matrix(), matrix), according);
            },
            applyStageScale: function (scale, according) {
                /* jshint -W030 */
                scale = scale || 1, according = according || [this.width() / 2, this.height() / 2];
                var matrix = nx.geometry.Matrix.multiply([
                    [1, 0, 0],
                    [0, 1, 0],
                    [-according[0], -according[1], 1]
                ], [
                    [scale, 0, 0],
                    [0, scale, 0],
                    [0, 0, 1]
                ], [
                    [1, 0, 0],
                    [0, 1, 0],
                    [according[0], according[1], 1]
                ]);
                this.applyStageMatrix(matrix, according);
            },
            resetStageMatrix: function () {
                var m = new nx.geometry.Matrix(this.matrix());
                this.disableUpdateStageScale(false);
                this.matrix(m.matrix());
                this.matrixObject(m);
                this.stageScale(1 / m.scale());
            },
            _setStageMatrix: function (matrix, according) {
                according = according || [this.width() / 2, this.height() / 2];
                var m = new nx.geometry.Matrix(matrix);
//                if (m.scale() > this.maxScale()) {
//                    m.applyScale(this.maxScale() / m.scale(), according);
//                }
//                if (m.scale() < this.minScale()) {
//                    m.applyScale(this.minScale() / m.scale(), according);
//                }
                if (!nx.geometry.Matrix.approximate(this.matrix(), m.matrix())) {
                    this.matrix(m.matrix());
                    this.matrixObject(m);
                    /* jshint -W030 */
                    !this.disableUpdateStageScale() && this.stageScale(1 / m.scale());
                }
            },
            _scaleEnd: function (sender, event) {

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


})(nx, nx.global);