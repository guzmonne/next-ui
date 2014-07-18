nx.define('topo.test.ViewModel', nx.Observable, {
    properties: {
        description: {
            value: null
        },
        script: {
            value: null
        },
        testname: {
            value: null
        },
        topo: {
            value: null
        },
        output: {
            value: null
        },
        tcase: {
            value: null
        },
        index: {
            value: 0
        },
        passed: {
            value: []
        },
        failed: {
            value: []
        },
        menustatus: {
            value: 'btn-group'
        },
        tearDown: {
            value: null
        }


    },
    methods: {
        init: function (topology, tcase) {
            this.watch('script', this.executeScript, this)
//            console.log(topology.getData())
            this.topo(topology);
            this.tcase(tcase);
            this.description(tcase[0].description);
            this.script(tcase[0].script);
            this.testname(tcase[0].name);
            this.tearDown(tcase[0].tearDown)
            this.index(0);
        },
        log:function(value)
        {
            var temp = this.output();
            this.output(temp + '//' + value);
        },
        casePass: function (sender, event) {
            test(this.testname(), function () {
                ok(true);
            })
            if (this.tearDown()) {
                console.log(this.tearDown());
                this.tearDown()(this.topo())
            }


            this.passed().push(this.testname());
            this.nextcase(this.index() + 1);
//            app.fire('generateReport');
        },
        caseFail: function (sender, event) {
            test(this.testname(), function () {
                ok(false);
            })
            if (this.tearDown()) {
                console.log(this.tearDown());
                this.tearDown()(this.topo());
            }
            this.topoRestore();
            this.failed().push(this.testname());
            this.nextcase(this.index() + 1);


        },
        nextcase: function (index) {
            if (index < this.tcase().length) {
                this.description(this.tcase()[index].description);
                this.script(this.tcase()[index].script);
                this.testname(this.tcase()[index].name);
                this.tearDown(this.tcase()[index].tearDown)
                this.index(index);
            }
            else {
                app.fire('generateReport');
                console.log('passed :  ' + this.passed())
                console.log('failed :  ' + this.failed())
            }
        },
        jumpTo: function (data) {
            if(this.tearDown())
            {
//                console.log(this.tearDown())
                this.tearDown()(this.topo());
            }

            this.script(null);
            this.topoRestore();
            this.description(data.description);
            this.script(data.script);
            this.testname(data.name);
            this.tearDown(data.tearDown)
        },
        menuaction: function () {
            if (this.menustatus() == 'btn-group')
                this.menustatus('btn-group open');
            else
                this.menustatus('btn-group');
        },
        topoRestore: function () {
//            console.log('restore');
//            this.topo().adaptToContainer();
//            this.topo().setData({
//                nodes: [
//                    {"id": 0, "x": 410, "y": 100, "name": "12K-1"},
//                    {"id": 1, "x": 410, "y": 280, "name": "12K-2"},
//                    {"id": 2, "x": 660, "y": 280, "name": "Of-9k-03"},
//                    {"id": 3, "x": 660, "y": 100, "name": "Of-9k-02"},
//                    {"id": 4, "x": 180, "y": 190, "name": "Of-9k-01"}
//                ],
//                links: [
//                    {"id": 0, "source": 0, "target": 1},
//                    {"id": 1, "source": 1, "target": 2},
//                    {"id": 2, "source": 1, "target": 3},
//                    {"id": 3, "source": 4, "target": 1},
//                    {"id": 4, "source": 2, "target": 3},
//                    {"id": 5, "source": 2, "target": 0},
//                    {"id": 6, "source": 3, "target": 0},
//                    {"id": 7, "source": 3, "target": 0},
//                    {"id": 8, "source": 3, "target": 0},
//                    {"id": 9, "source": 0, "target": 4},
//                    {"id": 10, "source": 0, "target": 4},
//                    {"id": 11, "source": 0, "target": 3}
//                ]
//            });
//            this.topo().adaptToContainer();
        },
        executeScript: function () {
            //this.topo().on('topologyGenerated', function () {
            try {
                if (this.script()) {
                    this.output('');
                    var result = this.script()(this.topo(),this);
                    if (result)
                        this.output(result);
                }
            }
            catch (err) {
                this.output(err.message);
                console.log(err.stack)
            }

            // })
        }
    }
});