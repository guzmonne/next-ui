(function(nx, global) {
    nx.define("ThirdRingItem", nx.graphic.Component, {
        properties: {},
        view: {
            type: 'nx.graphic.Group',
            props: {
                'data-name': 'ThirdRingItem',
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
                    'click': '{#_click}'
                }
            }]
        },
        methods: {
            _click:function(){
                //var secondRing = this.owner().owner().owner().owner().owner();
                this.owner().owner().owner().owner().owner().owner().expand();
            }
        }
    });
})(nx, window);