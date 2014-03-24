(function (nx, util, global) {
    /**
     * Topology base class

     var topologyData = {
        nodes: [
            {"id": 0, "x": 410, "y": 100, "name": "12K-1"},
            {"id": 1, "x": 410, "y": 280, "name": "12K-2"},
            {"id": 2, "x": 660, "y": 280, "name": "Of-9k-03"},
            {"id": 3, "x": 660, "y": 100, "name": "Of-9k-02"},
            {"id": 4, "x": 180, "y": 190, "name": "Of-9k-01"}
        ],
        links: [
            {"source": 0, "target": 1},
            {"source": 1, "target": 2},
            {"source": 1, "target": 3},
            {"source": 4, "target": 1},
            {"source": 2, "target": 3},
            {"source": 2, "target": 0},
            {"source": 3, "target": 0},
            {"source": 3, "target": 0},
            {"source": 3, "target": 0},
            {"source": 0, "target": 4},
            {"source": 0, "target": 4},
            {"source": 0, "target": 3}
        ]
     };
      nx.define('MyTopology', nx.ui.Component, {
        view: {
            content: {
                type: 'nx.graphic.Topology',
                props: {
                    width: 800,
                    height: 800,
                    nodeLabel: 'model.id',
                    showIcon: true,
                    data: topologyData
                }
            }
        }
     });
     var app = new nx.ui.Application();
     var comp = new MyTopology();
     comp.attach(app);


     * @class nx.graphic.Topology
     * @extend nx.ui.Component
     * @module nx.graphic.Topology
     * @uses nx.graphic.Topology.Config
     * @uses nx.graphic.Topology.Projection
     * @uses nx.graphic.Topology.Graph
     * @uses nx.graphic.Topology.Event
     * @uses nx.graphic.Topology.StageMixin
     * @uses nx.graphic.Topology.NodeMixin
     * @uses nx.graphic.Topology.LinkMixin
     * @uses nx.graphic.Topology.LayerMixin
     * @uses nx.graphic.Topology.TooltipMixin
     * @uses nx.graphic.Topology.SceneMixin
     *
     */
    nx.define("nx.graphic.Topology", nx.ui.Component, {
        mixins: [
            nx.graphic.Topology.Config,
            nx.graphic.Topology.Projection,
            nx.graphic.Topology.Graph,
            nx.graphic.Topology.Event,
            nx.graphic.Topology.StageMixin,
            nx.graphic.Topology.NodeMixin,
            nx.graphic.Topology.LinkMixin,
            nx.graphic.Topology.LayerMixin,
//            nx.graphic.Topology.LayoutMixin,
            nx.graphic.Topology.TooltipMixin,
            nx.graphic.Topology.SceneMixin,
            nx.graphic.Topology.Categories
        ],
        view: {
            props: {
                'class': ['n-topology', '{#themeClass}'],
                tabindex: '0',
                style: {
                    width: "{#width}",
                    height: "{#height}"
                }
            },
            content: [
                {
                    name: 'nav',
                    type: 'nx.graphic.Topology.Nav',
                    props: {
                        visible: '{#showNavigation}',
                        showIcon: '{#showIcon,direction=<>}'
                    }
                },
                {
                    name: "stage",
                    type: "nx.graphic.TopologyStage",
                    props: {
                        width: "{#width}",
                        height: "{#height}",
                        translateX: '{#paddingLeft}',
                        translateY: '{#paddingTop}'
                    },
                    events: {
                        ':mousedown': '{#_pressStage}',
                        ':touchstart': '{#_pressStage}',
                        'mouseup': '{#_clickStage}',
                        'touchend': '{#_clickStage}',
                        'mousewheel': '{#_mousewheel}',
                        'touchmove': '{#_mousewheel}',
                        'dragStageStart': '{#_dragStageStart}',
                        'dragStage': '{#_dragStage}',
                        'dragStageEnd': '{#_dragStageEnd}'

                    }
                },
                {
                    name: 'img',
                    tag: 'img'
                },
                {
                    name: 'canvas',
                    tag: 'canvas'
                }

            ],
            events: {
                'contextmenu': '{#_contextmenu}',
                'keydown': '{#_key}'
            }
        },
        properties: {
        },
        methods: {
            init: function (args) {
                this.inherited(args);
                this.sets(args);
                this.initLayer();
                this.initGraph();
                this.initNode();
                this.initScene();
            },
            attach: function (args) {
                this.inherited(args);
                this._adaptiveTimer();
            },
            __draw: function () {
                var start = new Date();
                var serializer = new XMLSerializer();
                var svg = serializer.serializeToString(this.stage().resolve("@root").$dom.querySelector('.stage'));
                var defs = serializer.serializeToString(this.stage().resolve("@root").$dom.querySelector('defs'));
                var svgString = '<svg width="' + this.width() + '" height="' + this.height() + '" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" >' + defs + svg + "</svg>";
                var b64 = window.btoa(svgString);
                var img = this.resolve("img").resolve("@root").$dom;
                //var canvas = this.resolve("canvas").resolve("@root").$dom;
                img.setAttribute('width', this.width());
                img.setAttribute('height', this.height());
                img.setAttribute('src', 'data:image/svg+xml;base64,' + b64);
//                var ctx = canvas.getContext("2d");
//                ctx.drawImage(img, 10, 10);
                this.resolve("stage").resolve("@root").setStyle("display", "none");
                console.log('Generate image', new Date() - start);
            }
        }
    });
})(nx, nx.util, nx.global);