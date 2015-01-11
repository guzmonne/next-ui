(function(global) {

    var random = function(num) {
        return Math.floor(Math.random() * num);
    };

    APP = function(file, fn) {

        $.getJSON(file, function(response) {

            console.time('Layout');
            topoOriginalData = response.response;
            var topoData = $.extend(true, {}, topoOriginalData);
            var topoNodeMap = {};
            var topoLinkMap = {};

            delete topoData.nodeSet;

            // build map
            topoData.nodes.forEach(function(node) {
                node.__linkMap__ = {};
                topoNodeMap[node.id] = node;
                delete node.x;
                delete node.y;
                delete node.fixed;
                node.x = random(1000);
            });

            // 1. add lin to node's link map 2.build link map 3.remove host link from links
            var l = topoData.links.length;
            while (l) {
                var link = topoData.links[--l];
                var id = link.id = link.id || nx.uuid();
                var linkID = link.source + '_' + link.target;
                var reverseLinkID = link.target + '_' + link.source;
                var source = topoNodeMap[link.source];
                var target = topoNodeMap[link.target];

                //add to node's link map
                if (source && target) {

                } else {
                    console.log('error', id, link);
                }


                if (source.nodeType == 'host' || target.nodeType == 'host') {
                    topoData.links.splice(l, 1);
                } else if (topoLinkMap[linkID] || topoLinkMap[reverseLinkID]) {
                    topoData.links.splice(l, 1);
                } else {
                    source.__linkMap__[id] = link;
                    target.__linkMap__[id] = link;
                    topoLinkMap[linkID] = link;
                }
            }

            // remove host
            //remove unlinked device
            l = topoData.nodes.length;
            while (l) {
                var node = topoData.nodes[--l];
                if (node.nodeType == 'host') {
                    topoData.nodes.splice(l, 1);
                } else if (Object.keys(node.__linkMap__).length == 0) {
                    topoData.nodes.splice(l, 1);
                }
            }




            topoData.nodes = topoData.nodes.sort(function(a, b) {
                return Object.keys(b.__linkMap__).length - Object.keys(a.__linkMap__).length;
            })





            // set coordinate
            var noderole = {
                'cloud': [],
                'CoreL0': [],
                'CoreL1': [],
                'BorderRouterL0': [],
                'BorderRouterL1': [],
                'BorderRouterL2': [],
                'DistributionL0': [],
                'DistributionL1': [],
                'DistributionL2': [],
                'DistributionL3': [],
                'AccessL0': [],
                'AccessL1': [],
                'AccessL2': [],
                'AccessL3': [],
                'AccessL4': [],
                'unknown': []
            };
            topoData.nodes.forEach(function(node) {
                var id = node.id;
                var role = node.role;
                var linkMap = node.__linkMap__;
                if (role == 'cloud') {
                    node.__level__ = 0;
                    noderole.cloud.push(node);
                }

                var isL0, isL1, isL2, isL3, linkID, destination, target, link;

                if (role == 'Core') {
                    isL0 = false, isL1 = false, isL2 = false, isL3 = false;
                    for (linkID in linkMap) {
                        link = linkMap[linkID];
                        destination = link.source == id ? topoNodeMap[link.target] : topoNodeMap[link.source];
                        if (destination.role == 'cloud') {
                            isL0 = true;
                        }
                    }

                    if (isL0) {
                        node.__level__ = 1;
                        noderole.CoreL0.push(node);
                    } else {
                        node.__level__ = 2;
                        noderole.CoreL1.push(node);
                    }

                }

                if (role == 'Border Router') {
                    isL0 = false, isL1 = false, isL2 = false, isL3 = false;
                    for (linkID in linkMap) {
                        link = linkMap[linkID];
                        destination = link.source == id ? topoNodeMap[link.target] : topoNodeMap[link.source];
                        if (destination.role == 'cloud') {
                            isL0 = true;
                        }

                        if (destination.role == 'Core') {
                            isL1 = true;
                        }
                    }

                    if (isL0) {
                        node.__level__ = 3;
                        noderole.BorderRouterL0.push(node);
                    } else if (isL1) {
                        node.__level__ = 4;
                        noderole.BorderRouterL1.push(node);
                    } else {
                        node.__level__ = 5;
                        noderole.BorderRouterL2.push(node);
                    }

                }


                if (role == 'Distribution') {
                    isL0 = false;
                    for (linkID in linkMap) {
                        link = linkMap[linkID];
                        destination = link.source == id ? topoNodeMap[link.target] : topoNodeMap[link.source];
                        if (destination.role == 'cloud') {
                            isL0 = true;
                        }
                        if (destination.role == 'Core') {
                            isL1 = true;
                        }
                        if (destination.role == 'Border Router') {
                            isL2 = true;
                        }
                    }

                    if (isL0) {
                        node.__level__ = 6;
                        noderole.DistributionL0.push(node);
                    } else if (isL1) {
                        node.__level__ = 7;
                        noderole.DistributionL1.push(node);
                    } else if (isL2) {
                        node.__level__ = 8;
                        noderole.DistributionL2.push(node);
                    } else {
                        node.__level__ = 9;
                        noderole.DistributionL3.push(node);
                    }
                }




                if (role == 'Access') {
                    isL0 = false;
                    for (linkID in linkMap) {
                        link = linkMap[linkID];
                        destination = link.source == id ? topoNodeMap[link.target] : topoNodeMap[link.source];
                        if (destination.role == 'cloud') {
                            isL0 = true;
                        }
                        if (destination.role == 'Core') {
                            isL1 = true;
                        }
                        if (destination.role == 'Border Router') {
                            isL2 = true;
                        }
                        if (destination.role == 'Distribution') {
                            isL3 = true;
                        }
                    }

                    if (isL0) {
                        node.__level__ = 10;
                        noderole.AccessL0.push(node);
                    } else if (isL1) {
                        node.__level__ = 11;
                        noderole.AccessL1.push(node);
                    } else if (isL2) {
                        node.__level__ = 12;
                        noderole.AccessL2.push(node);
                    } else if (isL3) {
                        node.__level__ = 13;
                        noderole.AccessL3.push(node);
                    } else {
                        node.__level__ = 14;
                        noderole.AccessL4.push(node);
                    }
                }

                if (role == 'unknown') {
                    node.__level__ = 15;
                    noderole.unknown.push(node);
                }



                //
                node.__connectedNodes__ = [];
                for (linkID in linkMap) {
                    link = linkMap[linkID];
                    destination = link.source == id ? topoNodeMap[link.target] : topoNodeMap[link.source];
                    node.__connectedNodes__.push(destination);
                }



            });

            // remove empty coulum, get the max row and coulum
            var maxRow, maxCoulum = 0;
            var levelGap = 0;
            for (l in noderole) {
                var level = noderole[l];
                if (level.length == 0) {
                    levelGap += 1;
                }
                level.forEach(function(node, index) {
                    node.__level__ -= levelGap;
                    node.y = node.__level__ * 100;
                    node.x = index * 100;
                    node.__order__ = index;
                });

                maxCoulum = Math.max(maxCoulum, level.length);
            }
            maxRow = 16 - levelGap;



            // tick the order. use force layout
            var height = 0,
                width = 0;
            for (l in noderole) {
                var level = noderole[l];

                if (level.length == 0) {
                    continue;
                }


                var links = [];

                level.forEach(function(node, index) {
                    node.__connectedNodes__.forEach(function(dest) {
                        if (dest.__level__ == node.__level__) {
                            links.push({
                                source: index,
                                target: level.indexOf(dest)
                            });
                        }
                    })
                });



                var force = new nx.data.ENForce();
                force.nodes(level);
                force.links(links);
                force.start();
                //var time = 2000;
                while (force.alpha()) { //299
                    //while (time) {
                    force.tick();
                    //time--;
                }
                force.stop();


                var minX = 999999,
                    minY = 99999,
                    maxX = 0,
                    maxY = 0;

                level.forEach(function(node, index) {
                    minX = Math.min(node.x, minX);
                    minY = Math.min(node.y, minY);
                    maxX = Math.max(node.x, maxX);
                    maxY = Math.max(node.y, maxY);
                });


                level.forEach(function(node, index) {
                    node.x -= minX;
                    node.y -= minY;
                    node.y += height;
                });
                height += (maxY - minY) + 100;
                width = Math.max(width, (maxX - minX));
            }





            // put to grid

            var xCell = 100;
            var yCell = 100;
            var row = Math.floor(height / yCell) + 2;
            var coulum = Math.max(Math.floor(width / xCell) + 2, 200);
            grid = new Array(row);
            for (var i = 0; i <= row; i++) {
                grid[i] = new Array();
            }

            //console.log((maxX - minX),(maxY - minY),coulum,row);




            for (l in noderole) {
                var level = noderole[l];

                if (level.length == 0) {
                    continue;
                }

                level.sort(function(a, b) {
                    return Object.keys(b.__linkMap__).length - Object.keys(a.__linkMap__).length;
                })

                level.forEach(function(node, index) {
                    var ySpot = Math.ceil(node.y / yCell);
                    var xSpot = Math.floor(node.x / xCell);
                    var step = 1;
                    while (grid[ySpot][xSpot]) {
                        var find = false;
                        for (var i = step; i >= step * -1; i--) {
                            if (!grid[ySpot + (step - Math.abs(i))][xSpot + i]) {
                                find = true;
                                break;
                            }

                        }

                        if (find) {
                            ySpot += step - Math.abs(i);
                            xSpot += i;
                        }

                        step++;
                    }

                    grid[ySpot][xSpot] = node;


                    node.__xSpot__ = xSpot;
                    node.__ySpot__ = ySpot;
                })
            }



            // clear just have one node level
            var maxCoulum = 0;
            var l = grid.length;
            levelGap = 0;
            while (l) {
                var row = grid[grid.length - (l--)];
                if (row.length == 0) {
                    levelGap++;
                    grid.splice(grid.length - l - 1, 1);
                }
                row.forEach(function(node) {
                    node.__ySpot__ -= levelGap;
                });
                maxCoulum = Math.max(maxCoulum, row.length);
            }







            grid.forEach(function(row, index) {
                var x = row.filter(function(a) {
                    return a
                });
                if (index != 0 && x.length == 1) {
                    var node = row[row.length - 1];
                    var xSpot = node.__xSpot__;
                    var ySpot = node.__ySpot__;
                    var step = 1;
                    while (grid[ySpot][xSpot]) {
                        var find = false;
                        for (var i = step; i > 0; i--) {
                            if (grid[ySpot + i] && !grid[ySpot + i][xSpot + step - i]) {
                                find = true;
                                ySpot += i;
                                xSpot += step - i;
                                break;
                            } else if (grid[ySpot + i] && !grid[ySpot + i][xSpot - step + i]) {
                                find = true;
                                ySpot += i;
                                xSpot -= step - i;
                                break;
                            }
                        }

                        if (!find) {
                            for (var i = step * -1; i < 0; i++) {
                                if (grid[ySpot + i] && !grid[ySpot + i][xSpot + step + i]) {
                                    find = true;
                                    ySpot += i;
                                    xSpot += step + i;
                                    break;
                                } else if (grid[ySpot + i] && !grid[ySpot + i][xSpot - step - i]) {
                                    find = true;
                                    ySpot += i;
                                    xSpot -= step + i;
                                    break;
                                }
                            }
                        }



                        step++;

                        if (step > 10) {
                            break;
                        }

                    }
                    grid[node.__ySpot__][node.__xSpot__] = undefined;
                    grid[ySpot][xSpot] = node;
                    node.__xSpot__ = xSpot;
                    node.__ySpot__ = ySpot;
                    row.length = 0;
                }

            });
            //
            //
            var clacLinkDistance = function(xSpot, ySpot, connectedNodes) {
                var length = 0;
                var returnInfinity = false;
                connectedNodes.forEach(function(n) {
                    length += (n.__xSpot__ - xSpot) * (n.__xSpot__ - xSpot) + (n.__ySpot__ - ySpot) * (n.__ySpot__ - ySpot)

                    if (n.__ySpot__ == ySpot && Math.abs(n.__xSpot__ - xSpot) != 1) {
                        //returnInfinity = true;
                    }

                    if (n.__xSpot__ == xSpot && Math.abs(n.__ySpot__ - ySpot) != 1) {
                        //returnInfinity = true;
                        //var allEmpty = false;
                        //
                        //for (var i = (n.__ySpot__ - ySpot); i > 0; i--) {
                        //
                        //}
                    }

                });
                //return length;
                if (returnInfinity) {
                    return Infinity;
                } else {
                    return length;
                }
            }



            grid.forEach(function(row, index) {
                var nodes = grid[index].filter(function(node) {
                    delete node.__fixed__;
                    return node
                });
                grid[index] = [];
                nodes.forEach(function(node) {
                    var minXSpot = node.__xSpot__;
                    var connectedNodes = node.__connectedNodes__;
                    if (grid[index][minXSpot] && grid[index][minXSpot].__fixed__) {
                        var i = 0;
                        while (grid[index][i++]) {}
                        minXSpot = i;
                    }


                    var minDistance = clacLinkDistance(minXSpot, index, connectedNodes);

                    for (var i = 0; i <= maxCoulum + 2; i++) {
                        if (!(grid[index][i] && grid[index][i].__fixed__)) {
                            var distance = clacLinkDistance(i, index, connectedNodes);
                            if (distance <= minDistance) {
                                minDistance = distance;
                                minXSpot = i;
                            }
                        }
                    }


                    if (grid[node.__ySpot__][node.__xSpot__] && !grid[node.__ySpot__][node.__xSpot__].__fixed__) {
                        grid[node.__ySpot__][node.__xSpot__] = undefined;
                    }
                    grid[index][minXSpot] = node;
                    node.__xSpot__ = minXSpot;
                    node.__fixed__ = true;
                });
                grid[index].forEach(function(item, i) {
                    if (i !== item.__xSpot__) {
                        grid[index][i] = undefined;
                    }
                })
            });







            console.log(maxCoulum);






            //topoData.nodes.forEach(function(node) {
            //    var yOrder = Math.floor(node.y / yCell);
            //    var xOrder = Math.floor(node.x / xCell);
            //
            //    var xSpot = xOrder,
            //        ySpot = yOrder;
            //    var step = 1;
            //    while (grid[xSpot][ySpot]) {
            //        var find = false;
            //        for (var i = step; i >= step * -1; i--) {
            //            for (var j = 0; j < step; j++) {
            //                if (grid[xSpot + i] && !grid[xSpot + i][ySpot + j]) {
            //                    find = true;
            //                    break;
            //                }
            //            }
            //            if (find) {
            //                break;
            //            }
            //        }
            //
            //        if (find) {
            //            xSpot += i;
            //            ySpot += j;
            //        }
            //
            //        step++;
            //    }
            //
            //    grid[xSpot][ySpot] = node;
            //
            //
            //    node.__xSpot__ = xSpot;
            //    node.__ySpot__ = ySpot;
            //
            //});


            //levelGap = 0;
            //i = 0
            //while (i < grid.length) {
            //    var level = grid[i];
            //    if (level.length == 0) {
            //        levelGap++;
            //        console.log(i);
            //        grid.splice(i, 1);
            //    }
            //    //level.forEach(function(node) {
            //    //    if (node) {
            //    //        node.__ySpot__ -= levelGap;
            //    //    }
            //    //})
            //    i++;
            //}

            //grid.forEach(function(row, index) {
            //    row.forEach(function(node) {
            //        if(node){
            //            node.__ySpot__ = index;
            //        }
            //    })
            //})

            //var l = grid.length;
            //levelGap = 0;
            //while (l) {
            //    var row = grid[grid.length - (l--)];
            //    if (row.length == 0) {
            //        levelGap++;
            //        grid.splice(grid.length - l - 1, 1);
            //    }
            //    row.forEach(function(node) {
            //        node.__ySpot__ -= levelGap;
            //    });
            //}

            topoData.nodes.forEach(function(node) {
                node.y = node.__ySpot__ * yCell * 1;
                node.x = node.__xSpot__ * xCell * (grid.length / maxCoulum)*2;
            });

            console.log(grid.length, maxCoulum)

            console.timeEnd('Layout');
            fn(topoData);


        });

    }

})(window);