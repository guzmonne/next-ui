(function (nx, util, global) {

    /**
     * Links layer
     Could use topo.getLayer('linksLayer') get this
     * @class nx.graphic.Topology.LinksLayer
     * @extend nx.graphic.Topology.Layer
     */

    nx.define('nx.graphic.Topology.LinksLayer', nx.graphic.Topology.Layer, {
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
            /**
             * Add a link
             * @param edge
             * @method addLink
             */

            addLink: function (edge) {
                var id = edge.id();
                var link = this._generateLink(edge);

                link.attach(this.resolve('static'));
                this.links().push(link);
                this.linksMap()[id] = link;
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
                link.setModel(edge, false);
                link.resolve('@root').set('class', 'link');
                link.resolve('@root').set('data-link-id', id);
                link.resolve('@root').set('data-linkKey', edge.linkKey());
                link.resolve('@root').set('data-source-node-id', edge.source().id());
                link.resolve('@root').set('data-target-node-id', edge.target().id());

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
                    enable: true
                };

                var linkConfig = nx.extend(defaultConfig, topo.linkConfig());
                nx.each(linkConfig, function (value, key) {
                    util.setProperty(link, key, value, topo);
                }, this);
                link.update();


                var superEvents = nx.graphic.Component.__events__;
                nx.each(link.__events__, function (e) {
                    if (superEvents.indexOf(e) == -1) {
                        link.on(e, function (sender, event) {
                            this.fire(e, link);
                        }, this);
                    }
                }, this);

                link.set('class', 'link');
                link.set('data-link-id', id);
                link.set('data-source-node-id', edge.source().id());
                link.set('data-target-node-id', edge.target().id());


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
             * Highlight links
             * @method highlightLinks
             * @param links {Array} links array
             */
            highlightLinks: function (links) {
                nx.each(links, function (link) {
                    this.highlightElement(link);
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
            }
        }
    });


})(nx, nx.util, nx.global);