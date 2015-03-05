module("SortedMap");

test("init", function () {
    var smap = new nx.data.SortedMap();
    ok(smap.length() === 0, "Inital length.");
});

test("add", function () {
    var smap = new nx.data.SortedMap();
    smap.add("a", "A");
    ok(smap.getValue("a") === "A");
    smap.add("A", "a", 0);
    ok(smap.indexOf("A") === 0 && smap.indexOf("a") === 1);
    ok(smap.getValueAt(0) === "a" && smap.getValueAt(1) === "A");
    ok(smap.getValue("a") === "A" && smap.getValue("A") === "a");
});
