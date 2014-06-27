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


    var getLabel = function (label) {

        var index = label.indexOf('_');
        if (label.indexOf('-') != -1) {
            index = Math.min(index, label.indexOf('-'));
        }
        if (label.indexOf(' ') != -1) {
            index = Math.min(index, label.indexOf(' '));
        }
        index = index == -1 ? 5 : index;
        index = Math.min(index, 3);


        var lastIndex = label.lastIndexOf('_');
        if (label.lastIndexOf('-') != -1) {
            lastIndex = Math.max(lastIndex, label.lastIndexOf('-'));
        }
        if (label.lastIndexOf(' ') != -1) {
            lastIndex = Math.max(lastIndex, label.lastIndexOf(' '));
        }
        lastIndex = lastIndex == -1 ? label.length - 3 : lastIndex;
        lastIndex = Math.max(lastIndex, label.length - 3);


        return label.length > 6 ? label.substr(0, index) + ".." + label.substr(lastIndex) : label; //･･･
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
                        return getLabel(label);
                    }
                }
            },
            nodeSetLabel: {
                dependencies: ['labelKey'],
                value: function (key) {
                    return function (model, nodeSet) {
                        var label = model.get('name');
                        return getLabel(label);
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