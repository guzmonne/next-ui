(function (nx, util, global) {
    'use strict';
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
                        style: 'transition: opacity 0.5s;'
                    }
                }

            ]
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
                link.setProperty('drawMethod', topo.linkDrawMethod());
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
                el.root().setStyle('opacity', 0.1);
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
                    nx.each(this.highlightedLinks(), function (link) {
                        link.append(this.resolve('static'));
                    }, this);
                    this.highlightedLinks([]);
                }, this);
            },
            highlightLinks: function (links) {
                nx.each(links, function (link) {
                    this.highlightedLinks().push(link);
                    link.append(this.resolve('activated'));
                }, this);
                this.fadeOut();
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
                this.$('activated').empty();
                this.$('static').empty();
                this.$('static').setStyle('opacity', 1);
            }
        }
    });


})(nx, nx.graphic.util, nx.global);