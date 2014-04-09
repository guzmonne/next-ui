(function (nx, util, global) {
    /**
     * @class nx.graphic.LinkSetTooltipContent
     * @extend nx.ui.Component
     * @module nx.graphic.Topology
     */
    nx.define("nx.graphic.Topology.LinkSetTooltipContent", nx.ui.Component, {
        properties: {
            linkSet: {
                set: function (value) {
                    var items = [];
                    var edges = value.model().getSubEdges();
                    nx.each(edges, function (edge) {
                        items.push({
                            item: "Source:" + edge.sourceID() + " Target :" + edge.targetID(),
                            edge: edge});
                    });
                    this.resolve("list").items(items);
                }
            },
            topology: {}
        },
        view: [
            {
                props: {
                    style: {
                        'maxHeight': '247px',
                        'overflow': 'auto',
                        'overflow-x': 'hidden'
                    }
                },
                content: {
                    name: 'list',
                    props: {
                        'class': 'list-group',
                        style: 'width:200px',
                        template: {
                            tag: 'a',
                            props: {
                                'class': 'list-group-item'
                            },
                            content: '{item}',
                            events: {
                                'click': '{#_click}'
                            }
                        }
                    }
                }
            }
        ],
        methods: {
            _click: function (sender, events) {
                var link = sender.model().edge;
                this.topology().fire('clickLink', link);
            }
        }
    });


})(nx, nx.util, nx.global);