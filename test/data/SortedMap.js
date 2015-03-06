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
    ok(smap.length() === 2);
    ok(smap.getKeyAt(0) === "a" && smap.indexOf(1) === "A");
    ok(smap.indexOf("a") === 0 && smap.indexOf("A") === 1);
    ok(smap.getValueAt(0) === "A" && smap.getValueAt(1) === "a");
    ok(smap.getValue("a") === "A" && smap.getValue("A") === "a");
});

test("add", function () {
    var smap = new nx.data.SortedMap();
    smap.add("A", "a");
    ok(smap.length() === 1);
    ok(smap.getValue("A") === "a");
    var result = smap.add("a", "A", 0);
    ok(result === "A");
    ok(smap.length() === 2);
    ok(smap.getKeyAt(0) === "a" && smap.indexOf(1) === "A");
    ok(smap.indexOf("a") === 0 && smap.indexOf("A") === 1);
    ok(smap.getValueAt(0) === "A" && smap.getValueAt(1) === "a");
    ok(smap.getValue("a") === "A" && smap.getValue("A") === "a");
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
    ok(result === "A");
    ok(smap.length() === 1);
    ok(smap.getKeyAt(0) === "A");
    ok(smap.indexOf("A") === 0);
    ok(smap.getValueAt(0) === "a");
    ok(smap.getValue("A") === "a");
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
    ok(result === "A");
    ok(smap.length() === 1);
    ok(smap.getKeyAt(0) === "A");
    ok(smap.indexOf("A") === 0);
    ok(smap.getValueAt(0) === "a");
    ok(smap.getValue("A") === "a");
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
    ok(result1 === "a" && result2 === "A");
    ok(smap.length() === 2);
    ok(smap.getKeyAt(0) === "a" && smap.indexOf(1) === "A");
    ok(smap.indexOf("a") === 0 && smap.indexOf("A") === 1);
    ok(smap.getValueAt(0) === "a" && smap.getValueAt(1) === "A");
    ok(smap.getValue("a") === "a" && smap.getValue("A") === "A");
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
    ok(result1 === "a" && result2 === "A");
    ok(smap.length() === 2);
    ok(smap.getKeyAt(0) === "a" && smap.indexOf(1) === "A");
    ok(smap.indexOf("a") === 0 && smap.indexOf("A") === 1);
    ok(smap.getValueAt(0) === "a" && smap.getValueAt(1) === "A");
    ok(smap.getValue("a") === "a" && smap.getValue("A") === "A");
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
    ok(smap.length() === 2);
    ok(smap.getKeyAt(0) === "a" && smap.indexOf(1) === "A");
    ok(smap.indexOf("a") === 0 && smap.indexOf("A") === 1);
    ok(smap.getValueAt(0) === "a" && smap.getValueAt(1) === "A");
    ok(smap.getValue("a") === "a" && smap.getValue("A") === "A");
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
    }]);
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
    }]);
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
    }]);
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
    }]);
});
