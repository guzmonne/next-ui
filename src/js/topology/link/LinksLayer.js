(function (nx, global) {
    var util = nx.util;

    /**
     * Links layer
     Could use topo.getLayer('links') get this
     * @class nx.graphic.Topology.LinksLayer
     * @extend nx.graphic.Topology.Layer
     */

    var CLZ = nx.define('nx.graphic.Topology.LinksLayer', nx.graphic.Topology.DoubleLayer, {
        statics: {
            defaultConfig: {
                linkType: 'parallel',
                label: null,
                color: null,
                width: null,
                enable: true
            }
        },
        events: ['pressLink', 'clickLink', 'enterLink', 'leaveLink'],
        properties: {
            /**
             * Links collection
             * @property links
             */
            links: {
                value: function () {
                    return [];
                }
            },
            /**
             * Links id : value map
             * @property linksMap
             */
            linksMap: {
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
                    this.eachLink(function (link) {
                        link.stageScale(value);
                    });
                }, this);
                topo.watch('linkConfig', this.__watchNodeConfigFN = function (prop, value) {
                    this.linkConfig = nx.extend({}, CLZ.defaultConfig, value);
                    delete  this.linkConfig.__owner__;
                }, this);
            },
            /**
             * Add a link
             * @param edge
             * @method addLink
             */

            addLink: function (edge) {
                var links = this.links();
                var linksMap = this.linksMap();
                var id = edge.id();
                var link = this._generateLink(edge);
                links[links.length] = link;
                linksMap[id] = link;
                return link;
            },
            /**
             * Update link
             * @method updateLink
             * @param edge {nx.data.edge}
             */
            updateLink: function (edge) {
                this.getLink(edge.id()).update();
            },
            /**
             * Remove a link
             * @param edge {nx.data.Edge}
             */
            removeLink: function (edge) {
                var linksMap = this.linksMap();
                var links = this.links();
                var id = edge.id();
                var link = linksMap[id];
                if (link) {
                    link.dispose();
                    links.splice(links.indexOf(link), 1);
                    delete linksMap[id];
                }
            },

            _generateLink: function (edge) {
                var id = edge.id();
                var topo = this.topology();
                var link = new nx.graphic.Topology.Link({
                    topology: topo
                });
                //set model
                link.setModel(edge, false);
                link.attach(this.view('static'));

                link.view().sets({
                    'class': 'link',
                    'data-id': id
                });

                this._stageScale = topo.stageScale();


                setTimeout(function () {
                    this.updateDefaultProperty(link);
                }.bind(this), 10);

                return link;

            },
            updateDefaultProperty: function (link) {
                var topo = this.topology();
                //delegate link's events
                var superEvents = nx.graphic.Component.__events__;
                nx.each(link.__events__, function (e) {
                    if (superEvents.indexOf(e) == -1) {
                        link.on(e, function (sender, event) {
                            this.fire(e, link);
                        }, this);
                    }
                }, this);
                //set properties
                var linkConfig = this.linkConfig;
                nx.each(linkConfig, function (value, key) {
                    util.setProperty(link, key, value, topo);
                }, this);

                if (nx.DEBUG) {
                    var edge = link.model();
                    link.view().sets({
                        'data-linkKey': edge.linkKey(),
                        'data-source-node-id': edge.source().id(),
                        'data-target-node-id': edge.target().id()
                    });
                }


                link.update();
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
             * Highlight links
             * @method highlightLinks
             * @param links {Array} links array
             */
            highlightLinks: function (links) {
                var highlightedElements = this.highlightedElements();
                nx.each(links, function (link) {
                    highlightedElements.add(link);
                }, this);
            },
            activeLinks: function (links) {
                var activeElements = this.activeElements();
                nx.each(links, function (link) {
                    activeElements.add(link);
                }, this);
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
            },
            dispose: function () {
                this.eachLink(function (link) {
                    link.dispose();
                });
                this.topology().unwatch('stageScale', this.__watchStageScaleFN, this);
                this.clear();
                this.inherited();
            }
        }
    });


})(nx, nx.global);