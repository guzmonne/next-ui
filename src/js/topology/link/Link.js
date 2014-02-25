(function (nx, util, global) {
    var Vector = nx.math.Vector;
    var Line = nx.math.Line;
    /**
     * Link class
     * @class nx.graphic.Topology.Link
     * @extend nx.graphic.Topology.AbstractLink
     */

    nx.define('nx.graphic.Topology.Link', nx.graphic.Topology.AbstractLink, {

        /**
         * @event click
         */
        /**
         * @event mouseout
         */
        /**
         * @event mouseover
         */
        /**
         * @event mousedown
         */
        events: ['click', 'mouseout', 'mouseover', 'mousedown'],
        properties: {
            /**
             * Get link type 'curve' / 'parallel'
             * @property linkType
             */
            linkType: {
                value: 'curve'
            },
            /**
             * Get link's gutter
             * @property gutterNumber
             */
            gutterNumber: {
                value: 6
            },
            /**
             * Get link's gutter percentage
             * @property gutter
             */
            gutter: {
                value: 0
            },
            /**
             * Get/set link's selected statues
             * @property selected
             */
            selected: {
                get: function () {
                    return this._selected || false;
                },
                set: function (value) {
                    if (value) {
                        this.setAttribute('class', 'link link-selected');
                    } else {
                        this.setAttribute('class', 'link');
                    }
                }
            },
            label: {
                set: function (value) {
                    var label = value;
                    var el = this.resolve('label');
                    if (value) {
                        if (nx.is(value, 'Function')) {
                            label = value.call(this, model, this);
                        } else if (model.get(value) !== undefined) {
                            label = model.get(value);
                        }
                    }

                    if (label !== undefined) {
                        el.set('text', label);
                        el.append();
                        this._updateLabel();
                    } else {
                        el.remove();
                    }
                    this._label = label;
                }
            },

            sourceLabel: {
                get: function () {
                    return this._sourceLabel;
                },
                set: function (value) {
                    var label = value;
                    var el = this.resolve('sourceLabel');
                    if (value) {
                        if (nx.is(value, 'Function')) {
                            label = value.call(this, model, this);
                        } else if (model.get(value) !== undefined) {
                            label = model.get(value);
                        }
                    }

                    if (label !== undefined) {
                        el.set('text', label);
                        el.append();
                        this._updateLabel();
                    } else {
                        el.remove();
                    }
                    this._sourceLabel = label;
                }
            },

            targetLabel: {
                get: function () {
                    return this._targetLabel;
                },
                set: function (value) {
                    var label = value;
                    var el = this.resolve('targetLabel');
                    if (value) {
                        if (nx.is(value, 'Function')) {
                            label = value.call(this, model, this);
                        } else if (model.get(value) !== undefined) {
                            label = model.get(value);
                        }
                    }

                    if (label !== undefined) {
                        el.set('text', label);
                        el.append();
                        this._updateLabel();
                    } else {
                        el.remove();
                    }
                    this._targetLabel = label;
                }
            },
            fade: {
                value: false
            },
            fadeValue: {
                value: 0.2
            },
            /**
             * Get link's direction
             * @property reverse
             */
            reverse: {
                value: false
            },
            parentLinkSet: {

            },
            sourcePoint: {
                get: function () {
                    var line = this.getPaddingLine();
                    return line.start;
                }
            },
            targetPoint: {
                get: function () {
                    var line = this.getPaddingLine();
                    return line.end;
                }
            },
            enable: {
                value: true
            }
        },
        view: {
            type: 'nx.graphic.Group',
            props: {
                'class': 'link'
            },
            content: [
                {
                    name: 'path',
                    type: 'nx.graphic.Path',
                    props: {
                        'class': 'link'
                    },
                    events: {
                        'click': '{#_click}',
                        'tap': '{#_click}',
                        'mousedown': '{#_mousedown}',
                        'touchstart': '{#_mousedown}',
                        'mouseover': '{#_mouseover}',
                        'mouseout': '{#_mouseout}'
                    }
                },
                {
                    name: 'line',
                    type: 'nx.graphic.Line',
                    props: {
                        'class': 'link'
                    },
                    events: {
                        'click': '{#_click}',
                        'tap': '{#_click}',
                        'mousedown': '{#_mousedown}',
                        'touchstart': '{#_mousedown}',
                        'mouseover': '{#_mouseover}',
                        'mouseout': '{#_mouseout}'
                    }
                },
                {
                    name: 'label',
                    type: 'nx.graphic.Text',
                    props: {
                        'alignment-baseline': 'text-before-edge',
                        'text-anchor': 'middle',
                        'class': 'linkLabel',
                        visible: false
                    }
                },
                {
                    name: 'sourceLabel',
                    type: 'nx.graphic.Text',
                    props: {
                        'alignment-baseline': 'text-before-edge',
                        'text-anchor': 'start',
                        'class': 'linkSourceLabel',
                        visible: false
                    }
                },
                {
                    name: 'targetLabel',
                    type: 'nx.graphic.Text',
                    props: {
                        'alignment-baseline': 'text-before-edge',
                        'text-anchor': 'end',
                        'class': 'linkTargetLabel',
                        visible: false
                    }
                }
            ]
        },
        methods: {
            attach: function (args) {
                this.inherited(args);

                var topo = this.topology();
                topo.watch('showIcon', this._watchShowIcon = function (prop, value) {
                    this._updateLabel();
                    this._setHintPosition();
                }, this);
            },
            setModel: function (model) {


                var topo = this.topology();
                this.linkType(topo.multipleLinkType());
                this.label(topo.linkLabelPath() || null);
                this.sourceLabel(topo.linkSourceLabelPath() || null);
                this.targetLabel(topo.linkTargetLabelPath() || null);

                this.inherited(model);

            },
            /**
             * Update link's path
             * @method update
             */
            update: function () {


                if (this.topology().linkDrawMethod()) {
                    this.topology().linkDrawMethod().call(this);
                    return;
                } else {
                    var path = [], d;
                    var _gutter = this.getGutter();
                    var gutter = new Vector(0, _gutter);
                    var line = this.getLine();
                    var n, point;
                    if (this.linkType() == 'curve') {
                        _gutter = _gutter * 3;
                        n = line.normal().multiply(_gutter);
                        point = line.center().add(n);
                        path.push('M', line.start.x, line.start.y);
                        path.push('Q', point.x, point.y, line.end.x, line.end.y);
                        path.push('Q', point.x + 1, point.y + 1, line.start.x, line.start.y);
                        path.push('Z');
                        d = path.join(' ');
                        this.resolve('path').append();
                        this.resolve('line').remove();
                        this.resolve('path').set('d', d);
                    } else {
                        var lineEl = this.resolve('line');
                        var newLine = line.translate(gutter);
//                        path.push('M', newLine.start.x, newLine.start.y);
//                        path.push('L', newLine.end.x, newLine.end.y);
//                        path.push('Z');
//                        d = path.join(' ');

                        lineEl.sets({
                            x1: newLine.start.x,
                            y1: newLine.start.y,
                            x2: newLine.end.x,
                            y2: newLine.end.y
                        });


                        this.resolve('path').remove();
                        this.resolve('line').append();
                    }


                    if (this.model().virtual() === true) {
                        this.dotted();
                    }
                }
                // this._updateLabel();
                //  this._setHintPosition();
            },
            /**
             * get link's gutter from the center position
             * @returns {number}
             * @method getGutter
             */
            getGutter: function () {
                var gutterNumber = this.gutterNumber();
                return this.gutter() * gutterNumber;
            },
            /**
             * Get link's line object
             * @returns {nx.math.Line}
             * @method getLine
             */
            getLine: function () {
                var line;
                var sourceVector = this.sourceVector();
                var targetVector = this.targetVector();
                if (this.reverse()) {
                    line = new Line(sourceVector, targetVector);
                } else {
                    line = new Line(targetVector, sourceVector);
                }
                return line;
            },
            getPaddingLine: function () {
                var _gutter = this.getGutter();
                var sourceSize = this.sourceNode().getSize();
                var sourceRadius = Math.max(sourceSize.width, sourceSize.height) / 1.3;
                var targetSize = this.targetNode().getSize();
                var targetRadius = Math.max(targetSize.width, targetSize.height) / 1.3;
                var line = this.line().pad(sourceRadius, targetRadius);
                var n = line.normal().multiply(_gutter);
                return line.translate(n);
            },
            /**
             * Change a link's style. (Developing)
             * @param inColor
             * @param inStrokeWidth
             * @param force
             * @method highlight
             */
            highlight: function (inColor, inStrokeWidth, force) {
            },
            /**
             * Recover link's statues
             * @param force
             * @method recover
             */

            fadeOut: function (force) {
                this.inherited(force);

                var parentLinkSet = this.parentLinkSet();
                if (parentLinkSet) {
                    parentLinkSet.fadeOut(force);
                }

            },
            lighting: function (force) {
                this.inherited(force);

                var parentLinkSet = this.parentLinkSet();
                if (parentLinkSet) {
                    parentLinkSet.lighting(force);
                }

            },
            recover: function (force) {
                this.selected(false);
                this.fadeIn(force);
            },
            /**
             * Change link's style to dotted
             * @method dotted
             */
            dotted: function () {
                this.resolve('path').setAttribute('stroke-dasharray', '2, 5');
            },
            /**
             * Get link svg element's Bound
             * @returns {*}
             */
            getBound: function () {
                return this.resolve('path').getBBox();
            },
            _updateLabel: function () {

                var line = this.getLine();
                var label, n, point;
                if (this.label() !== undefined) {
                    var _gutter = this.getGutter();
                    label = this.resolve('label');
                    n = line.normal().multiply(_gutter);
                    point = line.center().add(n);
                    label.visible(true);
                    label.x(point.x);
                    label.y(point.y);
                    //label.set('rotate', [Math.atan(slope) / Math.PI * 180, point.x, point.y].join(' '));
                }


                if (this.sourceLabel() !== undefined) {
                    label = this.resolve('sourceLabel');
                    point = this.sourcePoint();
                    label.visible(true);
                    label.x(point.x);
                    label.y(point.y);
                    //label.set('rotate', [Math.atan(slope) / Math.PI * 180, point.x, point.y].join(' '));
                }

                if (this.targetLabel() !== undefined) {
                    label = this.resolve('targetLabel');
                    point = this.targetPoint();
                    label.visible(true);
                    label.x(point.x);
                    label.y(point.y);
                    //label.set('rotate', [Math.atan(slope) / Math.PI * 180, point.x, point.y].join(' '));

                }

            },


            setHint: function (inText, inConfig, direction) {
                var hint = this._hint;
                if (!hint) {
                    hint = this._hint = new nx.graphic.Hint();
                    this.owner().appendChild(hint);
                }

                hint.sets({
                    text: inText,
                    userDirection: direction,
                    style: inConfig
                });


                //hint.update();

                this._setHintPosition();

                return hint;

            },

            setSourceHint: function (inText, inConfig, direction) {

                var hint = this._sourceHint;

                if (!hint) {
                    hint = this._sourceHint = new nx.graphic.Hint();
                    this.owner().appendChild(hint);
                }

                hint.sets({
                    text: inText,
                    userDirection: direction,
                    style: inConfig
                });


                this._setHintPosition();

                return hint;

            },
            setTargetHint: function (inText, inConfig, direction) {

                var hint = this._targetHint;

                if (!hint) {
                    hint = this._targetHint = new nx.graphic.Hint();
                    this.owner().appendChild(hint);
                }

                hint.sets({
                    text: inText,
                    userDirection: direction,
                    style: inConfig
                });

                this._setHintPosition();

                return hint;

            },
            _setHintPosition: function () {
                if (this._hintTimer) {
                    clearTimeout(this._hintTimer);
                }
                this._hintTimer = nx.util.timeout(function () {
                    var hint, point, direction;
                    if (this._hint) {
                        hint = this._hint;
                        point = this.centerPoint();
                        hint.position({x: point.x, y: point.y});

                        hint.gap(10);
                        if (!hint.userDirection()) {
                            direction = ['bottom', 'right', 'left', 'top', 'bottom', 'right', 'left', 'top' ][parseInt(this.line().circumferentialAngle() / 45)];
                            hint.direction(direction);
                        }

                        hint.update();
                    }


                    if (this._sourceHint) {
                        hint = this._sourceHint;
                        point = this.sourcePoint();
                        hint.position({x: point.x, y: point.y});
                        hint.gap(10);
                        if (!hint.userDirection()) {
                            direction = ['bottom', 'right', 'left', 'top', 'bottom', 'right', 'left', 'top' ][parseInt(this.line().circumferentialAngle() / 45)];
                            hint.direction(direction);
                        }
                        hint.update();
                    }

                    if (this._targetHint) {
                        hint = this._targetHint;
                        point = this.targetPoint();
                        hint.position({x: point.x, y: point.y});
                        hint.gap(10);
                        if (!hint.userDirection()) {
                            direction = ['bottom', 'right', 'left', 'top', 'bottom', 'right', 'left', 'top' ][parseInt(this.line().circumferentialAngle() / 45)];
                            hint.direction(direction);
                        }
                        hint.update();
                    }

                }, 10, this);
            },

            _click: function (sender, event) {
                if (this.enable()) {
                    this.fire('click', event);
                }

            },
            _mouseout: function (sender, event) {
                if (this.enable()) {
                    this.fire('mouseout', event);
                }
            },
            _mousedown: function (sender, event) {
                if (this.enable()) {
                    this.fire('mousedown', event);
                }
            },
            _mouseover: function (sender, event) {
                if (this.enable()) {
                    this.fire('mouseover', event);
                }
            },
            destroy: function () {
                var topo = this.topology();
                topo.unwatch('internalShowIcon', this._watchShowIcon, this);
                this.inherited();
            }
        }
    });


})(nx, nx.graphic.util, nx.global);