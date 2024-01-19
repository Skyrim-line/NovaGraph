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

std::vector<VecInt> dijkstra_source_to_all(igraph_integer_t src) {
    igraph_vector_int_list_t paths;
    igraph_vector_int_list_t edges;

    igraph_vector_int_list_init(&paths, 0);
    igraph_vector_int_list_init(&edges, 0);

    igraph_vs_t targets = igraph_vss_all(); // list of all vertices

    igraph_get_shortest_paths_dijkstra(&globalGraph, &paths, &edges, src, targets, /* TODO*/ NULL, IGRAPH_OUT, NULL, NULL);

    std::vector<VecInt> res;
    long numPaths = igraph_vector_int_list_size(&paths);

    for (long i = 0; i < numPaths; ++i) {
        igraph_vector_int_t path = VECTOR(paths)[i];
        std::vector<int> pathVector(VECTOR(path), VECTOR(path) + igraph_vector_int_size(&path));
        res.push_back(pathVector);
        igraph_vector_int_destroy(&path);
    }

    return res;
}