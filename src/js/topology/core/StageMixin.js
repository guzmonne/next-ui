(function (nx, util, global) {
    /**
     * Topology stage class
     * @class nx.graphic.Topology.Stage
     * @extend nx.graphic.Shape
     */
    nx.define('nx.graphic.Topology.StageMixin', {
        events: ['ready'],
        properties: {
            /**
             * Set/get topology's width.
             * @property width
             */
            width: {
                value: 0
            },
            /**
             * height Set/get topology's height.
             * @property height
             */
            height: {
                value: 0
            },
            /**
             * Set/get stage's padding.
             * @property padding
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
            containerWidth: {
                get: function () {
                    var w = this.scale() * (this.width() - this.paddingLeft() * 2);
                    return w < 30 ? 30 : w;
                }
            },
            /**
             * Get visible height
             * @property stageVisibleHeight
             */
            containerHeight: {
                get: function () {
                    var h = this.scale() * (this.height() - this.paddingTop() * 2);
                    return h < 30 ? 30 : h;
                }
            },
            visibleContainerWidth: {
                get: function () {
                    var w = this.width() - this.paddingLeft() * 2;
                    return w < 30 ? 30 : w;
                }
            },
            visibleContainerHeight: {
                get: function () {
                    var h = this.height() - this.paddingTop() * 2;
                    return h < 30 ? 30 : h;
                }
            },
            /**
             * @property adaptive
             */
            adaptive: {
                value: false
            },
            /**
             * @property stage
             */
            stage: {
                get: function () {
                    return this.resolve('stage');
                }
            }
        },

        methods: {
            init: function () {
            },
            /**
             * Set Timer to detect is topology appeared.
             * @private
             */
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
                this.height(bound.height);
                this.width(bound.width);
            },
            /**
             * Make topology adapt to container,container should set width/height
             * @method adaptToContainer
             */
            adaptToContainer: function () {
                this._adaptToContainer();

                if (this._fitTimer) {
                    clearTimeout(this._fitTimer);
                }

                this._fitTimer = setTimeout(function () {
                    this.move(0.1);
                    this.fit();
                }.bind(this), 500);

            },
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
             * Move topology
             * @method move
             * @param x
             * @param y
             * @param duration default is 0
             *
             */
            moveTo: function (x, y, duration) {
                var stage = this.stage();
                stage.setTransform(x, y, null, duration);
            },
            /**
             * Move topology
             * @method move
             * @param x
             * @param y
             */
            move: function (x, y, duration) {
                var stage = this.stage();
                stage.setTransform(stage.translateX() + x || 0, stage.translateY() + y || 0, null, duration);
            }
        }
    });
})(nx, nx.util, nx.global);