(function (nx, util, global, logger) {
    nx.define("nx.data.ObservableGraph.ForceProcessor", {
        methods: {
            process: function (data, key, model) {
                var forceStartDate = new Date();

                var _data = {nodes: data.nodes, links: []};
                var nodeIndexMap = {};
                nx.each(data.nodes, function (node, index) {
                    nodeIndexMap[node[key]] = index;
                });


                // if source and target is not number, force will search node
                nx.each(data.links, function (link) {
                    if (!nx.is(link.source, 'Object') && nodeIndexMap[link.source] !== undefined && !nx.is(link.target, 'Object') && nodeIndexMap[link.target] !== undefined) {
                        _data.links.push({
                            source: nodeIndexMap[link.source],
                            target: nodeIndexMap[link.target]
                        });
                    }
                });

                // force
                var force = new nx.data.Force();
                force.setData(data);

                if (_data.nodes.length < 50) {
                    while (true) {
                        force.tick();
                        if (force.maxEnergy < 1) {
                            break;
                        }
                    }
                } else {
                    var step = 0;
                    while (++step < 300) {
                        force.tick();
                    }
                }

                return data;
            }
        }
    });

})(nx, nx.graphic.util, nx.global, nx.logger);