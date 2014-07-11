(function (nx, global) {


    nx.define("ENC.TW.ViewModel.ControlVM.Layout", nx.Observable, {
        properties: {
            MVM: {},
            type: {
                dependencies: ['MVM.topoDataType']
            },
            types: {
                value: function () {
                    return [
                        {label: 'Enterprise network layout', id: 'enterprise', value: 'enterprise', activated: true},
                        {label: 'Force layout', id: 'force', value: 'force'},
                        {label: 'Customize layout', id: 'customize', value: 'customize'}
                    ];
                }
            },
            currentType: {
                value: 'enterprise'
            }
        },
        methods: {
            switchLayout: function (sender, args) {
                var model = sender.model();
                this.MVM().topologyVM().switchLayout(model.value);

                var types = this.types();
                var currentType = this.currentType();
                nx.each(types, function (item) {
                    if (item.id == model.id) {
                        item.activated = true
                    }
                    if (item.id == currentType) {
                        item.activated = false;
                    }
                });

                this.currentType(model.id);
                this.notify('types');

            }
        }
    })


})(nx, nx.global);