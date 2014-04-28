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


//                    name: 'shape',
//                    type: 'nx.graphic.Rect',
//                    props: {
//                        'class': 'bg'
//                    },
//                    events: {
//                        'mousedown': '{#_mousedown}',
//                        'dragstart': '{#_dragstart}',
//                        'dragmove': '{#_drag}',
//                        'dragend': '{#_dragend}'
//                    }
                },
                {
                    name: 'minus',

                    type: 'nx.graphic.Icon',
                    props: {
                        iconType: 'collapse'
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
                {
                    name: 'text',
                    type: 'nx.graphic.Group',
                    content: {
                        name: 'label',
                        type: 'nx.graphic.Text',
                        props: {
                            'class': 'nodeSetGroupLabel',
                            text: '{#label}'
                        },
                        events: {
                            'click': '{#_clickLabel}'
                        }
                    }
                }
            ],
            events: {
                'mouseenter': '{#_mouseenter}',
                'mouseleave': '{#_mouseleave}'
            }
        },
        properties: {
            nodeSet: {},
            topology: {}
        },
        methods: {

            init: function (args) {
                this.inherited(args);

                var nodes = this.nodes();

                nodes.on('change', function (sender, args) {
                    var action = args.action;
                    var items = args.items;

                    if (action == 'add') {

                        nx.each(items, function (node) {
                            if (nx.is(node, 'nx.graphic.Topology.NodeSet')) {
                                node.on('expandNode', this.redraw, this);
                                node.on('collapseNode', this.redraw, this);
                            }
                        }, this);

                        this.draw();

                    } else if (action == 'remove') {
                        nx.each(items, function (node) {
                            node.off('expandNode', this.redraw, this);
                            node.off('collapseNode', this.redraw, this);

                        }, this);

                        this.draw();
                    } else if (action == 'clear') {
                        nx.each(items, function (node) {
                            node.off('expandNode', this.redraw, this);
                            node.off('collapseNode', this.redraw, this);
                        }, this);

                        this.dispose();
                    }
                }, this);
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

                if (this.nodes().count() == 0) {
                    return;
                }


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
                shape.dom().setStyle('stroke', this.color());
                //
                shape.nodes(vectorArray);


                var bound = topo.getBoundByNodes(this.nodes().toArray());
                bound.left -= translate.x;
                bound.top -= translate.y;

//                var bound = topo.getBoundByNodes(this.nodes().toArray());
//                bound.left -= translate.x;
//                bound.top -= translate.y;
//                var shape = this.view('shape');
//                var text = this.view('text');
//                shape.sets({
//                    x: bound.left,
//                    y: bound.top,
//                    width: bound.width,
//                    height: bound.height,
//                    fill: this.color(),
//                    stroke: this.color(),
//                    scale: topo.stageScale()
//                });


                if (topo.showIcon() && topo.revisionScale() == 1) {


                    shape.dom().setStyle('stroke-width', 60 * stageScale);


                    var iconImg = this.view('iconImg');
                    iconImg.set('iconType', this.nodeSet().iconType());

                    var iconSize = iconImg.size();

                    this.view('minus').setTransform((bound.left) * stageScale, (bound.top - 12 - iconSize.height / 2) * stageScale, stageScale);

                    this.view('icon').visible(true);
                    this.view('icon').setTransform((bound.left + 38) * stageScale, (bound.top - 26) * stageScale, stageScale);
                    this.view('iconImg').set('iconType', this.nodeSet().iconType());

                    text.setTransform((bound.left + 12 + iconSize.width + 10) * stageScale, (bound.top - 12 - 5) * stageScale, stageScale);
                    text.view().dom().setStyle('fill', this.color());

                } else {
                    shape.dom().setStyle('stroke-width', 25 * stageScale);


                    this.view('minus').setTransform((bound.left) * stageScale, (bound.top - 22) * stageScale, stageScale);
                    this.view('icon').visible(false);

                    text.setTransform((bound.left + 18) * stageScale, (bound.top - 9) * stageScale, stageScale);
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






