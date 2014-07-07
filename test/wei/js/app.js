(function (nx, global) {
    nx.define('topo.test.App', nx.ui.Application, {
        methods: {
            run: function () {
                var abc
                var view = new topo.test.View();
                view.attach(this);
                view.items(topoCase)
                var topology = view.resolve('topo');
                var report = new topo.test.report();
                topology.on('ready', function () {
                    var viewmodel = new topo.test.ViewModel(view.resolve('topo'), topoCase);
                    view.model(viewmodel);

                })
                this.on('resize', function () {
                    if (abc){
                        clearTimeout(abc);
                    }
                    abc = setTimeout(function () {
                        console.log('resize...');
                        view.resolve('topo').adaptToContainer();
                    }, 500)

                });

                this.on('generateReport', function () {
                    view.detach(this);
                    report.attach(this);
                    QUnit.load();
                })

            }
        }
    });
})(nx, window);
