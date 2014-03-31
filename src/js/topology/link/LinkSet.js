(function (nx, util, global) {

    var Vector = nx.math.Vector;
    var Line = nx.math.Line;

    /**
     * LinkSet class
     * @class nx.graphic.Topology.LinkSet
     * @extend nx.graphic.Topology.AbstractLink
     * @module nx.graphic.Topology
     */


    nx.define('nx.graphic.Topology.LinkSet', nx.graphic.Topology.AbstractLink, {
        events: ['pressLinkSetNumber', 'clickLinkSetNumber', 'enterLinkSetNumber', 'leaveLinkSetNumber', 'collapsedLinkSet', 'expandLinkSet'],
        properties: {
            /**
             * Get link type 'curve' / 'parallel'
             * @property linkType {String}
             */
            linkType: {
                value: 'curve'
            },
            /**
             * Sub links collection
             * @property links
             * @readOnly
             */
            links: {
                value: function () {
                    return [];
                }
            },
            /**
             * Is linkSet is auto collapes
             * @property autoCollapse
             */
            autoCollapse: {
                value: true
            },
            /**
             * LinkSet's color
             * @property color
             */
            color: {
                set: function (value) {
                    this.$('numBg').setStyle('fill', value);
                    this.$('path').setStyle('stroke', value);
                    this._color = value;
                }
            },
            /**
             * Collapsed statues
             * @property collapsed
             */
            collapsed: {
                get: function () {
                    return this._collapsed;
                },
                set: function (value) {
                    if (this._collapsed !== value) {
                        this._collapsed = value;
                        if (value) {
                            this._updateLinkNumber();
                            this.update();
                            /**
                             * Fired when collapse linkSet
                             * @event collapsedLinkSet
                             * @param sender{Object} trigger instance
                             * @param event {Object} original event object
                             */
                            this.fire('collapsedLinkSet');
                        } else {
                            this.remove();
                            setTimeout(function () {
                                this.getLinks();
                                this._updateLinksGutter();
                                /**
                                 * Fired when expend linkSet
                                 * @event expandLinkSet
                                 * @param sender{Object} trigger instance
                                 * @param event {Object} original event object
                                 */
                                this.fire('expandLinkSet');
                            }.bind(this), 0);
                        }
                        return true;
                    } else {
                        return false;
                    }

                }
            },
            /**
             * Set/get link's usability
             * @property enable {Boolean}
             */
            enable: {
                get: function () {
                    return this._enable === undefined ? true : this._enable;
                },
                set: function (value) {
                    this._enable = value;
                    this.eachLink(function (link) {
                        link.enable(value);
                    });
                }
            },
            fade: {
                value: false
            }
        },
        view: {
            type: 'nx.graphic.Group',
            props: {
                'data-type': 'links-sum',
                'class': 'link-set'
            },
            content: [
                {
                    name: 'path',
                    type: 'nx.graphic.Line',
                    props: {
                        'class': 'link-set-bg'
                    }
                },
                {
                    name: 'numBg',
                    type: 'nx.graphic.Rect',
                    props: {
                        'class': 'link-set-circle',
                        height: 1
                    },
                    events: {
                        'mousedown': '{#_number_mouseup}',
                        'mouseenter': '{#_number_mouseenter}',
                        'mouseleave': '{#_number_mouseleave}'
                    }
                },
                {
                    name: 'num',
                    type: 'nx.graphic.Text',
                    props: {
                        'class': 'link-set-text'
                    }
                }
            ]
        },
        methods: {
            setModel: function (model, isUpdate) {
                this.inherited(model, isUpdate);
                //this._collapsed = model._activated;
                this.setBinding('collapsed', 'model.activated,direction=<>', this);
            },
            update: function () {
                if (this._collapsed) {
                    var lineEl = this.resolve('path');
                    var line = this.line();
                    lineEl.sets({
                        x1: line.start.x,
                        y1: line.start.y,
                        x2: line.end.x,
                        y2: line.end.y
                    });
                    this.append();
                    //num
                    var centerPoint = this.centerPoint();
                    this.$('num').set('x', centerPoint.x);
                    this.$('num').set('y', centerPoint.y);
                    this.$('numBg').set('x', centerPoint.x);
                    this.$('numBg').set('y', centerPoint.y);
                }
            },
            /**
             * Adjust sub links and collapse or expend linkset
             * @method adjust
             */
            adjust: function () {
                if (!this.autoCollapse()) {
                    this.expand();
                } else if (this.model().containEdgeSet()) {
                    this.collapse();
                } else {
                    var linkType = this.linkType();
                    var edges = this.model().getEdges(null, true);
                    var maxLinkNumber = linkType === 'curve' ? 9 : 5;
                    if (edges.length <= maxLinkNumber) {
                        this.expand();
                    } else {
                        this.collapse();
                    }

                }
            },
            /**
             * Update linkSet
             * @property updateLinkSet
             */
            updateLinkSet: function () {
                this.adjust();
                if (this._collapsed) {
                    this.update();
                    this._updateLinkNumber();
                } else {
                    //this.adjust();
                    this.getLinks();
                    this._updateLinksGutter();
                }
            },
            /**
             * Collapse linkSet
             * @method collapse
             */
            collapse: function () {
                this.collapsed(true);
            },
            /**
             * Expend linkSet
             * @method expand
             */
            expand: function () {
                this.collapsed(false);
            },
            /**
             * Iterate all sub links
             * @method eachLink
             * @param fn {Function}
             * @param context {Object}
             */
            eachLink: function (fn, context) {
                nx.each(this.links(), fn, context || this);
            },
            /**
             * Get all sub links
             * @method getLinks();
             * @returns {*}
             */
            getLinks: function () {
                var links = this.links();
                links.length = 0;
                var topo = this.topology();
                nx.each(this.model().getEdges(null, true), function (edge) {
                    var link = topo.getLink(edge.id());
                    if (link) {
                        links.push(link);
                    }
                });
                return links;
            },
            _updateLinkNumber: function () {
                var edges = this.model().getEdges(null, true);
                this.$('num').set('text', edges.length);

                var bound = this.resolve('num').getBound();
                var width = Math.max(bound.width - 6, 1);

                this.$('numBg').set('width', width);
                this.resolve('numBg').setTransform(width / -2);
            },
            _updateLinksGutter: function () {
                if (!this._collapsed) {
                    var links = this.links();
                    if (links.length > 1 && !this.model().containEdgeSet()) {
                        // reset all links gutter
                        if (links.length > 1) {
                            var offset = (links.length - 1) / 2;
                            nx.each(links, function (link, index) {
                                link.gutter(index * -1 + offset);
                                link.update();
                            });
                        }
                    }
                }
            },


            _number_mousedown: function (sender, event) {
                if (this.enable()) {
                    /**
                     * Fired when press number element
                     * @event pressLinkSetNumber
                     * @param sender{Object} trigger instance
                     * @param event {Object} original event object
                     */
                    this.fire('pressLinkSetNumber', event);
                }
            },
            _number_mouseup: function (sender, event) {
                if (this.enable()) {
                    /**
                     * Fired when click number element
                     * @event clickLinkSetNumber
                     * @param sender{Object} trigger instance
                     * @param event {Object} original event object
                     */
                    this.fire('clickLinkSetNumber', event);
                }
            },
            _number_mouseleave: function (sender, event) {
                if (this.enable()) {
                    /**
                     * Fired when mouse leave number element
                     * @event numberleave
                     * @param sender{Object} trigger instance
                     * @param event {Object} original event object
                     */
                    this.fire('numberleave', event);
                }
            },
            _number_mouseenter: function (sender, event) {
                if (this.enable()) {
                    /**
                     * Fired when mouse enter number element
                     * @event numberenter
                     * @param sender{Object} trigger instance
                     * @param event {Object} original event object
                     */
                    this.fire('numberenter', event);
                }
            }
        }
    });


})(nx, nx.util, nx.global);