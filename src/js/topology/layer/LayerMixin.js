(function (nx, global) {
    nx.define("nx.graphic.Topology.LayerMixin", {
        events: [],
        properties: {
            /**
             * @property layersMap
             */
            layersMap: {
                value: function () {
                    return {}
                }
            },
            /**
             * @property layers
             */
            layers: {
                value: function () {
                    return [];
                }
            }
        },
        methods: {
            initLayer: function () {
                this.layersMap({});
                this.layers([]);
                this.attachLayer("groups", "nx.graphic.Topology.GroupsLayer");
                this.attachLayer("links", "nx.graphic.Topology.LinksLayer");
                this.attachLayer("linkSet", "nx.graphic.Topology.LinkSetLayer");
                this.attachLayer("nodes", "nx.graphic.Topology.NodesLayer");
                this.attachLayer("paths", "nx.graphic.Topology.PathLayer");
                this.attachLayer("nodeSet", "nx.graphic.Topology.NodeSetLayer");

            },
            /**
             * To generate a layer
             * @param name
             * @param layer
             * @returns {*}
             * @private
             */
            _generateLayer: function (name, layer) {
                var layerObj;
                if (name && layer) {
                    if (nx.is(layer, "String")) {
                        var cls = nx.path(global, layer);
                        if (cls) {
                            layerObj = new cls();
                        }
                    } else {
                        layerObj = layer;
                    }
                    layerObj.topology(this);
                    layerObj.model(this.graph());
                    layerObj.draw();

                    nx.each(layerObj.__events__, function (eventName) {
                        nx.Object.delegateEvent(layerObj, eventName, this, eventName);
                    }, this);
                }
                return layerObj;
            },
            /**
             * Get a layer reference by name
             * @method getLayer
             * @param name {String} The name you pass to topology when you attacherLayer/prependLayer/insertLayerAfter
             * @returns {*} Instance of a layer
             */
            getLayer: function (name) {
                var layersMap = this.layersMap();
                return layersMap[name];
            },
            appendLayer: function (name, layer) {
                return this.attachLayer(name, layer);
            },
            /**
             * attach a layer to topology, that should be subclass of nx.graphic.Topology.Layer
             * @method attachLayer
             * @param name {String} handler to get this layer
             * @param layer <String,nx.graphic.Topology.Layer> Could be string of a layer's class name, or a reference of a layer
             */
            attachLayer: function (name, layer) {
                var layersMap = this.layersMap();
                var layers = this.layers();
                var layerObj = this._generateLayer(name, layer);
                if (layerObj) {
                    layerObj.attach(this.stage());
                    layersMap[name] = layerObj;
                    layers.push(layerObj);
                }
                return layerObj;
            },
            /**
             * Prepend a layer to topology, that should be subclass of nx.graphic.Topology.Layer
             * @method prependLayer
             * @param name {String} handler to get this layer
             * @param layer <String,nx.graphic.Topology.Layer> Could be string of a layer's class name, or a reference of a layer
             */
            prependLayer: function (name, layer) {
                var layersMap = this.layersMap();
                var layers = this.layers();
                var layerObj = this._generateLayer(name, layer);
                if (layerObj) {
                    layerObj.attach(this.stage(), 0);
                    layersMap[name] = layerObj;
                    layers.push(layerObj);
                }
                return layerObj;
            },
            /**
             * Insert a layer under a certain layer, that should be subclass of nx.graphic.Topology.Layer
             * @method insertLayerAfter
             * @param name  {String} handler to get this layer
             * @param layer <String,Object> Could be string of a layer's class name, or a reference of a layer
             * @param upsideLayerName {String} name of upside layer
             */
            insertLayerAfter: function (name, layer, upsideLayerName) {
                var layersMap = this.layersMap();
                var layers = this.layers();
                var layerObj = this._generateLayer(name, layer);
                var afterLayer = layersMap[upsideLayerName];
                if (layerObj && afterLayer) {
                    var index = layers.indexOf(afterLayer);
                    layerObj.attach(this.stage(), index);
                    layersMap[name] = layerObj;
                    layers.splice(index + 1, 0, layerObj);
                }
            },
            /**
             * Call all layer's recover
             * @method recover
             * @param force
             */
            recover: function (force) {
                nx.each(this.layers(), function (layer) {
                    layer.recover(force);
                }, this);
            },
            /**
             * Clear all layer's content
             * @method clear
             */
            clear: function () {
                debugger;
                nx.each(this.layers(), function (layer) {
                    layer.clear();
                });
            }
        }
    });
})(nx, nx.global);