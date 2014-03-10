(function (nx, util, global) {


    nx.define("nx.graphic.Topology.Search", nx.ui.Component, {
        events: ['openSearchPanel', 'closeSearchPanel', 'changeSearch', 'executeSearch'],
        properties: {
            topology: {},
            math: {}
        },
        view: {
//            content: [
//                {
//                    name: 'searchPopup',
//                    type: 'nx.ui.Popup',
//                    props: {
//                        direction: "right"
//                    },
//                    content: {
//                        name: 'searchCombo',
//                        type: 'nx.ui.ComboBox',
//                        props: {
//                            labelPath: 'label',
//                            width: 160,
//                            showArrow: false
//                        },
//                        events: {
//                            'change': '{#_change}',
//                            'execute': '{#_execute}'
//                        }
//                    }
//                }
//            ]
        },
        methods: {
            onInit: function () {
                this.close();
            },
            open: function (args) {
                var topo = this.topology();

                var combo = this.resolve("searchCombo");

                combo.match(topo.searchMath());

                var popup = this.resolve("searchPopup");


                var nodes = topo.getNodes();

                var data = [];
                nx.each(nodes, function (node) {
//                    data.push({
//                        label: node.label(),
//                        node: node
//                    })


                    data.push(node);
                });


                topo.selectedNodes().clear();


                combo.selectedItem(null);

                combo.value(null);

                combo.items(new nx.data.ObservableCollection(data));


                popup.open(args);


                topo.recover(true);


                this.fire("openSearchPanel");

                //

            },
            close: function () {
                this.resolve("searchPopup").close(true);
                this.resolve("searchCombo").close(true);


                this.fire("closeSearchPanel");
            },
            _change: function (sender, event) {
                var nodes = sender.menu().items();
                var topo = this.topology();

                topo.recover(true);


                this.topology().highlightNodes(nodes);


                this.fire("changeSearch", nodes);
            },
            _execute: function (sender, event) {
                var topo = this.topology();
                topo.recover(true);


                var selectedItem = sender.selectedItem();
                var nodes;

                if (selectedItem) {
                    selectedItem.model().selected(true);
                } else {
                    nodes = sender.menu().items();
                    if (!util.isArray(nodes)) {
                        nodes = nodes.toArray();
                    }
                    nx.each(nodes, function (node) {
                        node.selected(true);
                    });
                }

                this.close();

                this.fire("executeSearch", selectedItem || nodes);

            }

        }
    })


})(nx, nx.graphic.util, nx.global);