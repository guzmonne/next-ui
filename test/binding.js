module("binding.js");

nx.define('test.SimpleBindingClass', nx.Observable, {
    properties: {
        prop: 10,
        prop1: {
            value: nx.keyword.binding("prop")
        },
        prop2: {
            value: nx.keyword.binding("prop1", function (prop1) {
                return prop1 * 2;
            })
        },
        prop3: {
            value: nx.keyword.binding({
                source: "prop1, prop2",
                callback: function (prop1, prop2) {
                    return prop1 + prop2;
                }
            })
        }
    }
});

test('keyword binding', function () {
    var a = new test.SimpleBindingClass();
    ok(a.prop1() === 10, "initial binding single");
    ok(a.prop2() === 20, "initial binding with argument");
    ok(a.prop3() === 30, "initial binding with configure");
    a.prop(20);
    ok(a.prop1() === 20, "binding single");
    ok(a.prop2() === 40, "binding with argument");
    ok(a.prop3() === 60, "binding with configure");
});

nx.define("test.PathBindingClass", nx.Observable, {
    properties: {
        simple: {
            value: function () {
                return new test.SimpleBindingClass();
            }
        },
        prop1: {
            value: nx.keyword.binding("simple.prop")
        },
        prop2: {
            value: nx.keyword.binding("simple.prop", function (prop1) {
                return prop1 * 2;
            })
        },
        prop3: {
            value: nx.keyword.binding({
                source: "simple.prop1, simple.prop2",
                callback: function (prop1, prop2) {
                    return prop1 + prop2;
                }
            })
        }
    }
});

test('keyword binding with path', function () {
    var a = new test.PathBindingClass();
    ok(a.prop1() === 10, "initial binding single");
    ok(a.prop2() === 20, "initial binding with argument");
    ok(a.prop3() === 30, "initial binding with configure");
    a.simple().prop(20);
    ok(a.prop1() === 20, "binding single");
    ok(a.prop2() === 40, "binding with argument");
    ok(a.prop3() === 60, "binding with configure");
});

nx.define("test.DependBindingClass", nx.Observable, {
    properties: {
        simple: {
            value: function () {
                return new test.SimpleBindingClass();
            }
        },
        prop1: {
            dependencies: "simple.prop"
        },
        prop2: {
            dependencies: ["simple.prop1"],
            update: function (prop1) {
                ok(true, "update will surely be called");
            },
            value: function (prop1) {
                return prop1 * 2;
            }
        },
        prop3: {
            dependencies: ["simple.prop1", "simple.prop2"],
            update: function (prop1, prop2) {
                this.prop3(prop1 + prop2);
            }
        }
    }
});

test('keyword binding dependencies with path', function () {
    var a = new test.DependBindingClass();
    ok(a.prop1() === 10, "initial binding single");
    ok(a.prop2() === 20, "initial binding with argument");
    ok(a.prop3() === 30, "initial binding with configure");
    a.simple().prop(20);
    ok(a.prop1() === 20, "binding single");
    ok(a.prop2() === 40, "binding with argument");
    ok(a.prop3() === 60, "binding with configure");
});
