#include "generator.h"

val graph_nodes(void) {
    val nodes = val::array();
    for (igraph_integer_t i = 0; i < igraph_vcount(&igraphGlobalGraph); i++) {
        val n = val::object();
        n.set("id", i);
        n.set("name", VAS(&igraphGlobalGraph, "name", i));
        nodes.set(i, n);
    }
    return nodes;
}

val graph_edges(void) {
    val edges = val::array();
    for (igraph_integer_t i = 0; i < igraph_ecount(&igraphGlobalGraph); i++) {
        igraph_integer_t from, to;
        val e = val::object();
        igraph_edge(&igraphGlobalGraph, i, &from, &to);
        e.set("source", from);
        e.set("target", to);
        edges.set(i, e);
    }
    return edges;
}