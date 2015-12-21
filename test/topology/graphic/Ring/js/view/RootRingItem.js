(function(nx, global) {
    nx.define("RootRingItem", nx.graphic.Component, {
        properties: {
            labelPosition: {
                dependencies: ['model', 'owner'],
                value: function(model, owner) {
                    if (model) {
                        var ownerModel = this.owner().model();
                        var outerRadius = ownerModel.outerRadius();
                        var index = model.model().index();
                        var ringNumbers = ownerModel._ring._rings.length;

                        var x = outerRadius * 1.5;
                        var perY = (outerRadius * 1.6) / (ringNumbers - 1);
                        var y = outerRadius - perY * index - outerRadius * 0.2;

                        return {
                            x: x,
                            y: y
                        }
                    }
                }
            },
            d: {
                dependencies: ['model', 'labelPosition', 'model.ani_props'],
                value: function(model, labelPosition) {
                    if (model && labelPosition) {
                        var ownerModel = this.owner().model();
                        var ringStartAngle = ownerModel.startAngle();
                        var ringEndAngle = ownerModel.endAngle();
                        var innerRadius = ownerModel.innerRadius();
                        var outerRadius = ownerModel.outerRadius();
                        var innerCenterPoint = this.view('curve').innerCenterPoint();
                        var index = model.model().index();
                        var ringNumbers = ownerModel._ring._rings.length;
                        var angle = Math.min(ringStartAngle, 360 - ringEndAngle);

                        var x = innerRadius * Math.cos(angle * Math.PI / 180);
                        var y = innerRadius * Math.sin(angle * Math.PI / 180);
                        var gapStartPoint = {
                            x: x,
                            y: y * -1
                        };

                        var gapEndPoint = {
                            x: x,
                            y: y
                        };

                        var gap = gapStartPoint.y - gapEndPoint.y;
                        var perGap = gap / (ringNumbers + 1);

                        var points, d;

                        points = nx.geometry.BezierCurve.through([
                            [innerCenterPoint.x, innerCenterPoint.y],
                            [gapStartPoint.x, gapEndPoint.y + perGap * (index + 1)],
                            [labelPosition.x, labelPosition.y]
                        ]);

                        d = ['M', points[0][0], points[0][1]];
                        d.push('Q', points[1][0], points[1][1]);
                        d.push(points[2][0], points[2][1]);

                        //console.log(ringStartAngle, ringEndAngle, innerCenterPoint);


                        this.view('axl').sets({
                            x1: gapStartPoint.x,
                            y1: gapStartPoint.y,
                            x2: gapEndPoint.x,
                            y2: gapEndPoint.y
                        });

                        return d.join(' ');
                    }
                }
            },
            label: {
                dependencies: ['model', 'labelPosition'],
                value: function(model, labelPosition) {
                    if (model) {
                        return 'Group' + (this.model().model().index() + 1);
                    } else {
                        return 'Test';
                    }
                }
            },
            collapseDirection: {
                value: 'up'
            },
            collapseIndex: {
                value: 0
            },
            active: {
                equalityCheck: false,
                get: function() {
                    return this._active;
                },
                set: function(value) {
                    var model = this.model();
                    var collapseIndex = this.collapseIndex();
                    var collapseDirection = this.collapseDirection();
                    var ownerModel = this.owner().model();
                    var ringStartAngle = ownerModel.startAngle();
                    var ringEndAngle = ownerModel.endAngle();
                    var gapAngle = ownerModel.gapAngle();
                    var index = model.model().index();
                    var minSize = 10;

                    if (!value) {
                        if (collapseDirection == 'up') {
                            var _startAngle = ringEndAngle + collapseIndex * (minSize + gapAngle) + gapAngle;
                            this.model().sets({
                                startAngle: _startAngle,
                                endAngle: _startAngle + minSize
                            })
                        } else {
                            var _endAngle = ringStartAngle - collapseIndex * (minSize + gapAngle) - gapAngle;
                            this.model().sets({
                                startAngle: _endAngle - minSize,
                                endAngle: _endAngle
                            })
                        }

                        this.view('line').visible(false);

                    } else if (value == 'current') {
                        this.view('label').sets({
                            x: 0,
                            y: 0
                        });
                        this.view('label').view().dom().addClass('current');
                        this.view('line').visible(false);
                    } else {
                        this.view('label').view().dom().removeClass('current');
                        this.view('line').visible(true);
                        this.notify('labelPosition');
                    }



                    this._active = value;

                }
            }
        },
        view: {
            type: 'nx.graphic.Group',
            props: {
                'data-name': 'ringItem',
                //'data-index': '{model.index}',
                //'data-innerRadius': '{innerRadius}',
                //'data-outerRadius': '{outerRadius}',
                //'data-startAngle': '{startAngle}',
                //'data-endAngle': '{endAngle}',
                //'data-percentage': '{model.percentage}',
                //'data-deltaPercentage': '{model.deltaPercentage}',
                'data-visible': '{#active}'
            },
            content: [{
                name: 'curve',
                type: "nx.graphic.Arc",
                props: {
                    innerRadius: '{ani_props.innerRadius}',
                    outerRadius: '{ani_props.outerRadius}',
                    startAngle: '{ani_props.startAngle}',
                    endAngle: '{ani_props.endAngle}',
                    fill: '{color}'
                },
                events: {
                    'click': '{#expand}'
                }
            }, {
                name: 'line',
                type: 'nx.graphic.Path',
                props: {
                    d: '{#d}',
                    class: 'ring-text-path'
                }
            }, {
                name: 'label',
                type: 'nx.graphic.Text',
                props: {
                    translateX: 3,
                    x: '{#labelPosition.x}',
                    y: '{#labelPosition.y}',
                    text: '{#label}',
                    'class': "ring-text",
                    'visible': '{#active}'

                }
            }, {
                name: 'axl',
                type: 'nx.graphic.Line',
                props: {
                    'class': "ring-axl",
                    'visible': '{#active}'
                }
            }, {
                type: 'SecondRing',
                props: {
                    'visible': '{#active}'
                }
            }]
        },
        methods: {
            expand: function() {
                if (this._active == 'current') {
                    this.owner().owner().activeRing(-1); //crap
                } else {
                    this.owner().owner().activeRing(this.model().model().index()); //crap
                }
            }
        }
    });
})(nx, window);