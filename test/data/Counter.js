module("Counter");

test("Storage test", function () {
    var counter = new nx.data.Counter();
    var map = {
        "Null": null,
        "Undefined": undefined,
        "String0": "",
        "String": "hello",
        "BooleanTrue": true,
        "BooleanFalse": false,
        "Number0": 0,
        "Number": 100,
        "Object": {},
        "Array": [],
        "NXObject": new nx.Observable()
    };
    nx.each(map, function (value, key) {
        if (key === "Null" || key === "Undefined") {
            if (navigator && navigator.userAgent.indexOf("PhantomJS") >= 0) {
                return;
            }
        }
        ok(counter.getCount(value) === 0, "Initial count correct for " + key);
        counter.setCount(value, 100);
        ok(counter.getCount(value) === 100, "Set count correct for " + key);
        counter.setCount(value, -100);
        ok(counter.getCount(value) === -100, "Set negative count correct for " + key);
        counter.increase(value);
        ok(counter.getCount(value) === -99, "Increase count correct for " + key);
        counter.increase(value, 0);
        ok(counter.getCount(value) === -99, "Increase count 0 correct for " + key);
        counter.increase(value, 100);
        ok(counter.getCount(value) === 1, "Increase count 100 correct for " + key);
        counter.decrease(value);
        ok(counter.getCount(value) === 0, "Decrease count correct for " + key);
        counter.decrease(value, 0);
        ok(counter.getCount(value) === 0, "Decrease count 0 correct for " + key);
        counter.decrease(value, 100);
        ok(counter.getCount(value) === -100, "Decrease count 100 correct for " + key);
    });
});
