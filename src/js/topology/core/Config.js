(function (nx, util, global) {

    nx.define("nx.graphic.Topology.Config", {
        events: [],
        properties: {
            /**
             * @property autoLayout
             */
            autoLayout: {
                value: false
            },

            /**
             * 0: not start,1:drawing,2 :finished,3 start and padding adaptive
             * @property status
             */
            status: {
                value: 0 //0: not start,1:drawing,2 :finished,3 start and padding adaptive
            },
            theme: {
                value: "blue"
            },
            /**
             * @property showNavigation
             */
            showNavigation: {
                value: true
            },
            /**
             * @property tooltipManager
             */
            tooltipManager: {
                value: function () {
                    return new nx.graphic.Topology.TooltipManager({topology: this});
                }
            },
            /**
             * @property showModeSwitch
             */
            showModeSwitch: {
                value: true
            },
            /**
             * @property show3D
             */
            show3D: {
                value: false
            },
            internalshow3D: {
                value: false
            },
            /**
             * Set show/hide thumbnail
             * @property showThumbnail
             */
            showThumbnail: {
                value: false
            },
            viewSettingPanel: {
                get: function () {
                    return this.resolve("nav").resolve("customize");
                }
            },
            searchMath: {}
        },
        methods: {
        }
    });

})(nx, nx.graphic.util, nx.global);