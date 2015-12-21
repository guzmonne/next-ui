(function(nx, global) {


    nx.define("SecondRingItem", nx.graphic.Component, {
        statics: {
            borderInnerRadius: function(v) {
                return parseFloat(v) + 25;
            },
            borderOuterRadius: function(v) {
                return parseFloat(v) + 28;
            },
            borderOuterRadius2: function(v) {
                return parseFloat(v) + 40;
            },
            borderEndAngle: function(v) {
                if(v){
                    return parseFloat(v) + 1;
                }

            }
        },
        properties: {
            ring: {
                value: null
            }
        },
        view: {
            type: 'nx.graphic.Group',
            props: {
                'data-name': 'SecondRingItem'
            },
            content: [{
                name: 'arc',
                type: "nx.graphic.Arc",
                props: {
                    innerRadius: '{ani_props.innerRadius}',
                    outerRadius: '{ani_props.outerRadius}',
                    startAngle: '{ani_props.startAngle}',
                    endAngle: '{ani_props.endAngle}',
                    fill: '{color}',
                    'class': "secondRingItem"
                },
                events: {
                    'click': '{#_click}'
                }
            }, {
                name: 'borderArc',
                type: "nx.graphic.Arc",
                props: {
                    innerRadius: "{ani_props.innerRadius,converter=SecondRingItem.borderInnerRadius}",
                    outerRadius: '{ani_props.innerRadius,converter=SecondRingItem.borderOuterRadius}',
                    startAngle: '{ani_props.startAngle}',
                    endAngle: '{ani_props.endAngle}',
                    fill: '#eee',
                    'class': "secondRingItem"
                }
            }, {
                name: 'borderArc',
                type: "nx.graphic.Arc",
                props: {
                    innerRadius: "{ani_props.innerRadius,converter=SecondRingItem.borderInnerRadius}",
                    outerRadius: '{ani_props.outerRadius,converter=SecondRingItem.borderOuterRadius2}',
                    startAngle: '{ani_props.startAngle}',
                    endAngle: '{ani_props.startAngle,converter=SecondRingItem.borderEndAngle}',
                    fill: '#eee',
                    'class': "secondRingItem"
                }
            }]
        },
        methods: {
            _click: function(sender) {

                ring = new ThirdRing();
                ring.model(this.model());
                ring.attach(this);

                this.model().ring().animation(false);

                this.model().distance(-20);

                this.model().ring().update();

                setTimeout(function() {
                    ring.view().dom().addClass('visible');
                    this.model().ring().animation(true);
                }.bind(this), 50);


                this.view('arc').view().dom().addClass('hidden');
            }


        }
    });
})(nx, window);