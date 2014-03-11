(function (nx, util, global) {
    "use strict";

    /** Links layer
     Could use topo.getLayer("linksLayer") get this
     * @class nx.graphic.Topology.LinksLayer
     * @extend nx.graphic.Topology.Layer
     */

    nx.define("nx.graphic.Topology.LinkSetLayer", nx.graphic.Topology.Layer, {
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
            linkSetCollection: {
                value: function () {
                    return [];
                }
            },
            linkSetMap: {
                value: function () {
                    return {};
                }
            },
            highlightedLinks: {
                value: function () {
                    return [];
                }
            }
        },
        view: {
            type: 'nx.graphic.Group',
            content: [
                {
                    name: 'activated',
                    type: 'nx.graphic.Group'
                },
                {
                    name: 'static',
                    type: 'nx.graphic.Group',
                    props: {
                        'class': 'n-transition'
                    }
                }

            ]
        },
        methods: {
            /**
             * Add a link
             * @param edgeSet
             * @method addLink
             */

            addLinkSet: function (edgeSet) {
                var linkSetCollection = this.linkSetCollection();
                var linkSetMap = this.linkSetMap();
                var linkSet = this._generateLinkSet(edgeSet);


                linkSetMap[edgeSet.linkKey()] = linkSet;
                linkSetCollection.push(linkSet);

                return linkSet;
            },
            updateLink: function (edgeSet) {
                var linkSetMap = this.linkSetMap();
                var linkSet = linkSetMap[edgeSet.linkKey()];
                linkSet.updateLinks();
            },
            removeLink: function (edgeSet) {
                var linkSetCollection = this.linkSetCollection();
                var linkSetMap = this.linkSetMap();
                var linkKey = edgeSet.linkKey();
                var linkSet = linkSetMap[linkKey];
                if (linkSet) {
                    linkSet.dispose();
                    delete linkSetMap[linkKey];
                    linkSetCollection.splice(linkSetCollection.indexOf(linkSet), 1);
                    return true;
                } else {
                    return false;
                }
            },

            removeNode: function (vertex) {
//                var linkSetMap = this.linkSetMap();
//                vertex.eachEdge(function (edge) {
//                    var linkKey = edge.linkKey();
//                    var reverseLinkKey = edge.reverseLinkKey();
//                    var linkSet = linkSetMap[linkKey] || linkSetMap[reverseLinkKey];
//                    if (linkSet) {
//                        linkSet.destroy();
//                        delete linkSetMap[linkSet.graph().linkKey()]
//                    }
//                });
            },

            _generateLinkSet: function (edgeSet) {
                var linkKey = edgeSet.linkKey();
                var topo = this.topology();
                var linkset = new nx.graphic.Topology.LinkSet({
                    topology: topo
                });

                linkset.resolve("@root").set("data-nx-type", "nx.graphic.Topology.LinkSet");
                linkset.resolve("@root").set("data-linkKey", linkKey);
                linkset.resolve("@root").set("data-source-node-id", edgeSet.source().id());
                linkset.resolve("@root").set("data-target-node-id", edgeSet.target().id());

                linkset.attach(this.resolve('static'));
                linkset.setModel(edgeSet, false);
                linkset.updateLinks();
                linkset.adjust();


                // events: ['click', 'mouseout', 'mouseover', 'mousedown','clickNumber','leaveNumber'],


//                linkset.on("clickNumber", function (sender, event) {
//                    nx.eventObject = event;
//                    this.fire("clickLinkSetNumber", linkset);
//                }, this);
//
//                linkset.on("leaveNumber", function (sender, event) {
//                    nx.eventObject = event;
//                    this.fire("leaveLinkSetNumber", linkset);
//                }, this);

                return linkset;
            },


            eachLinkSet: function (fn, context) {
                nx.each(this.linkSetMap(), fn, context || this);
            },

            getLinkSet: function (sourceVertexID, targetVertexID) {
                var topo = this.topology();
                var edgeSet = topo.graph().getEdgeSetBySourceAndTarget(sourceVertexID, targetVertexID);
                return this.getLinkSetByLinkKey(edgeSet.linkKey());
            },
            getLinkSetByLinkKey: function (linkKey) {
                var linkSetMap = this.linkSetMap();
                return linkSetMap[linkKey];
            },
            /**
             * Fade out all nodes
             * @method fadeOut
             */
            fadeOut: function (fn, context) {
                var el = this.resolve("static");
                el.upon('transitionend', function () {
                    if (fn) {
                        fn.call(context || this);
                    }
                }, this);
                el.root().setStyle('opacity', 0.2);
            },
            /**
             * Fade in all nodes
             * @method fadeIn
             */
            fadeIn: function (fn, context) {
                var el = this.resolve("static");
                el.upon('transitionend', function () {
                    if (fn) {
                        fn.call(context || this);
                    }
                }, this);

                el.root().setStyle('opacity', 1);
            },
            /**
             * Recover all links statues
             * @param force
             * @method recover
             */
            recover: function (force) {
                this.fadeIn(function () {
                    nx.each(this.highlightedLinks(), function (link) {
                        link.append(this.resolve('static'));
                    }, this);
                    this.highlightedLinks([]);
                }, this);
            },
            highlightLinks: function (links) {
                nx.each(links, function (link) {
                    this.highlightedLinks().push(node);
                    link.append(this.resolve('activated'));
                }, this);
                this.fadeOut();
            },
            /**
             * Clear links layer
             * @method clear
             */
            clear: function () {
                nx.each(this.linkSetCollection(), function (linkSet) {
                    linkSet.dispose();
                });
                this.linkSetCollection([]);
                this.linkSetMap({});
                this.$('activated').empty();
                this.$('static').empty();
                this.$("static").setStyle('opacity', 1);
            }
        }
    });


})(nx, nx.graphic.util, nx.global);