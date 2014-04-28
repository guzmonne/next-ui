(function (nx, global) {

    /**
     * Topology base events
     * @class nx.graphic.Topology.Event
     * @module nx.graphic.Topology
     */
    nx.define('nx.graphic.Topology.Event', {
        events: ['clickStage', 'pressStage', 'dragStageStart', 'dragStage', 'dragStageEnd', 'projectionChange', 'zoomstart', 'zooming', 'zoomend', 'resetzooming', 'fitStage', 'up', 'down', 'left', 'right', 'esc', 'space', 'enter'],
        properties: {
            /**
             * Enabling gradual scaling feature when zooming, set to false will improve the performance
             * @property enableGradualScaling {Boolean}
             */
            enableGradualScaling: {
                value: true
            }
        },
        methods: {
            _mousewheel: function (sender, event) {
                if (this.scalable()) {
                    var step = 8000;
                    var data = event.wheelDelta;
                    var stage = this.stage();
                    var scale = data / step;

                    if (this._zoomWheelDelta == null) {
                        this._zoomWheelDelta = 0;
                        this.fire('zoomstart');
                    }

                    this._zoomWheelDelta += data / step;

                    if (this._enableGradualScaling) {
                        if (Math.abs(this._zoomWheelDelta) < 0.3) {
                            stage.disableUpdateStageScale(true);
                        } else {
                            this._zoomWheelDelta = 0;
                            stage.disableUpdateStageScale(false);
                        }
                    } else {
                        stage.disableUpdateStageScale(true);
                    }


                    stage.applyStageScale(1 + scale, [event.offsetX, event.offsetY]);

                    if (this._zooomEventTimer) {
                        clearTimeout(this._zooomEventTimer);
                    }

                    this._zooomEventTimer = setTimeout(function () {
                        stage.resetStageMatrix();
                        delete this._zoomWheelDelta;

                        /**
                         * Fired when end zooming
                         * @event zoomend
                         * @param sender{Object} trigger instance
                         * @param event {Object} original event object
                         */
                        this.fire('zoomend');

                    }.bind(this), 200);

                    /**
                     * Fired when zooming stage
                     * @event zooming
                     * @param sender{Object} trigger instance
                     * @param scale {Number} stage current scale
                     */
                    this.fire('zooming');
                }
                event.preventDefault();
                return false;
            },


            _contextmenu: function (sender, event) {
                event.preventDefault();
            },
            _clickStage: function (sender, event) {
                /**
                 * Fired when click the stage
                 * @event clickStage
                 * @param sender {Object}  Trigger instance
                 * @param event {Object} original event object
                 */
                this.fire('clickStage', event);
            },
            _pressStage: function (sender, event) {
                /**
                 * Fired when mouse press stage, this is a capture event
                 * @event pressStage
                 * @param sender {Object}  Trigger instance
                 * @param event {Object} original event object
                 */
                this.fire('pressStage', event);
            },
            _dragStageStart: function (sender, event) {
                /**
                 * Fired when start drag stage
                 * @event dragStageStart
                 * @param sender {Object}  Trigger instance
                 * @param event {Object} original event object
                 */
                this.fire('dragStageStart', event);
            },
            _dragStage: function (sender, event) {
                /**
                 * Fired when dragging stage
                 * @event dragStage
                 * @param sender {Object}  Trigger instance
                 * @param event {Object} original event object
                 */
                this.fire('dragStage', event);
            },
            _dragStageEnd: function (sender, event) {
                /**
                 * Fired when drag end stage
                 * @event dragStageEnd
                 * @param sender {Object}  Trigger instance
                 * @param event {Object} original event object
                 */
                this.fire('dragStageEnd', event);
            },
            _key: function (sender, event) {
                var code = event.keyCode;
                switch (code) {
                    case 38:
                        /**
                         * Fired when press up arrow key
                         * @event up
                         * @param sender {Object}  Trigger instance
                         * @param event {Object} original event object
                         */
                        this.fire('up', event);
                        event.preventDefault();
                        break;
                    case 40:
                        /**
                         * Fired when press down arrow key
                         * @event down
                         * @param sender {Object}  Trigger instance
                         * @param event {Object} original event object
                         */
                        this.fire('down', event);
                        event.preventDefault();
                        break;
                    case 37:
                        /**
                         * Fired when press left arrow key
                         * @event left
                         * @param sender {Object}  Trigger instance
                         * @param event {Object} original event object
                         */
                        this.fire('left', event);
                        event.preventDefault();
                        break;
                    case 39:
                        /**
                         * Fired when press right arrow key
                         * @event right
                         * @param sender {Object}  Trigger instance
                         * @param event {Object} original event object
                         */
                        this.fire('right', event);
                        event.preventDefault();
                        break;
                    case 13:
                        /**
                         * Fired when press enter key
                         * @event enter
                         * @param sender {Object}  Trigger instance
                         * @param event {Object} original event object
                         */
                        this.fire('enter', event);
                        event.preventDefault();
                        break;
                    case 27:
                        /**
                         * Fired when press esc key
                         * @event esc
                         * @param sender {Object}  Trigger instance
                         * @param event {Object} original event object
                         */
                        this.fire('esc', event);
                        event.preventDefault();
                        break;
                    case 32:
                        /**
                         * Fired when press space key
                         * @event space
                         * @param sender {Object}  Trigger instance
                         * @param event {Object} original event object
                         */
                        this.fire('space', event);
                        event.preventDefault();
                        break;
                }


                return false;
            }

        }
    });

})(nx, nx.global);