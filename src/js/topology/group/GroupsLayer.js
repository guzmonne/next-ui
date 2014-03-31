(function (nx, global) {


    var shapeMap = {
        'rect': 'nx.graphic.Topology.RectGroup',
        'circle': 'nx.graphic.Topology.CircleGroup',
        'polygon': 'nx.graphic.Topology.PolygonGroup'
    };


    var colorTable = ['#C3A5E4', '#75C6EF', '#CBDA5C', '#ACAEB1 ', '#2CC86F'];


    /**
     * Topology group layer class

     var groupsLayer = topo.getLayer('groups');
     var nodes1 = [sender.getNode(0), sender.getNode(1)];
     var group1 = groupsLayer.addGroup({
                    nodes: nodes1,
                    label: 'Rect',
                    color: '#f00'
                });
     group1.on('clickGroupLabel', function (sender, events) {
                    console.log(group1.nodes().toArray());
                }, this);

     *
     * @class nx.graphic.Topology.GroupsLayer
     * @extend nx.graphic.Topology.Layer
     * @module nx.graphic.Topology
     */

    nx.define('nx.graphic.Topology.GroupsLayer', nx.graphic.Topology.Layer, {
        statics: {
            /**
             * Default color table, with 5 colors
             * @property colorTable
             * @static
             */
            colorTable: colorTable
        },
        events: [],
        properties: {
            /**
             * Groups collection
             * @property groups {Array}
             */
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

            /**
             * Register a group item class
             * @param name {String} group items' name
             * @param className {Object} which should extend nx.graphic.Topology.GroupItem
             */
            registerGroupItem: function (name, className) {
                shapeMap[name] = className;
            },


            attach: function (args) {
                this.attach.__super__.apply(this, arguments);
                var topo = this.topology();
                topo.on('resetzooming', this.reDrawAllGroup, this);
                topo.on('zoomend', this.reDrawAllGroup, this);

            },
            /**
             * Add a group to group layer
             * @param obj {Object} config of a group
             * @returns {GroupClass}
             */
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
            /**
             * Re-draw all group, for update
             * @method reDrawAllGroup
             */
            reDrawAllGroup: function () {
                nx.each(this.groups(), function (group) {
                    group.draw();
                }, this);
            },
            clear: function () {
                this.groups([]);

                var topo = this.topology();
                topo.off('resetzooming', this.reDrawAllGroup, this);
                topo.off('zoomend', this.reDrawAllGroup, this);
                this.clear.__super__.apply(this, arguments);
            }

        }
    });


})(nx, nx.global);