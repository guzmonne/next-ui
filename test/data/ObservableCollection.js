module("ObservableCollection.js");



test('func add', function () {
    var changeCount=0;
    var notifyCount=0;
    var col1 = new nx.data.ObservableCollection();
    col1.on("change",function (){
        changeCount+=1;
    })
    col1.watch("count",function (){
        notifyCount+=1;
    })
    col1.add(1)
    equal(col1.getItem(0),1, "add number")
    equal(changeCount,1)
    equal(notifyCount,1)

    col1.add({x:1,y:2,z:3})
    deepEqual(col1.getItem(1),{x:1,y:2,z:3},"add object")
    equal(changeCount,2)
    equal(notifyCount,2)

    var obj =  function(){console.log(1)}
    col1.add(obj)
    equal(col1.getItem(2),obj,"add collection")
    equal(changeCount,3)
    equal(notifyCount,3)
});

test('func addRange', function () {
    var changeCount=0;
    var notifyCount=0;
    var col1 = new nx.data.ObservableCollection([1, 2]);
    col1.on("change",function (sender,data){
        changeCount+=1;
        if(data.action == 'clear')
        {
            changeCount = 0;
            notifyCount = 0;
        }
    })
    col1.watch("count",function (){
        notifyCount+=1;
    })
    col1.addRange([3,4])
    equal(col1.getItem(2),3, "add array")
    equal(changeCount,1)
    equal(notifyCount,1)
    col1.clear()

    var col2 = new nx.data.Collection([5, 6])
    col1.addRange(col2)
    equal(col1.getItem(0),5, "add collection")
    equal(changeCount,1)
    equal(notifyCount,1)
    col1.clear()
//    var dict = new nx.data.Dictionary({x: 7, y: 8, z: 9});
//    var col3 = new nx.data.Collection(dict);
//    col1.addRange(col3)
//    deepEqual(col1.getItem(0),{"key": "x","value": 7},"add dict")
});
//
test('func remove', function () {
    var changeCount=0;
    var notifyCount=0;
    var col1 = new nx.data.ObservableCollection([1, 2]);
    col1.on("change",function (sender,data){
        changeCount+=1;
        if(data.action == 'clear')
        {
            changeCount = 0;
            notifyCount = 0;
        }
    })
    col1.watch("count",function (){
        notifyCount+=1;
    })

    col1.remove(2)
    equal(col1.getItem(0),1,"verify data")
    equal(changeCount,1)
    equal(notifyCount,1)
    col1.clear()

    var obj =  function(){console.log(1)}
    col1.add(obj)
    col1.remove(obj)
    equal(changeCount,2)
    equal(notifyCount,2)
});

test('func insert', function () {
    var changeCount=0;
    var notifyCount=0;
    var col1 = new nx.data.ObservableCollection([1, 2, 3, 4]);
    col1.on("change",function (sender,data){
        changeCount+=1;
        if(data.action == 'clear')
        {
            changeCount = 0;
            notifyCount = 0;
        }
    })
    col1.watch("count",function (){
        notifyCount+=1;
    })

    var obj =  function(){console.log(1)}
    col1.insert(obj, 1)
    deepEqual(col1.getItem(1),obj,"verify insert obj")
    deepEqual(col1.getItem(2),2,"verify next obj")
    equal(changeCount,1)
    equal(notifyCount,1)

    var data = col1.count()
    col1.insert(data, data)
    deepEqual(data,data,"verify append obj")
    equal(changeCount,2)
    equal(notifyCount,2)
});

test('func insertRange', function () {
    var changeCount=0;
    var notifyCount=0;
    var col1 = new nx.data.ObservableCollection([1, 2, 3, 4]);
    col1.on("change",function (sender,data){
        changeCount+=1;
        if(data.action == 'clear')
        {
            changeCount = 0;
            notifyCount = 0;
        }
    })
    col1.watch("count",function (){
        notifyCount+=1;
    })
    col1.insertRange(['a1','a2','a3'], 2)
    equal(col1.getItem(2),'a1',"insert range array")
    equal(col1.count(),7,"insert range array")
    equal(changeCount,1)
    equal(notifyCount,1)

    col1.clear()
    col1.addRange([1,2, 3, 4])
    equal(changeCount,1)
    equal(notifyCount,1)

    var col2 = new nx.data.Collection(['a1', 'a2', 'a3', 'a4'])
    col1.insertRange(col2, 2)
    equal(col1.getItem(2),'a1',"insert range collection")
    equal(col1.count(),8,"insert range collection")
    equal(changeCount,2)
    equal(notifyCount,2)
});

test('sort', function () {
    var changeCount=0;
    var notifyCount=0;
    var col1 = new nx.data.ObservableCollection([2, 5, 1, 3]);
    col1.on("change",function (sender,data){
        changeCount+=1;
        if(data.action == 'clear')
        {
            changeCount = 0;
            notifyCount = 0;
        }
    })
    col1.watch("count",function (){
        notifyCount+=1;
    })
    col1.sort()
    equal(changeCount,1)
    equal(notifyCount,1)
    deepEqual(col1.toArray(), [1,2,3,5], "verfy sort result")
});
