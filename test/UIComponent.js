module("Component.js", {teardown: function () {
    var comps = app.content();
    var child;
    for (var i = 0; i < comps.count(); i++) {
        child = comps.getItem(i);
        child.destroy();
    }
}
});


nx.define("wq.button", nx.ui.Component, {
    events:['aclick','bclick'],
    view: {
        tag: 'button',
        content: '{test}'

    },
    properties: {
        aclickflag: false,
        bclickflag: false,
        count: 0
    },
    methods: {
        init: function () {
            this.inherited();
            this.watch("aclickflag", function () {
                this.count(1);
            }, this);
        },
        getInnerComp: function () {
            return this._innerComp;
        },
        bclick: function () {
            this.bclickflag(true);
        }

    }
});

var input = nx.define(nx.ui.Component, {
    view: [
        {
            tag: 'input',
            name: 'txt',
            props: {value: '{#test}'}
        }
    ],
    properties: {
        test: 'abc'
    },
    methods: {
        getInnerComp: function () {
            return this._innerComp;
        }
    }
});

nx.define("wq.container", nx.ui.Component, {
    view: {
        props: {id: 'wqcontainer'},
        content: [
            {
                type: input
            },
            {
                name: "wqbtn",
                type: "wq.button",
                events: {
                    'aclick': function () {
                        this.aclickflag(true);
                    },
                    'bclick': function (){this.bclick();}
                }
            },
            {
                content: new input
            },
            {
                name: "emptyContainer",
                content: {
                    name: "wqbtn2",
                    type: "wq.button",
                    events: {
                        'aclick': function () {
                            this.aclickflag(true);
                        },
                        'bclick': function (){this.bclick();}
                    }
                }
            }
        ]
    },
    properties: {
        wprop: 'abc'
    },
    methods: {
        getInnerComp: function () {
            return this._innerComp;
        }
    }
});

nx.define("qw.template", nx.ui.Component, {
    view: [{
        tag: 'ul',
        name: 'test',
        props: {
            template: [
                {
                    tag: 'li',
                    props: {
                        style: 'color:red'
                    },
                    content: '{data1}'
                },
                {
                    tag: 'li',
                    content: '{data2}'
                }
            ],
            items: '{#items}'

        }
    }],
    properties: {
        items: null,
        test: 'abc'
    },
    methods:{
        refresh: function(){
            var tmp = this.items();
            this.items(null);
            this.items(tmp);

        }
    }
});

test('type logic', function () {
    var obj = new wq.container();
    obj.attach(app);
    obj.model({test: 'cc'});
    var count = 0;
    obj.watch("wprop", function () {
        count += 1;
    })
    obj.wprop("ccccc");
    strictEqual(count, 1, "notify in prop");
    obj.resolve('wqbtn').fire('aclick');
    ok(obj.resolve('wqbtn').aclickflag(), "invoke inner component event");
    strictEqual(obj.resolve('wqbtn').count(), 1, "notify func in the inner component");
    obj.resolve('wqbtn').fire('bclick');
    ok(obj.resolve('wqbtn').bclickflag(), "invoke inner component event");

    ok(!obj.resolve('wqbtn2').aclickflag(), "no conflict with other comp");
    strictEqual(obj.resolve('wqbtn2').count(), 0, "no conflict with other comp");
    ok(!obj.resolve('wqbtn2').bclickflag(), "no conflict with other comp");

    obj.destroy();
    strictEqual(obj.model(), null, "check model after destroy");
})


test('template1', function () {
    var obj = new qw.template();
    var data = [
        {data1: '1', data2: '2'},
        {data1: '3', data2: '4'}
    ];
    var data2 = [
        {data1: '5', data2: '6'},
        {data1: '7', data2: '8'}
    ];
    obj.attach(app);
    obj.items(data);
    obj.items(data2);
    deepEqual(obj.resolve('test').content().getItem(0).model(), {data1: '5', data2: '6'}, "check template model");
    strictEqual(obj.resolve('test').content().getItem(0).content().getItem(0).resolve("@root").$dom.outerHTML,'<li style="color:red">5</li>','');
    strictEqual(obj.resolve('test').content().getItem(0).content().getItem(1).resolve("@root").$dom.outerHTML,'<li>6</li>','');
    deepEqual(obj.resolve('test').content().getItem(1).model(), {data1: '7', data2: '8'}, "check template model");
    strictEqual(obj.resolve('test').content().getItem(1).content().getItem(0).resolve("@root").$dom.outerHTML,'<li style="color:red">7</li>','');
    strictEqual(obj.resolve('test').content().getItem(1).content().getItem(1).resolve("@root").$dom.outerHTML,'<li>8</li>','');
    strictEqual(obj.resolve('test').content().count(), 2, "check template with empty item");
    strictEqual(obj.resolve('test').resolve('@root').$dom.childElementCount, 4, "check dom");
    obj.destroy();
})

