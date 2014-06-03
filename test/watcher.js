module("class.js");

test('property watcher', function () {
    var reg = {};
    var WatcherClass = nx.define(nx.Observable, {
        properties: {
            prop1: {
                value: "hello",
                watcher: "_watcher"
            },
            prop2: {
                watcher: function (n, v) {
                    if (n == "prop2") {
                        if (v === undefined) {
                            reg.initInline = true;
                        }
                        else {
                            reg.changeInline = true;
                        }
                    }
                }
            }
        },
        methods: {
            _watcher: function (n, v) {
                if (n == "prop1") {
                    if (v === "hello") {
                        reg.initMethod = true;
                    }
                    else {
                        reg.changeMethod = true;
                    }
                }
            }
        }
    });
    var a = new WatcherClass();
    a.prop1(100);
    a.prop2(100);
    ok(reg.initInline, "property inline watcher initial called");
    ok(reg.changeInline, "property inline watcher triggerd");
    ok(reg.initMethod, "property method watcher initial called");
    ok(reg.changeMethod, "property method watcher triggerd");
});
