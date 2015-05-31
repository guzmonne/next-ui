(function(nx, global) {
    nx.define("RingChart", nx.ui.Component, {
        properties: {},
        view: {
            content: [{
                name: "stage",
                type: "nx.graphic.Stage",
                props: {
                    width: 800,
                    height: 800
                },
                content: [{
                    name: 'rootRing',
                    type: 'RootRing',
                    props: {
                        'data-name': 'rootRing',
                        translateX: 300,
                        translateY: 300
                    }
                }, {
                    type: 'nx.graphic.Group',
                    props: {
                        translateX: 300,
                        translateY: 300
                    },
                    content: []
                }, {
                    type: 'nx.graphic.Group',
                    props: {
                        translateX: 300,
                        translateY: 300
                    }
                }, {
                    type: 'nx.graphic.Group',
                    props: {
                        translateX: 300,
                        translateY: 300
                    },
                    content: [{
                        name: 'line1',
                        type: 'nx.graphic.Path',
                        props: {
                            fill: 'transparent',
                            stroke: '#f00'
                        }
                    }, {
                        name: 'line2',
                        type: 'nx.graphic.Path',
                        props: {
                            fill: 'transparent',
                            stroke: '#f00'
                        }
                    }, {
                        name: 'line3',
                        type: 'nx.graphic.Path',
                        props: {
                            fill: 'transparent',
                            stroke: '#f00'
                        }
                    }]
                }]
            }]
        },
        methods: {

        }
    });
})(nx, window);