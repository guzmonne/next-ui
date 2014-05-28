(function (nx) {
    nx.define('odl.Shell', nx.ui.Application, {
        methods: {
            start: function (options) {
                var view = new odl.view.ShellView();
                var vm = new odl.viewmodel.ShellViewModel();
                view.model(vm);
                view.attach(this);
            }
        }
    });
})(nx);