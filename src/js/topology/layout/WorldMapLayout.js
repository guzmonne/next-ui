(function (nx, util, global) {

    var D3URL = 'http://d3js.org/d3.v3.min.js';
    var D3TOPOJSON = 'http://d3js.org/topojson.v1.min.js';
    var WORLDMAPTopoJSON = 'http://bl.ocks.org/mbostock/raw/4090846/world-50m.json';
    var width = 960, height = 480;
    var projection;
    nx.define("nx.graphic.Topology.WorldMapLayout", {
        properties: {
            topology: {}
        },
        methods: {
            process: function (graph, config, callback) {
                // load d3

                if (!config.worldTopoJson) {
                    console.log('Please idenity world topo json url, download from:http://bl.ocks.org/mbostock/raw/4090846/world-50m.json');
                    return;
                }

                WORLDMAPTopoJSON = config.worldTopoJson;


                this._loadD3(function () {
                    this._loadTopoJSON(function () {
                        this._process(graph, config, callback);
                    }.bind(this));
                }.bind(this));
            },
            _loadD3: function (fn) {
                if (typeof(d3) === "undefined") {
                    util.loadScript(D3TOPOJSON, function () {
                        fn.call(this);
                    }.bind(this));
                } else {
                    fn.call(this);
                }
            },
            _loadTopoJSON: function (fn) {
                if (typeof(topojson) === "undefined") {
                    util.loadScript(D3TOPOJSON, function () {
                        fn.call(this);
                    }.bind(this));
                } else {
                    fn.call(this);
                }
            },
            _process: function (graph, config, callback) {
                var topo = this.topology();

                projection = d3.geo.equirectangular().translate([width / 2, height / 2]).precision(0.1);
                topo.prependLayer('worldMap', 'nx.graphic.Topology.WorldMapLayer');

                var longitude = config.longitude || 'model.longitude',
                    latitude = config.latitude || 'model.latitude';


                topo.projectionXRange([0, 960]);
                topo.projectionYRange([0, 500]);

                topo._setProjection(false, false);

                topo.eachNode(function (n) {

                    var model = n.model();
                    var p = projection([nx.path(n, longitude), nx.path(n, latitude)]);
                    model.autoSave(false);
                    model.position({
                        x: p[0],
                        y: p[1]
                    });
                });

                topo.adjustLayout();

                topo.getLayer("worldMap").updateMap();

                if (callback) {
                    callback.call(topo);
                }
            }

        }
    });


    //

    nx.define("nx.graphic.Topology.WorldMapLayer", nx.graphic.Topology.Layer, {
        view: {
            type: 'nx.graphic.Group',
            content: {
                name: 'map',
                type: 'nx.graphic.Group'
            }
        },
        methods: {
            draw: function () {

                var map = this.view('map');

                var group = d3.select(map.view().dom().$dom);

                var path = d3.geo.path().projection(projection);

                d3.json(WORLDMAPTopoJSON, function (error, world) {
                    group.insert("path", ".graticule")
                        .datum(topojson.feature(world, world.objects.land))
                        .attr("class", "land mapPath")
                        .attr("d", path);

                    group.insert("path", ".graticule")
                        .datum(topojson.mesh(world, world.objects.countries, function (a, b) {
                            return a !== b;
                        }))
                        .attr("class", "boundary mapBoundary")
                        .attr("d", path);
                });

                this.topology().on("resetzooming", this.update, this);
                this.topology().on("zoomend", this.update, this);
                this.topology().on("fitStage", this.updateMap, this);
            },
            updateMap: function () {
                var g = this.view('map');
                var scale = Math.min(this.topology().containerWidth() / width, this.topology().containerHeight() / height);
                var translateX = (this.topology().containerWidth() - width * scale) / 2;
                var translateY = (this.topology().containerHeight() - height * scale) / 2;
                g.setTransform(translateX, translateY, scale);
            },
            update: function () {
                var topo = this.topology();
                this.set("scale", topo.scale());
            }
        }
    });


})(nx, nx.util, nx.global);