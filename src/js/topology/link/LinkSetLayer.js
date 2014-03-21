(function (nx, util, global) {

    /** Links layer
     Could use topo.getLayer('linksLayer') get this
     * @class nx.graphic.Topology.LinksLayer
     * @extend nx.graphic.Topology.Layer
     */

    nx.define('nx.graphic.Topology.LinkSetLayer', nx.graphic.Topology.Layer, {
        /**
         * @event clickLink
         */
        /**
         * @event leaveLink
         */
        /**
         * @event enterLink
         */
        events: ['pressLinkSetNumber', 'clickLinkSetNumber', 'enterLinkSetNumber', 'leaveLinkSetNumber', 'collapsedLinkSet', 'expandLinkSet'],
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
            }
        },
        methods: {
            attach: function (args) {
                this.inherited(args);
                var topo = this.topology();
                topo.watch('revisionScale', this._watchRevisionScale = function (prop, value) {
                    var links = this.linkSetCollection();
                    nx.each(links, function (link) {
                        link.view('numBg').setStyle('stroke-width', value * 16);
                        link.view('num').setStyle('font-size', Math.round(value * 9 + 3));
                    });

                }, this);

            },
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
            updateLinkSet: function (edgeSet) {
                var linkSet = this.getLinkSetByLinkKey([edgeSet.linkKey()]);
                linkSet.updateLinkSet();
            },
            removeLinkSet: function (edgeSet) {
                var linkSetCollection = this.linkSetCollection();
                var linkSetMap = this.linkSetMap();
                var linkKey = edgeSet.linkKey();
                var linkSet = linkSetMap[linkKey];
                if (linkSet) {
                    linkSet.model().removeAllEdges();
                    linkSet.dispose();
                    linkSetCollection.splice(linkSetCollection.indexOf(linkSet), 1);
                    delete linkSetMap[linkKey];
                    return true;
                } else {
                    return false;
                }
            },

            removeNode: function (vertex) {
            },

            _generateLinkSet: function (edgeSet) {
                var linkKey = edgeSet.linkKey();
                var topo = this.topology();
                var linkset = new nx.graphic.Topology.LinkSet({
                    topology: topo
                });

                var root = linkset.resolve('@root');
                root.set('data-nx-type', 'nx.graphic.Topology.LinkSet');
                root.set('data-linkKey', linkKey);
                root.set('data-source-node-id', edgeSet.source().id());
                root.set('data-target-node-id', edgeSet.target().id());

                linkset.attach(this.resolve('static'));
                linkset.setModel(edgeSet, false);
                linkset.adjust();

                linkset.on('numbermousedown', function (sender, event) {
                    this.fire('pressLinkSetNumber', linkset);
                }, this);
                linkset.on('numbermouseup', function (sender, event) {
                    this.fire('clickLinkSetNumber', linkset);
                }, this);

                linkset.on('numbermouseenter', function (sender, event) {
                    this.fire('enterLinkSetNumber', linkset);
                }, this);

                linkset.on('numbermouseleave', function (sender, event) {
                    this.fire('leaveLinkSetNumber', linkset);
                }, this);

                linkset.on('collapsedLinkSet', function (sender, event) {
                    this.fire('collapsedLinkSet', linkset);
                }, this);

                linkset.on('expandLinkSet', function (sender, event) {
                    this.fire('expandLinkSet', linkset);
                }, this);

                return linkset;
            },


            eachLinkSet: function (fn, context) {
                nx.each(this.linkSetMap(), fn, context || this);
            },

            getLinkSet: function (sourceVertexID, targetVertexID) {
                var topo = this.topology();
                var edgeSet = topo.graph().getEdgeSetBySourceAndTarget(sourceVertexID, targetVertexID);
                if (edgeSet) {
                    return this.getLinkSetByLinkKey(edgeSet.linkKey());
                } else {
                    return null;
                }
            },
            getLinkSetByLinkKey: function (linkKey) {
                var linkSetMap = this.linkSetMap();
                return linkSetMap[linkKey];
            },
            highlightLinkSet: function (linkSet, pin) {
                var topo = this.topology();
                var linksLayer = topo.getLayer('links');
                nx.each(linkSet, function (ls) {
                    if (ls.collapsed()) {
                        this.highlightElement(ls, pin);
                    } else {
                        linksLayer.highlightLinks(ls.links());
                    }
                }, this);
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
                this.inherited();
            }
        }
    });


})(nx, nx.util, nx.global);