(function (nx, util, global) {
    /** Links layer
     Could use topo.getLayer("linksLayer") get this
     * @class nx.graphic.Topology.LinksLayer
     * @extend nx.graphic.Topology.Layer
     */

    nx.define("nx.graphic.Topology.LinksLayer", nx.graphic.Topology.Layer, {
        /**
         * @event clickLink
         */
        /**
         * @event leaveLink
         */
        /**
         * @event enterLink
         */
        events: ['clickLink', 'leaveLink', 'enterLink', 'clickLinkSetNumber', 'leaveLinkSetNumber'],
        properties: {
            links: {
                value: function () {
                    return [];
                }
            },
            linksMap: {
                value: function () {
                    return {};
                }
            }
        },
        methods: {
            /**
             * Add a link
             * @param edge
             * @method addLink
             */

            addLink: function (edge) {
                var id = edge.id();
                var link = this._generateLink(edge);

                link.attach(this);
                this.links().push(link);
                this.linksMap()[id] = link;
                return link;
            },
            updateLink: function (edgeSet) {
                var linkSet = this._getLinkSet(edgeSet);
                return linkSet.updateLinks();
            },
            removeLink: function (edge) {
                var linksMap = this.linksMap();
                var id = edge.id();
                var link = linksMap[id];
                if (link) {
                    delete linksMap[id];
                    this.links(util.without(this.links(), link));
                    var linkSet = this._getLinkSet(edge.parentEdgeSet());
                    linkSet.removeLink(link);
                    return linkSet.updateLinks();
                } else {
                    return false;
                }
            },

            removeNode: function (vertex) {
                var linkSetMap = this.linkSetMap();
                vertex.eachEdge(function (edge) {
                    var linkKey = edge.linkKey();
                    var reverseLinkKey = edge.reverseLinkKey();
                    var linkSet = linkSetMap[linkKey] || linkSetMap[reverseLinkKey];
                    if (linkSet) {
                        linkSet.destroy();
                        delete linkSetMap[linkSet.model().linkKey()];
                    }
                });
            },

            _generateLink: function (edge) {
                var id = edge.id();
                var topo = this.topology();
                var multipleLinkType = topo.multipleLinkType();

                var link = new nx.graphic.Topology.Link({
                    topology: topo
                });
                link.setModel(edge);

                //'click', 'mouseout', 'mouseover', 'mousedown'


//                link.on("click", function (sender, event) {
//                    nx.eventObject = event;
//                    this.fire("clickLink", link);
//                }, this);
//
//
//                link.on("mouseout", function (sender, event) {
//                    nx.eventObject = event;
//                    this.fire("leaveLink", link);
//                }, this);
//
//
//                link.on("mouseover", function (sender, event) {
//                    nx.eventObject = event;
//                    this.fire("enterLink", link);
//                }, this);

                link.set("class", "link");
                link.set("data-link-id", id);
                link.set("data-source-node-id", edge.source().id());
                link.set("data-target-node-id", edge.target().id());


                return link;

            },


            /**
             * Traverse all links
             * @param fn
             * @param context
             * @method eachLink
             */
            eachLink: function (fn, context) {
                nx.each(this.linksMap(), fn, context || this);
            },
            /**
             * Get link by id
             * @param id
             * @returns {*}
             */
            getLink: function (id) {
                return this.linksMap()[id];
            },
            /**
             * Fade out all links
             * @param force
             * @method fadeOut
             */
            fadeOut: function (force) {
                this.eachLink(function (link) {
                    link.fadeOut(force);
                });

                this.eachLinkSet(function (link) {
                    link.fadeOut(force);
                });
            },
            /**
             * Fade in all links
             * @param force
             * @method fadeIn
             */
            fadeIn: function (force) {
                this.eachLink(function (link) {
                    link.fadeIn(force);
                });

                this.eachLinkSet(function (link) {
                    link.fadeIn(force);
                });
            },
            /**
             * Recover all links statues
             * @param force
             * @method recover
             */
            recover: function (force) {
                this.eachLink(function (link) {
                    link.recover(force);
                });

                this.eachLinkSet(function (link) {
                    link.recover(force);
                });
            },
            /**
             * Clear links layer
             * @method clear
             */
            clear: function () {
                nx.each(this.links(), function (link) {
                    link.dispose();
                });

                this.links([]);
                this.linksMap({});
                this.inherited();
            }
        }
    });


})(nx, nx.graphic.util, nx.global);