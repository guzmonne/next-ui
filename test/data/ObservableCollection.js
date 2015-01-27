module("ObservableCollection.js");



test('func add', function () {
    var changeCount = 0;
    var notifyCount = 0;
    var col1 = new nx.data.ObservableCollection();
    col1.on("change", function () {
        changeCount += 1;
    })
    col1.watch("count", function () {
        notifyCount += 1;
    })
    col1.add(1)
    equal(col1.getItem(0), 1, "add number")
    equal(changeCount, 1)
    equal(notifyCount, 1)

    col1.add({
        x: 1,
        y: 2,
        z: 3
    })
    deepEqual(col1.getItem(1), {
        x: 1,
        y: 2,
        z: 3
    }, "add object")
    equal(changeCount, 2)
    equal(notifyCount, 2)

    var obj = function () {
        console.log(1)
    }
    col1.add(obj)
    equal(col1.getItem(2), obj, "add collection")
    equal(changeCount, 3)
    equal(notifyCount, 3)
});

test('func addRange', function () {
    var changeCount = 0;
    var notifyCount = 0;
    var col1 = new nx.data.ObservableCollection([1, 2]);
    col1.on("change", function (sender, data) {
        changeCount += 1;
        if (data.action == 'clear') {
            changeCount = 0;
            notifyCount = 0;
        }
    })
    col1.watch("count", function () {
        notifyCount += 1;
    })
    col1.addRange([3, 4])
    equal(col1.getItem(2), 3, "add array")
    equal(changeCount, 1)
    equal(notifyCount, 1)
    col1.clear()

    var col2 = new nx.data.Collection([5, 6])
    col1.addRange(col2)
    equal(col1.getItem(0), 5, "add collection")
    equal(changeCount, 1)
    equal(notifyCount, 1)
    col1.clear()
    //    var dict = new nx.data.Dictionary({x: 7, y: 8, z: 9});
    //    var col3 = new nx.data.Collection(dict);
    //    col1.addRange(col3)
    //    deepEqual(col1.getItem(0),{"key": "x","value": 7},"add dict")
});
//
test('func remove', function () {
    var changeCount = 0;
    var notifyCount = 0;
    var col1 = new nx.data.ObservableCollection([1, 2]);
    col1.on("change", function (sender, data) {
        changeCount += 1;
        if (data.action == 'clear') {
            changeCount = 0;
            notifyCount = 0;
        }
    })
    col1.watch("count", function () {
        notifyCount += 1;
    })

    col1.remove(2)
    equal(col1.getItem(0), 1, "verify data")
    equal(changeCount, 1)
    equal(notifyCount, 1)
    col1.clear()

    var obj = function () {
        console.log(1)
    }
    col1.add(obj)
    col1.remove(obj)
    equal(changeCount, 2)
    equal(notifyCount, 2)
    // remove more
    col1.addRange([1, 2, 3, 4]);
    deepEqual(col1.remove(1, 3, 4), [0, 2, 3], "verify removed indices");
    ok(col1.length() === 1 && col1.contains(2), "verify removed result");
    equal(changeCount, 4);
    equal(notifyCount, 4);
});

test('func insert', function () {
    var changeCount = 0;
    var notifyCount = 0;
    var col1 = new nx.data.ObservableCollection([1, 2, 3, 4]);
    col1.on("change", function (sender, data) {
        changeCount += 1;
        if (data.action == 'clear') {
            changeCount = 0;
            notifyCount = 0;
        }
    })
    col1.watch("count", function () {
        notifyCount += 1;
    })

    var obj = function () {
        console.log(1)
    }
    col1.insert(obj, 1)
    deepEqual(col1.getItem(1), obj, "verify insert obj")
    deepEqual(col1.getItem(2), 2, "verify next obj")
    equal(changeCount, 1)
    equal(notifyCount, 1)

    var data = col1.count()
    col1.insert(data, data)
    deepEqual(data, data, "verify append obj")
    equal(changeCount, 2)
    equal(notifyCount, 2)
});