test('template2', function () {
    var obj = new qw.template();
    var data = [
        {data1: '1', data2: '2'}
    ];
    obj.attach(app)
    obj.items(data)
    deepEqual(obj.resolve('test').content().getItem(0).model(), {data1: '1', data2: '2'}, "check template with one item")
    equal(obj.resolve('test').content().count(), 1, "check content")
    equal(obj.resolve('test').resolve('@root').$dom.childElementCount, 2, "check dom")
    obj.destroy()
})

test('template3', function () {
    var obj = new qw.template()
    var data = []
    obj.attach(app)
    obj.items(data)
    equal(obj.resolve('test').content().count(), 0, "check template with empty item")
    equal(obj.resolve('test').resolve('@root').$dom.childElementCount, 0, "check dom")
    obj.destroy()
})


nx.define("qw.template2", nx.ui.Component, {
    view: [{
        tag: 'ul',
        name: 'test',
        props: {
            template: [
                {
                    tag: 'li',
                    props: {
                        style: 'color:red'
                    },
                    content: '{a.0}'
                },
                {
                    tag: 'li',
                    content: '{a.1}'
                }
            ],
            items: '{#items}'

        }
    }],
    properties: {
        items: null,
        test: 'abc'
    },
    method:{
        refresh: function(){
            var tmp = this.items;
            this.items(null);
            this.items(tmp);

        }
    }
});

test('template-array', function () {
    var obj = new qw.template2()
    var data = [{a:[1,2,3]},{a:[4,5,6]}]
    obj.attach(app)
    obj.items(data)
    equal(obj.resolve('test').content().count(), 2, "check template with array in object")
    deepEqual(obj.resolve('test').content().getItem(0).model(), {a:[1,2,3]}, "check template with one item")
    strictEqual(obj.resolve('test').content().getItem(0).content().getItem(0).resolve("@root").$dom.outerHTML,'<li style="color:red">1</li>','check dom')
    strictEqual(obj.resolve('test').content().getItem(0).content().getItem(1).resolve("@root").$dom.outerHTML,'<li>2</li>','')
    deepEqual(obj.resolve('test').content().getItem(1).model(), {a:[4,5,6]}, "check template with one item")
    strictEqual(obj.resolve('test').content().getItem(1).content().getItem(0).resolve("@root").$dom.outerHTML,'<li style="color:red">4</li>','check dom')
    strictEqual(obj.resolve('test').content().getItem(1).content().getItem(1).resolve("@root").$dom.outerHTML,'<li>5</li>','')
    equal(obj.resolve('test').resolve('@root').$dom.childElementCount, 4, "check dom")
    obj.destroy()
})

test('template-array2', function () {
    var obj = new qw.template2()
    var data = [{a:[1,2,3]}]
    obj.attach(app)
    obj.items(data)
    equal(obj.resolve('test').content().count(), 1, "check template with array in object")
    deepEqual(obj.resolve('test').content().getItem(0).model(), {a:[1,2,3]}, "check template with one item")
    equal(obj.resolve('test').content().count(), 1, "check content")
    equal(obj.resolve('test').resolve('@root').$dom.childElementCount, 2, "check dom")
    obj.destroy()
})

