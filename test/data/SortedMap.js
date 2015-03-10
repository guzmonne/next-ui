module("SortedMap");

test("init", function () {
    var smap = new nx.data.SortedMap();
    ok(smap.length() === 0, "Inital length.");
});

test("init with data", function () {
    var smap = new nx.data.SortedMap([{
        key: "a",
        value: "A"
    }, {
        key: "A",
        value: "a"
    }]);
    ok(smap.length() === 2, "Initial length");
    ok(smap.getKeyAt(0) === "a" && smap.getKeyAt(1) === "A", "Keys");
    ok(smap.indexOf("a") === 0 && smap.indexOf("A") === 1, "Indices");
    ok(smap.getValueAt(0) === "A" && smap.getValueAt(1) === "a", "Indices' values");
    ok(smap.getValue("a") === "A" && smap.getValue("A") === "a", "Keys' values");
});

test("add", function () {
    var smap = new nx.data.SortedMap();
    var result;
    result = smap.add("A", "a");
    ok(result === "a", "Returned value at first time");
    ok(smap.length() === 1, "Length at first time");
    ok(smap.getValue("A") === "a");
    result = smap.add("a", "A", 0);
    ok(result === "A", "Returned value at second time");
    ok(smap.length() === 2, "Length at second time");
    ok(smap.getKeyAt(0) === "a" && smap.getKeyAt(1) === "A", "Keys");
    ok(smap.indexOf("a") === 0 && smap.indexOf("A") === 1, "Indices");
    ok(smap.getValueAt(0) === "A" && smap.getValueAt(1) === "a", "Indices' values");
    ok(smap.getValue("a") === "A" && smap.getValue("A") === "a", "Keys' values");
});

test("remove", function () {
    var smap = new nx.data.SortedMap([{
        key: "a",
        value: "A"
    }, {
        key: "A",
        value: "a"
    }]);
    var result = smap.remove("a");
    ok(result === "A", "Returned value");
    ok(smap.length() === 1, "Length");
    ok(smap.getKeyAt(0) === "A", "Key");
    ok(smap.indexOf("A") === 0, "Index");
    ok(smap.getValueAt(0) === "a", "Index's value");
    ok(smap.getValue("A") === "a", "Key's value");
});

test("removeAt", function () {
    var smap = new nx.data.SortedMap([{
        key: "a",
        value: "A"
    }, {
        key: "A",
        value: "a"
    }]);
    var result = smap.removeAt(0);
    ok(result === "A", "Returned value");
    ok(smap.length() === 1, "Length");
    ok(smap.getKeyAt(0) === "A", "Key");
    ok(smap.indexOf("A") === 0, "Index");
    ok(smap.getValueAt(0) === "a", "Index's value");
    ok(smap.getValue("A") === "a", "Key's value");
});

test("setValue", function () {
    var smap = new nx.data.SortedMap([{
        key: "a",
        value: "A"
    }, {
        key: "A",
        value: "a"
    }]);
    var result1 = smap.setValue("a", "a");
    var result2 = smap.setValue("A", "A");
    ok(result1 === "a" && result2 === "A", "Returned values");
    ok(smap.length() === 2, "Length");
    ok(smap.getKeyAt(0) === "a" && smap.getKeyAt(1) === "A", "Keys");
    ok(smap.indexOf("a") === 0 && smap.indexOf("A") === 1, "Indices");
    ok(smap.getValueAt(0) === "a" && smap.getValueAt(1) === "A", "Indices' values");
    ok(smap.getValue("a") === "a" && smap.getValue("A") === "A", "Keys' values");
});

test("setValueAt", function () {
    var smap = new nx.data.SortedMap([{
        key: "a",
        value: "A"
    }, {
        key: "A",
        value: "a"
    }]);
    var result1 = smap.setValueAt(0, "a");
    var result2 = smap.setValueAt(1, "A");
    ok(result1 === "a" && result2 === "A", "Returned values");
    ok(smap.length() === 2, "Length");
    ok(smap.getKeyAt(0) === "a" && smap.getKeyAt(1) === "A", "Keys");
    ok(smap.indexOf("a") === 0 && smap.indexOf("A") === 1, "Indices");
    ok(smap.getValueAt(0) === "a" && smap.getValueAt(1) === "A", "Indices' values");
    ok(smap.getValue("a") === "a" && smap.getValue("A") === "A", "Keys' values");
});

test("sort", function () {
    var smap = new nx.data.SortedMap([{
        key: "A",
        value: "a"
    }]);
    smap.setValue("A", "A");
    smap.add("a", "a");
    smap.sort(function (key1, val1, key2, val2) {
        return key1 < key2;
    });
    ok(smap.length() === 2, "Length");
    ok(smap.getKeyAt(0) === "a" && smap.getKeyAt(1) === "A", "Keys");
    ok(smap.indexOf("a") === 0 && smap.indexOf("A") === 1, "Indices");
    ok(smap.getValueAt(0) === "a" && smap.getValueAt(1) === "A", "Indices' values");
    ok(smap.getValue("a") === "a" && smap.getValue("A") === "A", "Keys' values");
});

test("toArray", function () {
    var smap = new nx.data.SortedMap([{
        key: "A",
        value: "a"
    }]);
    smap.setValue("A", "A");
    smap.add("a", "a");
    smap.sort(function (key1, val1, key2, val2) {
        return key1 < key2;
    });
    deepEqual(smap.toArray(), [{
        key: "a",
        value: "a"
    }, {
        key: "A",
        value: "A"
    }], "Returned array");
});

/*
 * Properties tests start here
 */

test("property:length", function () {
    expect(3, "Expected operations once each: add/remove/removeAt");
    var smap = new nx.data.SortedMap([{
        key: "A",
        value: "A"
    }]);
    smap.watch("length", function (pname, pvalue) {
        ok(true);
    });
    smap.setValue("A", "a");
    smap.add("a", "a", 0);
    smap.setValueAt(0, "A");
    smap.remove("A");
    smap.removeAt(0);
    smap.sort(function (key1, val1, key2, val2) {
        return key1 < key2;
    });
});

/*
 * Events tests start here
 */

test("event:add", function () {
    var events = [];
    var smap = new nx.data.SortedMap();
    smap.on("change", function (sender, evt) {
        events.push(evt);
    });
    smap.add("A", "a");
    smap.add("a", "A", 0);
    deepEqual(events, [{
        action: "add",
        index: 0,
        key: "A",
        value: "a"
    }, {
        action: "add",
        index: 0,
        key: "a",
        value: "A"
    }], "Events happened");
});

test("event:remove", function () {
    var events = [];
    var smap = new nx.data.SortedMap([{
        key: "a",
        value: "A"
    }, {
        key: "A",
        value: "a"
    }]);
    smap.on("change", function (sender, evt) {
        events.push(evt);
    });
    smap.removeAt(0);
    smap.remove("A");
    deepEqual(events, [{
        action: "remove",
        index: 0,
        key: "a",
        value: "A"
    }, {
        action: "remove",
        index: 0,
        key: "A",
        value: "a"
    }], "Events happened");
});

test("event:set", function () {
    var events = [];
    var smap = new nx.data.SortedMap([{
        key: "a",
        value: "a"
    }, {
        key: "A",
        value: "A"
    }]);
    smap.on("change", function (sender, evt) {
        events.push(evt);
    });
    smap.setValueAt(0, "A");
    smap.setValue("A", "a");
    deepEqual(events, [{
        action: "set",
        index: 0,
        key: "a",
        value: "A",
        former: "a"
    }, {
        action: "set",
        index: 1,
        key: "A",
        value: "a",
        former: "A"
    }], "Events happened");
});
