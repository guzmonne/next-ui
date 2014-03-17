(function (nx, global) {

    'use strict';

    nx.define("nx.graphic.Topology.GroupItem", nx.graphic.Component, {
        events: [],
        properties: {
            topology: {

            },
            nodes: {
                value: function () {
                    return new nx.data.ObservableCollection();
                }
            },
            color: {

            },
            label: {

            }
        },
        view: {

        },
        methods: {
            init: function (args) {

                this.init.__super__.apply(this, arguments);

                var nodes = this.nodes();

                nodes.on('change', function (sender, args) {
                    var action = args.action;
                    var items = args.items;

                    if (action == 'add') {

                        nx.each(items, function (node) {
                            node.model().on('updateCoordinate', this.draw, this);
                        }, this);

                        this.draw();

                    } else if (action == 'remove') {
                        nx.each(items, function (node) {
                            node.model().off('updateCoordinate', this.draw, this);
                        }, this);

                        this.draw();
                    } else if (action == 'clear') {
                        nx.each(items, function (node) {
                            node.model().off('updateCoordinate', this.draw, this);
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