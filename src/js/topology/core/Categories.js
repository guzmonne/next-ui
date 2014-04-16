(function (nx, global) {
    /**
     * Topology's batch operation class
     * @class nx.graphic.Topology.Categories
     * @module nx.graphic.Topology
     */
    nx.define("nx.graphic.Topology.Categories", {
        events: [],
        properties: {
        },
        methods: {
            /**
             * Show loading indicator
             * @method showLoading
             */
            showLoading: function () {
                this.view().dom().addClass('n-topology-loading');
                this.view('loading').dom().setStyle('display', 'block');
            },
            /**
             * Hide loading indicator
             * @method hideLoading
             */
            hideLoading: function () {
                this.view().dom().removeClass('n-topology-loading');
                this.view('loading').dom().setStyle('display', 'none');
            },
            __draw: function () {
                var start = new Date();
                var serializer = new XMLSerializer();
                var svg = serializer.serializeToString(this.stage().resolve("@root").$dom.querySelector('.stage'));
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
            },
            __drawBG: function (inBound) {
                var bound = inBound || this.stage().getContentBound();
                var bg = this.stage().resolve('bg').root();
                bg.sets({
                    x: bound.left,
                    y: bound.top,
                    width: bound.width,
                    height: bound.height,
                    visible: true
                });
                this.stage().resolve('bg').set('visible', true);
            }
        }
    });


})(nx, nx.global);