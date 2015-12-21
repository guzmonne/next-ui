(function(nx, global) {

    global.generateTree = function(level, depth, number) {
        var _number = number || _random(2, 4);
        var ary = [];
        if (level <= depth) {
            return;
        }
        for (var i = 0; i < _number; i++) {
            var obj = {
                id: nx.uuid(),
                value: _random(100),
                depth: depth
            };
            var children = generateTree(level, depth + 1);
            if (children) {
                obj.children = children;
            }

            ary.push(obj);
        }
        return ary;
    };

    var _random = function(start, end) {
        if (end) {
            return Math.floor(Math.random() * (end - start)) + start;
        } else {
            return Math.floor(Math.random() * start);
        }

    }




})(nx, window);