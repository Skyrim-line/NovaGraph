#include "../graph.h"
#include <iostream>

// Check connection
bool vertices_are_connected(igraph_integer_t src, igraph_integer_t tar) {
    igraph_bool_t res;
    igraph_are_connected(&globalGraph, src, tar, &res);
    std::cout << "Connected status: " << res << std::endl;
    return res;
}


// DIJKSTRA

VecInt dijkstra_source_to_target(igraph_integer_t src, igraph_integer_t tar) {
    VecInt vs;
    igraph_vector_int_t vertices;

    // TODO: change final NULL to weights
    igraph_get_shortest_path_dijkstra(&globalGraph, &vertices, NULL, src, tar, NULL, IGRAPH_OUT);
    
    for (int i = 0; i < igraph_vector_int_size(&vertices); ++i) {
        vs.push_back(VECTOR(vertices)[i]);
    }

    igraph_vector_int_destroy(&vertices);

    return vs;
}

std::vector<VecInt> dijkstra_source_to_all(igraph_integer_t src) {
    std::vector<VecInt> res;
    igraph_vector_int_list_t paths;
    igraph_vector_int_list_init(&paths, 0);

    igraph_vs_t targets = igraph_vss_all(); // list of all vertices

    igraph_get_shortest_paths_dijkstra(&globalGraph, &paths, NULL, src, targets, /* TODO*/ NULL, IGRAPH_OUT, NULL, NULL);

    long numPaths = igraph_vector_int_list_size(&paths);

    for (long i = 0; i < numPaths; ++i) {
        igraph_vector_int_t path = VECTOR(paths)[i];
        std::vector<int> pathVector(VECTOR(path), VECTOR(path) + igraph_vector_int_size(&path));
        res.push_back(pathVector);
    }

    igraph_vector_int_list_destroy(&paths);

    return res;
}


// A*

/*
igraph_error_t my_heuristic(igraph_real_t *result, igraph_integer_t from, igraph_integer_t to, void *extra) {
    // Your heuristic calculation goes here
    // This function should estimate the distance from 'from' to 'to'
    // It should provide a lower value for better candidate exploration

    // For simplicity, let's use a constant heuristic value for demonstration
    *result = 1.0;
    igraph_distance

    return IGRAPH_SUCCESS;
}

VecInt astar_source_to_target(igraph_integer_t src, igraph_integer_t tar) {

    igraph_vector_int_t vertices;
    //igraph_vector_int_t edges;

    // TODO: change final NULL to weights
    igraph_get_shortest_path_astar(&globalGraph, &vertices, NULL, src, tar, NULL, IGRAPH_OUT, my_heuristic, NULL);

    VecInt vs;
    for (int i = 0; i < igraph_vector_int_size(&vertices); ++i) {
        vs.push_back(VECTOR(vertices)[i]);
    }

    igraph_vector_int_destroy(&vertices);

    return vs;
}
*/

// Yen
std::vector<VecInt> yen_source_to_target(igraph_integer_t src, igraph_integer_t tar, igraph_integer_t k) {
    std::vector<VecInt> res;
    igraph_vector_int_list_t paths;
    igraph_vector_int_list_init(&paths, 0);

    igraph_get_k_shortest_paths(&globalGraph, NULL, &paths, NULL, k, src, tar, IGRAPH_OUT);

    long numPaths = igraph_vector_int_list_size(&paths);

    for (long i = 0; i < numPaths; ++i) {
        igraph_vector_int_t path = VECTOR(paths)[i];
        std::vector<int> pathVector(VECTOR(path), VECTOR(path) + igraph_vector_int_size(&path));
        res.push_back(pathVector);
    }

    igraph_vector_int_list_destroy(&paths);

    return res;
}

    
// BELLMAN-FORD

VecInt bf_source_to_target(igraph_integer_t src, igraph_integer_t tar) {
    VecInt vs;
    igraph_vector_int_t vertices;

    // TODO: change final NULL to weights
    igraph_get_shortest_path_bellman_ford(&globalGraph, &vertices, NULL, src, tar, NULL, IGRAPH_OUT);

    for (int i = 0; i < igraph_vector_int_size(&vertices); ++i) {
        vs.push_back(VECTOR(vertices)[i]);
    }

    igraph_vector_int_destroy(&vertices);

    return vs;
}

