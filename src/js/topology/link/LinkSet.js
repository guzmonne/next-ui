(function (nx, global) {

    var Vector = nx.geometry.Vector;
    var Line = nx.geometry.Line;

    /**
     * LinkSet class
     * @class nx.graphic.Topology.LinkSet
     * @extend nx.graphic.Topology.AbstractLink
     * @module nx.graphic.Topology
     */


    nx.define('nx.graphic.Topology.LinkSet', nx.graphic.Topology.AbstractLink, {
        events: ['pressLinkSetNumber', 'clickLinkSetNumber', 'enterLinkSetNumber', 'leaveLinkSetNumber', 'collapseLinkSet', 'expandLinkSet'],
        properties: {
            /**
             * Get link type 'curve' / 'parallel'
             * @property linkType {String}
             */
            linkType: {
                get: function () {
                    return this._linkType !== undefined ? this._linkType : 'parallel';
                },
                set: function (inValue) {
                    var value = this._processPropertyValue(inValue);
                    if (this._linkType !== value) {
                        this._linkType = value;
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            /**
             * Sub links collection
             * @property links
             * @readOnly
             */
            links: {
                get: function () {
                    var links = [];
                    this.eachLink(function (link, edge) {
                        links.push(link);
                    }, this);
                    return links;
                }
            },
            /**
             * LinkSet's color
             * @property color
             */
            color: {
                set: function (inValue) {
                    var value = this._processPropertyValue(inValue);
                    this.view('numBg').dom().setStyle('fill', value);
                    this.view('path').dom().setStyle('stroke', value);
                    this._color = value;
                }
            },
            stageScale: {
                set: function (value) {
                    this.view('path').dom().setStyle('stroke-width', value);
                    this.view('number').setTransform(null, null, value);
                    /* jshint -W030 */
                    this.model() && this._updateLinksOffset();
                    this._stageScale = value;
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
                set: function (inValue) {
                    var value = this._processPropertyValue(inValue);
                    this._enable = value;
                    this.eachLink(function (link) {
                        link.enable(value);
                    });
                }
            },
            /**
             * Collapsed statues
             * @property collapsed
             */
            collapsedRule: {
                value: false
            },
            activated: {
                get: function () {
                    return this._activated !== undefined ? this._activated : true;
                },
                set: function (value) {
                    if (this._activated !== value) {
                        this._activated = value;
                        return true;
                    } else {
                        return false;
                    }
                }
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
                    name: 'number',
                    type: 'nx.graphic.Group',
                    content: [
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
                                'class': 'link-set-text',
                                y: 1
                            }
                        }
                    ]
                }

            ]
        },
        methods: {
            setModel: function (model, isUpdate) {
                this.inherited(model, isUpdate);
                this._activated = model.activated();
                this.setBinding('activated', 'model.activated,direction=<>', this);
            },
            update: function () {
                if (this._activated) {
                    var line = this.line();
                    this.view('path').sets({
                        x1: line.start.x,
                        y1: line.start.y,
                        x2: line.end.x,
                        y2: line.end.y
                    });
                    //num
                    var centerPoint = this.centerPoint();
                    this.view('number').setTransform(centerPoint.x, centerPoint.y);
                }
            },
            /**
             * Update linkSet
             * @property updateLinkSet
             */
            updateLinkSet: function () {
                var value = this._processPropertyValue(this.collapsedRule());
                this._activated = !value;
                this.activated(value);
                if (value) {
                    this.append();
                    this.update();
                    this._updateLinkNumber();
                    /**
                     * Fired when collapse linkSet
                     * @event collapseLinkSet
                     * @param sender{Object} trigger instance
                     * @param event {Object} original event object
                     */
                    this.fire('collapseLinkSet');
                } else {
                    this.remove();
                    this._updateLinksOffset();
                    /**
                     * Fired when expend linkSet
                     * @event expandLinkSet
                     * @param sender{Object} trigger instance
                     * @param event {Object} original event object
                     */
                    this.fire('expandLinkSet');
                }
            },
            /**
             * Iterate all sub links
             * @method eachLink
             * @param fn {Function}
             * @param context {Object}
             */
            eachLink: function (fn, context) {
                var topo = this.topology();
                this.model().eachEdge(function (edge) {
                    var linkKey = edge.linkKey();
                    var link;
                    if (edge.type() == 'edge') {
                        link = topo.getLink(edge.id());
                    } else {
                        link = topo.getLinkSetByLinkKey(linkKey);
                    }
                    if (link) {
                        fn.call(context || this, link, edge);
                    }
                });
            },

            _updateLinkNumber: function () {
                var edges = this.model().getEdges();
                var numEl = this.view('num');
                var numBg = this.view('numBg');
                if (edges.length == 1) {
                    numEl.visible(false);
                    numBg.visible(false);

                } else {
                    numEl.sets({
                        text: edges.length,
                        visible: true
                    });

                    var bound = numEl.getBound();
                    var width = Math.max(bound.width - 6, 1);

                    numBg.sets({
                        width: width,
                        visible: true
                    });
                    numBg.setTransform(width / -2);
                }

            },
            _updateLinksOffset: function () {
                if (!this._activated) {
                    var obj = {};
                    this.eachLink(function (link, edge) {
                        var linkKey = edge.linkKey();
                        if (edge.type() == 'edge') {
                            var ary = obj[linkKey] = obj[linkKey] || [];
                            ary.push(link);
                        } else {
                            link.updateLinkSet();
                        }
                    }, this);

                    nx.each(obj, function (links, linkKey) {
                        if (links.length > 1) {
                            var offset = (links.length - 1) / 2;
                            nx.each(links, function (link, index) {
                                link.offsetPercentage(index * -1 + offset);
                                link.update();
                            }, this);
                        }
                    }, this);
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


})(nx, nx.global);