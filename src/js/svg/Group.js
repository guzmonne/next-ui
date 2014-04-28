(function (nx, global) {

    /**
     * SVG group component
     * @class nx.graphic.Group
     * @extend nx.graphic.Component
     * @module nx.graphic
     */
    nx.define("nx.graphic.Group", nx.graphic.Component, {
        view: {
            tag: 'svg:g'
        },
        methods: {
            move: function (x, y) {
                var translate = this.translate();
                this.setTransform(x + translate.x, y + translate.y);
            }
        }
    });
})(nx, nx.global);