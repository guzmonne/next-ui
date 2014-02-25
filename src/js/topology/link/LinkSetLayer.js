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
            },
            linkSetMap: {
                value: function () {
                    return {};
                }
            }
        },
        methods: {
            /**
             * Add a link
             * @param edgeSet
             * @method addLink
             */

            addLink: function (edgeSet) {

                var type = edgeSet.type();

                if (type == "link") {

                    linkSet = this._getLinkSet(edgeSet);

                    //generate a link
                    var link = this._generateLink(edgeSet);
                    // set links direction
                    link.reverse(linkSet.linkKey() == edgeSet.linkKey());
                    //parent
                    link.parentLinkSet(linkSet);

                    // push to collection
                    linkSet.addLink(link);

                    return link;


                } else if (type == 'linkSet') {

                    var linkSet = this._getLinkSet(edgeSet);

                    linkSet.updateLinks();

                    //linkSet.activate();

                    return linkSet


                } else {
                    return null;
                }
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
                        delete linkSetMap[linkSet.model().linkKey()]
                    }
                });
            },

            _getLinkSet: function (edge) {
                var linkKey = edge.linkKey();
                var reverseLinkKey = edge.reverseLinkKey();
                var linkSetMap = this.linkSetMap();
                var linkSet = linkSetMap[linkKey] || linkSetMap[reverseLinkKey];


                // append to link linkSet
                if (!linkSet) {
                    linkSet = this._generateLinkSet(edge);
                    linkSetMap[linkKey] = linkSet;
                    this.appendChild(linkSet);
                }

                return linkSet;
            },

            _generateLinkSet: function (edge) {
                var linkKey = edge.linkKey();
                var linkset = new nx.graphic.Topology.LinkSet({
                    owner: this
                });

                linkset.setAttribute("data-nx-type", "nx.graphic.Topology.LinkSet");
                linkset.setAttribute("data-linkKey", linkKey);
                linkset.setAttribute("data-source-node-id", edge.source().id());
                linkset.setAttribute("data-target-node-id", edge.target().id());

                linkset.model(edge);

                linkset.onSetModel(edge);


                // events: ['click', 'mouseout', 'mouseover', 'mousedown','clickNumber','leaveNumber'],


                linkset.on("clickNumber", function (sender, event) {
                    nx.eventObject = event;
                    this.fire("clickLinkSetNumber", linkset);
                }, this);

                linkset.on("leaveNumber", function (sender, event) {
                    nx.eventObject = event;
                    this.fire("leaveLinkSetNumber", linkset);
                }, this);

                return linkset;
            },

            _generateLink: function (edge) {
                var id = edge.id();
                var topo = this.topology();
                var multipleLinkType = topo.multipleLinkType();

                var link = new nx.graphic.Topology.Link({
                    linkType: multipleLinkType,
                    owner: this
                });
                link.model(edge);
                link.onSetModel(edge);

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

                link.setAttribute("class", "link");
                link.setAttribute("data-link-id", id);
                link.setAttribute("data-source-node-id", edge.source().id());
                link.setAttribute("data-target-node-id", edge.target().id());


                this.links().push(link);
                this.linksMap()[id] = link;


                return link;

            },


            /**
             * Traverse all links
             * @param fn
             * @param context
             * @method eachLink
             */
            eachLink: function (fn, context) {
                nx.each(this.linksMap(), function (link, key) {
                    fn.call(this, link, key);
                }, context || this);
            },
            /**
             * Get link by id
             * @param id
             * @returns {*}
             */
            getLink: function (id) {
                return this.linksMap()[id];
            },
            eachLinkSet: function (fn, context) {
                nx.each(this.linkSetMap(), function (link, key) {
                    fn.call(this, link, key);
                }, this);
            },

            getLinkSet: function (sourceVertexID, targetVertexID) {
                var linkKey = sourceVertexID + "_" + targetVertexID;
                var reverseLinkKey = targetVertexID + "_" + sourceVertexID;
                var linkSetMap = this.linkSetMap();
                return linkSetMap[linkKey] || linkSetMap[reverseLinkKey];
            },
            getLinkSetByLinkKey: function (linkKey) {
                var linkSetMap = this.linkSetMap();
                return linkSetMap[linkKey];
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


                var linkSetMap = this.linkSetMap();
                nx.each(linkSetMap, function (linkSet, key) {
                    linkSet.destroy();
                });

                this.links([]);
                this.linksMap({});
                this.linkSetMap({});

                this.inherited();
            }
        }
    });


})(nx, nx.graphic.util, nx.global);