test('template-collection', function () {
    var obj = new qw.template()
    var data = new nx.data.Collection([{data1: '1', data2: '2'},{data1: '3', data2: '4'}])
    obj.attach(app)
    obj.items(data)
    deepEqual(obj.resolve('test').content().getItem(0).model(), {data1: '1', data2: '2'}, "check template model")
    strictEqual(obj.resolve('test').content().getItem(0).content().getItem(0).resolve("@root").$dom.outerHTML,'<li style="color:red">1</li>','')
    strictEqual(obj.resolve('test').content().getItem(0).content().getItem(1).resolve("@root").$dom.outerHTML,'<li>2</li>','')
    equal(obj.resolve('test').content().count(), 2, "check template count")
    equal(obj.resolve('test').resolve('@root').$dom.childElementCount, 4, "check dom")
    obj.destroy()
})
test('template-collection-add', function () {
    var obj = new qw.template()
    var data = new nx.data.Collection([{data1: '1', data2: '2'},{data1: '3', data2: '4'}])
    obj.attach(app)
    obj.items(data)
    equal(obj.resolve('test').content().count(), 2, "check template count")
    data.add({data1: '5', data2: '6'})
    //obj.items(data)
    obj.refresh()
    equal(obj.resolve('test').content().count(), 3, "check template count after intert")
    deepEqual(obj.resolve('test').content().getItem(2).model(), {data1: '5', data2: '6'}, "check template model")
    strictEqual(obj.resolve('test').content().getItem(2).content().getItem(0).resolve("@root").$dom.outerHTML,'<li style="color:red">5</li>','check dom after insert')
    strictEqual(obj.resolve('test').content().getItem(2).content().getItem(1).resolve("@root").$dom.outerHTML,'<li>6</li>','')
    equal(obj.resolve('test').resolve('@root').$dom.childElementCount, 6, "check dom")
    obj.destroy()
})

test('template-collection-insert', function () {
    var obj = new qw.template()
    var data = new nx.data.Collection([{data1: '1', data2: '2'},{data1: '3', data2: '4'}])
    obj.attach(app)
    obj.items(data)
    equal(obj.resolve('test').content().count(), 2, "check template count")
    data.insert({data1: '5', data2: '6'},2)
    //obj.items(data)
    obj.refresh()
    equal(obj.resolve('test').content().count(), 3, "check template count after intert")
    deepEqual(obj.resolve('test').content().getItem(2).model(), {data1: '5', data2: '6'}, "check template model")
    strictEqual(obj.resolve('test').content().getItem(2).content().getItem(0).resolve("@root").$dom.outerHTML,'<li style="color:red">5</li>','check dom after insert')
    strictEqual(obj.resolve('test').content().getItem(2).content().getItem(1).resolve("@root").$dom.outerHTML,'<li>6</li>','')
    equal(obj.resolve('test').resolve('@root').$dom.childElementCount, 6, "check dom")
    obj.destroy()
})

test('template-collection-remove', function () {
    var obj = new qw.template()
    var orignal_data = [{data1: '1', data2: '2'},{data1: '3', data2: '4'}]
    var data = new nx.data.Collection(orignal_data)
    obj.attach(app)
    obj.items(data)
    data.remove(orignal_data[0])
    //obj.items(data)
    obj.refresh()
    equal(obj.resolve('test').content().count(), 1, "check template count after remove")
    strictEqual(obj.resolve('test').content().getItem(0).content().getItem(0).resolve("@root").$dom.outerHTML,'<li style="color:red">3</li>','check dom after remove')
    strictEqual(obj.resolve('test').content().getItem(0).content().getItem(1).resolve("@root").$dom.outerHTML,'<li>4</li>','')
    equal(obj.resolve('test').resolve('@root').$dom.childElementCount, 2, "check dom")
    obj.destroy()
})

test('template-ObservableCollection', function () {
    var obj = new qw.template()
    var data = new nx.data.ObservableCollection([{data1: '1', data2: '2'},{data1: '3', data2: '4'}])
    obj.attach(app)
    obj.items(data)
    deepEqual(obj.resolve('test').content().getItem(0).model(), {data1: '1', data2: '2'}, "check template model")
    strictEqual(obj.resolve('test').content().getItem(0).content().getItem(0).resolve("@root").$dom.outerHTML,'<li style="color:red">1</li>','')
    strictEqual(obj.resolve('test').content().getItem(0).content().getItem(1).resolve("@root").$dom.outerHTML,'<li>2</li>','')
    equal(obj.resolve('test').content().count(), 2, "check template count")
    equal(obj.resolve('test').resolve('@root').$dom.childElementCount, 4, "check dom")
    obj.destroy()
})

test('template-ObservableCollection-insert', function () {
    var obj = new qw.template();
    var data = new nx.data.ObservableCollection([{data1: '1', data2: '2'},{data1: '3', data2: '4'}]);
    obj.attach(app);
    obj.items(data);
    equal(obj.resolve('test').content().count(), 2, "check template count");
    data.insert({data1: '5', data2: '6'},2);
    equal(obj.resolve('test').content().count(), 3, "check template count after intert");
    deepEqual(obj.resolve('test').content().getItem(2).model(), {data1: '5', data2: '6'}, "check template model");
    strictEqual(obj.resolve('test').content().getItem(2).content().getItem(0).resolve("@root").$dom.outerHTML,'<li style="color:red">5</li>','check dom after insert');
    strictEqual(obj.resolve('test').content().getItem(2).content().getItem(1).resolve("@root").$dom.outerHTML,'<li>6</li>','');
    equal(obj.resolve('test').resolve('@root').$dom.childElementCount, 6, "check dom");
    obj.destroy();
})


