(function (nx, global) {

    /**
     *
     * Base group shape class
     * @class nx.graphic.Topology.GroupItem
     * @extend nx.graphic.Component
     * @module nx.graphic.Topology.Group
     *
     */


    nx.define("nx.graphic.Topology.GroupItem", nx.graphic.Group, {
        events: [],
        properties: {
            /**
             * Topology
             * @property topology
             * @readyOnly
             */
            topology: {

            },
            /**
             * Node array in the shape
             * @property nodes {nx.data.ObservableCollection}
             */
            nodes: {
                value: function () {
                    return new nx.data.ObservableCollection();
                }
            },
            /**
             * Shape's color
             * @property color
             */
            color: {

            },
            /**
             * Group's label
             * @property label
             */
            label: {

            },
            blockDrawing: {
                value: false
            }
        },
        view: {

        },
        methods: {
            init: function (args) {

                this.inherited(args);

                var nodes = this.nodes();

                nodes.on('change', function (sender, args) {
                    var action = args.action;
                    var items = args.items;

                    if (action == 'add') {

                        nx.each(items, function (node) {
                            node.on('updateNodeCoordinate', this._draw, this);
                            node.on('remove', this.removeNode, this);
                        }, this);

                        this.draw();

                    } else if (action == 'remove') {
                        nx.each(items, function (node) {
                            node.off('updateNodeCoordinate', this._draw, this);
                        }, this);

                        this.draw();
                    } else if (action == 'clear') {
                        nx.each(items, function (node) {
                            node.off('updateNodeCoordinate', this._draw, this);
                        }, this);
                    }
                }, this);

            },
            _draw: function () {
                if (!this.blockDrawing()) {
                    this.draw();
                }
            },
            draw: function () {
                if (this.nodes().count() === 0) {
                    this.hide();
                    return;
                } else {
                    this.show();
                }
            },
            removeNode: function (node) {
                this.nodes().remove(node);
            },
            updateNodesPosition: function (x, y) {
                var stageScale = this.topology().stageScale();
                this.nodes().each(function (node) {
                    node.move(x * stageScale, y * stageScale);
                });
            },
            dispose: function () {
                this.nodes().clear();
                this.nodes().dispose();
                this.inherited();
            }
        }
    });


})(nx, nx.global);