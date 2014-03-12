(function (nx, util, global) {

    nx.define("nx.graphic.Topology.Config", {
        events: [],
        properties: {
            /**
             * @property status
             */
            status: {
                value: 0
            },
            theme: {
                get: function () {
                    return this._theme || 'blue';
                },
                set: function (value) {
                    this._theme = value;
                    this.notify('themeClass');
                }
            },
            themeClass: {
                get: function () {
                    return 'n-topology-' + this.theme();
                }
            },
            /**
             * @property showNavigation
             */
            showNavigation: {
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