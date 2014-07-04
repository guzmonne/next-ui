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
            topo.resize(500,500);
//            topo.fit();
            return topo.width() + ',' + topo.height();


        }
    },
    {
        name: 'API resize 1,1, fit',
        description: "resize the topo",
        script: function (topo) {
            topo.resize(1,1);
            topo.fit();
            return topo.width() + ',' + topo.height();
        }
    },
    {
        name: 'API resize 0,0/no fit',
        description: "resize the topo",
        script: function (topo) {
            topo.resize(0,0);
            topo.fit();
            return topo.width() + ',' + topo.height();
            //topo.adaptToContainer();
        }
    },
    {
        name: 'API resize 3000,3000/no fit',
        description: "resize the topo",
        script: function (topo) {
            topo.resize(3000,3000);
            //topo.fit();
            return topo.width() + ',' + topo.height();
            //topo.adaptToContainer();
        }
    },
    {
        name: 'API resize twice',
        description: "resize the topo twice",
        script: function (topo) {
            topo.resize(500,500);
            topo.setData({
                nodes: [
                    {"id": 0, "x": 410, "y": 100, "name": "12K-1"},
                    {"id": 1, "x": 410, "y": 280, "name": "12K-2"},
                    {"id": 2, "x": 660, "y": 280, "name": "Of-9k-03"},
                    {"id": 3, "x": 660, "y": 100, "name": "Of-9k-02"},
                    {"id": 4, "x": 180, "y": 190, "name": "Of-9k-01"}
                ],
                links: [
                    {"id": 0, "source": 0, "target": 1},
                    {"id": 1, "source": 1, "target": 2},
                    {"id": 2, "source": 1, "target": 3},
                    {"id": 3, "source": 4, "target": 1},
                    {"id": 4, "source": 2, "target": 3},
                    {"id": 5, "source": 2, "target": 0},
                    {"id": 6, "source": 3, "target": 0},
                    {"id": 7, "source": 3, "target": 0},
                    {"id": 8, "source": 3, "target": 0},
                    {"id": 9, "source": 0, "target": 4},
                    {"id": 10, "source": 0, "target": 4},
                    {"id": 11, "source": 0, "target": 3}
                ]
            });
            topo.adaptToContainer();
            topo.resize(600,600);
            topo.fit();
            return topo.width() + ',' + topo.height();
            //topo.adaptToContainer();
        }
    }
]