(function (nx, util, global) {

    var Vector = nx.math.Vector;
    var Line = nx.math.Line;


    nx.define("nx.graphic.Topology.LinkSet", nx.graphic.Topology.AbstractLink, {
        events: ['numbermousedown', 'numbermouseup', 'numbermouseenter', 'numbermouseleave'],
        properties: {

            links: {
                value: function () {
                    return [];
                }
            },
            autoCollapse: {
                value: true
            },
            color: {
                set: function (value) {
                    this.$('numBg').setStyle('fill', value);
                    this.$('path').setStyle('stroke', value);
                    this._color = value;
                }
            },
            collapsed: {
                set: function (value) {
                    if (this._collapsed != value) {
                        this._collapsed = value;
                        if (value) {
                            this.update();
                        } else {
                            this.remove();
                        }
                        return true;
                    } else {
                        return false;
                    }

                }
            },
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
                    type: "nx.graphic.Line",
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
                this.setBinding('collapsed', 'model.activated,direction=<>', this);
            },
            update: function () {

                if (this.collapsed()) {

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

                    this.$("num").set('x', centerPoint.x);
                    this.$("num").set('y', centerPoint.y);

                    this.$("numBg").set('x', centerPoint.x);
                    this.$("numBg").set('y', centerPoint.y);

                }

            },
            collapse: function () {
                this.collapsed(true);

            },
            expand: function () {
                this.collapsed(false);
            },

            _updateLinkNumber: function () {
                var edges = this.links();
                this.$("num").set('text', edges.length);

                var bound = this.resolve("num").getBound();
                var width = Math.max(bound.width - 8, 1);

                this.$("numBg").set('width', width);
                this.$("numBg").set("translateX", width / -2);

            },

            eachLink: function (fn, context) {
                nx.each(this.links(), fn, context || this);
            },
            updateLinks: function () {
                var links = this.links();
                links.length = 0;
                var topo = this.topology();
                nx.each(this.model().getEdges(null, true), function (edge) {
                    links.push(topo.getLink(edge.id()));
                });
                this._updateLinkNumber();
                this.updateLinksGutter();
                return links;
            },
            updateLink: function (link) {
                //todo
                this.updateLinks();
                return link;
            },
            updateLinksGutter: function () {
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
            },

            adjust: function () {
                if (!this.autoCollapse()) {
                    this.expand();
                } else if (this.model().containEdgeSet()) {
                    this.collapse();
                } else {
                    var linkType;
                    var topo = this.topology();
                    var links = this.links();
                    if (links[0]) {
                        linkType = links[0].linkType();
                    } else {
                        linkType = topo.linkType();
                    }
                    var maxLinkNumber = linkType === "curve" ? 9 : 5;
                    if (links.length <= maxLinkNumber) {
                        this.expand();
                    } else {
                        this.collapse();
                    }
                }
            },
            _number_mousedown: function (sender, event) {
                if (this.enable()) {
                    this.fire("numbermousedown", event);
                }
            },
            _number_mouseup: function (sender, event) {
                if (this.enable()) {
                    this.fire("numbermouseup", event);
                }
            },
            _number_mouseleave: function (sender, event) {
                if (this.enable()) {
                    this.fire("numberleave", event);
                }
            },
            _number_mouseenter: function (sender, event) {
                if (this.enable()) {
                    this.fire("numberenter", event);
                }
            }
        }
    });


})(nx, nx.graphic.util, nx.global);