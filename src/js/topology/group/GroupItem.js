(function (nx, global) {

    /**
     *
     * Base group shape class
     * @class nx.graphic.Topology.GroupItem
     * @extend nx.graphic.Component
     * @module nx.graphic.Topology.Group
     *
     */


    nx.define("nx.graphic.Topology.GroupItem", nx.graphic.Component, {
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
                            node.on('updateNodeCoordinate', this.draw, this);
                        }, this);

                        this.draw();

                    } else if (action == 'remove') {
                        nx.each(items, function (node) {
                            node.off('updateNodeCoordinate', this.draw, this);
                        }, this);

                        this.draw();
                    } else if (action == 'clear') {
                        nx.each(items, function (node) {
                            node.off('updateNodeCoordinate', this.draw, this);
                        }, this);

                        this.dispose();
                    }
                }, this);

            },
            draw: function () {
            },
            dispose: function () {
                nx.each(this.nodes().toArray(), function (node) {
                    node.off('updateNodeCoordinate', this.draw, this);
                }, this);
                this.dispose.__super__.apply(this, arguments);
            }
        }
    });


})(nx, nx.global);