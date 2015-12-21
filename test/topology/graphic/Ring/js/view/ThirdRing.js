(function(nx, global) {
    nx.define("ThirdRing", nx.graphic.Component, {
        properties: {},
        view: {
            type: 'nx.graphic.Group',
            props: {
                'data-name': "ThirdRing",
                items: '{ring.rings}',
                template: {
                    type: 'ThirdRingItem'
                }
            }
        },
        methods: {}
    });
})(nx, window);