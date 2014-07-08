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
            },
            updated: {
                value: false
            }
        },
        methods: {
            expandAll: function () {
                var topo = this.MVM().topology();
                this.event().expandALL(true);


                var nodeSetLayer = topo.getLayer('nodeSet');

                console.time('expandAll');

                var fn = function (callback) {
                    var isFinished = true;
                    nodeSetLayer.eachNodeSet(function (nodeSet) {
                        if (nodeSet.visible()) {
                            nodeSet.animation(false);
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

                        nodeSetLayer.eachNodeSet(function (nodeSet) {
                            nodeSet.animation(true);
                        });


                        topo.stage().resetFitMatrix();
                        this.event().expandALL(false);
                        topo.hideLoading();
                        topo.fit(function () {
                            topo.blockEvent(false);
                            console.timeEnd('expandAll');
                        }, this);
                    }.bind(this));
                }.bind(this), 100);

            },
            adapt: function () {
                var topo = this.MVM().topology();
                if (topo) {

                    if (this._adaptTimer) {
                        clearTimeout(this._adaptTimer);
                    }

                    this._adaptTimer = setTimeout(function () {
                        topo.adaptToContainer();
                    }.bind(this), 300);
                }
            },
            savePosition: function () {
                var topo = this.MVM().topology();
                topo.showLoading();
                setTimeout(function () {
                    topo.hideLoading();
                }, 3000);
            }
        }
    });
})(nx, nx.global);