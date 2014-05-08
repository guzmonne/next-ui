(function (nx, global) {

    var util = nx.util;

    /** Links layer
     Could use topo.getLayer('linkSet') get this
     * @class nx.graphic.Topology.LinksLayer
     * @extend nx.graphic.Topology.Layer
     */

    var CLZ = nx.define('nx.graphic.Topology.LinkSetLayer', nx.graphic.Topology.DoubleLayer, {
        statics: {
            defaultConfig: {
                linkType: 'parallel',
                label: null,
                sourceLabel: null,
                targetLabel: null,
                color: null,
                width: null,
                dotted: false,
                style: null,
                enable: true,
                collapsedRule: function (model) {
                    if (model.type() == 'edgeSetCollection') {
                        return true;
                    }
                    var linkType = this.linkType();
                    var edges = model.getEdges();
                    var maxLinkNumber = linkType === 'curve' ? 9 : 5;
                    return edges.length > maxLinkNumber;
                }
            }
        },
        events: ['pressLinkSetNumber', 'clickLinkSetNumber', 'enterLinkSetNumber', 'leaveLinkSetNumber', 'collapseLinkSet', 'expandLinkSet'],
        properties: {
            linkSetArray: {
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

                topo.watch('stageScale', this.__watchStageScaleFN = function (prop, value) {
                    this.eachLinkSet(function (linkSet) {
                        linkSet.stageScale(value);
                    });
                }, this);

            },
            addLinkSet: function (edgeSet) {
                var linkSetArray = this.linkSetArray();
                var linkSetMap = this.linkSetMap();
                var linkSet = this._generateLinkSet(edgeSet);
                linkSetMap[edgeSet.linkKey()] = linkSet;
                linkSetArray[linkSetArray.length] = linkSet;
                return linkSet;
            },
            updateLinkSet: function (edgeSet) {
                var linkSet = this.getLinkSetByLinkKey([edgeSet.linkKey()]);
                linkSet.updateLinkSet();
            },
            removeLinkSet: function (edgeSet) {
                var linkSetArray = this.linkSetArray();
                var linkSetMap = this.linkSetMap();
                var linkKey = edgeSet.linkKey();
                var linkSet = linkSetMap[linkKey];
                if (linkSet) {
                    linkSet.dispose();
                    linkSetArray.splice(linkSetArray.indexOf(linkSet), 1);
                    delete linkSetMap[linkKey];
                    return true;
                } else {
                    return false;
                }
            },
            _generateLinkSet: function (edgeSet) {
                var linkKey = edgeSet.linkKey();
                var topo = this.topology();
                var linkSet = new nx.graphic.Topology.LinkSet({
                    topology: topo,
                    stageScale: topo.stageScale()
                });
                //set model
                linkSet.setModel(edgeSet, false);
                linkSet.attach(this.view('static'));

                //set element attribute
                linkSet.view().sets({
                    'data-nx-type': 'nx.graphic.Topology.LinkSet',
                    'data-linkKey': linkKey,
                    'data-source-node-id': edgeSet.source().id(),
                    'data-target-node-id': edgeSet.target().id()

                });
                //set properties
                var linkSetConfig = nx.extend({}, CLZ.defaultConfig, topo.linkSetConfig());
                delete linkSetConfig.__owner__; //fix bug
                nx.each(linkSetConfig, function (value, key) {
                    util.setProperty(linkSet, key, value, topo);
                }, this);

                //delegate elements events
                var superEvents = nx.graphic.Component.__events__;
                nx.each(linkSet.__events__, function (e) {
                    //exclude basic events
                    if (superEvents.indexOf(e) == -1) {
                        linkSet.on(e, function (sender, event) {
                            this.fire(e, linkSet);
                        }, this);
                    }
                }, this);

                linkSet.updateLinkSet();
                return linkSet;
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
             * @method highlightLinkSetArray
             * @param linkSetAry {Array} linkSet array
             */
            highlightLinkSetArray: function (linkSetAry) {
                var topo = this.topology();
                var linksLayer = topo.getLayer('links');
                var highlightedElements = this.highlightedElements();
                nx.each(linkSetAry, function (linkSet) {
                    if (linkSet.activated()) {
                        highlightedElements.add(linkSet);
                    } else {
                        linksLayer.highlightLinks(linkSet.links());
                    }
                }, this);
            },
            /**
             * Active linkSet
             * @method highlightLinkSetArray
             * @param linkSetAry {Array} linkSet array
             */
            activeLinkSetArray: function (linkSetAry) {
                var topo = this.topology();
                var linksLayer = topo.getLayer('links');
                var activeElements = this.activeElements();
                nx.each(linkSetAry, function (linkSet) {
                    if (linkSet.activated()) {
                        activeElements.add(linkSet);
                    } else {
                        linksLayer.activeLinks(linkSet.links());
                    }
                }, this);
            },
            /**
             * Clear links layer
             * @method clear
             */
            clear: function () {
                nx.each(this.linkSetArray(), function (linkSet) {
                    linkSet.dispose();
                });
                this.linkSetArray([]);
                this.linkSetMap({});
                this.inherited();
            },
            dispose: function () {
                this.clear();
                this.topology().unwatch('stageScale', this.__watchStageScaleFN, this);
                this.inherited();
            }
        }
    });


})(nx, nx.global);