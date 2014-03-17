(function (nx, util, global) {

    nx.define("nx.graphic.Topology.LayoutMixin", {
        events: [],
        properties: {
            layout: {
                value: function () {
                    return {};
                }
            },
            currentLayoutName: {
                value: 'force'
            },
            currentLayout: {
                get: function () {
                    var layout = this.layout();
                    return layout[name];
                }
            }
        },
        methods: {
            initLayout: function () {
                this.registerLayout('force', new nx.graphic.Topology.NeXtForceLayout());
            },
            registerLayout: function (name, cls) {
                var layout = this.layout();
                layout[name] = cls;

                if (cls.topology) {
                    cls.topology(this);
                }

            },
            getLayout: function (name) {
                var layout = this.layout();
                return layout[name];
            },
            activiteLayout: function (inName) {
                var layout = this.layout();
                var name = inName || this.currentLayoutName();
                if (layout[name] && layout[name]['process']) {
                    layout[name]['process'].call(this, this.graph(), name);
                    this.currentLayoutName(name);
                }
            },
            deactivateLayout: function (name) {

            }
        }
    });


})(nx, nx.util, nx.global);