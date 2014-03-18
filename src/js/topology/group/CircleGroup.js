(function (nx, global) {

    'use strict';


    nx.define('nx.graphic.Topology.CircleGroup', nx.graphic.Topology.GroupItem, {
        events: ["dragGroupStart", "dragGroup", "dragGroupEnd", "clickGroupLabel"],
        view: {
            type: 'nx.graphic.Group',
            props: {
                'class': 'group'
            },
            content: [
                {
                    name: 'shape',
                    type: 'nx.graphic.Circle',
                    props: {
                        'class': 'bg'
                    },
                    events: {
                        'mousedown': '{#_mousedown}',
                        'dragstart': '{#_dragstart}',
                        'dragmove': '{#_drag}',
                        'dragend': '{#_dragend}'
                    }
                },
                {
                    name: 'text',
                    type: 'nx.graphic.Text',
                    props: {
                        'class': 'groupLabel',
                        text: '{#label}'
                    },
                    events: {
                        'click': '{#_clickLabel}'
                    }
                }
            ]
        },
        properties: {
        },
        methods: {

            draw: function () {
                var topo = this.topology();
                var translate = topo.stage().translate();
                var bound = topo.getBoundByNodes(this.nodes().toArray());
                var radius = Math.sqrt(Math.pow(bound.width / 2, 2) + Math.pow(bound.height / 2, 2));

                var shape = this.view('shape');
                shape.sets({
                    cx: bound.left - translate.x + bound.width / 2,
                    cy: bound.top - translate.y + bound.height / 2,
                    r: radius,
                    fill: this.color(),
                    stroke: this.color()
                });


                var text = this.view('text');
                text.sets({
                    x: bound.left - translate.x + bound.width / 2,
                    y: bound.top - translate.y + bound.height / 2 - radius - 6
                });
                text.view().dom().setStyle('fill', this.color());
            },
            _clickLabel: function (sender, event) {
                this.fire('clickGroupLabel');
            },
            _mousedown: function (sender, event) {
                event.captureDrag(this.view('shape'));
            },
            _dragstart: function (sender, event) {
                this.fire('dragGroupStart', event);
            },
            _drag: function (sender, event) {
                this.fire('dragGroup', event);
                this._updateNodesPosition(event.drag.delta[0], event.drag.delta[1]);
            },
            _dragend: function (sender, event) {
                this.fire('dragGroupEnd', event);
            },
            _updateNodesPosition: function (x, y) {
                this.nodes().each(function (node) {
                    node.move(x, y);
                });
            }
        }
    });


})(nx, nx.global);