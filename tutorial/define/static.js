(function (nx) {
    var log = function (inMsg) {
        if (console) {
            console.log(inMsg);
        }
    };

    /**
     * define static property and static method
     */
    nx.define("Foo", {
        statics: {
            CONSTANT_1: 1,
            hello: function () {
                log("hello");
            }
        },
        properties: {

        },
        methods: {
            hi: function () {
                Foo.hello();
            }
        }
    });
    log(Foo.CONSTANT_1);
    Foo.hello();
    var foo = new Foo();
    foo.hi();

    /**
     * define static class
     */
    nx.define("Foo", {
        static: true,
        statics: {
            CONSTANT_1: 1
        },
        properties: {
            p1: {
                value: "p1-value"
            },
            p2: {
            }
        },
        methods: {
            /**
             * only run once
             */
            init: function () {
                this.p2("p2-value");
            },
            hello: function () {
                log("hello");
            }
        }
    });
    log(Foo.CONSTANT_1);
    Foo.hello();
    log(Foo.p1());
    log(Foo.p2());
    Foo.p1("p1-value-new");
    log(Foo.p1());

    try {
        new Foo();
    } catch (e) {
        log(e);
    }


    debugger;
})(nx);