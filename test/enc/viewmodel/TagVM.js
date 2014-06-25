(function (nx, global) {

    nx.define("ENC.TW.ViewModel.TagVM", nx.Observable, {
        events: [],
        properties: {
            MVM: {},
            tagData: {
                dependencies: ['MVM.topoDataModel.data', 'MVM.topologyGenerated'],
                value: function (data, generated) {
                    if (data && generated) {
                        var nodes = data.nodes;
                        var tagDictionary = this.tagDictionary();
                        nx.each(nodes, function (node) {
                            var tag = node.tag;
                            var id = node.id;
                            if (tag) {
                                nx.each(tag.split(","), function (t) {
                                    var value = tagDictionary.getItem(t);
                                    if (value) {
                                        value.nodes.push(id);
                                    } else {
                                        value = {nodes: [id]};
                                    }
                                    tagDictionary.setItem(t, value);
                                })
                            }
                        })
                    }
                }
            },
            tagDictionary: {
                value: function () {
                    return  new nx.data.ObservableDictionary();
                }
            }
        },
        methods: {

        }
    });
})(nx, nx.global);