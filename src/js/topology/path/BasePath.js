(function (nx, global) {

    nx.define("nx.graphic.Topology.BasePath", nx.graphic.Component, {
        events: [],
        properties: {
            nodes: {},
            pathGenerator: {
                value: function () {
                    return function () {

                    };
                }
            },
            pathStyle: {
                value: function () {
                    return {
                        'stroke': '#666',
                        'stroke-width': 2,
                        fill: 'none'
                    };
                }
            },
            topology: {}
        },
        view: {
            type: 'nx.graphic.Group',
            content: {
                name: 'path',
                type: 'nx.graphic.Path',
                props: {

                }
            }
        },
        methods: {
            attach: function (parent) {
                this.inherited(parent);
                this.view("path").dom().setStyles(this.pathStyle());
                nx.each(this.nodes(), function (node) {
                    node.on('updateNodeCoordinate', this._draw, this);
                }, this);
            },
            _draw: function () {
                var topo = this.topology();
                var pathStyle = this.pathStyle();
                var d = this.pathGenerator().call(this);
                if (d) {
                    this.view('path').set('d', d);

                    //
                    var strokeWidth = parseInt(pathStyle['stroke-width'], 10) || 1;
                    this.view("path").dom().setStyle('stroke-width', strokeWidth * topo.stageScale());

                }
            },
            draw: function () {
                this._draw();
            }
        }
    });
})(nx, nx.global);