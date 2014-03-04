(function (nx, util, global) {

    nx.define("nx.graphic.Topology.Config", {
        events: [],
        properties: {
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
             * @property showModeSwitch
             */
            showModeSwitch: {
                value: true
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
            }
        },
        methods: {
        }
    });

})(nx, nx.graphic.util, nx.global);