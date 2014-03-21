(function (nx, util, global) {

    /** Links layer
     Could use topo.getLayer('linksLayer') get this
     * @class nx.graphic.Topology.LinksLayer
     * @extend nx.graphic.Topology.Layer
     */

    nx.define('nx.graphic.Topology.LinksLayer', nx.graphic.Topology.Layer, {
        /**
         * @event clickLink
         */
        /**
         * @event leaveLink
         */
        /**
         * @event enterLink
         */
        events: ['pressLink', 'clickLink', 'leaveLink', 'enterLink'],
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
            attach: function (args) {
                this.attach.__super__.apply(this, arguments);
//                var topo = this.topology();
//                topo.on('projectionChange', this._projectionChangeFN = function (sender, event) {
//                    setTimeout(function () {
//                        nx.each(this.links(), function (link) {
//                            link.update();
//                        }, this);
//                    }.bind(this), 100);
//
//                }, this);
            },
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
            updateLink: function (edge) {
                this.getLink(edge.id()).update();
            },
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

                link.setProperty('linkType', topo.linkType());
                link.setProperty('gutter', topo.linkGutter());
                link.setProperty('label', topo.linkLabel());
                link.setProperty('sourceLabel', topo.linkSourceLabel());
                link.setProperty('targetLabel', topo.linkTargetLabel());
                link.setProperty('color', topo.linkColor());
                link.setProperty('width', topo.linkWidth());
                link.setProperty('dotted', topo.linkDotted());
                link.setProperty('style', topo.linkStyle());
                link.set('drawMethod', topo.linkDrawMethod());
                link.setProperty('enable', topo.linkEnable());

                link.update();

                link.on('linkmousedown', function (sender, event) {
                    this.fire('pressLink', link);
                }, this);


                link.on('linkmouseup', function (sender, event) {
                    this.fire('clickLink', link);
                }, this);


                link.on('linkmouseenter', function (sender, event) {
                    this.fire('enterLink', link);
                }, this);

                link.on('linkmouseleave', function (sender, event) {
                    this.fire('leaveLink', link);
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
            highlightLinks: function (links, pin) {
                nx.each(links, function (link) {
                    this.highlightElement(link, pin);
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