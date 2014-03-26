(function (nx, util, global) {

    nx.define("nx.graphic.Topology.LayoutMixin", {
        events: [],
        properties: {
            layoutMap: {
                value: function () {
                    return {};
                }
            },
            layoutType: {
                value: null
            },
            layoutConfig: {
                value: null
            }
        },
        methods: {
            initLayout: function () {
                this.registerLayout('force', new nx.graphic.Topology.NeXtForceLayout());
                this.registerLayout('USMap', new nx.graphic.Topology.USMapLayout());
                this.registerLayout('WorldMap', new nx.graphic.Topology.WorldMapLayout());
            },
            registerLayout: function (name, cls) {
                var layoutMap = this.layoutMap();
                layoutMap[name] = cls;

                if (cls.topology) {
                    cls.topology(this);
                }

            },
            getLayout: function (name) {
                var layoutMap = this.layoutMap();
                return layoutMap[name];
            },
            activiteLayout: function (inName, inConfig, callback) {
                var layoutMap = this.layoutMap();
                var name = inName || this.layoutType();
                var config = inConfig || this.layoutConfig();
                if (layoutMap[name] && layoutMap[name].process) {
                    layoutMap[name].process(this.graph(), config, callback);
                    this.layoutType(name);
                }
            },
            deactivateLayout: function (name) {

            }
        }
    });


})(nx, nx.util, nx.global);