(function (nx, global) {


    /**
     * Polygon shape group class
     * @class nx.graphic.Topology.PolygonGroup
     * @extend nx.graphic.Topology.GroupItem
     * @module nx.graphic.Topology.Group
     *
     */

    nx.define('nx.graphic.Topology.PolygonGroup', nx.graphic.Topology.GroupItem, {
        events: ["dragGroupStart", "dragGroup", "dragGroupEnd", "clickGroupLabel"],
        view: {
            type: 'nx.graphic.Group',
            props: {
                'class': 'group'
            },
            content: [
                {
                    name: 'shape',
                    type: 'nx.graphic.Polygon',
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
                    type: 'nx.graphic.Group',
                    content: {
                        name: 'label',
                        type: 'nx.graphic.Text',
                        props: {
                            'class': 'groupLabel',
                            text: '{#label}'
                        },
                        events: {
                            'click': '{#_clickLabel}'
                        }
                    }
                }
            ]
        },
        properties: {
        },
        methods: {

            draw: function () {
                var topo = this.topology();
                var stageScale = topo.stageScale();
                var translate = {
                    x: topo.matrix().x(),
                    y: topo.matrix().y()
                };

                var vectorArray = [];
                this.nodes().each(function (node) {
                    if (node.visible()) {
                        vectorArray.push({x: node.x(), y: node.y()});
                    }
                });
                var shape = this.view('shape');
                var text = this.view('text');
                shape.sets({
                    fill: this.color()
                });
                shape.setStyle('stroke', this.color());
                shape.setStyle('stroke-width', 60 * stageScale);
                shape.nodes(vectorArray);




                var bound = topo.getBoundByNodes(this.nodes().toArray());
                bound.left -= translate.x;
                bound.top -= translate.y;

                text.setTransform((bound.left + bound.width / 2) * stageScale, (bound.top - 5) * stageScale, stageScale);
                text.view().dom().setStyle('fill', this.color());
            },
            _clickLabel: function (sender, event) {
                /**
                 * Fired when click group label
                 * @event clickGroupLabel
                 * @param sender{Object} trigger instance
                 * @param event {Object} original event object
                 */
                this.fire('clickGroupLabel');
            },
            _mousedown: function (sender, event) {
                event.captureDrag(this.view('shape'));
            },
            _dragstart: function (sender, event) {
                /**
                 * Fired when start drag a group
                 * @event dragGroupStart
                 * @param sender{Object} trigger instance
                 * @param event {Object} original event object
                 */
                this.fire('dragGroupStart', event);
            },
            _drag: function (sender, event) {
                /**
                 * Fired when dragging a group
                 * @event dragGroup
                 * @param sender{Object} trigger instance
                 * @param event {Object} original event object
                 */
                this.fire('dragGroup', event);
                this._updateNodesPosition(event.drag.delta[0], event.drag.delta[1]);
            },
            _dragend: function (sender, event) {
                /**
                 * Fired finish dragging
                 * @event dragGroupEnd
                 * @param sender{Object} trigger instance
                 * @param event {Object} original event object
                 */
                this.fire('dragGroupEnd', event);
            },
            _updateNodesPosition: function (x, y) {
                var stageScale = this.topology().stageScale();
                this.nodes().each(function (node) {
                    node.move(x * stageScale, y * stageScale);
                });
            }
        }
    });


})(nx, nx.global);