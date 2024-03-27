#include "generator.h"

std::string check_attribute(void) {
    if (igraph_cattribute_has_attr(&igraphGlobalGraph, IGRAPH_ATTRIBUTE_VERTEX, "name")) {
        return "name";
    } else if (igraph_cattribute_has_attr(&igraphGlobalGraph, IGRAPH_ATTRIBUTE_VERTEX, "label")) {
        return "label";
    } else if (igraph_cattribute_has_attr(&igraphGlobalGraph, IGRAPH_ATTRIBUTE_VERTEX, "id")) {
        return "id";
    } else {
        return NULL;
    }
}

val graph_nodes(void) {
    val nodes = val::array();
    std::string attr = check_attribute();
    for (igraph_integer_t i = 0; i < igraph_vcount(&igraphGlobalGraph); i++) {
        val n = val::object();
        n.set("id", i);
        if (!attr.empty()) n.set("name", VAS(&igraphGlobalGraph, attr.c_str(), i));
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