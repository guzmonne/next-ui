(function (nx, global) {


    /**
     * Polygon shape group class
     * @class nx.graphic.Topology.PolygonGroup
     * @extend nx.graphic.Topology.GroupItem
     * @module nx.graphic.Topology.Group
     *
     */

    nx.define('nx.graphic.Topology.NodeSetPolygonGroup', nx.graphic.Topology.GroupItem, {
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
                    name: 'minus',
                    type: 'nx.graphic.Group',
                    content: {
                        type: 'nx.graphic.Icon',
                        props: {
                            iconType: 'collapse'
                        }
                    },
                    events: {
                        'click': '{#_collapse}'
                    }
                },
                {
                    name: 'icon',
                    type: 'nx.graphic.Group',
                    content: {
                        name: 'iconImg',
                        type: 'nx.graphic.Icon',
                        props: {
                            iconType: 'groupL'
                        }
                    }
                },
//                {
//                    name: 'bg',
//                    type: 'nx.graphic.Rect',
//                    props: {
//                        fill: '#f00',
//                        'opacity': '0.1'
//                    }
//                },
                {
                    name: 'text',
                    type: 'nx.graphic.Group',
                    content: {
                        name: 'label',
                        type: 'nx.graphic.Text',
                        props: {
                            'class': 'nodeSetGroupLabel',
                            text: '{#label}',
                            style: {
                                'alignment-baseline': 'central',
                                'text-anchor': 'start',
                                'font-size': 12
                            }
                        },
                        events: {
                            'click': '{#_clickLabel}'
                        }
                    }
                }
            ],
            events: {
                //  'mouseenter': '{#_mouseenter}',
                //'mouseleave': '{#_mouseleave}'
            }
        },
        properties: {
            nodeSet: {},
            topology: {},
            opacity: {
                set: function (value) {
                    var groupDOM = this.view('shape').dom();
                    var _opacity = groupDOM.getStyle('opacity');
                    groupDOM.setStyle('opacity', value);
                }
            }
//            color: {
//                set: function (value) {
//                    var text = this.view('text');
//                    text.view().dom().setStyle('fill', value);
//                    var shape = this.view('shape');
//                    shape.sets({
//                        fill: value
//                    });
//                    shape.dom().setStyle('stroke', value);
//                    this._color = value;
//                }
//            }
        },
        methods: {

            init: function (args) {
                this.inherited(args);
            },

            redraw: function () {
                setTimeout(this.draw.bind(this), 900);
            },

            draw: function () {
                var topo = this.topology();
                var stageScale = topo.stageScale();
                var translate = {
                    x: topo.matrix().x(),
                    y: topo.matrix().y()
                };

                if (this.nodes().count() === 0) {
                    return;
                }


                var vectorArray = [];
                this.nodes().each(function (node) {
                    if (node.visible()) {
                        vectorArray.push({x: node.model().x(), y: node.model().y()});
                    }
                });
                var shape = this.view('shape');
                shape.sets({
                    fill: this.color()
                });
                shape.dom().setStyle('stroke', this.color());
                //
                shape.nodes(vectorArray);

                var bound = topo.getBoundByNodes(this.nodes().toArray());
                bound.left -= translate.x;
                bound.top -= translate.y;

                bound.left *= stageScale;
                bound.top *= stageScale;
                bound.width *= stageScale;
                bound.height *= stageScale;

//                this.view('bg').sets({
//                    x: bound.left,
//                    y: bound.top,
//                    width: bound.width,
//                    height: bound.height
//                });
                var text = this.view('text');
                if (topo.showIcon() && topo.revisionScale() == 1) {

                    shape.dom().setStyle('stroke-width', 60 * stageScale);

                    var iconImg = this.view('iconImg');
                    iconImg.set('iconType', this.nodeSet().iconType());

                    var iconSize = iconImg.size();

                    this.view('minus').setTransform(bound.left + bound.width / 2, bound.top - iconSize.height * stageScale / 2, 1.5 * stageScale);

                    this.view('icon').visible(true);
                    this.view('icon').setTransform(bound.left + bound.width / 2 + 10 * stageScale + iconSize.width * stageScale / 2, bound.top - iconSize.height * stageScale / 2, 0.7 * stageScale);


                    this.view('label').sets({
                        x: bound.left + bound.width / 2 + 12 * stageScale + iconSize.width * stageScale,
                        y: bound.top - iconSize.height * stageScale / 2
                    });
                    this.view('label').view().dom().setStyle('font-size', 18 * stageScale);
                    text.view().dom().setStyle('fill', this.color());

                } else {

                    shape.dom().setStyle('stroke-width', 30 * stageScale);

                    this.view('minus').setTransform(bound.left + bound.width / 2, bound.top, 1.5 * stageScale);


                    this.view('label').sets({
                        x: bound.left + bound.width / 2 + 12 * stageScale,
                        y: bound.top
                    });
                    this.view('label').view().dom().setStyle('font-size', 18 * stageScale);
                    text.view().dom().setStyle('fill', this.color());
                }


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
                this.blockDrawing(true);
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


                var stageScale = this.topology().stageScale();
                this.move(event.drag.delta[0] * stageScale, event.drag.delta[1] * stageScale);
            },
            _dragend: function (sender, event) {
                this.blockDrawing(false);
                this.draw();
                this.setTransform(0, 0);
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
            },
            _collapse: function () {
                var nodeSet = this.nodeSet();
                if (nodeSet) {
                    nodeSet.collapsed(true);
                }
            },
            hide: function (force) {

                if (this.__timer) {
                    clearTimeout(this.__timer);
                }
                if (force) {
                    this.view().dom().setStyle('opacity', 0);
                } else {
                    this.__timer = setTimeout(function () {
                        this.view().dom().setStyle('opacity', 0);
                    }.bind(this), 300);
                }

            },
            show: function () {
                if (this.__timer) {
                    clearTimeout(this.__timer);
                }
                this.view().dom().setStyle('opacity', 1);
            },
            _mouseenter: function (sender, event) {
                this.show();
            },
            _mouseleave: function (sender, event) {
                this.hide();
            },
            dispose: function () {
                nx.each(this.nodes(), function (node) {
                    if (nx.is(node, 'nx.graphic.Topology.NodeSet')) {
                        node.off('expandNode', this.redraw, this);
                        node.off('collapseNode', this.redraw, this);
                    }
                }, this);
                this.inherited();
            }
        }
    });


})(nx, nx.global);






