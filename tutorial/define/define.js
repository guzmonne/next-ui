(function () {
    var log = function (inMsg) {
        if (console) {
            console.log(inMsg);
        }
    };
    nx.define("Foo", {});
    var foo = new Foo();

    /*
     define class with property and method
     */
    nx.define("Foo", {
        properties: {
            p1: {
                value: "p1-value"
            }
        },
        methods: {
            print: function (inMsg) {
                log(inMsg);
            }
        }
    });
    var foo = new Foo();
    log("p1:" + foo.p1());
    foo.p1("p1-value-new");
    log("p1:" + foo.p1());
    foo.print("hello");

    /*
     Share property,when property value type is Object
     */
    nx.define("Foo", {
        properties: {
            list: {
                value: []
            }
        }
    });
    var foo1 = new Foo();

    foo1.list().push(1);
    foo1.list().push(2);
    log("list:" + foo1.list());
    var foo2 = new Foo();
    log("list:" + foo2.list());

    /**
     * no shared property,option 1
     */
    nx.define("Foo", {
        properties: {
            list: {
                get: function () {
                    var list = this._list;
                    if (this._list === undefined) {
                        list = this._list = [];
                    }
                    return list;
                }
            }
        }
    });
    var foo1 = new Foo();

    foo1.list().push(1);
    foo1.list().push(2);
    log("list:" + foo1.list());
    var foo2 = new Foo();
    log("list:" + foo2.list());

    /**
     * no shared property,option 2
     */
    nx.define("Foo", {
        properties: {
            list: {
            }
        },
        methods: {
            init: function () {
                this.list([]);
            }
        }
    });
    var foo1 = new Foo();

    foo1.list().push(1);
    foo1.list().push(2);
    log("list:" + foo1.list());
    var foo2 = new Foo();
    log("list:" + foo2.list());

    /**
     * extend property get & set methods
     */
    nx.define("Foo", {
        properties: {
            p1: {
                value: "p1-value",
                get: function () {
                    this.print("get p1 method,value:" + this._p1);
                    return this._p1;
                }
            }
        },
        methods: {
            print: function (inMsg) {
                log(inMsg);
            }
        }
    });
    var foo = new Foo();
    foo.p1();
    foo.p1("p1-value-new")
    foo.p1();

    /**
     * extend class,overwrite or override
     */
    nx.define("Bar", Foo, {
        properties: {
            p1: {
                inherits: true,
                set: function (inValue) {
                    this.print("set p1 method,old value:" + this._p1 + ",new value:" + inValue);
                    this._p1 = inValue;
                }
            },
            p2: {
                value: "p2-value"
            }
        },
        methods: {
            print: function (inMsg) {
                log("logic 1");
                this.inherited(inMsg);
                log("logic 2");
            },
            hello: function () {
                log("hello");
            }
        }
    });
    var bar = new Bar();
    bar.p1();
    bar.p1("p1-value-new");
    log("p2:" + bar.p2());
    bar.p2("p2-value-new");
    log("p2:" + bar.p2());
    bar.hello();

    /**
     * Constructor
     */
    nx.define("Foo", {
        methods: {
            init: function () {
                log("I am foo");
            }
        }
    });
    var foo = new Foo();

    /**
     * Overwrite constructor
     */
    nx.define("Bar", Foo, {
        methods: {
            init: function () {
                log("I am bar");
            }
        }
    });

    var bar = new Bar();
    /**
     * Override constructor
     */
    nx.define("Bar", Foo, {
        methods: {
            init: function () {
                this.inherited();
                log("I am bar");
            }
        }
    });
    var bar = new Bar();

    /**
     * Mixin
     */
    nx.define("Foo", {
        methods: {
            method1: function () {
                log("method1")
            }
        }
    });
    nx.define("Bar", {
        methods: {
            method2: function () {
                log("method2")
            }
        }
    });
    nx.define("StitchingMonster", {
        mixins: [Foo, Bar],
        methods: {
            method3: function () {
                log("method3")
            }
        }
    });
    var sm = new StitchingMonster();
    sm.method1();
    sm.method2();
    sm.method3();
    log(sm instanceof StitchingMonster);
    log(sm instanceof Foo);
    log(sm instanceof Bar);

    log(nx.is(sm, StitchingMonster));
    log(nx.is(sm, Foo));
    log(nx.is(sm, Bar));
})();