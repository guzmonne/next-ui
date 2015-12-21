(function(nx, global) {
    nx.define("SecondRing", nx.graphic.Component, {
        properties: {},
        view: {
            type: 'nx.graphic.Group',
            props: {
                'data-name': "SecondRing",
                items: '{ring.rings}',
                template: {
                    type: 'SecondRingItem'
                }
            }
        },
        methods: {}
    });
})(nx, window);