std::vector<VecInt> bf_source_to_all(igraph_integer_t src) {
    std::vector<VecInt> res;
    igraph_vector_int_list_t paths;
    igraph_vector_int_list_init(&paths, 0);

    igraph_vs_t targets = igraph_vss_all(); // list of all vertices

    igraph_get_shortest_paths_bellman_ford(&globalGraph, &paths, NULL, src, targets, /* TODO*/ NULL, IGRAPH_OUT, NULL, NULL);

    long numPaths = igraph_vector_int_list_size(&paths);

    for (long i = 0; i < numPaths; ++i) {
        igraph_vector_int_t path = VECTOR(paths)[i];
        std::vector<int> pathVector(VECTOR(path), VECTOR(path) + igraph_vector_int_size(&path));
        res.push_back(pathVector);
    }
    
    igraph_vector_int_list_destroy(&paths);

    return res;
}


// BFS
std::vector<VecInt> bfs(igraph_integer_t src) {
    std::vector<VecInt> result;
    igraph_vector_int_t order;
    igraph_vector_int_init(&order, 0);
    igraph_vector_int_t layers;
    igraph_vector_int_init(&layers, 0);

    igraph_bfs_simple(&globalGraph, src, IGRAPH_OUT, &order, &layers, NULL);

    igraph_integer_t current_layer = 1;
    VecInt current_layer_vertices;

    for (igraph_integer_t i = 0; i < igraph_vector_int_size(&order); ++i) {
        int vertex = VECTOR(order)[i];
        int layer = VECTOR(layers)[current_layer];
    
        if (i == layer) {
            result.push_back(current_layer_vertices);
            current_layer_vertices.clear();
            ++current_layer;
        }
        current_layer_vertices.push_back(vertex);        
    }
    result.push_back(current_layer_vertices);

    igraph_vector_int_destroy(&order);
    igraph_vector_int_destroy(&layers);
    return result;
}


std::vector<VecInt> dfs(igraph_integer_t src) {
    igraph_vector_int_t order;
    igraph_vector_int_init(&order, 0);
    igraph_vector_int_t dist;
    igraph_vector_int_init(&dist, 0);

    igraph_dfs(&globalGraph, src, IGRAPH_OUT, false, &order, NULL, NULL, &dist, NULL, NULL, NULL);

    int size = igraph_vector_int_size(&order);
    int maxDist = igraph_vector_int_max(&dist);

    std::vector<VecInt> result;

    VecInt orderVec, distVec;
    for (long int i = 0; i < size; ++i) {
        if (VECTOR(order)[i] != -1) {
            orderVec.push_back(VECTOR(order)[i]);
        }
    }
    for (long int i = 0; i < igraph_vector_int_size(&dist); ++i) {
        // VECTOR(dist)[i] = distance from src
        // tmp = scaled distance (for rendering colours)
        if (VECTOR(dist)[i] < 0) {
            distVec.push_back(0);
        } else {
            double tmp = (double)(maxDist - VECTOR(dist)[i] + 1)/(double)maxDist * size;
            distVec.push_back(tmp);
        }
    }

    result.push_back(orderVec);
    result.push_back(distVec);

    igraph_vector_int_destroy(&order);
    igraph_vector_int_destroy(&dist);
    return result;
}


VecInt randomWalk(igraph_integer_t start, int steps) {
    igraph_vector_int_t vertices;
    igraph_vector_int_init(&vertices, 0);

    igraph_random_walk(&globalGraph, NULL, &vertices, NULL, start, IGRAPH_OUT, steps, IGRAPH_RANDOM_WALK_STUCK_RETURN);

    VecInt path;
    for (int i = 0; i < igraph_vector_int_size(&vertices); i++) {
        path.push_back(VECTOR(vertices)[i]);
    }

    igraph_vector_int_destroy(&vertices);
    return path;
}


std::vector<VecInt> min_spanning_tree(void) {
    igraph_t mst;

    // TODO: check for weights
    igraph_minimum_spanning_tree_unweighted(&globalGraph, &mst);

    // TODO: convert graph to GraphData and return
    igraph_vector_int_t edges;
    igraph_integer_t num_edges = igraph_ecount(&mst);

    igraph_vector_int_init(&edges, num_edges * 2);
    igraph_get_edgelist(&mst, &edges, 0);

    std::vector<VecInt> edges_list(num_edges);

    std::cout << "Edges:" << std::endl;
    for (int i = 0; i < num_edges; ++i) {
        VecInt v;

        v.push_back(VECTOR(edges)[2 * i]);
        v.push_back(VECTOR(edges)[2 * i + 1]);
        std::cout << VECTOR(edges)[2 * i] << ", " << VECTOR(edges)[2 * i + 1] << std::endl;
        edges_list[i] = v;
    }

    igraph_vector_int_destroy(&edges);
    igraph_destroy(&mst);

    return edges_list;
}
