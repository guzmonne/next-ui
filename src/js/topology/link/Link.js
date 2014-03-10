(function (nx, util, global) {
    var Vector = nx.math.Vector;
    var Line = nx.math.Line;
    /**
     * Link class
     * @class nx.graphic.Topology.Link
     * @extend nx.graphic.Topology.AbstractLink
     */

    var gutterStep = 5;

    nx.define('nx.graphic.Topology.Link', nx.graphic.Topology.AbstractLink, {
        properties: {
            /**
             * Get link type 'curve' / 'parallel'
             * @property linkType
             */
            linkType: {
                value: 'curve'
            },
            /**
             * Get link's gutter percentage
             * @property gutter
             */
            gutter: {
                value: 0
            },
            label: {
                set: function (label) {
                    var el = this.resolve("label");
                    /*jshint -W083*/
                    if (label != null) {
                        el.append();
                    } else {
                        el.remove();
                    }
                    this._label = label;
                }
            },
            labelPosition: {

            },
            sourceLabel: {
                set: function (label) {
                    var el = this.resolve("sourceLabel");
                    if (label != null) {
                        el.append();
                    } else {
                        el.remove();
                    }
                    this._sourceLabel = label;
                }
            },
            targetLabel: {
                set: function (label) {
                    var el = this.resolve("targetLabel");
                    if (label != null) {
                        el.append();
                    } else {
                        el.remove();
                    }
                    this._targetLabel = label;
                }
            },
            color: {
                set: function (value) {
                    this.$('line').setStyle('stroke', value);
                    this.$('path').setStyle('stroke', value);
                    this._color = value;
                }
            },
            width: {
                set: function (value) {
                    this.$('line').setStyle('stroke-width', value);
                    this.$('path').setStyle('stroke-width', value);
                    this._color = value;
                }
            },
            dotted: {
                set: function (value) {
                    if (value) {
                        this.$('path').setStyle('stroke-dasharray', '2, 5');
                    } else {
                        this.$('path').setStyle('stroke-dasharray', '');
                    }
                    this._dotted = value;
                }
            },
            style: {
                set: function (value) {
                    this.$('line').setStyles(value);
                    this.$('path').setStyles(value);
                }
            },
            fade: {
                value: false
            },
            fadeValue: {
                value: 0.2
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
                get: function () {
                    return this._enable != null ? this._enable : true;
                },
                set: function (value) {
                    this._enable = value;
                    if (value) {
                        this.resolve("disableLabel").remove();

                    } else {
                        this.resolve('disableLabel').append();
                        this.root().addClass('disable');
                    }
                }
            },
            drawMethod: {

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
                        'class': 'link',
                        style: 'stroke:#5BC1DF'
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
                        'class': 'link',
                        style: 'stroke:#5BC1DF'
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
                        'class': 'link-label'
                    }
                },
                {
                    name: 'sourceLabel',
                    type: 'nx.graphic.Text',
                    props: {
                        'alignment-baseline': 'text-before-edge',
                        'text-anchor': 'start',
                        'class': 'source-label'
                    }
                },
                {
                    name: 'targetLabel',
                    type: 'nx.graphic.Text',
                    props: {
                        'alignment-baseline': 'text-before-edge',
                        'text-anchor': 'end',
                        'class': 'target-label'
                    }
                },
                {
                    name: 'disableLabel',
                    type: 'nx.graphic.Text',
                    props: {
                        'alignment-baseline': 'central',
                        'text-anchor': 'middle',
                        'class': 'disable-label',
                        text: 'x'
                    }
                }
            ]
        },
        methods: {
            attach: function (args) {
                this.inherited(args);
            },
            setModel: function (model, isUpdate) {
                this.inherited(model, isUpdate);
            },
            setProperty: function (key, value) {
                var propValue;
                var rpatt = /(?={)\{([^{}]+?)\}(?!})/;
                if (value !== undefined) {
                    var model = this.model();

                    if (nx.is(value, 'Function')) {
                        propValue = value.call(this, model, this);
                    } else if (nx.is(value, 'String')) {
                        var path = value.split('.');
                        if (path.length == 2 && path[0] == 'model') {
                            this.setBinding(key, value, this);
                        } else {
                            propValue = value;
                        }
                    } else {
                        propValue = value;
                    }
                    this.set(key, propValue);
                }
            },
            /**
             * Update link's path
             * @method update
             */
            update: function () {
                if (this.drawMethod()) {
                    this.drawMethod().call(this);
                } else {
                    var path = [], d;
                    var _gutter = this.gutter() * gutterStep;
                    var gutter = new Vector(0, _gutter);
                    var line = this.line();
                    var n, point;
                    if (this.reverse()) {
                        line = line.negate();
                    }
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
                        lineEl.sets({
                            x1: newLine.start.x,
                            y1: newLine.start.y,
                            x2: newLine.end.x,
                            y2: newLine.end.y
                        });
                        this.resolve('path').remove();
                        this.resolve('line').append();
                    }
                }
                this._updateLabel();
                //  this._setHintPosition();
            },
            getPaddingLine: function () {
                var _gutter = this.gutter() * gutterStep;
                var sourceSize = this.sourceNode().getSize();
                var sourceRadius = Math.max(sourceSize.width, sourceSize.height) / 1.3;
                var targetSize = this.targetNode().getSize();
                var targetRadius = Math.max(targetSize.width, targetSize.height) / 1.3;
                var line = this.line().pad(sourceRadius, targetRadius);
                var n = line.normal().multiply(_gutter);
                return line.translate(n);
            },
            _updateLabel: function () {
                var el, point;
                var _gutter = this.gutter() * gutterStep;
                var line = this.line();
                var n = line.normal().multiply(_gutter);
                if (this._label != null) {
                    el = this.resolve("label");
                    point = line.center().add(n);
                    el.set('x', point.x);
                    el.set('y', point.y);
                    el.set('text', this._label);
                }

                if (this._sourceLabel) {
                    el = this.resolve("sourceLabel");
                    point = this.sourcePoint();
                    el.set('x', point.x);
                    el.set('y', point.y);
                    el.set('text', this._sourceLabel);
                }


                if (this._targetLabel) {
                    el = this.resolve("targetLabel");
                    point = this.targetPoint();
                    el.set('x', point.x);
                    el.set('y', point.y);
                    el.set('text', this._targetLabel);
                }


                if (!this.enable()) {
                    el = this.resolve("disableLabel");
                    point = line.center().add(n);
                    el.set('x', point.x);
                    el.set('y', point.y);
                }

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
                            direction = ['bottom', 'right', 'left', 'top', 'bottom', 'right', 'left', 'top' ][parseInt(this.line().circumferentialAngle() / 45, 10)];
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
                            direction = ['bottom', 'right', 'left', 'top', 'bottom', 'right', 'left', 'top' ][parseInt(this.line().circumferentialAngle() / 45, 10)];
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
                            direction = ['bottom', 'right', 'left', 'top', 'bottom', 'right', 'left', 'top' ][parseInt(this.line().circumferentialAngle() / 45, 10)];
                            hint.direction(direction);
                        }
                        hint.update();
                    }

                }, 10, this);
            },
            destroy: function () {
                var topo = this.topology();
                //topo.unwatch('internalShowIcon', this._watchShowIcon, this);
                this.inherited();
            }
        }
    });


})(nx, nx.graphic.util, nx.global);