test('template-ObservableCollection-add', function () {
    var obj = new qw.template();
    var data = new nx.data.ObservableCollection([{data1: '1', data2: '2'},{data1: '3', data2: '4'}]);
    obj.attach(app);
    obj.items(data);
    equal(obj.resolve('test').content().count(), 2, "check template count");
    data.add({data1: '5', data2: '6'});
    equal(obj.resolve('test').content().count(), 3, "check template count after intert");
    deepEqual(obj.resolve('test').content().getItem(2).model(), {data1: '5', data2: '6'}, "check template model");
    strictEqual(obj.resolve('test').content().getItem(2).content().getItem(0).resolve("@root").$dom.outerHTML,'<li style="color:red">5</li>','check dom after insert');
    strictEqual(obj.resolve('test').content().getItem(2).content().getItem(1).resolve("@root").$dom.outerHTML,'<li>6</li>','');
    equal(obj.resolve('test').resolve('@root').$dom.childElementCount, 6, "check dom");
    obj.destroy();
})


test('template-ObservableCollection-insertRange', function () {
    var obj = new qw.template();
    var data = new nx.data.ObservableCollection();
    obj.attach(app);
    obj.items(data);
    equal(obj.resolve('test').content().count(), 0, "check template count");
    data.insertRange([{data1: '1', data2: '2'},{data1: '3', data2: '4'}],0);
    equal(obj.resolve('test').content().count(), 2, "check template count after intert");
    deepEqual(obj.resolve('test').content().getItem(1).model(), {data1: '3', data2: '4'}, "check template model");
    strictEqual(obj.resolve('test').content().getItem(1).content().getItem(0).resolve("@root").$dom.outerHTML,'<li style="color:red">3</li>','check dom after insert');
    strictEqual(obj.resolve('test').content().getItem(1).content().getItem(1).resolve("@root").$dom.outerHTML,'<li>4</li>','');
    equal(obj.resolve('test').resolve('@root').$dom.childElementCount, 4, "check dom");
    obj.destroy();
})

test('template-ObservableCollection-remove', function () {
    var obj = new qw.template();
    var orignal_data = [{data1: '1', data2: '2'},{data1: '3', data2: '4'}];
    var data = new nx.data.ObservableCollection(orignal_data);
    obj.attach(app);
    obj.items(data);
    data.remove(orignal_data[1]);
    equal(obj.resolve('test').content().count(), 1, "check template count after remove");
    equal(obj.resolve('test').content().getItem(0).content().getItem(0).resolve("@root").$dom.outerHTML,'<li style="color:red">1</li>','check dom after remove');
    equal(obj.resolve('test').content().getItem(0).content().getItem(1).resolve("@root").$dom.outerHTML,'<li>2</li>','');

    data.remove(orignal_data[0]);
    equal(obj.resolve('test').content().count(), 0, "check template count after remove all");
    equal(obj.resolve('test').resolve('@root').$dom.childElementCount, 0, "check dom");
    obj.destroy();
})

test('template-ObservableCollection-clear', function () {
    var obj = new qw.template();
    var orignal_data = [{data1: '1', data2: '2'},{data1: '3', data2: '4'}];
    var data = new nx.data.ObservableCollection(orignal_data);
    obj.attach(app);
    obj.items(data);
    equal(obj.resolve('test').content().count(), 2, "check template count");
    data.clear();
    equal(obj.resolve('test').content().count(), 0, "check template count after clear");
    equal(obj.resolve('test').resolve('@root').$dom.childElementCount, 0, "check dom");
    obj.destroy();
})


    var numsObj = nx.define(nx.Observable, {
        properties: {
            data1: {
                value: null
            },
            data2:{
                dependencies: ['data1'],
                get: function () {
                    return this._data1+1;
                }
            }
        },
        methods: {
            init: function (data) {
                this.inherited();
                this.sets(data);
            }
        }
    });

