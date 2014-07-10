(function (nx, global) {


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
                        var label = model.get('name') || model.get('label');
                        return getLabel(label);
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
                        if (rootNode) {
                            var deviceType = rootNode.deviceType;
                            var role = rootNode.role;
                            if (role == "Border Router") {
                                return 'groupl';
                            } else {
                                return deviceTypeMapping[deviceType];
                            }
                        } else {
                            return 'groupl';
                        }

                    }
                }
            },
            nodeGreyOut: {
                value: function () {
                    var self = this;
                    return function (model, node) {
                        return !model.get('greyOut');
                    }
                }
            },
            linkGreyOut: {
                value: function () {
                    var self = this;
                    return function (model, node) {
                        return !model.source().get('greyOut') && !model.target().get('greyOut');
                    }
                }
            }
        },
        methods: {
            init: function () {
                this.inherited();
            },
            drawLink: function () {
                var line = this.line();
                var path = [];
                path.push('M', line.start.x, line.start.y);
                path.push('L', line.end.x, line.start.y);
                path.push('L', line.end.x, line.end.y);
                return path.join(' ');
            }
        }
    });


})(nx, nx.global);