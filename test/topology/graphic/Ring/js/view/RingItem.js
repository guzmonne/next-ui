(function(nx, global) {
    nx.define("RingItem", nx.graphic.Component, {
        properties: {},
        view: {
            type: 'nx.graphic.Group',
            props: {
                'data-name': 'ringItem',
                'data-innerRadius': '{innerRadius}',
                'data-outerRadius': '{outerRadius}',
                'data-startAngle': '{startAngle}',
                'data-endAngle': '{endAngle}',
                'data-percentage': '{model.percentage}',
                'data-deltaPercentage': '{model.deltaPercentage}'
            },
            content: [{
                type: nx.graphic.Arc,
                props: {
                    innerRadius: '{ani_props.innerRadius}',
                    outerRadius: '{ani_props.outerRadius}',
                    startAngle: '{ani_props.startAngle}',
                    endAngle: '{ani_props.endAngle}',
                    fill: '{color}'
                },
                events: {
                    'click': '{click}'
                }
            }, {
                type: 'Ring'
            }]
        },
        methods: {}
    });
})(nx, window);