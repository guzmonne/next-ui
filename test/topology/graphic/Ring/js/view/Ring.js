(function(nx, global) {
    nx.define("Ring", nx.graphic.Component, {
        properties: {},
        view: {
            type: 'nx.graphic.Group',
            props: {
                'data-name':"x123",
                items: '{ring.rings}',
                template: {
                    type: 'RingItem'
                }
            }
        },
        methods: {}
    });
})(nx, window);