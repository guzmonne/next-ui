module("nx.Observable",
    {setup: function () {

    }
    });


nx.define('observeObj1', nx.Observable, {
    properties: {
        prop1: {
            value: "hahah"
        },
        prop2: {
            value: "hahah"
        },
        b0: {
            value: "hahah"
        },
        b1: {
            value: "hahah"
        } ,
        b4: {
            value: "12"
            //binding:{direction:"<>"}
        }
    },
    methods: {
        testMethod: function () {
            return "testMethod"
        },
        b2: function () {
            return "testMethod"
        },
        b3: function () {
            return "testMethod"
        }

    }
});

nx.define('observeObj11', nx.Observable, {
    properties: {
        prop1: {
            value: "hahah"
        },
        prop2: {
            value: "hahah"
        }
    },
    methods: {
        testMethod: function () {
            return "testMethod"
        }

    }
});

nx.define('observeObj12', nx.Observable, {
    properties: {
        prop1: {
            value: "hahah"
        },
        prop2: {
            value: "hahah"
        }
    },
    methods: {
        testMethod: function () {
            return "testMethod"
        }

    }
});

nx.define('observeObj13', nx.Observable, {
    properties: {
        prop1: {
            value: "hahah"
        },
        prop2: {
            value: "hahah"
        }
    },
    methods: {
        testMethod: function () {
            return "testMethod"
        }

    }
});

nx.define('observeObj14', nx.Observable, {
    properties: {
        prop1: {
            value: "hahah"
        },
        prop2: {
            value: "hahah"
        }
    },
    methods: {
        testMethod: function () {
            return "testMethod"
        }

    }
});

nx.define('observeObj2', nx.Observable, {
    properties: {
        prop1: {
            value: "hahaha"
        },
        prop2: {
            value: "hahaha"
        }
    },
    methods: {
        init: function (indata) {
            this.inherited(indata);
            this.prop1("override_init")
        },
        set: function (value) {
            this.prop1(value)
        },
        get: function () {
            return this.prop1()
        },
        testMethod: function () {
            return "testMethod"
        }

    }
});

nx.define('observeObj3', nx.Observable, {
    properties: {
        prop1: {
            value: "hahaha"
        },
        prop2: {
            value: "hahaha"
        }
    },
    methods: {
        init: function (indata) {
            this.inherited(indata);
            this.prop1("override_init")
        },
        testMethod: function () {
            return "testMethod"
        }

    }
});


test('method get', function () {
    var testObj1 = new observeObj1;
    equal(testObj1.get("prop1"), "hahah")

    testObj1.set("prop1", "test")
    equal(testObj1.get("prop1"), "test")
});

test('method override get', function () {
    var testObj1 = new observeObj2;
    equal(testObj1.get("prop1"), "override_init")

});

test('method set', function () {
    var testObj1 = new observeObj1;
    equal(testObj1.set("prop1", null),undefined);
    equal(testObj1.get("prop1"), null)

    equal(testObj1.set("prop1", "test"),undefined)
    equal(testObj1.get("prop1"), "test")

    equal(testObj1.set("prop1", {test: true}),undefined)
    deepEqual(testObj1.get("prop1"), {test: true})
});

test('method override set', function () {
    var testObj1 = new observeObj2;
    testObj1.set("override_get")
    equal(testObj1.prop1(), "override_get")

    testObj1.set(null)
    equal(testObj1.prop1(), null)

    testObj1.set({test: true})
    deepEqual(testObj1.prop1(), {test: true})
});

test('method watch/unwatch', function () {
    var handler1=0;
    var handler2=0;
    var testObj1 = new observeObj11;
    //add 2 watch for prop1
    var watchh1,watchh2
    testObj1.watch("prop1", watchh1=function (name, value) {
        handler1+=1;
    });
    ok(testObj1.prop1._watched)
    equal(testObj1.__watchers__.prop1.length,1)

    testObj1.watch("prop1", watchh2=function(name, value) {
        handler2+=1;
    });
    equal(testObj1.__watchers__.prop1.length,2)

    //set prop1 to notify
    testObj1.set("prop1","test2")
    equal(handler2, 1)
    equal(handler1, 1)

    //unwatch
    testObj1.unwatch("prop1", watchh1)
    equal(testObj1.__watchers__.prop1.length,1)
    testObj1.unwatch("prop1", watchh2);
    equal(testObj1.__watchers__.prop1.length,0)

    //set prop1 again, no notify
    handler1=0;
    handler2=0;
    testObj1.set("prop1","test3")
    equal(handler2, 0)
    equal(handler1, 0)
});

test('method watch*/unwatch', function () {
    var handler1=0;
    var handler2=0;
    var watchh1,watchh2
    var testObj1 = new observeObj12;
    testObj1.watch("prop1", watchh1=function (name, value) {
        handler1+=1;
    });
    testObj1.watch("*", watchh2=function (name, value) {
        handler2+=1;
    });
    testObj1.set("prop1","test2")
    equal(handler2, 1)
    equal(handler1, 1)

    //unwatch prop1
    testObj1.unwatch("prop1", watchh1);

    //set prop1 again, * will notify
    handler1=0;
    handler2=0;
    testObj1.set("prop1","test3")
    equal(handler2, 1)
    equal(handler1, 0)

    //unwatch *
    testObj1.unwatch("*", watchh2);

    //set prop1 again, no notify
    handler1=0;
    handler2=0;
    testObj1.set("prop1","test4")
    equal(handler2, 0)
    equal(handler1, 0)
});

test('method watch*/unwatch', function () {
    var handler2=0;
    var watchh2
    var testObj1 = new observeObj13;

    testObj1.watch("*", watchh2=function (name, value) {
        handler2+=1;
    });
    testObj1.set("prop1","test2")
    equal(handler2, 1)

    testObj1.unwatch("*",watchh2)
    handler2=0;
    testObj1.set("prop1","test4")
    equal(handler2, 0)
});

test('method notify*', function () {
    var handler1=0;
    var handler2=0;
    var watchh1,watchh2
    var testObj1 = new observeObj14;
    testObj1.watch("prop1", watchh1=function (name, value) {
        handler1+=1;
    });
    testObj1.watch("prop1", watchh2=function (name, value) {
        handler2+=1;
    });
    testObj1.notify("*")
    equal(handler2, 1)
    equal(handler1, 1)
    testObj1.unwatch("prop1", watchh1);
    testObj1.unwatch("prop1", watchh2);
    handler1=0;
    handler2=0;
    testObj1.notify("*")
    equal(handler2, 0)
    equal(handler1, 0)
});

test('method setBinding', function () {
    var testObj1 = new observeObj1;
    testObj1.setBinding("b1","1,test=b1")
    equal("1",testObj1.getBinding("b1")._sourcePath)
    equal("b1",testObj1.getBinding("b1").test)

    testObj1.clearBinding("b1")
    testObj1.clearBinding("b2")
    testObj1.clearBinding("b3")
    equal(null, testObj1.__bindings__.b1,"remove Binding")

    var testObj2 = new observeObj3;
    testObj1.setBinding("b4","prop1,direction=<>",testObj2)
    equal("override_init",testObj1.b4(),"binding <>,init value")

    testObj1.b4("testReverseBinding")
    equal(testObj2.prop1(),"testReverseBinding","binding <>,target->source")
    equal(testObj1.b4(),"testReverseBinding", "binding <>, target->source")

    testObj2.prop1("testBindings")
    equal("testBindings",testObj2.prop1(),"binding <>, source->target")
    equal("testBindings",testObj1.b4(),"binding <>, source->source")
});

