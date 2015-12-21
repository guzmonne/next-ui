(function(nx, global) {
    nx.define("RootRing", nx.graphic.Component, {
        properties: {},
        view: {
            type: 'nx.graphic.Group',
            content: [{
                name: 'rings',
                type: 'nx.graphic.Group',
                props: {
                    items: '{ring.rings}',
                    template: {
                        type: 'RootRingItem'
                    }
                }
            }, {
                name: 'recoverBtn',
                type: 'nx.graphic.Circle',
                props: {
                    cx: '{outerRadius}',
                    cy: 0,
                    r: 10,
                    'class':'recoverBtn'
                },
                events: {
                    'click': '{#_click}'
                }
            }]
        },
        methods: {
            activeRing: function(index) {

                var rings = this.view('rings').view().content();
                var upRings = [];
                var downRings = [];


                if (index < 0 || index >= rings.count()) {
                    nx.each(rings, function(ring, i) {
                        ring.active(true);
                    });
                    this.model().ring().update();

                    this.view('recoverBtn').dom().removeClass('visible');

                    return;
                }

                nx.each(rings, function(ring, i) {
                    if (i < index) {
                        upRings.push(ring);
                    } else if (i > index) {
                        downRings.push(ring)
                    }

                });

                nx.each(downRings, function(ring, i) {
                    ring.collapseDirection('up');
                    ring.collapseIndex(i);
                    ring.active(false);
                });

                nx.each(upRings, function(ring, i) {
                    ring.collapseDirection('down');
                    ring.collapseIndex(i);
                    ring.active(false);
                });

                var currentRing = rings.getItem(index);

                currentRing.active('current');

                currentRing.model().sets({
                    startAngle: this.model().startAngle(),
                    endAngle: this.model().endAngle()
                }, this);

                this.view('recoverBtn').dom().addClass('visible');

            },
            _click: function() {
                this.activeRing(-1);
            }

        }
    });
})(nx, window);