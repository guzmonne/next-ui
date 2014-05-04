(function (nx, global) {


    var shapeMap = {
        'rect': 'nx.graphic.Topology.RectGroup',
        'circle': 'nx.graphic.Topology.CircleGroup',
        'polygon': 'nx.graphic.Topology.PolygonGroup',
        'nodeSetPolygon': 'nx.graphic.Topology.NodeSetPolygonGroup'
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
                this.inherited(args);
                var topo = this.topology();
                topo.on('zoomend', this._redraw.bind(this), this);
                topo.on('fitStage', this._redraw.bind(this), this);
                topo.watch('revisionScale', this._redraw.bind(this), this);
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
                group.attach(this);


                group.nodes().addRange(nodes);

                this.groups().push(group);

                return group;

            },
            _redraw: function () {
                nx.each(this.groups(), function (group) {
                    group.draw();
                }, this);
            },
            /**
             * Remove a group
             * @method removeGroup
             * @param group
             */
            removeGroup: function (group) {
                var groups = this.groups();
                groups.splice(groups.indexOf(group), 1);
                group.dispose();
            },
            clear: function () {
                nx.each(this.groups(), function (group) {
                    group.dispose();
                }, this);
                this.groups([]);
                this.inherited();
            },
            dispose: function () {
                this.clear();
                var topo = this.topology();
                topo.off('zoomend', this._redraw.bind(this), this);
                topo.off('fitStage', this._redraw.bind(this), this);
                topo.unwatch('revisionScale', this._redraw.bind(this), this);
                this.inherited();
            }

        }
    });


})(nx, nx.global);