test('template-ObservableObject', function () {
    var num1 = new numsObj({data1: 1});
    var num2 = new numsObj({data1: 3});
    var col = new nx.data.ObservableCollection([num1, num2]);
    var obj = new qw.template();
    obj.attach(app);
    obj.items(col);
    //strictEqual(obj.resolve('test').content().getItem(0).model(),num1, "check template model")
    ok(obj.resolve('test').content().getItem(0).model()===num1, "check template model");
    strictEqual(obj.resolve('test').content().getItem(0).content().getItem(0).resolve("@root").$dom.outerHTML,'<li style="color:red">1</li>','');
    strictEqual(obj.resolve('test').content().getItem(0).content().getItem(1).resolve("@root").$dom.outerHTML,'<li>2</li>','');
    strictEqual(obj.resolve('test').content().count(), 2, "check template count");
    strictEqual(obj.resolve('test').resolve('@root').$dom.childElementCount, 4, "check dom");
    num1.data1(5);
    ok(obj.resolve('test').content().getItem(0).model()===num1, "check template model");
    strictEqual(obj.resolve('test').content().getItem(0).content().getItem(0).resolve("@root").$dom.outerHTML,'<li style="color:red">5</li>','check dom after object changed');
    strictEqual(obj.resolve('test').content().getItem(0).content().getItem(1).resolve("@root").$dom.outerHTML,'<li>6</li>','');
    obj.destroy();
})

test('template-ObservableObject-add', function () {
    var num1 = new numsObj({data1: 1});
    var num2 = new numsObj({data1: 3});
    var col = new nx.data.ObservableCollection([num1, num2]);
    var obj = new qw.template();
    obj.attach(app);
    obj.items(col);
    col.add({data1: '5', data2: '6'});
    deepEqual(obj.resolve('test').content().getItem(2).model(), {data1: '5', data2: '6'}, "check template model");
    strictEqual(obj.resolve('test').content().getItem(2).content().getItem(0).resolve("@root").$dom.outerHTML,'<li style="color:red">5</li>','check dom add json object');
    strictEqual(obj.resolve('test').content().getItem(2).content().getItem(1).resolve("@root").$dom.outerHTML,'<li>6</li>','');
    obj.destroy();
})



nx.define("qw.template_template", nx.ui.Component, {
    view: [{
        tag: 'ul',
        name: 'test',
        props: {
            template: [
                {
                    tag: 'li',
                    props: {
                        style: 'color:red'
                    },
                    events: {
                        'aclick': function (sender,event) {
                            this.owner().eventResult(this.model());
                        }
                    },
                    content: '{0}'
                },
                {
                    tag: 'li',
                    props: {
                        template:
                            {
                                tag: 'li',
                                props: {
                                    style: 'color:blue'
                                },
                                events: {
                                    'aclick': function () {
                                        this.owner().eventResult(this.model());
                                    }
                                },
                                content: '{}'
                            },
                        items: '{1}'
                    }
                }
            ],
            items: '{#items}'

        }
    }],
    properties: {
        items: null,
        test: 'abc',
        eventResult:''
    },
    method:{
        refresh: function(){
            var tmp = this.items;
            this.items(null);
            this.items(tmp);

        }
    }
});

test('template-template', function () {
    var obj = new qw.template_template();
    var data = [[1,['a1','a2','a3'],3],[4,['b1','b2','b3'],6]];
    obj.attach(app);
    obj.items(data);
    strictEqual(obj.resolve("test").content().getItem(0).content().getItem(1).content().getItem(2).resolve("@root").$dom.outerHTML, '<li style="color:blue">a3</li>');
    strictEqual(obj.resolve("test").content().getItem(1).content().getItem(1).content().getItem(2).resolve("@root").$dom.outerHTML, '<li style="color:blue">b3</li>');
    obj.resolve("test").content().getItem(1).content().getItem(1).content().getItem(2).fire('aclick');
    equal(obj.eventResult(),'b3','inner template event');
    obj.resolve("test").content().getItem(0).content().getItem(1).content().getItem(2).fire('aclick');
    equal(obj.eventResult(),'a3','inner template event');
    obj.resolve("test").content().getItem(0).content().getItem(0).fire('aclick');
    deepEqual(obj.eventResult(),[1,['a1','a2','a3'],3],'template event');
    obj.resolve("test").content().getItem(1).content().getItem(0).fire('aclick');
    deepEqual(obj.eventResult(),[4,['b1','b2','b3'],6],'template event');
    obj.destroy();
})



