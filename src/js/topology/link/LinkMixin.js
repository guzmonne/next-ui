(function (nx, global) {

    /**
     * Links mixin class
     * @class nx.graphic.Topology.LinkMixin
     * @module nx.graphic.Topology
     */
    nx.define("nx.graphic.Topology.LinkMixin", {
        events: ['addLink'],
        properties: {
            /**
             * Is topology support Multiple link , is false will highly improve performance
             * @property supportMultipleLink {Boolean}
             */
            supportMultipleLink: {
                value: true
            },
            /**
             * All link's config. key is link's property, support super binding
             * value could be a single string eg: color:'#f00'
             * value could be a an expression eg: label :'{model.id}'
             * value could be a function eg iconType : function (model,instance){ return  'router'}
             * value could be a normal binding expression eg : label :'{#label}'
             * @property {linkConfig}
             */
            linkConfig: {

            },
            /**
             * All linkSet's config. key is link's property, support super binding
             * value could be a single string eg: color:'#f00'
             * value could be a an expression eg: label :'{model.id}'
             * value could be a function eg iconType : function (model,instance){ return  'router'}
             * value could be a normal binding expression eg : label :'{#label}'
             * @property {linkSetConfig}
             */
            linkSetConfig: {

            }
        },
        methods: {

            /**
             * Add a link to topology
             * @method addLink
             * @param obj {JSON}
             * @param inOption {Config}
             * @returns {nx.graphic.Topology.Link}
             */
            addLink: function (obj, inOption) {
                var edge = this.graph().addEdge(obj, inOption);
                var link = this.getLink(edge.id());
                this.fire("addLink", link);
                return link;
            },
            /**
             * Remove a link
             * @method removeLink
             * @param inLink  {nx.graphic.Topology.Link}
             * @returns {boolean}
             */
            removeLink: function (inLink) {
                var edge;
                if (inLink instanceof  nx.graphic.Topology.Link) {
                    edge = inLink.model();
                } else if (inLink instanceof nx.data.Edge) {
                    edge = inLink;
                } else {
                    edge = this.graph().getEdge(inLink);
                }
                if (edge) {
                    this.graph().removeEdge(edge);
                    this.fire("removeLink");
                    return true;
                } else {
                    return false;
                }
            },

            deleteLink: function (inLink) {
                var data = inLink.model().getData();
                this.removeLink(inLink);
                this.graph().deleteEdge(data);
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
             * get linkSet by node
             * @param sourceVertexID {String} source node's id
             * @param targetVertexID {String} target node's id
             * @returns  {nx.graphic.Topology.LinkSet}
             */
            getLinkSet: function (sourceVertexID, targetVertexID) {
                return this.getLayer("linkSet").getLinkSet(sourceVertexID, targetVertexID);
            },
            /**
             * Get linkSet by linkKey
             * @param linkKey {String} linkKey
             * @returns {nx.graphic.Topology.LinkSet}
             */
            getLinkSetByLinkKey: function (linkKey) {
                return this.getLayer("linkSet").getLinkSetByLinkKey(linkKey);
            },
            /**
             * Get links by node
             * @param sourceVertexID {String} source node's id
             * @param targetVertexID {String} target node's id
             * @returns {Array} links collection
             */
            getLinksByNode: function (sourceVertexID, targetVertexID) {
                var linkSet = this.getLinkSet(sourceVertexID, targetVertexID);
                if (linkSet) {
                    return linkSet.getLinks();
                }
            }
        }
    });


})(nx, nx.global);