(function (nx, util, global) {
    var Vector = nx.math.Vector;
    var Line = nx.math.Line;
    /**
     * Link class
     * @class nx.graphic.Topology.Link
     * @extend nx.graphic.Topology.AbstractLink
     * @module nx.graphic.Topology
     */

    var gutterStep = 5;

    nx.define('nx.graphic.Topology.Link', nx.graphic.Topology.AbstractLink, {
        events: ['pressLink', 'clickLink', 'enterLink', 'leaveLink'],
        properties: {
            /**
             * Get link type 'curve' / 'parallel'
             * @property linkType {String}
             */
            linkType: {
                value: 'curve'
            },
            /**
             * Get/set link's gutter percentage
             * @property gutter {Float}
             */
            gutter: {
                value: 0
            },
            /**
             * Get/set link's gutter step
             * @property gutterStep {Number}
             */
            gutterStep: {
                value: 5
            },
            /**
             * Get/set link's label, it is shown at the center point
             * @property label {String}
             */
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
            /**
             * Get/set link's source point label
             * @property sourceLabel {String}
             */
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
            /**
             * Get/set link's target point label
             * @property targetLabel {String}
             */
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
            /**
             * Set/get link's color
             * @property color {Color}
             */
            color: {
                set: function (value) {
                    this.$('line').setStyle('stroke', value);
                    this.$('path').setStyle('stroke', value);
                    this._color = value;
                }
            },
            /**
             * Set/get link's width
             * @property width {Number}
             */
            width: {
                set: function (value) {
                    this.$('line').setStyle('stroke-width', value);
                    this.$('path').setStyle('stroke-width', value);
                    this._color = value;
                }
            },
            /**
             * Set/get is link dotted
             * @property dotted {Boolean}
             */
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
            /**
             * Set link's style
             * @property style {Object}
             */
            style: {
                set: function (value) {
                    this.$('line').setStyles(value);
                    this.$('path').setStyles(value);
                }
            },
            fade: {
                value: false
            },
            /**
             * Get link's parent linkSet
             * @property parentLinkSet
             */
            parentLinkSet: {

            },
            /**
             * Get link's source interface point position
             * @property sourcePoint
             */
            sourcePoint: {
                get: function () {
                    var line = this.getPaddingLine();
                    return line.start;
                }
            },
            /**
             * Get link's target interface point position
             * @property targetPoint
             */
            targetPoint: {
                get: function () {
                    var line = this.getPaddingLine();
                    return line.end;
                }
            },
            /**
             * Set/get link's usability
             * @property enable {Boolean}
             */
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
            /**
             * Set the link's draw function, after set this property please call update function
             * @property drawMethod {Function}
             */
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
                    type: 'nx.graphic.Group',
                    content: [
                        {
                            name: 'path',
                            type: 'nx.graphic.Path',
                            props: {
                                'class': 'link'
                            }
                        },
                        {
                            name: 'overPath',
                            type: 'nx.graphic.Path',
                            props: {
                                style: 'stroke:#f00'
                            }
                        },
                        {
                            name: 'line',
                            type: 'nx.graphic.Line',
                            props: {
                                'class': 'link'
                            }
                        }
                    ],
                    events: {
                        'mouseenter': '{#_mouseenter}',
                        'mouseleave': '{#_mouseleave}',
                        'mousedown': '{#_mousedown}',
                        'touchstart': '{#_mousedown}',
                        'mouseup': '{#_mouseup}',
                        'touchend': '{#_mouseup}'
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

            /**
             * Update link's path
             * @method update
             */
            update: function () {

                this.inherited();

                var _gutter = this.gutter() * this.gutterStep();
                var gutter = new Vector(0, _gutter);
                var line = this.line();
                var d;

                if (this.reverse()) {
                    line = line.negate();
                }
                if (this.drawMethod()) {
                    d = this.drawMethod().call(this, this.model(), this);
                    this.resolve('path').append();
                    this.resolve('line').remove();
                    this.resolve('path').set('d', d);

                } else if (this.linkType() == 'curve') {
                    var path = [];
                    var n, point;

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
                this._updateLabel();
                //  this._setHintPosition();
            },
            /**
             * Get link's padding Line
             * @method getPaddingLine
             * @returns {*}
             */
            getPaddingLine: function () {
                var _gutter = this.gutter() * gutterStep;
                var sourceSize = this.sourceNode().getBound(true);
                var sourceRadius = Math.max(sourceSize.width, sourceSize.height) / 1.3;
                var targetSize = this.targetNode().getBound(true);
                var targetRadius = Math.max(targetSize.width, targetSize.height) / 1.3;
                var line = this.line().pad(sourceRadius, targetRadius);
                var n = line.normal().multiply(_gutter);
                return line.translate(n);
            },
            /**
             * Get calculated gutter number
             * @method getGutter
             * @returns {number}
             */
            getGutter: function () {
                return this.gutter() * this.gutterStep();
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

            __drawOverPath: function () {
                var path = this.$("path").$dom;
                var overPath = this.$("overPath").$dom;
                var length = path.getTotalLength();
                var index = path.getPathSegAtLength(length * 0.5);
                var endPoint = path.getPointAtLength(length * 0.5);
                var segList = path.pathSegList;
                var pathAry = [];
                for (var i = 0; i <= index; i++) {
                    var item = segList.getItem(i);
                    pathAry.push(item.pathSegTypeAsLetter);
                    if (item.x1) {
                        pathAry.push(item.x1, item.y1);
                    }
                    pathAry.push(item.x, item.y);
                }
                pathAry.pop();
                pathAry.pop();
                pathAry.push(endPoint.x, endPoint.y);
                //pathAry.push("Z");

                overPath.setAttribute('d', pathAry.join(" "));

            },
            /**
             * Fade out link
             * @method fadeOut
             * @param force {Boolean}
             */
            fadeOut: function (force) {
                this.inherited(force);
                var parentLinkSet = this.parentLinkSet();
                if (parentLinkSet) {
                    parentLinkSet.fadeOut(force);
                }
            },
            /**
             * Recover link's fade status
             * @param force
             */
            recover: function (force) {
                this.selected(false);
                this.fadeIn(force);
            },
            _mousedown: function () {
                if (this.enable()) {
                    /**
                     * Fired when mouse down on link
                     * @event pressLink
                     * @param sender{Object} trigger instance
                     * @param event {Object} original event object
                     */
                    this.fire('pressLink');
                }
            },
            _mouseup: function () {
                if (this.enable()) {
                    /**
                     * Fired when click link
                     * @event clickLink
                     * @param sender{Object} trigger instance
                     * @param event {Object} original event object
                     */
                    this.fire('clickLink');
                }
            },
            _mouseleave: function () {
                if (this.enable()) {
                    /**
                     * Fired when mouse leave link
                     * @event leaveLink
                     * @param sender{Object} trigger instance
                     * @param event {Object} original event object
                     */
                    this.fire('leaveLink');
                }
            },
            _mouseenter: function () {
                if (this.enable()) {
                    /**
                     * Fired when mouse enter link
                     * @event enterLink
                     * @param sender{Object} trigger instance
                     * @param event {Object} original event object
                     */
                    this.fire('enterLink');
                }
            }
        }
    });


})(nx, nx.util, nx.global);