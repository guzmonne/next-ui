(function (nx, global) {

    var deviceTypeMapping = {
        SWITCH: 'switch',
        ROUTER: 'router',
        AP: 'accesspoint',
        UNKNOWN: 'unknown',
        asr: 'nexus5000',
        WIRED: 'host',
        access: 'accesspoint',
        core: 'groupm'
    };


    nx.define("ENC.TW.ViewModel.TopologyVM.View", nx.Observable, {
        properties: {
            MVM: {},
            labelKey: {
                value: 'label'
            },
            nodeLabel: {
                dependencies: ['labelKey'],
                value: function (key) {
                    return function (model, node) {
                        var label = model.get(key);
                        return label.length > 5 ? label.substr(0, 6) + "..." : label;
                    }
                }
            },
            nodeSetLabel: {
                dependencies: ['labelKey'],
                value: function (key) {
                    return function (model, nodeSet) {
                        var label = model.get('name');
                        return label.length > 5 ? label.substr(0, 6) + "..." : label;
                    }
                }
            },
            status: {
                watcher: function (prop, value) {
                    if (this.MVM()) {
                        this.MVM().topologyGenerated(value == "generated");
                    }
                }
            },
            nodeIconPath: {
                value: function () {
                    var self = this;
                    return function (model, node) {
                        var deviceType = model.get('deviceType');
                        return deviceTypeMapping[deviceType];

                    }
                }
            },
            nodeSetIconPath: {
                value: function () {
                    var self = this;
                    return function (model, nodeSet) {
                        var rootID = model.get('root');
                        var nodes = self.MVM().topoData().nodes;
                        var rootNode = nodes.filter(function (n) {
                            return n.id == rootID
                        }).shift();
                        var deviceType = rootNode.deviceType;
                        var role = rootNode.role;
                        if (role == "Border Router") {
                            return 'groupl';
                        } else {
                            return deviceTypeMapping[deviceType];
                        }
                    }
                }
            }
        },
        methods: {
            init: function () {
                this.inherited();
            }
        }
    });

})(nx, nx.global);