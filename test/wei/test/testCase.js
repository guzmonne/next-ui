module("topoCase")
var topoCase = [
    {
        name: 'API getData()',
        description: "this test is to check the getData API",
        script: function (topo) {
            return(JSON.stringify(topo.getData()));
        }

    },
    {
        name: 'API setData-empty',
        description: "set empty data",
        script: function (topo) {
            topo.setData({});
        }
    },
    {
        name: 'API setData-one node only',
        description: "set data, only one node only and link to an unexisting node",
        script: function (topo) {
            topo.setData({nodes: [
                {"id": 0, "x": 410, "y": 100, "name": "12K-1"}
            ], links: [
                {"source": 0, "target": 1}
            ]})
        }
    },
    {
        name: 'API setData-one node only',
        description: "set data, only one node only and link not correct",
        script: function (topo) {
            topo.setData({nodes: [
                {"id": 0, "x": 410, "y": 100, "name": "12K-1"}
            ], links: [
                {"source": 1, "target": 2}
            ]})
        }
    },
    {
        name: 'API setData-empty/ nodes:[],links:[]',
        description: "set {'nodes':[],'links':[]}",
        script: function (topo) {
            topo.setData({"nodes": [], "links": []});
        }
    },
    {
        name: 'API getLink',
        description: "get link",
        script: function (topo) {
            return 'source: ' + topo.getLink(0).sourceNode().label() + ' dest: ' + topo.getLink(0).targetNode().label() + '// expect source 12k-1 dest 12k-2';
        }
    },
    {
        name: 'NG-API getLink',
        description: "get link which is not exists",
        script: function (topo) {
            return topo.getLink(15) + '//expect undefined';
        }
    },
    {
        name: 'API getNode',
        description: "get an existing node",
        script: function (topo) {
            return topo.getNode(0).label() + '//expect 12k-1';
        }
    },
    {
        name: 'NG-API getNode',
        description: "get an unexisting node",
        script: function (topo) {
            return topo.getNode(10) + '//expect undefined';
        }
    },
    {
        name: 'API resize 500,500/no fit',
        description: "resize the topo",
        script: function (topo) {
            topo.adaptToContainer();
            topo.resize(500, 500);
//            topo.fit();
            return topo.width() + ',' + topo.height();


        }
    },
    {
        name: 'API resize 1,1, fit',
        description: "resize the topo",
        script: function (topo) {
            topo.adaptToContainer();
            topo.resize(1, 1);
            topo.fit();
            return topo.width() + ',' + topo.height();
        }
    },
    {
        name: 'API resize 0,0/fit',
        description: "resize the topo",
        script: function (topo) {
            topo.adaptToContainer();
            topo.resize(0, 0);
            topo.fit();
            return topo.width() + ',' + topo.height();
            //topo.adaptToContainer();
        }
    },
    {
        name: 'API resize 3000,3000/no fit',
        description: "resize the topo",
        script: function (topo) {
            topo.adaptToContainer();
            topo.resize(3000, 3000);
            topo.fit();
            return topo.width() + ',' + topo.height();
            //topo.adaptToContainer();
        }
    },
    {
        name: 'API resize twice',
        description: "resize the topo twice",
        script: function (topo) {
            topo.adaptToContainer();
            topo.resize(500, 500);
            topo.fit();
            topo.resize(600, 600);
            topo.fit();
            return topo.width() + ',' + topo.height();
            //topo.adaptToContainer();
        }
    },
    {
        name: 'API eachlink',
        description: "eachlink",
        script: function (topo) {
            var output = "";
            topo.eachLink(function (link) {
                output = output + '//id: ' + link.id() + " source: " + link.sourceNode().label() + " dest: " + link.targetNode().label() + ' ';

            })
            return output;
        }
    },
    {
        name: 'API insertData',
        description: "insert a normal data",
        script: function (topo) {
            topo.insertData({
                nodes: [
                    {"id": 5, "x": 500, "y": 500, "name": "qiaowei"}
                ],
                links: [
                    {"id": 12, "source": 0, "target": 5}
                ]
            })
        }
    },
    {
        name: 'API insertData({})',
        description: "insert a {} data",
        script: function (topo) {
            topo.insertData({});
        }
    },
    {
        name: 'API insertData(nodes: [],links: [])',
        description: "insert a nodes: [],links: [] data",
        script: function (topo) {
            topo.insertData({nodes: [], links: []});
        }
    },
    {
        name: 'API add link, normal data',
        description: "add a link, from 9k-01 to 9k-03",
        script: function (topo) {
            topo.addLink({"id": 12, "source": 4, "target": 2})
        }
    },
    {
        name: 'API add link, normal data, mulitple times',
        description: "add a link, from 9k-01 to 9k-03",
        script: function (topo) {
            topo.addLink({"id": 12, "source": 4, "target": 2})
            topo.addLink({"id": 13, "source": 4, "target": 2})
            topo.addLink({"id": 14, "source": 4, "target": 2})
            topo.addLink({"id": 15, "source": 4, "target": 2})
            topo.addLink({"id": 16, "source": 4, "target": 2})
            topo.addLink({"id": 17, "source": 4, "target": 2})
            topo.addLink({"id": 18, "source": 4, "target": 2})
            return topo.getData().links.length + "expect: 19"
        }
    },
    {
        name: 'API add link, null data',
        description: "add a link, data is {}",
        script: function (topo) {
            topo.addLink({})
            return topo.getData().links.length
        }
    },
    {
        name: 'API add link, dest node not exists',
        description: "add a link, dest node not exists",
        script: function (topo) {
            topo.addLink({"id": 12, "source": 4, "target": 5})
            return topo.getData().links.length
        }
    },
    {
        name: 'API add link, src node not exists',
        description: "add a link,src node not exist",
        script: function (topo) {
            topo.addLink({"id": 12, "source": 5, "target": 4})
            return topo.getData().links.length
        }
    },
    {
        name: 'API eachNode',
        description: "eachNode",
        script: function (topo) {
            var output = "";
            topo.eachNode(function (node) {
                output = output + '//id: ' + node.id() + " label : " + node.label() + ' ';

            });
            return output;
        }
    },
    {
        name: 'API move-x',
        description: "move",
        script: function (topo) {
            topo.move(-100, 0);
        }
    },
    {
        name: 'API move-y',
        description: "move",
        script: function (topo) {
            topo.move(0, -100);
        }
    },
    {
        name: 'API move-2 moves',
        description: "move x first, then move y",
        script: function (topo) {
            topo.move(-100, 0);
            setTimeout(function () {
                topo.move(0, -100);
            }, 1000)

        }
    },
    {
        name: 'API move with duration 50000',
        description: "move",
        script: function (topo) {
            topo.move(-100, 0, 5);
        }
    },
    {
        name: 'API move-big move',
        description: "move out of screen",
        script: function (topo) {
            console.log(1111)
            topo.move(-3000, -2000);
        }
    },
    {
        name: 'API move-monve continously',
        description: "",
        script: function (topo) {
            setTimeout(function () {
                topo.move(-100, 0);
            }, 600)
            setTimeout(function () {
                topo.move(-100, 0);
            }, 600)
            setTimeout(function () {
                topo.move(-100, 0);
            }, 600)

        }
    },
    {
        name: 'API zoom-placeholder',
        description: "move out of screen",
        script: function (topo) {
            console.log(1111)
            topo.move(-3000, -2000);
        }
    }

]