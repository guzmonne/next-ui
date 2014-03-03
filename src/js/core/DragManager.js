(function (nx, util, global) {

    nx.define("nx.graphic.DragManager", nx.Observable, {
        static: true,
        properties: {
            node: {},
            track: {},
            dragging: {value: false}
        },
        methods: {
            init: function () {
                window.addEventListener('mousedown', this._capture_mousedown.bind(this), true);
                window.addEventListener('mousemove', this._capture_mousemove.bind(this), true);
                window.addEventListener('mouseup', this._capture_mouseup.bind(this), true);
            },
            start: function (evt) {
                return function (node) {
                    // make sure only one node can capture the "drag" event
                    if (node && !this.node()) {
                        this.node(node);
                        // track and data
                        var track = [];
                        this.track(track);
                        this.track().push([evt.clientX, evt.clientY]);
                        evt.dragCapture = function () {
                        };
                        return true;
                    }
                }.bind(this);
            },
            move: function (evt) {
                var node = this.node();
                if (node) {
                    // attach to the event
                    evt.drag = this._makeDragData(evt);

                    if (!this.dragging()) {
                        this.dragging(true);
                        node.fire("dragstart", evt);
                    }
                    // fire events
                    node.fire("dragmove", evt);
                }
            },
            end: function (evt) {
                var node = this.node();
                if (node) {
                    // attach to the event
                    evt.drag = this._makeDragData(evt);
                    // fire events
                    node.fire("dragend", evt);
                    // clear status
                    this.node(null);
                    this.track(null);
                    this.dragging(false);
                }
            },
            _makeDragData: function (evt) {
                var track = this.track();
                var current = [evt.clientX, evt.clientY], origin = track[0], last = track[track.length - 1];
                track.push(current);
                // TODO make sure the data is correct when target applied a matrix
                return {
                    target: this.node(),
                    current: current,
                    offset: [current[0] - origin[0], current[1] - origin[1]],
                    delta: [current[0] - last[0], current[1] - last[1]]
                };
            },
            _capture_mousedown: function (evt) {
                if (evt.captureDrag) {
                    this._lastDragCapture = evt.captureDrag;
                }
                if (evt.type === "mousedown") {
                    evt.captureDrag = this.start(evt);
                } else {
                    evt.captureDrag = function () {
                    };
                }
            },
            _capture_mousemove: function (evt) {
                this.move(evt);
            },
            _capture_mouseup: function (evt) {
                this.end(evt);
            }
        }
    });

})(nx, nx.graphic.util, nx.global);