(function (nx, util, global) {

    /**
     * Topology base events
     * @class nx.graphic.Topology.Event
     * @module nx.graphic.Topology
     */
    nx.define('nx.graphic.Topology.Event', {
        events: ['clickStage', 'pressStage', 'dragStageStart', 'dragStage', 'dragStageEnd', 'up', 'down', 'left', 'right', 'esc', 'space', 'enter'],
        methods: {
            _mousewheel: function (sender, event) {
                if (this.scalable()) {
                    var step = 8000;
                    var data = 0;
                    if (event.touches && event.touches.length == 2) {
//                        this._zoomCenterPointX(0);
//                        this._zoomCenterPointY(0);
//                        var dist = Math.sqrt((event.touches[0].pageX - event.touches[1].pageX) * (event.touches[0].pageX - event.touches[1].pageX) + (event.touches[0].pageY - event.touches[1].pageY) * (event.touches[0].pageY - event.touches[1].pageY));
//                        if (this._mousewheelDist) {
//                            data = dist * (this._mousewheelDist > dist ? -1 : 1);
//                        }
//                        this._mousewheelDist = dist;

                    } else if (event.wheelDelta) {
                        data = event.wheelDelta;
                        this._zoomCenterPoint = {
                            x: event.offsetX,
                            y: event.offsetY
                        };
                    }

                    this._scale = Math.max(Math.min(this._maxScale, this.scale() + data / step), this._minScale);


                    if (!this.__zoomStart) {
                        this.__zooming = true;
                        this.__zoomStart = true;
                        this._gradualZoom();
                    }


                    if (this._zooomEventTimer) {
                        clearTimeout(this._zooomEventTimer);
                    }

                    this._zooomEventTimer = setTimeout(function () {
                        delete this.__zooming;
                        delete this.__zoomStart;
                        delete this._zoomCenterPoint;
                    }.bind(this), 100);

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

})(nx, nx.util, nx.global);