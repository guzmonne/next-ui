(function (nx, util, global) {

    nx.define("nx.graphic.Topology.Event", {
        events: ['clickStage'],
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
                        this._zoomCenterPointX(0);
                        this._zoomCenterPointY(0);
                        var dist = Math.sqrt((event.touches[0].pageX - event.touches[1].pageX) * (event.touches[0].pageX - event.touches[1].pageX) + (event.touches[0].pageY - event.touches[1].pageY) * (event.touches[0].pageY - event.touches[1].pageY));
                        if (this._mousewheelDist) {
                            data = dist * (this._mousewheelDist > dist ? -1 : 1);
                        }
                        this._mousewheelDist = dist;

                    } else if (event.wheelDelta) {
                        data = event.wheelDelta;
                        this._zoomCenterPointX(event.offsetX);
                        this._zoomCenterPointY(event.offsetY);
                    }
                    this.scale(this.scale() + data / step);
                    this._zoomCenterPointX(0);
                    this._zoomCenterPointY(0);
                }
                event.preventDefault();
                return false;
            },
            _contextmenu: function (sender, event) {
                event.stop();
            }
        },
        _clickStage: function (sender, event) {
            this.fire("clickStage", event);
        }
    });

})(nx, nx.graphic.util, nx.global);