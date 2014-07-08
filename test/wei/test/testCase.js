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
        },
        tearDown: function (topo) {
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
        },
        tearDown: function (topo) {
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
        },
        tearDown:function(topo)
        {
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
        }
    },
    {
        name: 'API setData-empty/ nodes:[],links:[]',
        description: "set {'nodes':[],'links':[]}",
        script: function (topo) {
            topo.setData({"nodes": [], "links": []});
        },
        tearDown:function(topo)
        {
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
            topo.resize(500, 500);
//            topo.fit();
            return topo.width() + ',' + topo.height();
        },
        tearDown:function(topo)
        {
            topo.adaptToContainer();
        }
    },
    {
        name: 'API resize 1,1, fit',
        description: "resize the topo",
        script: function (topo) {
//            topo.adaptToContainer();
            topo.resize(1, 1);
            topo.fit();
            return topo.width() + ',' + topo.height();
        },
        tearDown:function(topo)
        {
            topo.adaptToContainer();
        }
    },
    {
        name: 'API resize 0,0/fit',
        description: "resize the topo",
        script: function (topo) {
//            topo.adaptToContainer();
            topo.resize(0, 0);
            topo.fit();
            return topo.width() + ',' + topo.height();
            //topo.adaptToContainer();
        },
        tearDown:function(topo)
        {
            topo.adaptToContainer();
        }
    },
    {
        name: 'API resize 3000,3000/no fit',
        description: "resize the topo",
        script: function (topo) {
//            topo.adaptToContainer();
            topo.resize(3000, 3000);
            topo.fit();
            return topo.width() + ',' + topo.height();
            //topo.adaptToContainer();
        },
        tearDown:function(topo)
        {
            topo.adaptToContainer();
        }
    },
    {
        name: 'API resize twice',
        description: "resize the topo twice",
        script: function (topo) {
//            topo.adaptToContainer();
            topo.resize(500, 500);
            topo.fit();
            topo.resize(600, 600);
            topo.fit();
            return topo.width() + ',' + topo.height();
            //topo.adaptToContainer();
        },
        tearDown:function(topo)
        {
            topo.adaptToContainer();
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
            var before = topo.getData().links.length
            console.log(topo.getData().links)
            topo.addLink({})
            return "before: "+before + " after: "+topo.getData().links.length
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
        },
        tearDown:function(topo)
        {
            topo.adaptToContainer();
        }
    },
    {
        name: 'API move-y',
        description: "move",
        script: function (topo) {
            topo.move(0, -100);
        },
        tearDown:function(topo)
        {
            topo.adaptToContainer();
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

        },
        tearDown:function(topo)
        {
            topo.adaptToContainer();
        }
    },
    {
        name: 'API move with duration 50000',
        description: "move",
        script: function (topo) {
            topo.move(-100, 0, 5);
        },
        tearDown:function(topo)
        {
            topo.adaptToContainer();
        }
    },
    {
        name: 'API move-big move',
        description: "move out of screen",
        script: function (topo) {
            console.log(1111)
            topo.move(-3000, -2000);
        },
        tearDown:function(topo)
        {
            topo.adaptToContainer();
        }
    },
    {
        name: 'API move-move continously',
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

        },
        tearDown:function(topo)
        {
            topo.adaptToContainer();
        }
    },
    {
        name: 'API zoom-placeholder',
        description: "move out of screen",
        script: function (topo) {
            console.log(1111)
            topo.move(-3000, -2000);
        }
    },
    {
        name: 'API addNode',
        description: "Add a correct Node",
        script: function (topo) {
            topo.addNode({"id": 6, "x": 190, "y": 150, "name": "qiaowei2"})
        }
    },
    {
        name: 'API addNode-empty',
        description: "Add a empty data for Node",
        script: function (topo) {
            topo.addNode({})
        }
    },
    {
        name: 'API Remove existing Link',
        description: "Remove a existing link",
        script: function (topo) {
            var before = topo.getLink(0).sourceNode().label();
            topo.removeLink(0);
            var after = topo.getLink(0);
            return 'result: before: '+before +' after: ' + after;
        },
        tearDown:function(topo)
        {
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
        }
    },
    {
        name: 'API Remove unexisting Link',
        description: "Remove a unexisting link",
        script: function (topo) {
            var before = topo.getLink(100);
            topo.removeLink(0);
            var after = topo.getLink(100);
            return 'result: before: '+before +' after: ' + after;
        }
    },
    {
        name: 'API Remove existing node',
        description: "Remove a existing node",
        script: function (topo) {
            topo.removeNode(0);
            var removed = (topo.getNode(0)===undefined);
            removed = removed && (topo.getLink(0)===undefined)
            return "can not get by getNode: " + removed + "//getData: node number+"+ topo.getData().nodes.length;
        },
        tearDown:function(topo)
        {
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
        }
    },
    {
        name: 'props Remove unexisting node',
        description: "Remove a unexisting node",
        script: function (topo) {
            topo.removeNode(100);
        }
    },
    {
        name: 'props add selectedNodes',
        description: "props add selectedNodes",
        script: function (topo) {
            topo.selectedNodes().add(topo.getNode(0));
            var data = topo.selectedNodes().toArray()
            var result="";
            for (var i=0;i<data.length;i++)
            {
                result = result + "//"+data[i].label();
            }
            return result;
        },
        tearDown:function(topo)
        {
            topo.selectedNodes().clear()
        }
    },
    {
        name: 'props add multiple selectedNodes',
        description: "props add multiple selectedNodes",
        script: function (topo) {
            topo.selectedNodes().add(topo.getNode(0));
            topo.selectedNodes().add(topo.getNode(1));
            topo.selectedNodes().add(topo.getNode(2));
            topo.selectedNodes().add(topo.getNode(3));
            var data = topo.selectedNodes().toArray()
            var result="";
            for (var i=0;i<data.length;i++)
            {
                result = result + "//"+data[i].label();
            }
            return result;
        },
        tearDown:function(topo)
        {
            topo.selectedNodes().clear()
        }
    },
    {
        name: 'props add multiple duplicate selectedNodes',
        description: "props add multiple duplicate selectedNodes",
        script: function (topo) {
            topo.selectedNodes().add(topo.getNode(0));
            topo.selectedNodes().add(topo.getNode(0));
            topo.selectedNodes().add(topo.getNode(0));
            topo.selectedNodes().add(topo.getNode(0));
            var data = topo.selectedNodes().toArray()
            var result="";
            for (var i=0;i<data.length;i++)
            {
                result = result + "//"+data[i].label();
            }
            return result;
        },
        tearDown:function(topo)
        {
            topo.selectedNodes().clear()
        }
    },
    {
        name: 'props add unexists to selectedNodes',
        description: "props add unexists to  selectedNodes",
        script: function (topo) {
            var node = topo.getNode(100)
            topo.selectedNodes().add(node);

            var data = topo.selectedNodes().toArray()
            var result="";
            for (var i=0;i<data.length;i++)
            {
                result = result + "//"+data[i].label();
            }
            return result;
        },
        tearDown:function(topo)
        {
            topo.selectedNodes().clear()
        }
    },
    {
        name: 'props selectedNodes clear',
        description: "props selectedNodes clear",
        script: function (topo) {
            topo.selectedNodes().add(topo.getNode(0));
            topo.selectedNodes().add(topo.getNode(1));
            topo.selectedNodes().add(topo.getNode(2));
            topo.selectedNodes().add(topo.getNode(3));
            topo.selectedNodes().clear();
            var data = topo.selectedNodes().toArray()
            var result="";
            for (var i=0;i<data.length;i++)
            {
                result = result + "//"+data[i].label();
            }
            return result;
        }
    },
    {
        name: 'props selectedNodes nothing to clear',
        description: "props selectedNodes nothing to clear",
        script: function (topo) {
            topo.selectedNodes().clear();
            topo.selectedNodes().clear();
            var data = topo.selectedNodes().toArray()
            var result="";
            for (var i=0;i<data.length;i++)
            {
                result = result + "//"+data[i].label();
            }
            return result;
        }
    },
    {
        name: 'props selectedNodes addRange',
        description: "props selectedNodes addRange",
        script: function (topo) {
            topo.selectedNodes().addRange([topo.getNode(0),topo.getNode(1),topo.getNode(2)])

            var data = topo.selectedNodes().toArray()
            var result="";
            for (var i=0;i<data.length;i++)
            {
                result = result + "//"+data[i].label();
            }
            return result;
        },
        tearDown:function(topo)
        {
            topo.selectedNodes().clear()
        }
    },
    {
        name: 'props selectedNodes addRange duplicate',
        description: "props selectedNodes addRange duplicate",
        script: function (topo) {
            topo.selectedNodes().addRange([topo.getNode(0),topo.getNode(0),topo.getNode(0)])

            var data = topo.selectedNodes().toArray()
            var result="";
            for (var i=0;i<data.length;i++)
            {
                result = result + "//"+data[i].label();
            }
            return result;
        },
        tearDown:function(topo)
        {
            topo.selectedNodes().clear()
        }
    },
    {
        name: 'API hignlight nodes only ',
        description: "API hignlight nodes only",
        script: function (topo) {
            nx.each(topo.layers(), function (layer) {
                layer.fadeOut(true);
            }, this);

            var nodeLayer = topo.getLayer('nodes');
            var nodeLayerHighlightElements = nodeLayer.highlightedElements();
            nodeLayerHighlightElements.add(topo.getNode(0));
            nodeLayerHighlightElements.add(topo.getNode(1));
        },
        tearDown:function(topo)
        {
            topo.recoverHighlight()
        }
    },
    {
        name: 'API highlightRelatedNode ',
        description: "API hignlight nodes only",
        script: function (topo) {
            topo.highlightRelatedNode(topo.getNode(1));
        },
        tearDown:function(topo)
        {
            topo.recoverHighlight()
        }
    },
    {
        name: 'API highlightRelatedNode in the nodeset ',
        description: "API hignlight nodes in the nodeset ",
        script: function (topo) {
            var nodeset = topo.aggregationNodes([topo.getNode(0),topo.getNode(1)]);
//            nodeset.collapsed(false);
            topo.highlightRelatedNode(topo.getNode(1));
        },
        tearDown:function(topo)
        {
            var nodesets = topo.getLayer('nodeSet').nodeSetDictionary().toObject();
            nx.each(nodesets,function(nodeset,id){
                topo.deleteNodeSet(id);
            })
            topo.recoverHighlight()
        }
    },
    {
        name: 'API highlightRelatedNode in the expanded nodeset',
        description: "API hignlight nodes in the expanded nodeset ",
        script: function (topo) {
            var nodeset = topo.aggregationNodes([topo.getNode(0),topo.getNode(1)]);
            nodeset.collapsed(false);
            topo.highlightRelatedNode(topo.getNode(1));
        },
        tearDown:function(topo)
        {
            var nodesets = topo.getLayer('nodeSet').nodeSetDictionary().toObject();
            nx.each(nodesets,function(nodeset,id){
                topo.deleteNodeSet(id);
            })

            topo.recoverHighlight()
        }
    },
    {
        name: 'API nodeLayerHighlightElements in the nodeset ',
        description: "API hignlight nodes in the nodeset ",
        script: function (topo) {
            var nodeset = topo.aggregationNodes([topo.getNode(0),topo.getNode(1)]);
//            nodeset.collapsed(false);
            nx.each(topo.layers(), function (layer) {
                layer.fadeOut(true);
            }, this);

            var nodeLayer = topo.getLayer('nodes');
            var nodeLayerHighlightElements = nodeLayer.highlightedElements();
            nodeLayerHighlightElements.add(topo.getNode(0));
            nodeLayerHighlightElements.add(topo.getNode(1));
        },
        tearDown:function(topo)
        {
            var nodesets = topo.getLayer('nodeSet').nodeSetDictionary().toObject();
            nx.each(nodesets,function(nodeset,id){
                topo.deleteNodeSet(id);
            })
            topo.recoverHighlight()
        }
    },
    {
        name: 'API nodeLayerHighlightElements in the expanded nodeset',
        description: "API hignlight nodes in the expanded nodeset ",
        script: function (topo) {
            var nodeset = topo.aggregationNodes([topo.getNode(0),topo.getNode(1)]);
            nodeset.collapsed(false);
            nx.each(topo.layers(), function (layer) {
                layer.fadeOut(true);
            }, this);

            var nodeLayer = topo.getLayer('nodes');
            var nodeLayerHighlightElements = nodeLayer.highlightedElements();
            nodeLayerHighlightElements.add(topo.getNode(0));
            nodeLayerHighlightElements.add(topo.getNode(1));
        },
        tearDown:function(topo)
        {
            var nodesets = topo.getLayer('nodeSet').nodeSetDictionary().toObject();
            nx.each(nodesets,function(nodeset,id){
                topo.deleteNodeSet(id);
            })
            topo.recoverHighlight()
        }
    },
    {
        name: 'API setData/fit twice',
        description: "setData/fit the topo twice",
        script: function (topo) {
            var data = {
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
            };
            topo.setData(data, function(){
                topo.fit()
            },this)
            topo.setData(data, function(){
                topo.fit()
            },this)
            return topo.width() + ',' + topo.height();
        },
        tearDown:function(topo)
        {
            topo.adaptToContainer();
        }
    }


]