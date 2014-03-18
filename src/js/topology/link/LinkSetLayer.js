(function (nx, util, global) {
    'use strict';

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
            },
            highlightedLinkSet: {
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
//            attach: function (args) {
//                this.attach.__super__.apply(this, arguments);
//                var topo = this.topology();
//                topo.on('projectionChange', this._projectionChangeFN = function (sender, event) {
//                    setTimeout(function () {
//                        nx.each(this.linkSetCollection(), function (link) {
//                            link.update();
//                        }, this);
//                    }.bind(this), 10);
//
//                }, this);
//            },
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
            /**
             * Fade out all nodes
             * @method fadeOut
             */
            fadeOut: function (fn, context) {
                var el = this.resolve('static');
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
                var el = this.resolve('static');
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
                    nx.each(this.highlightedLinkSet(), function (link) {
                        link.append(this.resolve('static'));
                    }, this);
                    this.highlightedLinkSet([]);
                }, this);
            },
            highlightLinkSet: function (linkSet) {
                var topo = this.topology();
                var linkslayer = topo.getLayer('links');
                nx.each(linkSet, function (linkset) {
                    if (linkset.collapsed()) {
                        this.highlightedLinkSet().push(linkset);
                        linkset.append(this.resolve('activated'));
                    } else {
                        linkslayer.highlightLinks(linkset.links());
                    }

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
                this.$('static').setStyle('opacity', 1);
            }
        }
    });


})(nx, nx.util, nx.global);