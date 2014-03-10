(function (nx, util, global) {

    nx.define("nx.graphic.Topology.LinkMixin", {
        events: [],
        properties: {
            /**
             * Set multipleLinkType ,parallel / curve
             * @property linkType
             */
            linkType: {
                value: 'parallel' //parallel / curve
            },
            linkGutter: {
                value: 0
            },
            linkLabel: {
                value: null
            },
            linkSourceLabel: {
                value: null
            },
            linkTargetLabel: {
                value: null
            },
            linkColor: {},
            linkWidth: {},
            linkDotted: {},
            linkStyle: {},
            linkDrawMethod: {},
            supportMultipleLink: {
                value: true
            },
            linkEnable: {
                value: true
            },
            linkSetDrawMethod: {}
        },
        methods: {

            /**
             * Add a link to topology
             * @param obj
             * @param inOption
             * @returns {*}
             */
            addLink: function (obj, inOption) {
                var edge = this.model().addEdge(obj, inOption);
                var link = this.getLink(edge.id());
                this.adjustLayout();
                this.fire("addLink", link);
                return link;
            },
            removeLink: function (inLink, inOption) {
                var edge;
                if (inLink instanceof  nx.graphic.Topology.Link) {
                    edge = inLink.model();
                } else if (inLink instanceof nx.Graph.Edge) {
                    edge = inLink;
                } else {
                    return false;
                }

                this.model().removeEdge(edge, inOption);
                this.adjustLayout();
                this.fire("removeLink");
                return true;

            },

            removeLinkByID: function (id, inOption) {
                var link = this.getLink(id);
                if (link) {
                    return this.removeLink(link, inOption);
                } else {
                    return false;
                }

            },
            /**
             * Traverse each link
             * @method eachLink
             * @param fn <Function>
             * @param context {Object}
             */
            eachLink: function (fn, context) {
                this.getLayer("links").eachLink(fn, context || this);
            },

            /**
             * Get link by link id
             * @method getLink
             * @param id
             * @returns {*}
             */
            getLink: function (id) {
                return this.getLayer("links").getLink(id);
            },
            /**
             * get linkSet of two nodes
             * @param sourceVertexID
             * @param targetVertexID
             * @returns {*}
             */
            getLinkSet: function (sourceVertexID, targetVertexID) {
                return this.getLayer("links").getLinkSet(sourceVertexID, targetVertexID);
            },
            getLinkSetByLinkKey: function (linkKey) {
                return this.getLayer("links").getLinkSetByLinkKey(linkKey);
            }
        }
    });


})(nx, nx.graphic.util, nx.global);