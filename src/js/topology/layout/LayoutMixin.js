(function (nx, global) {
    /**
     * Layout mixin class
     * @class nx.graphic.Topology.LayoutMixin
     * @module nx.graphic.Topology
     */
    nx.define("nx.graphic.Topology.LayoutMixin", {
        events: [],
        properties: {
            /**
             * Layout map
             * @property  layoutMap
             */
            layoutMap: {
                value: function () {
                    return {};
                }
            },
            /**
             * Current layout type
             * @property layoutType
             */
            layoutType: {
                value: null
            },
            /**
             * Current layout config
             * @property layoutConfig
             */
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
            /**
             * Register a layout
             * @method registerLayout
             * @param name {String} layout name
             * @param cls {Object} layout class instance
             */
            registerLayout: function (name, cls) {
                var layoutMap = this.layoutMap();
                layoutMap[name] = cls;

                if (cls.topology) {
                    cls.topology(this);
                }
            },
            /**
             * Get layout instance by name
             * @method getLayout
             * @param name {String}
             * @returns {*}
             */
            getLayout: function (name) {
                var layoutMap = this.layoutMap();
                return layoutMap[name];
            },
            /**
             * Activate a layout
             * @param inName {String} layout name
             * @param inConfig {Object} layout config object
             * @param callback {Function} callback for after apply a layout
             */
            activateLayout: function (inName, inConfig, callback) {
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


})(nx, nx.global);