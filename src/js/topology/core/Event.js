(function (nx, util, global) {

    nx.define('nx.graphic.Topology.Event', {
        events: ['clickStage', 'pressStage', 'dragStageStart', 'dragStage', 'dragStageEnd', 'up', 'down', 'left', 'right', 'esc', 'space', 'enter'],
        properties: {
        },
        methods: {
            /**
             * Mouse wheel event handler
             * @param sender
             * @param event
             * @returns {Boolean}
             * @private
             */
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
                this.fire('clickStage', event);
            },
            _pressStage: function (sender, event) {
                this.fire('pressStage', event);
            },
            _dragStageStart: function (sender, event) {
                this.fire('dragStageStart', event);
            },
            _dragStage: function (sender, event) {
                this.fire('dragStage', event);
            },
            _dragStageEnd: function (sender, event) {
                this.fire('dragStageEnd', event);
            },
            _key: function (sender, event) {
                var code = event.keyCode;
                switch (code) {
                    case 38:
                        this.fire('up', event);
                        event.preventDefault();
                        break;
                    case 40:
                        this.fire('down', event);
                        event.preventDefault();
                        break;
                    case 37:
                        this.fire('left', event);
                        event.preventDefault();
                        break;
                    case 39:
                        this.fire('right', event);
                        event.preventDefault();
                        break;
                    case 13:
                        this.fire('enter', event);
                        event.preventDefault();
                        break;
                    case 27:
                        this.fire('esc', event);
                        event.preventDefault();
                        break;
                    case 32:
                        this.fire('space', event);
                        event.preventDefault();
                        break;
                }



                return false;
            }

        }
    });

})(nx, nx.util, nx.global);