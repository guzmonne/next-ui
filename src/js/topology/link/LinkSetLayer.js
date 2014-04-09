(function (nx, util, global) {

    /** Links layer
     Could use topo.getLayer('linksLayer') get this
     * @class nx.graphic.Topology.LinksLayer
     * @extend nx.graphic.Topology.Layer
     */

    nx.define('nx.graphic.Topology.LinkSetLayer', nx.graphic.Topology.Layer, {
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
                    linkSet.model().removeEdges();
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


                var defaultConfig = {
                    linkType: 'parallel',
                    gutter: 0,
                    label: null,
                    sourceLabel: null,
                    targetLabel: null,
                    color: null,
                    width: null,
                    dotted: false,
                    style: null,
                    enable: true,
                    collapsed: function (model) {
                        if (this.model().containEdgeSet()) {
                            return true;
                        }
                        var linkType = this.linkType();
                        var edges = model.getSubEdges();
                        var maxLinkNumber = linkType === 'curve' ? 9 : 5;
                        return edges.length > maxLinkNumber;
                    }
                };
                var linkSetConfig = nx.extend(defaultConfig, topo.linkSetConfig());
                nx.each(nx.extend(defaultConfig, linkSetConfig), function (value, key) {
                    util.setProperty(linkset, key, value, topo);
                }, this);

                var superEvents = nx.graphic.Component.__events__;
                nx.each(linkset.__events__, function (e) {
                    if (superEvents.indexOf(e) == -1) {
                        linkset.on(e, function (sender, event) {
                            this.fire(e, linkset);
                        }, this);
                    }
                }, this);
                return linkset;
            },
            /**
             * Iterate all linkSet
             * @method eachLinkSet
             * @param fn {Function}
             * @param context {Object}
             */
            eachLinkSet: function (fn, context) {
                nx.each(this.linkSetMap(), fn, context || this);
            },
            /**
             * Get linkSet by source node id and target node id
             * @param sourceVertexID {String}
             * @param targetVertexID {String}
             * @returns {nx.graphic.LinkSet}
             */
            getLinkSet: function (sourceVertexID, targetVertexID) {
                var topo = this.topology();
                var edgeSet = topo.graph().getEdgeSetBySourceAndTarget(sourceVertexID, targetVertexID);
                if (edgeSet) {
                    return this.getLinkSetByLinkKey(edgeSet.linkKey());
                } else {
                    return null;
                }
            },
            /**
             * Get linkSet by linkKey
             * @param linkKey {String} linkKey
             * @returns {nx.graphic.Topology.LinkSet}
             */
            getLinkSetByLinkKey: function (linkKey) {
                var linkSetMap = this.linkSetMap();
                return linkSetMap[linkKey];
            },
            /**
             * Highlight linkSet
             * @method highlightLinkSet
             * @param linkSet {Array} linkSet array
             */
            highlightLinkSet: function (linkSet) {
                var topo = this.topology();
                var linksLayer = topo.getLayer('links');
                nx.each(linkSet, function (ls) {
                    if (ls.collapsed()) {
                        this.highlightElement(ls);
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