(function (nx, global) {

    nx.define('nx.graphic.Topology.NodeWatcher', nx.Observable, {
        properties: {
            property: {
                value: 'generated'
            },
            topology: {},
            'nodes': {
                get: function () {
                    return this._nodes || [];
                },
                set: function (value) {
                    var updater = this.updater();
                    var property = this.property();
                    var vertices = this.vertices();

                    if (vertices.length !== 0) {
                        nx.each(vertices, function (vertex) {
                            vertex.unwatch(property, updater, this);
                        }, this);
                        vertices.length = 0;
                    }


                    if (nx.is(value, Array) || nx.is(value, nx.data.ObservableCollection)) {
                        nx.each(value, function (item) {
                            var vertex = this._getVertex(item);
                            if (vertex && vertices.indexOf(vertex) == -1) {
                                vertices.push(vertex);
                            }
                        }, this);
                    }

                    if (nx.is(value, nx.data.ObservableCollection)) {
                        value.on('change', function (sender, args) {
                            var action = args.action;
                            var items = args.items;
                            if (action == 'add') {

                            } else if (action == 'remove') {

                            } else if (action == 'clear') {

                            }
                        });
                    }


                    nx.each(vertices, function (vertex) {
                        vertex.watch(property, updater, this);
                    }, this);

                    updater();
                    this._nodes = value;
                }
            },
            vertices: {
                value: function () {
                    return [];
                }
            },
            updater: {
                value: function () {
                    return function () {

                    };
                }
            }
        },
        methods: {
            _getVertex: function (value) {
                var vertex;
                var topo = this.topology();
                var graph = topo.graph();
                if (nx.is(value, nx.graphic.Topology.AbstractNode)) {
                    vertex = value.model();
                } else if (graph.getVertex(value)) {
                    vertex = graph.getVertex(value);
                }
                return vertex;
            },
            getNodes: function () {
                var nodes = [];
                var topo = this.topology();
                var graph = topo.graph();
                var vertices = this.vertices();
                nx.each(vertices, function (vertex) {
                    var id = vertex.id();
                    var node = topo.getNode(id);
                    if (!node) {
                        var generatedRootVertexSet = vertex.generatedRootVertexSet();
                        if (generatedRootVertexSet) {
                            node = topo.getNode(generatedRootVertexSet.id());
                        }
                    }

                    if (node && nodes.indexOf(node)) {
                        nodes.push(node);
                    }
                });

                return nodes;
            }

        }
    });
})(nx, nx.global);