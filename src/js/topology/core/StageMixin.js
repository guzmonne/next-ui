(function (nx, util, global) {
    /**
     * Topology stage class
     * @class nx.graphic.Topology.Stage
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
            paddingLeft: {
                dependencies: ['padding'],
                get: function () {
                    return this._paddingLeft !== undefined ? this._paddingLeft : this.padding();
                }
            },
            paddingTop: {
                dependencies: ['padding'],
                get: function () {
                    return this._paddingTop !== undefined ? this._paddingTop : this.padding();
                }
            },
            /**
             * Get the graphic container's width, include un visible area
             * @property containerWidth {Number}
             */
            containerWidth: {
                get: function () {
                    var w = this.scale() * (this.width() - this.paddingLeft() * 2);
                    return w < 30 ? 30 : w;
                }
            },
            /**
             * Get the graphic container's height, include un visible area
             * @property containerHeight {Number}
             */
            containerHeight: {
                get: function () {
                    var h = this.scale() * (this.height() - this.paddingTop() * 2);
                    return h < 30 ? 30 : h;
                }
            },
            /**
             * Get the graphic visible container's width
             * @property visibleContainerWidth {Number}
             */
            visibleContainerWidth: {
                get: function () {
                    var w = this.width() - this.paddingLeft() * 2;
                    return w < 30 ? 30 : w;
                }
            },
            /**
             * Get the graphic visible container's height
             * @property visibleContainerWidth {Number}
             */
            visibleContainerHeight: {
                get: function () {
                    var h = this.height() - this.paddingTop() * 2;
                    return h < 30 ? 30 : h;
                }
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
            }
        },

        methods: {
            _adaptiveTimer: function () {
                var self = this;
                if (!this.adaptive() && (this.width() !== 0 && this.height() !== 0)) {
                    this.status('appended');
                    this.fire('ready');
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
                    this.fire('resizeStage');
                    this.height(bound.height);
                    this.width(bound.width);
                }
            },
            /**
             * Make topology adapt to container,container should set width/height
             * @method adaptToContainer
             */
            adaptToContainer: function () {
                if (!this.adaptive()) {
                    return;
                }
                this._adaptToContainer();

                if (this._fitTimer) {
                    clearTimeout(this._fitTimer);
                }

                this._fitTimer = setTimeout(function () {
                    this.move(0.1);
                    this.fit();
                }.bind(this), 500);

            },
            /**
             * Get the passing bound related inside bound,if not passing param will return the topology graphic's bound
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
            /**
             * Move topology to position
             * @method move
             * @param x {Number}
             * @param y {Number}
             * @param [duration] {Number} default is 0
             *
             */
            moveTo: function (x, y, duration) {
                var stage = this.stage();
                stage.setTransform(x, y, null, duration);
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
                stage.setTransform(stage.translateX() + x || 0, stage.translateY() + y || 0, null, duration);
            }
        }
    });
})(nx, nx.util, nx.global);