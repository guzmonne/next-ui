(function (nx, global) {


    var shapeMap = {
        'rect': 'nx.graphic.Topology.RectGroup',
        'circle': 'nx.graphic.Topology.CircleGroup',
        'polygon': 'nx.graphic.Topology.PolygonGroup'
    };


    var colorTable = ['#C3A5E4', '#75C6EF', '#CBDA5C', '#ACAEB1 ', '#2CC86F'];


    nx.define('nx.graphic.Topology.GroupsLayer', nx.graphic.Topology.Layer, {
        events: [],
        properties: {
            groups: {
                value: function () {
                    return [];
                }
            }
        },
        view: {
            type: 'nx.graphic.Group'
        },
        methods: {

            registerGroupItem: function (name, className) {
                shapeMap[name] = className;
            },


            attach: function (args) {
                this.attach.__super__.apply(this, arguments);
                var topo = this.topology();
                topo.on('resetzooming', this.reDrawAllGroup, this);
                topo.on('zoomend', this.reDrawAllGroup, this);

            },

            addGroup: function (obj) {
                var groups = this.groups();
                var shape = obj.shapeType || 'rect';
                var nodes = obj.nodes;

                var GroupClass = nx.path(global, shapeMap[shape]);
                var group = new GroupClass({
                    'topology': this.topology()
                });

                var config = nx.clone(obj);
                if (!config.color) {
                    config.color = colorTable[groups.length % 5];
                }
                delete  config.nodes;
                delete  config.shapeType;

                group.sets(config);
                group.nodes().addRange(nodes);


                group.draw();
                group.attach(this);
                this.groups().push(group);

                return group;

            },
            reDrawAllGroup: function () {
                nx.each(this.groups(), function (group) {
                    group.draw();
                }, this);
            }

        }
    });


})(nx, nx.global);