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
        name: 'API setData-empty/ nodes:[],links:[]',
        description: "set {'nodes':[],'links':[]}",
        script: function (topo) {
            topo.setData({"nodes": [], "links": []});
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
        tearDown: function (topo) {
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
        tearDown: function (topo) {
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
        tearDown: function (topo) {
            topo.adaptToContainer();
        }
    },
    {
        name: 'API resize 3000,3000/no fit',
        description: "resize the topo",
        script: function (topo) {
//            topo.adaptToContainer();
            topo.resize(3000, 3000);
//            topo.fit();
            return topo.width() + ',' + topo.height();
            //topo.adaptToContainer();
        },
        tearDown: function (topo) {
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
        tearDown: function (topo) {
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
            topo.addLink({"id": 100, "source": 4, "target": 2})
        }
    },
    {
        name: 'API add link, normal data, mulitple times',
        description: "add a link, from 9k-01 to 9k-03",
        script: function (topo) {
            topo.addLink({"id": 101, "source": 4, "target": 2})
            topo.addLink({"id": 102, "source": 4, "target": 2})
            topo.addLink({"id": 103, "source": 4, "target": 2})
            topo.addLink({"id": 104, "source": 4, "target": 2})
            topo.addLink({"id": 105, "source": 4, "target": 2})
            topo.addLink({"id": 106, "source": 4, "target": 2})
            topo.addLink({"id": 107, "source": 4, "target": 2})
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
            return "before: " + before + " after: " + topo.getData().links.length
        }
    },
    {
        name: 'API add link, link id exists',
        description: "add a link, data is {}",
        script: function (topo) {
            topo.addLink({"id": 1, "source": 4, "target": 2});
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
        name: 'API add link, dest node not exists',
        description: "add a link, dest node not exists",
        script: function (topo) {
            topo.addLink({"id": 108, "source": 4, "target": 500})
            return topo.getData().links.length
        }
    },
    {
        name: 'API add link, src node not exists',
        description: "add a link,src node not exist",
        script: function (topo) {
            topo.addLink({"id": 109, "source": 500, "target": 4})
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
        tearDown: function (topo) {
//            console.time('xx');
//            console.log(topo.stage().matrixObject().toString());
            topo.fit(function () {
            }, this, 100);
//            console.log(topo.stage().matrixObject().toString());
        }
    },
    {
        name: 'API move-y',
        description: "move",
        script: function (topo) {
//            console.log(topo.stage().matrixObject().toString());
            topo.move(0, -100);
//            console.log(topo.stage().matrixObject().toString());
//            console.timeEnd('xx');
        },
        tearDown: function (topo) {
            topo.fit(function () {
            }, this, 0)
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
        tearDown: function (topo) {
            topo.fit(function () {
            }, this, 0)
        }
    },
    {
        name: 'API move with duration 50000',
        description: "move",
        script: function (topo) {
            topo.move(-100, 0, 5);
        },
        tearDown: function (topo) {
            topo.fit(function () {
            }, this, 0)
        }
    },
    {
        name: 'API move-big move',
        description: "move out of screen",
        script: function (topo) {
            console.log(1111)
            topo.move(-3000, -2000);
        },
        tearDown: function (topo) {
            topo.fit(function () {
            }, this, 0)
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
        tearDown: function (topo) {
            topo.fit(function () {
            }, this, 0)
        }
    },
    {
        name: 'API zoom-placeholder',
        description: "move out of screen",
        script: function (topo) {
            console.log(1111)
            topo.move(-3000, -2000);
        },
        tearDown: function (topo) {
            topo.fit(function () {
            }, this, 0)
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
        name: 'NG-API addNode with existing id',
        description: "Add a Node which id is existing, drag the Of-9k-01 the see if it have bug",
        script: function (topo) {
            topo.addNode({"id": 4, "x": 190, "y": 150, "name": "qiaowei2"})
            console.log(topo.getData())
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
            return 'result: before: ' + before + ' after: ' + after;
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
        name: 'API Remove existing Link in a nodeset',
        description: "Remove a existing link",
        script: function (topo) {
            var nodeset = topo.aggregationNodes([topo.getNode(0), topo.getNode(1)]);
//            var before = topo.getLink(0).sourceNode().label();
            topo.removeLink(0);
//            var after = topo.getLink(0);
//            return 'result: before: ' + before + ' after: ' + after;
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
        name: 'API Remove existing Link in a expanded nodeset',
        description: "Remove a existing link",
        script: function (topo) {
            var nodeset = topo.aggregationNodes([topo.getNode(0), topo.getNode(1)]);
            nodeset.collapsed(false);
//            var before = topo.getLink(0).sourceNode().label();
            topo.removeLink(0);
//            var after = topo.getLink(0);
//            return 'result: before: ' + before + ' after: ' + after;
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
        name: 'API Remove unexisting Link',
        description: "Remove a unexisting link",
        script: function (topo) {
            var before = topo.getLink(100);
            topo.removeLink(0);
            var after = topo.getLink(100);
            return 'result: before: ' + before + ' after: ' + after;
        }
    },
    {
        name: 'API Remove existing node',
        description: "Remove a existing node",
        script: function (topo) {
            topo.removeNode(0);
            var removed = (topo.getNode(0) === undefined);
            removed = removed && (topo.getLink(0) === undefined)
            return "can not get by getNode: " + removed + "//getData: node number+" + topo.getData().nodes.length;
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
        name: 'API Remove unexisting node',
        description: "Remove a unexisting node",
        script: function (topo) {
            topo.removeNode(100);
        }
    },
    {
        name: 'API Remove node in a nodeset',
        description: "Remove node in a nodeset",
        script: function (topo) {
            var nodeset = topo.aggregationNodes([topo.getNode(0), topo.getNode(1)]);
            topo.removeNode(0);
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
        name: 'API Remove node in a expanded nodeset',
        description: "Remove node in a nodeset",
        script: function (topo) {
            var nodeset = topo.aggregationNodes([topo.getNode(0), topo.getNode(1)]);
            nodeset.collapsed(false);
            setTimeout(function () {
                topo.removeNode(0);
            }, 2000)

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
        name: 'props add selectedNodes',
        description: "props add selectedNodes",
        script: function (topo) {
            topo.selectedNodes().add(topo.getNode(0));
            var data = topo.selectedNodes().toArray()
            var result = "";
            for (var i = 0; i < data.length; i++) {
                result = result + "//" + data[i].label();
            }
            return result;
        },
        tearDown: function (topo) {
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
            var result = "";
            for (var i = 0; i < data.length; i++) {
                result = result + "//" + data[i].label();
            }
            return result;
        },
        tearDown: function (topo) {
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
            var result = "";
            for (var i = 0; i < data.length; i++) {
                result = result + "//" + data[i].label();
            }
            return result;
        },
        tearDown: function (topo) {
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
            var result = "";
            for (var i = 0; i < data.length; i++) {
                result = result + "//" + data[i].label();
            }
            return result;
        },
        tearDown: function (topo) {
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
            var result = "";
            for (var i = 0; i < data.length; i++) {
                result = result + "//" + data[i].label();
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
            var result = "";
            for (var i = 0; i < data.length; i++) {
                result = result + "//" + data[i].label();
            }
            return result;
        }
    },
    {
        name: 'props selectedNodes addRange',
        description: "props selectedNodes addRange",
        script: function (topo) {
            topo.selectedNodes().addRange([topo.getNode(0), topo.getNode(1), topo.getNode(2)])

            var data = topo.selectedNodes().toArray()
            var result = "";
            for (var i = 0; i < data.length; i++) {
                result = result + "//" + data[i].label();
            }
            return result;
        },
        tearDown: function (topo) {
            topo.selectedNodes().clear()
        }
    },
    {
        name: 'props selectedNodes addRange duplicate',
        description: "props selectedNodes addRange duplicate",
        script: function (topo) {
            topo.selectedNodes().addRange([topo.getNode(0), topo.getNode(0), topo.getNode(0)])

            var data = topo.selectedNodes().toArray()
            var result = "";
            for (var i = 0; i < data.length; i++) {
                result = result + "//" + data[i].label();
            }
            return result;
        },
        tearDown: function (topo) {
            topo.selectedNodes().clear()
        }
    },
    {
        name: 'API hignlight nodes only ',
        description: "API hignlight nodes only",
        script: function (topo) {
            topo.fadeOut();
            var nodeLayer = topo.getLayer('nodes');
            var nodeLayerHighlightElements = nodeLayer.highlightedElements();
            nodeLayerHighlightElements.add(topo.getNode(0));
            nodeLayerHighlightElements.add(topo.getNode(1));

//            topo.fade
        },
        tearDown: function (topo) {
            topo.recoverHighlight()
        }
    },
    {
        name: 'API highlightRelatedNode ',
        description: "API hignlight nodes only",
        script: function (topo) {
//            topo.fadeOut();
            topo.highlightRelatedNode(topo.getNode(1));
        },
        tearDown: function (topo) {
            topo.recoverHighlight()
        }
    },
    {
        name: 'API highlightRelatedNode in the nodeset ',
        description: "API hignlight nodes in the nodeset ",
        script: function (topo) {
            var nodeset = topo.aggregationNodes([topo.getNode(0), topo.getNode(1)]);
//            nodeset.collapsed(false);
            topo.highlightRelatedNode(topo.getNode(1));
        },
        tearDown: function (topo) {
            var nodesets = topo.getLayer('nodeSet').nodeSetDictionary().toObject();
            nx.each(nodesets, function (nodeset, id) {
                topo.deleteNodeSet(id);
            })
            topo.recoverHighlight()
        }
    },
    {
        name: 'API highlightRelatedNode in the expanded nodeset',
        description: "API hignlight nodes in the expanded nodeset ",
        script: function (topo) {
            var nodeset = topo.aggregationNodes([topo.getNode(0), topo.getNode(1)]);
            nodeset.collapsed(false);
            setTimeout(function () {
                topo.highlightRelatedNode(topo.getNode(1));
            }, 2000)
        },
        tearDown: function (topo) {
            var nodesets = topo.getLayer('nodeSet').nodeSetDictionary().toObject();
            nx.each(nodesets, function (nodeset, id) {
                topo.deleteNodeSet(id);
            })

            topo.recoverHighlight()
        }
    },
    {
        name: 'API highlightNode in the node ',
        description: "API hignlight nodes in the node ",
        script: function (topo) {
            topo.fadeOut(true)
            topo.highlightedNodes([topo.getNode(0)]);

        },
        tearDown: function (topo) {
            var nodesets = topo.getLayer('nodeSet').nodeSetDictionary().toObject();
            nx.each(nodesets, function (nodeset, id) {
                topo.deleteNodeSet(id);
            })
            topo.recoverHighlight()
        }
    },
    {
        name: 'API highlightedNodes in the nodeset ',
        description: "API hignlight nodes in the nodeset ",
        script: function (topo) {
            var nodeset = topo.aggregationNodes([topo.getNode(0), topo.getNode(1)]);
//            nodeset.collapsed(false);
            setTimeout(function () {
                topo.fadeOut(true)
                topo.highlightedNodes([0, 1]);
            }, 2000)


        },
        tearDown: function (topo) {
            var nodesets = topo.getLayer('nodeSet').nodeSetDictionary().toObject();
            nx.each(nodesets, function (nodeset, id) {
                topo.deleteNodeSet(id);
            })
            topo.recoverHighlight()
        }
    },
    {
        name: 'API highlightedNodes in the expanded nodeset',
        description: "API hignlight nodes in the expanded nodeset ",
        script: function (topo) {
            var nodeset = topo.aggregationNodes([topo.getNode(0), topo.getNode(1)]);
            nodeset.collapsed(false);
            topo.fadeOut(true)
            topo.highlightedNodes([topo.getNode(0), topo.getNode(1)]);
        },
        tearDown: function (topo) {
            var nodesets = topo.getLayer('nodeSet').nodeSetDictionary().toObject();
            nx.each(nodesets, function (nodeset, id) {
                topo.deleteNodeSet(id);
            })
            topo.recoverHighlight()
        }
    },
    {
        name: 'API highlightedNodes in the mul nodeset',
        description: "API hignlight nodes in the mul nodeset ",
        script: function (topo) {
            var nodeset = topo.aggregationNodes([topo.getNode(0), topo.getNode(1)]);
            topo.aggregationNodes([nodeset, topo.getNode(2)]);
            topo.fadeOut(true)
            topo.highlightedNodes([0, 2]);
        },
        tearDown: function (topo) {
            var nodesets = topo.getLayer('nodeSet').nodeSetDictionary().toObject();
            nx.each(nodesets, function (nodeset, id) {
                console.log(id)
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
            topo.setData(data, function () {
                topo.fit()
            }, this)
            topo.setData(data, function () {
                topo.fit()
            }, this)
            return topo.width() + ',' + topo.height();
        },
        tearDown: function (topo) {
            topo.adaptToContainer();
        }
    },
    {
        name: 'API add group/add by node object',
        description: "API add group",
        script: function (topo) {
            var groupsLayer = topo.getLayer('groups');
            var nodes1 = [topo.getNode(0), topo.getNode(1)];
            var group1 = groupsLayer.addGroup({
                nodes: nodes1,
                label: 'Rect',
                color: '#f00'
            });
        },
        tearDown: function (topo) {
            topo.getLayer('groups').clear();
        }
    },
    {
        name: 'API add group/one node in the group',
        description: "API add group",
        script: function (topo) {
            var groupsLayer = topo.getLayer('groups');
            var nodes1 = [topo.getNode(0)];
            var group1 = groupsLayer.addGroup({
                nodes: nodes1,
                label: 'Rect',
                color: '#f00'
            });

        },
        tearDown: function (topo) {
            topo.getLayer('groups').clear();
        }
    },
    {
        name: 'API add group/add by node id',
        description: "API add group",
        script: function (topo) {
            var groupsLayer = topo.getLayer('groups');
            var nodes1 = [0, 1, 2];
            var group1 = groupsLayer.addGroup({
                nodes: nodes1,
                label: 'Rect',
                color: '#f00'
            });
            //groupsLayer.removeGroup(group1.__id__);
//            group1.remove()
        },
        tearDown: function (topo) {
            topo.getLayer('groups').clear();
        }
    },
    {
        name: 'API add multiple group/add by node id',
        description: "API add group",
        script: function (topo) {
            var groupsLayer = topo.getLayer('groups');
            groupsLayer.addGroup({
                nodes: [0, 1, 2],
                label: 'Rect',
                color: '#f00'
            });

            groupsLayer.addGroup({
                nodes: [0, 3, 4],
                label: 'Rect',
                color: 'green'
            });

        },
        tearDown: function (topo) {
            topo.getLayer('groups').clear();
        }
    },
    {
        name: 'API group-add node',
        description: "API add group",
        script: function (topo) {
            var groupsLayer = topo.getLayer('groups');
            var nodes1 = [topo.getNode(0), topo.getNode(1)];
            var group1 = groupsLayer.addGroup({
                nodes: nodes1,
                label: 'Rect',
                color: '#f00'
            });
            group1.addNode(2)
            var nodes = group1.getNodes()
            var result = '';
            for (var i = 0; i < nodes.length; i++) {
                result = result + nodes[i].label() + '/'
            }
            return result;
        },
        tearDown: function (topo) {
            topo.getLayer('groups').clear();
        }
    },
    {
        name: 'API multiple group/add same node',
        description: "API add group",
        script: function (topo) {
            var groupsLayer = topo.getLayer('groups');
            var group1 = groupsLayer.addGroup({
                nodes: [0, 1, 2, 4],
                label: 'Rect1',
                color: '#f00'
            });

            var group2 = groupsLayer.addGroup({
                nodes: [0, 4],
                label: 'Rect2',
                color: 'green'
            });
            group1.addNode(3)
            group2.addNode(3)


        },
        tearDown: function (topo) {
            topo.getLayer('groups').clear();
        }
    },
    {
        name: 'API group-remove node',
        description: "API add group",
        script: function (topo) {
            var groupsLayer = topo.getLayer('groups');
            var nodes1 = [topo.getNode(0), topo.getNode(1)];
            var group1 = groupsLayer.addGroup({
                nodes: nodes1,
                label: 'Rect',
                color: '#f00'
            });
            setTimeout(function () {
                group1.removeNode(1);
            }, 2000)

        },
        tearDown: function (topo) {
            topo.getLayer('groups').clear();
        }
    },
    {
        name: 'API group-remove GROUP',
        description: "API remove group",
        script: function (topo) {
            var groupsLayer = topo.getLayer('groups');
            var nodes1 = [topo.getNode(0), topo.getNode(1)];
            var group1 = groupsLayer.addGroup({
                nodes: nodes1,
                label: 'Rect',
                color: '#f00'
            });
            setTimeout(function () {
                groupsLayer.removeGroup(group1.__id__)
            }, 2000, this)


        },
        tearDown: function (topo) {
            topo.getLayer('groups').clear();
        }
    },
    {
        name: 'API zoomByBound',
        description: "API zoomByBound",
        script: function (topo) {
            topo.zoomByBound({left: 500, top: 200, width: 100, height: 100})
        },
        tearDown: function (topo) {
            topo.fit(function () {
            }, this, 0)
        }
    },
    {
        name: 'API zoomByNodes',
        description: "API zoomByNodes",
        script: function (topo) {
            topo.zoomByNodes([topo.getNode(0)])
        },
        tearDown: function (topo) {
            topo.fit(function () {
            }, this, 0)
        }
    },
    {
        name: 'API zoomByNodes-one by one',
        description: "API zoomByNodes-4 times, wait for a moment",
        script: function (topo) {
            topo.selectedNodes().add(topo.getNode(0));
            topo.zoomByNodes([topo.getNode(0)]);
            setTimeout(function () {
                topo.selectedNodes().clear()
                topo.zoomByNodes([topo.getNode(1)]);
                topo.selectedNodes().add(topo.getNode(1));
            }, 1000)
            setTimeout(function () {
                topo.selectedNodes().clear()
                topo.zoomByNodes([topo.getNode(2)]);
                topo.selectedNodes().add(topo.getNode(2));
            }, 2000)
            setTimeout(function () {
                topo.selectedNodes().clear()
                topo.zoomByNodes([topo.getNode(3)]);
                topo.selectedNodes().add(topo.getNode(3));
            }, 3000)
            setTimeout(function () {
                topo.selectedNodes().clear()
                topo.fit();
            }, 4000)
        }
    },
    {
        name: 'API resize then zoomByNodes-one by one',
        description: "API zoomByNodes-4 times, wait for a moment",
        script: function (topo) {
            topo.resize(500, 500);
            topo.selectedNodes().add(topo.getNode(0));
            topo.zoomByNodes([topo.getNode(0),topo.getNode(1)]);

            setTimeout(function () {
                topo.selectedNodes().clear()
                topo.zoomByNodes([topo.getNode(1)]);
                topo.selectedNodes().add(topo.getNode(1));
            }, 2000);
            setTimeout(function () {
                topo.selectedNodes().clear()
                topo.zoomByNodes([topo.getNode(2)]);
                topo.selectedNodes().add(topo.getNode(2));
            }, 3000);
            setTimeout(function () {
                topo.selectedNodes().clear()
                topo.zoomByNodes([topo.getNode(3)]);
                topo.selectedNodes().add(topo.getNode(3));
            }, 4000);
            setTimeout(function () {
                topo.selectedNodes().clear()
                topo.fit();
            }, 5000);
        },
        tearDown: function (topo) {
            topo.adaptToContainer();
        }
    },
    {
        name: 'API zoomByNodes-multiple nodes',
        description: "API zoomByNodes",
        script: function (topo) {
            topo.zoomByNodes([topo.getNode(0), topo.getNode(1), topo.getNode(2)])
        },
        tearDown: function (topo) {
            topo.fit(function () {
            }, this, 0)
        }
    },
    {
        name: 'API zoomByNodes-nodes goes not exists',
        description: "API zoomByNodes",
        script: function (topo) {
            topo.zoomByNodes([topo.getNode(100)])
        },
        tearDown: function (topo) {
            topo.fit(function () {
            }, this, 0)
        }
    },
    {
        name: 'API zoomByNodes-no nodes',
        description: "API zoomByNodes",
        script: function (topo) {
            topo.zoomByNodes([])
        },
        tearDown: function (topo) {
            topo.fit(function () {
            }, this, 0)
        }
    },
    {
        name: 'prop hide-navi',
        description: "API hide-navi",
        script: function (topo) {
            topo.showNavigation(false)
        },
        tearDown: function (topo) {
            topo.showNavigation(true)
        }
    },
    {
        name: 'prop theme',
        description: "API theme",
        script: function (topo) {
            setTimeout(function () {
                topo.theme("blue")
            }, 1000);
            setTimeout(function () {
                topo.theme("green")
            }, 2000);
            setTimeout(function () {
                topo.theme("dark")
            }, 3000);
            setTimeout(function () {
                topo.theme("slate")
            }, 4000);
            setTimeout(function () {
                topo.theme("yellow")
            }, 5000);
        },
        tearDown: function (topo) {
            topo.theme("blue")
        }
    },
    {
        name: 'prop width/height',
        description: "API theme",
        script: function (topo) {
            topo.height(600);
            topo.width(610);
            return 'height: ' + topo.height() + 'width: ' + topo.width()
        },
        tearDown: function (topo) {
            topo.adaptToContainer();
        }
    },
    {
        name: 'prop node-Draggable-false',
        description: "API node-Draggable",
        script: function (topo) {
            topo.nodeDraggable(false);

        },
        tearDown: function (topo) {
            topo.nodeDraggable(true);
        }
    },
    {
        name: 'prop showIcon',
        description: "API showIcon",
        script: function (topo) {
            topo.showIcon(false);
            setTimeout(function () {
                topo.showIcon(true);
            }, 3000)
        },
        tearDown: function (topo) {
            topo.nodeDraggable(true);
        }
    },
    {
        name: 'prop supportMultipleLink',
        description: "API supportMultipleLink",
        script: function (topo) {
            topo.supportMultipleLink(false);
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
            })
        },
        tearDown: function (topo) {
            topo.supportMultipleLink(true);
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
        name: 'prop scalable',
        description: "API scalable",
        script: function (topo) {
            topo.scalable(false)
        },
        tearDown: function (topo) {
            topo.scalable(true);
        }
    },
    {
        name: 'event/before setData/after setData',
        description: "event/before setData/after setData",
        script: function (topo, context) {
            topo.on('beforeSetData', function () {
                context.log('beforeSetData1');
            });
            topo.on('beforeSetData', function () {
                context.log('beforeSetData2');
            });
            topo.on('afterSetData', function () {
                context.log('afterSetData1');
            });
            topo.on('afterSetData', function () {
                context.log('afterSetData2');
            });
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
            topo.off('afterSetData');
            topo.off('beforeSetData');
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
        },
        tearDown: function (topo) {
            //topo.scalable(true);
        }
    },
    {
        name: 'event/click stage',
        description: "click the stage, you will see the message",
        script: function (topo, context) {
            topo.on('clickStage', function () {
                context.log('clickStage1 ');
            });
            topo.on('clickStage', function () {
                context.log('clickStage2 ');
            });

        },
        tearDown: function (topo) {
            topo.off('clickStage')
        }
    },
    {
        name: 'event/click stage-removed',
        description: "click the stage, you wont see the message",
        script: function (topo, context) {
            topo.on('clickStage', function () {
                context.log('clickStage1 ');
            });
            topo.off('clickStage');

        }
    },
    {
        name: 'event/drag stage',
        description: "drag the stage, you will see the drag event sequence",
        script: function (topo, context) {
            topo.on('dragStage', function () {
                context.log('dragStage ');
            });
            topo.on('dragStageEnd', function () {
                context.log('dragStageEnd ');
            });
            topo.on('dragStageStart', function () {
                context.log('dragStageStart ');
            });

        },
        tearDown: function (topo) {
            topo.off('dragStage');
            topo.off('dragStageEnd')
            topo.off('dragStageStart')
        }
    },
    {
        name: 'event/drag stage-removed',
        description: "drag the stage, you will see the drag event sequence",
        script: function (topo, context) {
            topo.on('dragStage', function () {
                context.log('dragStage ');
            });
            topo.on('dragStageEnd', function () {
                context.log('dragStageEnd ');
            });
            topo.on('dragStageStart', function () {
                context.log('dragStageStart ');
            });
            topo.off('dragStage');
            topo.off('dragStageEnd')
            topo.off('dragStageStart')

        },
        tearDown: function (topo) {

        }
    },
    {
        name: 'event/pressStage stage',
        description: "drag the stage, you will see the drag event sequence",
        script: function (topo, context) {
            topo.on('pressStage', function () {
                context.log('pressStage ');
            });
        },
        tearDown: function (topo) {
            topo.off("pressStage")
        }
    },
    {
        name: 'event/resizeStage stage',
        description: "drag the stage, you will see the drag event sequence",
        script: function (topo, context) {
            topo.on('resizeStage', function () {
                context.log('resizeStage ');
            });
            topo.resize(600, 600);

        },
        tearDown: function (topo) {
            topo.off("resizeStage")
        }
    },
    {
        name: 'event/resizeStage the set height/width',
        description: "drag the stage, you will see the drag event sequence",
        script: function (topo, context) {
            topo.on('resizeStage', function () {
                context.log('resizeStage ');
            });
            topo.height(600);
            topo.width(600);

        },
        tearDown: function (topo) {
            topo.off("resizeStage")
        }
    },
    {
        name: 'event/fit ',
        description: "click fit to see the message",
        script: function (topo, context) {
            topo.on('fit', function () {
                context.log('fit ');
            });
        },
        tearDown: function (topo) {
            topo.off("fit")
        }
    },
    {
        name: 'event/insertData ',
        description: "",
        script: function (topo, context) {
            topo.on('insertData', function () {
                context.log('insertData ');
            });
            topo.insertData({
                nodes: [
                    {"id": 5, "x": 500, "y": 500, "name": "qiaowei"}
                ],
                links: [
                    {"id": 12, "source": 0, "target": 5}
                ]
            })
        },
        tearDown: function (topo) {
            topo.off("insertData")
            topo.removeNode(5);
            topo.removeLink(12);
        }
    },
    {
        name: 'event/insertData nodes: [],links: []',
        description: "",
        script: function (topo, context) {
            topo.on('insertData', function () {
                context.log('insertData ');
            });
            topo.insertData({
                nodes: [],
                links: []
            })
        },
        tearDown: function (topo) {
            topo.off("insertData")
        }
    },
    {
        name: 'event/insertData duplicate data',
        description: "",
        script: function (topo, context) {
            topo.on('insertData', function () {
                context.log('insertData ');
            });
            topo.insertData({
                nodes: [
                    {"id": 0, "x": 410, "y": 100, "name": "12K-1"}
                ],
                links: [
                    {"id": 0, "source": 0, "target": 1}
                ]})
        },
        tearDown: function (topo) {
            topo.off("insertData")
        }
    },
    {
        name: 'event/select Node',
        description: "click a node to trigger the event",
        script: function (topo, context) {
            topo.on('selectNode', function () {
                context.log('selectNode ');
            });
        },
        tearDown: function (topo) {
            topo.off("selectNode")
        }
    },
    {
        name: 'event/enter Node.leave node',
        description: "click a node to trigger the event",
        script: function (topo, context) {
            topo.on('enterNode', function () {
                context.log('enterNode ');
            });
            topo.on('leaveNode', function () {
                context.log('leaveNode ');
            });
        },
        tearDown: function (topo) {
            topo.off("enterNode")
            topo.off("leaveNode")
        }
    },
    {
        name: 'event/updateNodeCoordinate',
        description: "click a node to a new place",
        script: function (topo, context) {
            topo.on('updateNodeCoordinate', function () {
                context.log('updateNodeCoordinate ');
            });
        },
        tearDown: function (topo) {
            topo.off("updateNodeCoordinate");
        }
    },
    {
        name: 'event/drag node',
        description: "drag the node, you will see the drag event sequence",
        script: function (topo, context) {
            topo.on('dragNode', function () {
                context.log('dragNode ');
            });
            topo.on('dragNodeStart', function () {
                context.log('dragNodeStart ');
            });
            topo.on('dragNodeEnd', function () {
                context.log('dragNodeEnd ');
            });

        },
        tearDown: function (topo) {
            topo.off('dragNode');
            topo.off('dragNodeStart');
            topo.off('dragNodeEnd');
        }
    },
    {
        name: 'for test only',
        description: "for test only",
        script: function (topo, context) {
            context.log('aaa');
        }
    },
    {
        name: 'API, add path',
        description: "click a node to a new place",
        script: function (topo, context) {
            var pathLayer = topo.getLayer("paths");
            var links1 = [topo.getLink(2)];
            var path1 = new nx.graphic.Topology.Path({
                links: links1,
                arrow: 'cap'
            });
            path1.pathWidth(20);
            pathLayer.addPath(path1);
        },
        tearDown: function (topo) {
            var pathLayer = topo.getLayer("paths");
            var paths = pathLayer.paths();
            nx.each(paths, function (path) {
                pathLayer.removePath(path);
            })

        }
    },
    {
        name: 'API, add path, path not exists',
        description: "click a node to a new place",
        script: function (topo, context) {
            var pathLayer = topo.getLayer("paths");
            var links1 = [topo.getLink(100)];
            var path1 = new nx.graphic.Topology.Path({
                links: links1,
                arrow: 'cap'
            });
            path1.pathWidth(20);
            pathLayer.addPath(path1);
        },
        tearDown: function (topo) {
            var pathLayer = topo.getLayer("paths");
            var paths = pathLayer.paths();
            nx.each(paths, function (path) {
                pathLayer.removePath(path);
            })

        }
    },
    {
        name: 'API, add multiple path',
        description: "click a node to a new place",
        script: function (topo, context) {
            var pathLayer = topo.getLayer("paths");
            var links1 = [topo.getLink(0), topo.getLink(1), topo.getLink(4), topo.getLink(6)];
            var path1 = new nx.graphic.Topology.Path({
                links: links1,
                arrow: 'cap'
            });

            var links2 = [topo.getLink(3), topo.getLink(1), topo.getLink(5)];
            var path2 = new nx.graphic.Topology.Path({
                links: links2,
                arrow: 'cap'
            });
            path1.pathWidth(10);
            path2.pathWidth(10);
            pathLayer.addPath(path1);
            pathLayer.addPath(path2);
            var paths = pathLayer.paths();
            console.log(paths)
        },
        tearDown: function (topo) {
            var pathLayer = topo.getLayer("paths");
            var paths = pathLayer.paths();
            console.log(paths)
            nx.each(paths, function (path) {
                pathLayer.removePath(path);
            })

        }
    },
    {
        name: 'API, fade out path',
        description: "API, fade out path",
        script: function (topo, context) {
            var pathLayer = topo.getLayer("paths");
            var links1 = [topo.getLink(0), topo.getLink(1), topo.getLink(4), topo.getLink(6)];
            var path1 = new nx.graphic.Topology.Path({
                links: links1,
                arrow: 'cap'
            });

            var links2 = [topo.getLink(3), topo.getLink(1), topo.getLink(5)];
            var path2 = new nx.graphic.Topology.Path({
                links: links2,
                arrow: 'cap'
            });
            path1.pathWidth(10);
            path2.pathWidth(10);
            pathLayer.addPath(path1);
            pathLayer.addPath(path2);
            pathLayer.fadeOut(true);
        },
        tearDown: function (topo) {
            var pathLayer = topo.getLayer("paths");
            var paths = pathLayer.paths();
            nx.each(paths, function (path) {
                pathLayer.removePath(path);
            });
            pathLayer.fadeOut(false);

        }
    },
    {
        name: 'API, add path first then do aggregration',
        description: "add path first then do aggregration",
        script: function (topo, context) {

            var pathLayer = topo.getLayer("paths");
            var links1 = [topo.getLink(0), topo.getLink(1), topo.getLink(4), topo.getLink(6)];
            var path1 = new nx.graphic.Topology.Path({
                links: links1,
                arrow: 'cap'
            });

            var links2 = [topo.getLink(3), topo.getLink(1), topo.getLink(5)];
            var path2 = new nx.graphic.Topology.Path({
                links: links2,
                arrow: 'cap'
            });
            path1.pathWidth(10);
            path2.pathWidth(10);
            pathLayer.addPath(path1);
            pathLayer.addPath(path2);
            topo.aggregationNodes([topo.getNode(0), topo.getNode(1)]);
        },
        tearDown: function (topo) {
            var pathLayer = topo.getLayer("paths");
            var paths = pathLayer.paths();
            nx.each(paths, function (path) {
                pathLayer.removePath(path);
            })

        }
    },
    {
        name: 'API, aggregration first then add path',
        description: "API, aggregration first then add path",
        script: function (topo, context) {
            topo.aggregationNodes([topo.getNode(0), topo.getNode(1)]);
            var pathLayer = topo.getLayer("paths");
            var links1 = [topo.getLink(0), topo.getLink(1), topo.getLink(4), topo.getLink(6)];
            var path1 = new nx.graphic.Topology.Path({
                links: links1,
                arrow: 'cap'
            });

            var links2 = [topo.getLink(3), topo.getLink(1), topo.getLink(5)];
            var path2 = new nx.graphic.Topology.Path({
                links: links2,
                arrow: 'cap'
            });
            path1.pathWidth(10);
            path2.pathWidth(10);
            pathLayer.addPath(path1);
            pathLayer.addPath(path2);

        },
        tearDown: function (topo) {
            var pathLayer = topo.getLayer("paths");
            var paths = pathLayer.paths();
            nx.each(paths, function (path) {
                pathLayer.removePath(path);
            })

        }
    },
    {
        name: 'API, pathlayer clear',
        description: "API, wait for 2 sec, clear the path",
        script: function (topo, context) {
            var pathLayer = topo.getLayer("paths");
            var links1 = [topo.getLink(0), topo.getLink(1), topo.getLink(4), topo.getLink(6)];
            var path1 = new nx.graphic.Topology.Path({
                links: links1,
                arrow: 'cap'
            });

            var links2 = [topo.getLink(3), topo.getLink(1), topo.getLink(5)];
            var path2 = new nx.graphic.Topology.Path({
                links: links2,
                arrow: 'cap'
            });
            path1.pathWidth(10);
            path2.pathWidth(10);
            pathLayer.addPath(path1);
            pathLayer.addPath(path2);

            setTimeout(function () {
                pathLayer.clear();
            }, 2000)

        }
    },
    {
        name: 'API, pathlayer clear-nothing to clear',
        description: "pathlayer clear-nothing to clear",
        script: function (topo, context) {
            var pathLayer = topo.getLayer("paths");
            setTimeout(function () {
                pathLayer.clear();
            }, 2000)

        }
    },
    {
        name: 'API, remove path',
        description: "pathlayer,wait for 2sec to clear the path",
        script: function (topo, context) {
            var pathLayer = topo.getLayer("paths");
            var links1 = [topo.getLink(0), topo.getLink(1), topo.getLink(4), topo.getLink(6)];
            var path1 = new nx.graphic.Topology.Path({
                links: links1,
                arrow: 'cap'
            });

            var links2 = [topo.getLink(3), topo.getLink(1), topo.getLink(5)];
            var path2 = new nx.graphic.Topology.Path({
                links: links2,
                arrow: 'cap'
            });
            path1.pathWidth(10);
            path2.pathWidth(10);
            pathLayer.addPath(path1);
            pathLayer.addPath(path2);

            setTimeout(function () {
                pathLayer.removePath(path1);
                pathLayer.removePath(path2);
            }, 2000)

        }
    }


]