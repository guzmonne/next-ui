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
             * @param isNotNotifyStageSizeChanged {Boolean} is not notify stage size changed , default is false, set to TRUE to avoid topology change when change stage size
             * @method adaptToContainer
             */
            adaptToContainer: function (isNotNotifyStageSizeChanged) {
                this._adaptToContainer();
                this.fit();


//                if (!isNotNotifyStageSizeChanged) {
//                    this._setProjection();
//                }
//                this.fire('updating');
//                util.defer(this.adjustLayout.bind(this));
            },
            /**
             * Recover topology's translate
             * @method recover
             */
            recover: function () {
                var topo = this.owner();
                this.translateX(topo.paddingLeft());
                this.translateY(topo.paddingTop());
            },
            /**
             * Get stage's translate
             * @returns {{x: *, y: *}}
             * @method getTranslate
             */
            getTranslate: function () {
                return {
                    x: this.translateX(),
                    y: this.translateY()
                };
            },
            getBond: function () {
                return this.resolve('stage').getBBox();
            },
            /**
             * Clear stage
             * @method clear
             */
            clear: function () {
                this.resolve('stage').content(null);
            },


            /**
             * Move topology
             * @method move
             * @param x
             * @param y
             */
            //todo
            moveTo: function (x, y) {
                var stage = this.stage();
                if (x !== undefined) {
                    stage.translateX(x);
                }

                if (y !== undefined) {
                    stage.translateY(y);
                }
            },
            /**
             * Move topology
             * @method move
             * @param x
             * @param y
             */
            move: function (x, y) {
                var stage = this.stage();
                if (x !== undefined) {
                    stage.translateX(stage.translateX() + x);
                }

                if (y !== undefined) {
                    stage.translateY(stage.translateY() + y);
                }
            }
        }
    });
})(nx, nx.graphic.util, nx.global);