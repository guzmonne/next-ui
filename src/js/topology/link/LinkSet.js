(function (nx, util, global) {

    var Vector = nx.math.Vector;
    var Line = nx.math.Line;


    nx.define("nx.graphic.Topology.LinkSet", nx.graphic.Topology.AbstractLink, {
        statics: {
            autoCollapse: true
        },
        events: ['click', 'mouseout', 'mouseover', 'mousedown', 'clickNumber', 'leaveNumber'],
        properties: {
            links: {
                value: function () {
                    return [];
                }
            },
            virtualLinks: {
                value: function () {
                    return [];
                }
            },
            linkSets: {
                value: function () {
                    return [];
                }
            },
            selected: {
                value: false
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
            },
            radian: {
                value: 1
            },
            reverse: {
                value: false
            },
            linkNumber: {
                value: 0
            },
            active: {
                value: false
            }
        },
        meta: {
            view: {
                content: [
                    {
                        name: 'sum',
                        props: {
                            visible: '{#active}',
                            'data-type': 'links-sum',
                            'class': 'link-set'
                        },
                        content: [
                            {
                                name: 'path',
                                type: "nx.graphic.Path",
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
                                    'mouseleave': '{#_number_mouseleave}'
                                }
                            },
                            {
                                name: 'num',
                                type: 'nx.graphic.Text',
                                props: {
                                    'class': 'link-set-text',
                                    text: '{#linkNumber}'
                                }
                            }
                        ]
                    },
                    {
                        name: 'links',
                        props: {
                            'data-type': 'links'
                        }
                    }


                ]
            }
        },
        methods: {
            onInit: function () {
                this.watch("active", function (prop, value) {
                    if (value) {
                        this.activate();
                    } else {
                        this.deactivate();
                    }
                    this.update();
                }, this);
            },
            onSetModel: function (model) {
                this.inherited(model);
                this.notify("active");
            },
            update: function () {
                if (this.active()) {

                    if (this.topology().linkSetDrawMethod()) {
                        this.topology().linkSetDrawMethod().call(this);
                        return;
                    }


                    var path = [];
                    var line = this.line();
                    path.push("M", line.start.x, line.start.y);
                    path.push("L", line.end.x, line.end.y);
                    path.push("Z");
                    var d = path.join(" ");
                    this.resolve("path").set("d", d);


                    //num
                    var centerPoint = this.centerPoint();

                    this.resolve("num").x(centerPoint.x);
                    this.resolve("num").y(centerPoint.y);


                    this.resolve("numBg").set("x", centerPoint.x);
                    this.resolve("numBg").set("y", centerPoint.y);

//                //todo fix browser issue;
                    if (nx.browser.chrome) {
//                    this.resolve("sum").hide();
//                    this.resolve("sum").show();
//                    if (!this.activated) {
//                        this.resolve("sum").hide();
//                    }
                    }
                }

            },


            eachLink: function (fn, context) {
                nx.each(this.getLinks(), fn, context || this);
            },
            getLinks: function () {
                var links = [];
                var linksLayer = this.owner();
                nx.each(this.model().getEdges(null, true), function (edge) {
                    links.push(linksLayer.getLink(edge.id()));
                });
                return links;
            },
            updateLink: function (link) {
                //todo
                this.updateLinks();
                return link;
            },
            addLink: function (link, isAppend) {
                if (isAppend !== false) {
                    this.resolve("links").appendChild(link);
                    link.owner(this);

                }
            },
            removeLink: function (link) {
                this.resolve("links").removeChild(link);
            },
            updateLinks: function () {
                var links = [];
                var linksLayer = this.owner();
                nx.each(this.model().getEdges(null, true), function (edge) {
                    var link = linksLayer.getLink(edge.id());
                    if (!link) {
                        link = linksLayer.addLink(edge);
                    }
                    links.push(link);
                });

                if (nx.graphic.Topology.LinkSet.autoCollapse === false) {
                    this.activate();
                } else if (this.model().containEdgeSet()) {
                    this.activate();
                } else {
                    var topo = this.topology();
                    var multipleLinkType = topo.multipleLinkType();
                    var maxLinkNumber = multipleLinkType === "curve" ? 9 : 5;

                    // reset all links gutter
                    if (links.length > 1) {
                        var offset = (links.length - 1) / 2;
                        nx.each(links, function (link, index) {
                            link.gutter(index * -1 + offset);
                            link.update();
                        });
                    }

                    // less than max link number
                    if (links.length <= maxLinkNumber) {
                        if (this.activated) {
                            this.deactivate();
                        }
                    } else {
                        this.activate();
                    }
                }
            },


            activate: function () {
                this.active(true);
                this.resolve("links").remove();
                this.resolve("sum").append();

                this._updateLinkNumber();

            },
            deactivate: function () {
                this.active(false);

                this.resolve("sum").remove();
                this.resolve("links").append();
                //this.resolve("links").empty();

            },

            _updateLinkNumber: function () {
                var edges = this.model().getEdges(null, true);
                this.resolve("num").text(edges.length);

                var bound = this.resolve("num").getBound();
                var width = Math.max(bound.width - 8, 1);

                this.resolve("numBg").width(width);
                this.resolve("numBg").set("translateX", width / -2);

            },
            fadeOut: function (force) {
                if (this.active()) {
                    this.inherited(force);
                }
            },

            fadeIn: function (force) {
                if (this.active()) {
                    this.inherited(force);
                }
            },
            recover: function (force) {
                this.selected(false);
                this.fadeIn(force);
            },

            /**
             * Get link svg element's Bound
             * @returns {*}
             */
            getBound: function () {
                return this.resolve("path").getBBox();
            },
            _click: function (sender, event) {
                if (this.enable()) {
                    this.fire("click", event);
                }
            },
            _mouseout: function (sender, event) {
                if (this.enable()) {
                    this.fire("mouseout", event);
                }
            },
            _mousedown: function (sender, event) {
                if (this.enable()) {
                    this.fire("mousedown", event);
                }
                event.stop();
            },
            _mouseover: function (sender, event) {
                if (this.enable()) {
                    this.fire("mouseover", event);
                }
                event.stop();
            },
            _number_mouseup: function (sender, event) {
                this.fire("clickNumber", event);
                event.stop();
            },
            _number_mouseleave: function (sender, event) {
                this.fire("leaveNumber", event);
            },
            destroy: function () {
                var layer = this.owner();
                nx.each(this.model().edges(), function (edge) {
                    var link = layer.getLink(edge.id());
                    link.destroy();
                });
                this.inherited();

            }
        }
    });


})(nx, nx.graphic.util, nx.global);