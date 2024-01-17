#include "graph.h"
//#include <iostream>

VecInt dijkstra_source_to_target(igraph_integer_t src, igraph_integer_t tar) {

    igraph_vector_int_t vertices;
    //igraph_vector_int_t edges;

    // TODO: change final NULL to weights
    igraph_get_shortest_path_dijkstra(&globalGraph, &vertices, NULL, src, tar, NULL, IGRAPH_OUT);

    VecInt vs;
    for (int i = 0; i < igraph_vector_int_size(&vertices); ++i) {
        vs.push_back(VECTOR(vertices)[i]);
    }

    igraph_vector_int_destroy(&vertices);

    return vs;
}