(function (nx, global) {
    var d = 500;

    /**
     * Thumbnail for topology
     * @class nx.graphic.Topology.Thumbnail
     * @extend nx.ui.Component
     */

    nx.ui.define("nx.graphic.Topology.Thumbnail", {
        view: {
            content: [
                {
                    name: 'handler',
                    tag: 'i',
                    props: {
                        'class': 'n-icon-thumbnail-collapse-x16 handler'
                    },
                    events: {
                        'click': '{#_toggleThumbnail}'
                    }
                },
                {
                    name: 'svg',
                    props: {
                        'class': 'n-topology-thumbnail-svg'
                    }
                }
            ]
        },
        methods: {
            onAppend: function () {
                var topo = this.topo = this.owner();

                this.view().visible(topo.showThumbnail());

                if (!topo.showThumbnail()) {

                    return;
                }

                topo.watch("height", this._size, this);
                topo.watch("width", this._size, this);
                topo.watch("paddingLeft", this._winSize, this);
                //topo.listen("paddingTop", this._winSize, this);
                this._initStage();


                topo.on("updating", this.update, this);
                topo.on("zoomend", this.update, this);
                topo.on("dragStageEnd", this.update, this);


                topo.on("ready", function () {
                    this._drawDot();
                    this._drawRect();
                }, this);


            },


            _initStage: function () {


                var stage = this.stage = new nx.graphic.Stage({
                    width: d,
                    height: d
                });

                var g = this.g = new nx.graphic.Group();
                stage.appendChild(g);


                var rect = this.rect = new nx.graphic.Rect({
                    stroke: '#0f0',
                    opacity: 0,
                    visible: false
                });
                rect.on("click", function () {
                    if (this.topo) {
                        this.topo.fit();
                    }
                }, this);
                this.stage.appendChild(rect);


                var viewrect = this.viewrect = new nx.graphic.Rect({
                    fill: 'rgba(31, 110, 238, 0.1)',
                    //opacity: 0.1,
                    stroke: 'rgba(31, 110, 238, 0.5)',
                    'stroke-width': 1
                });
                viewrect.draggable(true);

                var topoStage;
                var sx, sy;


                viewrect.on("dragstart", function () {
                    topoStage = this.topo.stage();
                    sx = topoStage.translateX();
                    sy = topoStage.translateY();


                }, this);

                viewrect.on("drag", function (sender, args) {
                    clearInterval(this.timer);
                    topoStage.translateX(sx - args.x / this.rate);
                    topoStage.translateY(sy - args.y / this.rate);
                }, this);
                viewrect.on("dragend", function () {
                    this.update()
                }, this);

                this.stage.appendChild(viewrect);

                this.view("svg").appendChild(stage);
            },

            _drawDot: function () {
                this.g.clear();
                var w, h;
                var topo = this.topo;
                var tx = topo.stage().translateX();
                var ty = topo.stage().translateY();
                var width = topo.width();
                var height = topo.height();
                var bound = topo.stage().getBBox();
                var scale = topo.scale();
                var rate;


                if (bound.x < 0) {
                    w = width - bound.x;
                } else {
                    w = Math.max(bound.x + bound.width, width);
                }

                if (bound.y < 0) {
                    h = height - bound.y;
                } else {
                    h = Math.max(bound.y + bound.height, height);
                }


                rate = d / Math.max(w, h);


                if (scale < 1) {

                } else {
                    rate = rate / scale;
                }

                var r = rate;

                var rx = bound.x > 0 ? bound.x * r : 0;
                var ry = bound.y > 0 ? bound.y * r : 0;


                this.rect.sets({
                    x: rx,
                    y: ry,
                    width: bound.width * r,
                    height: bound.height * r
                });


                topo.eachNode(function (node) {
                    var circle = new nx.graphic.Circle({
                        radius: 2,
                        x: node.x() * r,
                        y: node.y() * r,
                        fill: "#1F6EEE",
                        opacity: '0.6'
                    });

                    this.g.appendChild(circle);

                }, this);


                var gx = bound.x < 0 ? tx * r - bound.x * r : tx * r;
                var gy = bound.y < 0 ? ty * r - bound.y * r : ty * r;


                this.g.transform().translateX(gx);
                this.g.transform().translateY(gy);
            },
            _drawRect: function () {
                var w, h;
                var topo = this.topo;
                var tx = topo.stage().translateX();
                var ty = topo.stage().translateY();
                var width = topo.width();
                var height = topo.height();
                var bound = topo.stage().getBBox();
                var scale = topo.scale();
                var rate;

//                bound.x = bound.x / scale;
//                bound.y = bound.y / scale;
//                bound.width = bound.width / scale;
//                bound.height = bound.height / scale;


                if (bound.x < 0) {
                    w = width - bound.x;
                } else {
                    w = Math.max(bound.x + bound.width, width);
                }

                if (bound.y < 0) {
                    h = height - bound.y;
                } else {
                    h = Math.max(bound.y + bound.height, height);
                }


                //w = w * scale;
                //h = h * scale;

                rate = d / Math.max(w, h);


                //rate = d / Math.max(width, height);


                //var r = rate / scale;
                //var wx = bound.x < 0 ? (tx - bound.x) * 1 : tx * 1;
                //var wy = bound.y < 0 ? (ty - bound.y) * 1 : ty * 1;

                //this.g.transform().scale(scale);

                if (scale < 1) {

                } else {
                    rate = rate / scale;
                }


                var vx = bound.x < 0 ? bound.x * rate * -1 : 0;
                var vy = bound.y < 0 ? bound.y * rate * -1 : 0;
                var vw = Math.max(width * rate, 1);
                var vh = Math.max(height * rate, 1);

                this.viewrect.sets({
                    x: vx,
                    y: vy,
                    width: vw,
                    height: vh
                });


                this.rate = rate;

            },
            _size: function () {

                var topo = this.topo;
                var width = topo.width();
                var height = topo.height();
                var el = this.view();
                var svg = this.stage;
                var rate;
                if (width > height) {

                    d = width * 0.2;


                    el.setStyle("width", d);
                    el.setStyle("height", height / width * d);
                    el.setStyle("margin-left", -2 - d);
                    svg.height(height / width * d);
                    // rate = d / width;

                } else {
                    d = height * 0.2;
                    el.setStyle("height", d);
                    el.setStyle("width", height / width * d);
                    el.setStyle("margin-left", -8 - width / height * d);
                    svg.width(height / width * d);
                    // rate = d / height;
                }

            },
            update: function () {
                if (this.timer) {
                    clearInterval(this.timer);
                }
                this.timer = util.timeout(function () {
                    this._drawDot();
                    this._drawRect();
                }, 30, this);

            },

            _toggleThumbnail: function (sender) {
                this.view("svg").toggle();
                sender.toggleClass("n-icon-thumbnail-expand-x16");

            },
            _winSize: function () {

            }
        }
    });


})(nx, nx.global);