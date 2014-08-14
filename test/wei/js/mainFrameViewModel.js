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
            this.topo(topology);
            this.tcase(tcase);
            this.setData(tcase[0]);
            this.index(0);
        },
        log: function (value) {
            var temp = this.output();
            this.output(temp + '//' + value);
        },
        casePass: function (sender, event) {
            test(this.testname(), function () {
                ok(true);
            })
            this.executeTearDown()
            this.nextcase(this.index() + 1);
        },
        caseFail: function (sender, event) {
            test(this.testname(), function () {
                ok(false);
            })
            this.executeTearDown()
            this.nextcase(this.index() + 1);
        },
        executeTearDown: function () {
            if (this.tearDown()) {
                this.tearDown()(this.topo());
            }
        },
        nextcase: function (index) {
            if (index < this.tcase().length) {
                this.setData(this.tcase()[index])
                this.index(index);
            }
            else {
                app.fire('generateReport');
            }
        },
        jumpTo: function (data) {
            this.executeTearDown();
            this.script(null);
            this.setData(data);
            this.menuaction()
        },
        setData: function (data) {
            this.description(data.description);
            this.script(data.script);
            this.testname(data.name);
            this.tearDown(data.tearDown)
        },
        clearConsole: function () {
            this.output('');
        },
        menuaction: function () {
            if (this.menustatus() == 'btn-group')
                this.menustatus('btn-group open');
            else
                this.menustatus('btn-group');
        },
        executeScript: function () {
            try {
                if (this.script()) {
                    this.output('');
                    var result = this.script()(this.topo(), this);
                    if (result)
                        this.output(result);
                }
            }
            catch (err) {
                this.output(err.message);
                console.log(err.stack)
            }
        }
    }
});