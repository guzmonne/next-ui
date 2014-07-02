(function (nx, global) {

    nx.define("ENC.TW.ViewModel.TopologyVM", nx.Observable, {
        events: [],
        properties: {
            MVM: {
                watcher: function (prop, value) {
                    if (value) {
                        this.data().MVM(value);
                        this.event().MVM(value);
                        this.view().MVM(value);
                    }
                }
            },
            data: {
                value: function () {
                    return new ENC.TW.ViewModel.TopologyVM.Data();
                }
            },
            event: {
                value: function () {
                    return new ENC.TW.ViewModel.TopologyVM.Event();
                }
            },
            view: {
                value: function () {
                    return new ENC.TW.ViewModel.TopologyVM.View();
                }
            }
        },
        methods: {
            expandAll: function () {
                var topo = this.MVM().topology();
                topo.enableNodeSetAnimation(false);
                this.event().expandALL(true);


                var nodeSetLayer = topo.getLayer('nodeSet');
//                var isFinished = true;

                var fn = function (callback) {
                    var isFinished = true;
                    nodeSetLayer.eachNodeSet(function (nodeSet) {
                        if (nodeSet.view().visible() != false) {
                            nodeSet.collapsed(false);
                            isFinished = false;
                        }
                    });
                    if (!isFinished) {
                        fn(callback);
                    } else {
                        callback();
                    }
                };

                topo.showLoading();

                setTimeout(function () {
                    fn(function () {
                        topo.stage().resetFitMatrix();
                        topo.enableNodeSetAnimation(true);
                        this.event().expandALL(false);
                        topo.hideLoading();
                        topo.fit(function () {
                            topo.blockEvent(false);
                        }, this);
                    }.bind(this));
                }.bind(this), 100);

            }
        }
    });
})(nx, nx.global);