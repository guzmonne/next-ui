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
        name: 'API resize 500,500',
        description: "resize the topo",
        script: function (topo) {
            topo.resize(500,500);
//            topo.fit();
            return topo.width() + ',' + topo.height();
//            topo.adaptToContainer();

        }
    },
    {
        name: 'API resize 1,1',
        description: "resize the topo",
        script: function (topo) {
            topo.resize(1,1);
//            topo.fit();
            return topo.width() + ',' + topo.height();
            //topo.adaptToContainer();
        }
    },
    {
        name: 'API resize 0,0/no fit',
        description: "resize the topo",
        script: function (topo) {
            topo.resize(0,0);
//            topo.fit();
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
    }
]