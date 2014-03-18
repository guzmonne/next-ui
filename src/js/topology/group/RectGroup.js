(function (nx, global) {

    'use strict';


    nx.define('nx.graphic.Topology.RectGroup', nx.graphic.Topology.GroupItem, {
        events: ["dragGroupStart", "dragGroup", "dragGroupEnd", "clickGroupLabel"],
        view: {
            type: 'nx.graphic.Group',
            props: {
                'class': 'group'
            },
            content: [
                {
                    name: 'shape',
                    type: 'nx.graphic.Rect',
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

                var shape = this.view('shape');
                shape.sets({
                    x: bound.left - translate.x,
                    y: bound.top - translate.y,
                    width: bound.width,
                    height: bound.height,
                    fill: this.color(),
                    stroke: this.color()
                });


                var text = this.view('text');
                text.sets({
                    x: bound.left - translate.x + bound.width / 2,
                    y: bound.top - translate.y - 6
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