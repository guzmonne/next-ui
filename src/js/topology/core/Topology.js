(function (nx, util, global) {
    nx.define("nx.graphic.Topology", nx.ui.Component, {
        mixins: [
            nx.graphic.Topology.Config,
            nx.graphic.Topology.Projection,
            nx.graphic.Topology.Model,
//            nx.graphic.Topology.Event,
            nx.graphic.Topology.StageMixin,
            nx.graphic.Topology.NodeMixin,
            nx.graphic.Topology.LinkMixin,
            nx.graphic.Topology.LayerMixin,
//            nx.graphic.Topology.LayoutMixin,
            //nx.graphic.Topology.SceneMixin,
            //nx.graphic.Topology.Categories
        ],
        view: {
            props: {
                'class': 'n-topology n-topology-blue',
                style: {
                    width: "{#width}",
                    height: "{#height}"
                }
            },
            content: [
                {
//                    name: 'nav',
//                    type: 'nx.graphic.Topology.Nav',
//                    props: {
//                        //scale: '{#scale,direction=<>}',
//                        maxScale: '{#maxScale}',
//                        minScale: '{#minScale}',
//                        mode: '{#mode,direction=<>}',
//                        show3D: '{#internalshow3D}',
//                        showModeSwitch: '{#showModeSwitch}',
//                        showZoomRate: '{#showNavigation}',
//                        visible: '{#showNavigation}',
//                        showIcon: '{#showIcon,direction=<>}',
//                        theme: '{#theme,direction=<>}'
//                    },
//                    events: {
//                        'fit': '{#fit}',
//                        'show3DTopology': '{#show3DTopology}'
//                    }
                },
                {
                    name: "stage",
                    type: "nx.graphic.TopologyStage",
                    props: {
                        width: "{#width}",
                        height: "{#height}",
                        //scale: '{#scale}',
                        translateX: '{#paddingLeft}',
                        translateY: '{#paddingTop}'
                    },
                    events: {
//                        'mousedown': '{#_pressStage}',
//                        'touchstart': '{#_clickStage}',
//                        'mousewheel': '{#_mousewheel}',
//                        'touchmove': '{#_mousewheel}'
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

//                nx.each(this.__properties__, function (prop) {
//                    var value = this[prop].__meta__.value;
//                    if (value) {
//                        this.set(prop, nx.is(value, 'Function') ? value.call(this) : value);
//                    }
//                }, this);


                this.sets(args);

                this.initLayer();
                this.initModel();
            },
            onInit: function () {
                this.initStage();
                this.initLayer();
                this.initModel();

                //this.initScene();
                //this.activateScene("default");


            },
            attach: function (args) {
                this.inherited(args);

                this._adaptiveTimer();
            }
        }
    });
})(nx, nx.graphic.util, nx.global);