test('class', function () {
    var def = nx.define("qw.class", nx.ui.Component, {
        view: {
            tag:'button',
            props:{
                id:'comp',
                class:'a b c'
            },
            content:[
                {
                    tag:'span',
                    props:{class:['e', 'f', 'g', 1]}
                },
                {
                    tag:'span',
                    props:{class:'{class}'}
                },
                {
                    tag:'span',
                    props:{class:'{#class}'}
                }
            ]
        },
        properties: {
            class:'orignal'
        },
        method:{
        }
    });
    var obj = new def();
    obj.attach(app);
    obj.model({class:'test'});
    var comp_obj = obj.view();
    var dom = document.getElementById('comp');
    ok(comp_obj.dom().$dom == dom, 'check dom');
    equal(dom.getAttribute('class'), 'a b c', 'check class(String)');
    equal(dom.children[0].getAttribute('class'), 'e f g 1', 'check class(array)');
    equal(dom.children[1].getAttribute('class'), 'test', 'check class(model-single class)');

    obj.model({class:'a b c'});
    equal(dom.children[1].getAttribute('class'), 'a b c', 'check class(model class string multiple class)');
    obj.model({class:['e', 'f', 'g', 1]});
    equal(dom.children[1].getAttribute('class'), 'e f g 1', 'check class(model class array)');

    equal(dom.children[2].getAttribute('class'), 'orignal', 'check class(prop single string)');
    obj.class('a b c');
    equal(dom.children[2].getAttribute('class'), 'a b c', 'check class(prop single string)');
    obj.class(['e', 'f', 'g', 1]);
    equal(dom.children[2].getAttribute('class'), 'e f g 1', 'check class(prop array)');


    obj.destroy();
})




test('style', function () {
    var def = nx.define("qw.class", nx.ui.Component, {
        view: {
            tag:'button',
            props:{
                id:'comp',
                style:'width: 1px; height: 2px;'
            },
            content:[
                {
                    tag:'span',
                    props:{
                        style:{
                            width: '1px',
                            height: '2px'
                        }
                    }
                },
                {
                    tag:'span',
                    props:{style:'{style}'}
                },
                {
                    tag:'span',
                    props:{style:'{#style}'}
                },
                {
                    tag:'span',
                    props:{
                        style:{
                            width : '{#style.width}',
                            height : '{#style.height}'
                        }
                    }
                },
                {
                    tag:'span',
                    props:{
                        style:{
                            width : '{width}',
                            height : '{height}'
                        }
                    }
                }
            ]
        },
        properties: {
            style:'width: 0px;'
        },
        method:{
        }
    });

    var styleObj = nx.define(nx.Observable, {
        properties: {
            width: {
                value: null
            },
            height:{
                value: null
            }
        },
        methods: {
            init: function (data) {
                this.inherited();
                this.sets(data);
            }
        }
    });

    var obj = new def();
    obj.attach(app);
    obj.model({style:'width: 2px; height: 2px;'});
    var comp_obj = obj.view();
    var dom = document.getElementById('comp');
    ok(comp_obj.dom().$dom == dom, 'check dom');
    equal(dom.getAttribute('style').trim(), 'width: 1px; height: 2px;', 'check style(String)');
    equal(dom.children[0].getAttribute('style').trim(), 'width: 1px; height: 2px;', 'check style(array)');
    equal(dom.children[1].getAttribute('style').trim(), 'width: 2px; height: 2px;', 'check style(model-single class)');
    //model test
    obj.model({style:{
        width: '2px',
        height: '3px'
    }});
    equal(dom.children[1].getAttribute('style').trim(), 'width: 2px; height: 3px;', 'check style(model class array)');
    equal(dom.children[2].getAttribute('style').trim(), 'width: 0px;', 'check class(prop single string)');
    obj.style('width: 2px; height: 2px;');
    equal(dom.children[2].getAttribute('style').trim(), 'width: 2px; height: 2px;', 'check style(prop single string)');
    obj.style({
        width: '2px',
        height: '3px'
    });
    equal(dom.children[2].getAttribute('style').trim(), 'width: 2px; height: 3px;', 'check style(prop array)');
    //observable obj test
    obj.style(new styleObj({width:'11px',height:'20px'}))
    equal(dom.children[3].getAttribute('style').trim(), 'width: 11px; height: 20px;', 'check style observable');
    //model observable obj test
    obj.model(new styleObj({width:'11px',height:'20px'}));
    equal(dom.children[4].getAttribute('style').trim(), 'width: 11px; height: 20px;', 'check style model observable');
    obj.destroy();
})
