(function (nx, global) {

    nx.define("ENC.TW.ViewModel.ControlVM.Tag", nx.Observable, {
        events: [],
        properties: {
            MVM: {},
            tagData: {
                dependencies: ['tagDataModel.data'],
                value: function (data) {
                    if (data) {
                        var dict = {};
                        nx.each(data, function (item) {
                            var tag = item.tag, items;
                            if (dict[tag]) {
                                items = dict[tag];
                                items.push(item);
                            } else {
                                items = [item];
                            }
                            dict[tag] = items;
                        });

                        var tags = [];
                        nx.each(dict, function (value, key) {
                            tags.push(new nx.data.ObservableObject({
                                key: key,
                                nodes: value,
                                originalKey: key,
                                opened: false
                            }))
                        });
                        this.tags(tags);

                    }
                }
            },
            tags: {
                value: function () {
                    return  [];//new nx.data.ObservableDictionary();
                }
            },
            tagDataModel: {
                value: function () {
                    return  new ENC.TW.Model.Tag();
                }
            }
        },
        methods: {
            highlightTag: function (sender, events) {
                var nodes = sender.model().get('nodes');
                var ids = nodes.map(function (a) {
                    return a.networkDeviceId
                });
                console.log(ids);
                this.MVM().topologyVM().highlightedNodes(ids);
            },
            recoverTag: function () {
                this.MVM().topologyVM().recoverHighlighted();
            },
            update: function (model) {
                console.log(model);
            }
        }
    });

})(nx, nx.global);