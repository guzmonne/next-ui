(function (nx, util, global) {


    nx.define('nx.graphic.Component', nx.ui.Component, {
        events: [],
        properties: {
        },
        view: {},
        methods: {
            init: function (args) {
                this.inherited(args);
                //annotation
                nx.each(this.__properties__, function (prop) {
                    var watch = this[prop].getMeta("watch");
                    if (watch) {
                        this.watch(prop, watch, this);
                    }
                }, this);

                this.sets(args);
            },
            append: function () {
                var parentElement = this._parentElement = this.resolve("@root").$dom.parentElement || this._parentElement;
                if (parentElement && !parentElement.contains(this.resolve("@root"))) {
                    parentElement.appendChild(this.resolve("@root") && this.resolve("@root").$dom);
                }
            },
            remove: function () {
                var parentElement = this._parentElement = this.resolve("@root").$dom.parentElement;
                if (parentElement && this.resolve("@root")) {
                    parentElement.removeChild(this.resolve("@root").$dom);
                }
            }
        }
    });

})(nx, nx.graphic.util, nx.global);