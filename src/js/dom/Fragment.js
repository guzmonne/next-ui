(function (nx) {

    var Collection = nx.data.Collection;

    nx.define('nx.dom.Fragment', nx.dom.Node, {
        methods: {
            children: function () {
                var result = new Collection();
                nx.each(this.$dom.childNodes, function (child) {
                    result.add(new this.constructor(child));
                }, this);
                return result;
            }
        }
    });
})(nx);