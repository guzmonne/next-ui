function collapse() {
    topo.aggregationNodes([0, 1]);
    topo.aggregationNodes([2, 3]);
    topo.aggregationNodes([4, 9, 10, 11]);
}

function expandToShow(ids) {
    var i, c, id, vertex, expanding = null;
    var vertices = topo.graph().vertices(),
        vertexSets = topo.graph().vertexSets();
    for (i = 0; i < ids.length; i++) {
        id = ids[i];
        c = vertex = vertices.getItem(id) || vertexSets.getItem(id);
        if (!vertex || vertex.generated()) {
            continue;
        }
        while (c.parentVertexSet() && !c.generated()) {
            c = c.parentVertexSet();
        }
        if (c !== vertex) {
            expanding = topo.getNode(c.id());
            break;
        }
    }
    if (expanding) {
        expanding.expand(false);
        expandToShow(ids);
    }
}
