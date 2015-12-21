(function (nx, global) {


    function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }

    function describeArc(x, y, radius, startAngle, endAngle) {

        var start = polarToCartesian(x, y, radius, endAngle);
        var end = polarToCartesian(x, y, radius, startAngle);

        var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

        var d = [
            "M", start.x, start.y,
            "A", radius, radius, 0, arcSweep, 0, end.x, end.y,
            "L", 0, 0
        ].join(" ");

        return d;
    }

    nx.define("ENC.TW.View.Node", nx.graphic.Topology.Node, {
        properties: {
            tagRingType: {
                value: 'Pi'
            }
        },
        methods: {
            attach: function (parent) {
                this.inherited(parent);
                var tagGroup = this.tagGroup = new nx.graphic.Group();
                tagGroup.attach(this.view());
            },
            addTag: function (tag) {
                var tags = this._tags = this._tags || {};
                tags[tag.get('key')] = tag;
            },
            removeTag: function (tag) {
                var tags = this._tags = this._tags || {};
                delete tags[tag.get('key')];
            },
            updateTag: function () {
                var tagGroup = this.tagGroup;
                tagGroup.dispose();

                tagGroup = this.tagGroup = new nx.graphic.Group();
                var size = this.getBound(true);
                var radius = Math.min(size.width, size.height) / 1.3;
                var length = Object.keys(this._tags).length;

                if (this.tagRingType() != 'Pi') {
                    nx.each(this._tags, function (tag) {
                        radius += 3;
                        var circle = new nx.graphic.Circle({
                            r: radius + 2,
                            fill: tag.get('color')
                        });
                        circle.attach(tagGroup, 0);
                    });
                } else {
                    var startAngle = 0;
                    var preAngle = 359.9 / length;
                    nx.each(this._tags, function (tag) {
                        var path = new nx.graphic.Path({
                            d: describeArc(0, 0, radius, startAngle, startAngle + preAngle),
                            fill: tag.get('color')
                        });
                        path.attach(tagGroup, 0);
                        startAngle += preAngle;
                    });
                }


                tagGroup.attach(this.view());
                this.dom().insertBefore(tagGroup.dom(), this.view('label').dom());
            }
        }
    });


})(nx, nx.global);