test('func insertRange', function () {
    var changeCount = 0;
    var notifyCount = 0;
    var col1 = new nx.data.ObservableCollection([1, 2, 3, 4]);
    col1.on("change", function (sender, data) {
        changeCount += 1;
        if (data.action == 'clear') {
            changeCount = 0;
            notifyCount = 0;
        }
    })
    col1.watch("count", function () {
        notifyCount += 1;
    })
    col1.insertRange(['a1', 'a2', 'a3'], 2)
    equal(col1.getItem(2), 'a1', "insert range array")
    equal(col1.count(), 7, "insert range array")
    equal(changeCount, 1)
    equal(notifyCount, 1)

    col1.clear()
    col1.addRange([1, 2, 3, 4])
    equal(changeCount, 1)
    equal(notifyCount, 1)

    var col2 = new nx.data.Collection(['a1', 'a2', 'a3', 'a4'])
    col1.insertRange(col2, 2)
    equal(col1.getItem(2), 'a1', "insert range collection")
    equal(col1.count(), 8, "insert range collection")
    equal(changeCount, 2)
    equal(notifyCount, 2)
});

test('sort', function () {
    var changeCount = 0;
    var notifyCount = 0;
    var col1 = new nx.data.ObservableCollection([2, 5, 1, 3]);
    col1.on("change", function (sender, data) {
        changeCount += 1;
        if (data.action == 'clear') {
            changeCount = 0;
            notifyCount = 0;
        }
    })
    col1.watch("count", function () {
        notifyCount += 1;
    })
    col1.sort()
    equal(changeCount, 1)
    equal(notifyCount, 1)
    deepEqual(col1.toArray(), [1, 2, 3, 5], "verfy sort result")
});

test("unique", function () {
    var events = [];
    var coll = new nx.data.ObservableCollection([1, 2, 3, 3]);
    coll.on("change", function (coll, evt) {
        events.push(evt);
    });

    coll.unique(true);
    ok(coll.count() === 3, "Removed duplicated items");

    ok(coll.add(4) === 4, "Add item success");
    ok(coll.length() === 4, "Add item result correct");
    ok(coll.add(4) === null, "Add duplicated item failed");
    ok(coll.length() === 4, "Add duplicated item result correct");
    ok(JSON.stringify(coll.addRange([4, 5, 6])) === JSON.stringify([5, 6]), "Duplicated item removed when adding range");
    ok(coll.length() === 6, "Add range result correct");

    ok(coll.insert(0, 0) === 0, "Insert item success");
    ok(coll.length() === 7, "Insert item result correct");
    ok(coll.insert(0, 0) === null, "Insert duplicated item failed");
    ok(coll.length() === 7, "Insert duplicated item result correct");
    ok(JSON.stringify(coll.insertRange([-1, -2, 0], 0)) === JSON.stringify([-1, -2]), "Duplicated item removed when inserting range");
    ok(coll.length() === 9, "Insert range result correct");

    ok(JSON.stringify(events) === JSON.stringify([{
        action: "remove",
        items: [3],
        index: 3
    }, {
        action: "add",
        items: [4]
    }, {
        action: "add",
        items: [5, 6]
    }, {
        action: "add",
        items: [0],
        index: 0
    }, {
        action: "add",
        items: [-1, -2],
        index: 0
    }]), "Events notified correct");
});

test("monitor", function () {
    expect(2);
    var coll = new nx.data.ObservableCollection();
    var coll1 = new nx.data.ObservableCollection();
    var coll2 = new nx.data.ObservableCollection();
    coll.add(coll1);
    var watcher = coll.monitor(function (item) {
        ok(item === coll1, "Exist item processed");
        var res = item.monitor(function (item) {
            ok(item === 1, "New item processed");
        });
        return res.release;
    });
    coll1.add(1);
    watcher.release();
    // not notify anything from here
    coll.add(coll2);
    coll1.add(2);
    coll2.add(2);
});
