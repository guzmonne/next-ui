(function (nx, util, global) {
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
            //nx.graphic.Topology.Categories
        ],
        view: {
            props: {
                'class': ['n-topology', '{#themeClass}'],
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
                        scale: '{#scale,direction=<>}',
//                        maxScale: '{#maxScale}',
//                        minScale: '{#minScale}',
//                        mode: '{#mode,direction=<>}',
//                        show3D: '{#internalshow3D}',
//                        showModeSwitch: '{#showModeSwitch}',
//                        showZoomRate: '{#showNavigation}',
//                        visible: '{#showNavigation}',
//                        showIcon: '{#showIcon,direction=<>}',
//                        theme: '{#theme,direction=<>}'
                    },
                    events: {
//                        'fit': '{#fit}',
//                        'show3DTopology': '{#show3DTopology}'
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
//                    name: 'thumbnail',
//                    type: 'nx.graphic.Topology.Thumbnail',
//                    props: {
//                        'class': 'n-topology-thumbnail',
//                        style: {
//                            left: '{#width}'
//                        },
//                        visible: "{#showThumbnail}"
//
//                    }
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
                'contextmenu': '{#_contextmenu}'
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
            onInit: function () {

                //this.initScene();
                //


            },
            attach: function (args) {
                this.inherited(args);
                this._adaptiveTimer();
            },
            draw: function () {
                var start = new Date();
                var serializer = new XMLSerializer();
                var svg = serializer.serializeToString(this.stage().resolve("@root").$dom.querySelector('[data-nx-type*=inksLayer]'));
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
})(nx, nx.graphic.util, nx.global);