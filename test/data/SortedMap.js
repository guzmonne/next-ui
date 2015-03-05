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
    smap.add("a", "A", 0);
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
    smap.remove("a");
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
    smap.removeAt(0);
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
    smap.setValue("a", "a");
    smap.setValue("A", "A");
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
    smap.setValueAt(0, "a");
    smap.setValueAt(1, "A");
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
