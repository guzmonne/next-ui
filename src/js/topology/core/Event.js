(function (nx, util, global) {

    nx.define("nx.graphic.Topology.Event", {
        events: [],
        properties: {
            eventQueue: {
                value: function () {
                    return []
                }
            }
        },
        methods: {
            /**
             * On an event
             * @method on
             * @param name
             * @param handler
             * @param context
             */
            onx: function (name, handler, context, isStatic) {
                var eventQueue = [];

                if (util.indexOf(this.__events__, name) == -1) {
                    //
                    context = context || this;
                    //
                    //for each layer
                    nx.each(this.layersQueue(), function (layer) {
                        // seek if events match

                        if (layer.can(name)) {
                            layer.on(name, handler, context || self);
                            eventQueue.push({
                                name: name,
                                handler: handler,
                                context: context,
                                owner: layer
                            });
                        }
                    }, this);


                    //for each scene
                    nx.each(this.scenesQueue(), function (scene) {
                        // seek if events match
                        if (scene.can(name)) {
                            scene.on(name, handler, context);
                        }
                    });


                    if (eventQueue.length == 0) {
                        eventQueue.push({
                            name: name,
                            handler: handler,
                            context: context || this,
                            owner: this
                        });
                        this.inherited(name, handler, context);
                    }
                    if (!isStatic) {
                        this.eventQueue(this.eventQueue().concat(eventQueue));
                    }
                } else {
                    this.inherited(name, handler, context);
                }


            },
            /**
             * Off an event
             * @method off
             * @param name
             * @param handler
             * @param context
             */
            offx: function (name, handler, context) {
                if (util.indexOf(this.__events__, name) == -1) {
                    nx.each(this.eventQueue(), function (item) {
                        if (item.name == name) {
                            if (item.owner == this) {
                                this.inherited(name, handler, context);
                            } else {
                                item.owner.off(name, handler, context)
                            }
                        }
                    }, this);
                } else {
                    this.inherited(name, handler, context);
                }
            },
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
                    var e = event.originalEvent;
                    if (event.originalEvent.touches && event.originalEvent.touches.length == 2) {
                        this._zoomCenterPointX(0);
                        this._zoomCenterPointY(0);
                        var dist = Math.sqrt((e.touches[0].pageX - e.touches[1].pageX) * (e.touches[0].pageX - e.touches[1].pageX) + (e.touches[0].pageY - e.touches[1].pageY) * (e.touches[0].pageY - e.touches[1].pageY));
                        if (this._mousewheelDist) {
                            data = dist * (this._mousewheelDist > dist ? -1 : 1);
                        }
                        this._mousewheelDist = dist;

                    } else if (event.getWheelData) {
                        data = event.getWheelData();
                        var offset = event.getOffsetXY();
                        this._zoomCenterPointX(offset.x);
                        this._zoomCenterPointY(offset.y);

                        event.stop();

                    }

                    this.scale(this.scale() + data / step);
                    this._zoomCenterPointX(0);
                    this._zoomCenterPointY(0);
                    //}

                }

            },
            /**
             *
             * @param sender
             * @param event
             * @returns {boolean}
             * @private
             */
            _pressStage: function (sender, event) {

                var topo = this;
                var stage = topo.stage();
                var translateX = stage.translateX();
                var translateY = stage.translateY();
                var offset = event.getPageXY();
                var px = translateX - offset.x;
                var py = translateY - offset.y;
                var startDrag = true;
                var fn = function (sender, event) {
                    //console.log("x");
                    if (startDrag) {
                        var offset = event.getPageXY();
                        stage.translateX(px + offset.x);
                        stage.translateY(py + offset.y);
                        topo.fire("dragStage");
                    }
                };
                var fn2 = function (sender, event) {
                    nx.app.off("mousemove", fn);
                    nx.app.off("mouseup", fn2);

                    nx.app.off("touchmove", fn);
                    nx.app.off("touchend", fn2);


                    var offset = event.getPageXY();
                    var _px = translateX - offset.x;
                    var _py = translateY - offset.y;
                    if (_px == px && _py == py) {
                        this.fire("clickStage", event);
                    }


                    startDrag = false;

                    topo.fire("dragStageEnd");

                    nx.dom.removeClass(document.body, "n-userselect n-dragCursor");
                };
                nx.app.on("mousemove", fn);
                nx.app.on("mouseup", fn2);

                nx.app.on("touchmove", fn);
                nx.app.on("touchend", fn2);


                topo.fire("dragStageStart");

                nx.dom.addClass(document.body, "n-userselect n-dragCursor");


            },
            _contextmenu: function (sender, event) {
                event.stop();
            }
        }
    });

})(nx, nx.graphic.util, nx.global);