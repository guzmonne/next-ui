
(function (nx, global) {
    nx.define('topo.test.App', nx.ui.Application, {
        methods: {
            run: function () {
                var view = new topo.test.View();
                view.attach(this);
                var topology = view.view('topo');
                var report = new topo.test.report();
                topology.on('ready', function () {
                    var viewmodel = new topo.test.ViewModel(view.resolve('topo'), topoCase);
                    view.model(viewmodel);
                })
                this.on('resize', function () {
                    console.log('resize...');
                    view.resolve('topo').adaptToContainer();
                });

                this.on('generateReport',function(){
                    view.detach(this);
                    report.attach(this);
                    QUnit.load();
                })

//                var self = this;
//                setTimeout(function(){
////                    test('ccc',function(){ok(true)})
//                    view.detach();
//                    report.attach(self);
//                    QUnit.load();
//                },5000)


            }
        }
    });
})(nx, window);