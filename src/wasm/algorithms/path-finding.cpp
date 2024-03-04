#include "../graph.h"
#include <iostream>
#include <string>

// Check connection
bool vertices_are_connected(igraph_integer_t src, igraph_integer_t tar) {
    igraph_bool_t res;
    igraph_are_connected(&igraphGlobalGraph, src, tar, &res);
    std::cout << "Connected status: " << res << std::endl;
    return res;
}


// DIJKSTRA

val dijkstra_source_to_target(igraph_integer_t src, igraph_integer_t tar) {
    igraph_vector_int_t vertices;

    // TODO: change final NULL to weights
    igraph_get_shortest_path_dijkstra(&igraphGlobalGraph, &vertices, NULL, src, tar, NULL, IGRAPH_OUT);

    val result = val::object();
    val colorMap = val::object();
    std::string msg =
        "Dijkstra's Shortest Path from ["
        + std::to_string(src)
        + "] to ["
        + std::to_string(tar)
        + "]:\n";

    for (int i = 0; i < igraph_vector_int_size(&vertices); ++i) {
        std::string nodeId = std::to_string(VECTOR(vertices)[i]);

        if (i > 0) {
            std::string linkId = std::to_string(VECTOR(vertices)[i-1]) + '-' + nodeId;
            //std::cout << colorMap[nodeId].as<int>() << std::endl;
            colorMap.set(linkId, getFreq(colorMap, linkId) + 1);
            msg += " -> ";
        }
        colorMap.set(nodeId, getFreq(colorMap, nodeId) + 1);
        msg += "[" + nodeId + "]";
    }

    result.set("colorMap", colorMap);
    result.set("message", msg);

    igraph_vector_int_destroy(&vertices);
    return result;
}

val dijkstra_source_to_all(igraph_integer_t src) {
    igraph_vector_int_list_t paths;
    igraph_vector_int_list_init(&paths, 0);
    igraph_vs_t targets = igraph_vss_all(); // list of all vertices

    igraph_get_shortest_paths_dijkstra(&igraphGlobalGraph, &paths, NULL, src, targets, /* TODO*/ NULL, IGRAPH_OUT, NULL, NULL);

    val res = igraph_vector_int_list_to_val(&paths);

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
    igraph_get_shortest_path_astar(&igraphGlobalGraph, &vertices, NULL, src, tar, NULL, IGRAPH_OUT, my_heuristic, NULL);

    VecInt vs;
    for (int i = 0; i < igraph_vector_int_size(&vertices); ++i) {
        vs.push_back(VECTOR(vertices)[i]);
    }

    igraph_vector_int_destroy(&vertices);

    return vs;
}
*/

// Yen
val yen_source_to_target(igraph_integer_t src, igraph_integer_t tar, igraph_integer_t k) {
    igraph_vector_int_list_t paths;
    igraph_vector_int_list_init(&paths, 0);

    igraph_get_k_shortest_paths(&igraphGlobalGraph, NULL, &paths, NULL, k, src, tar, IGRAPH_OUT);

    val res = igraph_vector_int_list_to_val(&paths);

    igraph_vector_int_list_destroy(&paths);
    return res;
}

    
// BELLMAN-FORD

val bf_source_to_target(igraph_integer_t src, igraph_integer_t tar) {
    igraph_vector_int_t vertices;

    // TODO: change final NULL to weights
    igraph_get_shortest_path_bellman_ford(&igraphGlobalGraph, &vertices, NULL, src, tar, NULL, IGRAPH_OUT);

    val vs = igraph_vector_int_to_val(&vertices);

    igraph_vector_int_destroy(&vertices);
    return vs;
}

val bf_source_to_all(igraph_integer_t src) {
    igraph_vector_int_list_t paths;
    igraph_vector_int_list_init(&paths, 0);
    igraph_vs_t targets = igraph_vss_all(); // list of all vertices

    igraph_get_shortest_paths_bellman_ford(&igraphGlobalGraph, &paths, NULL, src, targets, /* TODO*/ NULL, IGRAPH_OUT, NULL, NULL);

    val res = igraph_vector_int_list_to_val(&paths);
    
    igraph_vector_int_list_destroy(&paths);
    return res;
}


// BFS
val bfs(igraph_integer_t src) {
    val result = val::array();
    igraph_vector_int_t order, layers;
    igraph_vector_int_init(&order, 0);
    igraph_vector_int_init(&layers, 0);

    igraph_bfs_simple(&igraphGlobalGraph, src, IGRAPH_OUT, &order, &layers, NULL);

    igraph_integer_t current_layer = 1;
    val current_layer_array = val::array();

    for (igraph_integer_t i = 0; i < igraph_vector_int_size(&order); ++i) {
        int vertex = VECTOR(order)[i];
        int layer = VECTOR(layers)[current_layer];
    
        if (i == layer) {
            result.set(current_layer - 1, current_layer_array);
            current_layer_array = val::array();
            ++current_layer;
        }
        current_layer_array.set(current_layer_array["length"].as<int>(), vertex);        
    }
    result.set(current_layer - 1, current_layer_array);

    igraph_vector_int_destroy(&order);
    igraph_vector_int_destroy(&layers);
    return result;
}


val dfs(igraph_integer_t src) {
    igraph_vector_int_t order, dist;
    igraph_vector_int_init(&order, 0);
    igraph_vector_int_init(&dist, 0);

    igraph_dfs(&igraphGlobalGraph, src, IGRAPH_OUT, false, &order, NULL, NULL, &dist, NULL, NULL, NULL);

    int size = igraph_vector_int_size(&order);
    int maxDist = igraph_vector_int_max(&dist);

    //std::vector<VecInt> result;
    val result = val::array();

    //VecInt orderVec, distVec;
    val orderArr = val::array();
    val distArr = val::array();

    for (long int i = 0; i < size; ++i) {
        if (VECTOR(order)[i] != -1) {
            orderArr.set(orderArr["length"].as<int>() ,VECTOR(order)[i]);
        }
    }
    for (long int i = 0; i < igraph_vector_int_size(&dist); ++i) {
        // VECTOR(dist)[i] = distance from src
        // tmp = scaled distance (for rendering colours)
        if (VECTOR(dist)[i] < 0) {
            distArr.set(i, 0);
        } else {
            double tmp = (double)(maxDist - VECTOR(dist)[i] + 1)/(double)maxDist * size;
            distArr.set(i, tmp);
        }
    }

    result.set(0, orderArr);
    result.set(1, distArr);

    igraph_vector_int_destroy(&order);
    igraph_vector_int_destroy(&dist);
    return result;
}


val randomWalk(igraph_integer_t start, int steps) {
    igraph_vector_int_t vertices;
    igraph_vector_int_init(&vertices, 0);

    igraph_random_walk(&igraphGlobalGraph, NULL, &vertices, NULL, start, IGRAPH_OUT, steps, IGRAPH_RANDOM_WALK_STUCK_RETURN);

    val path = igraph_vector_int_to_val(&vertices);

    igraph_vector_int_destroy(&vertices);
    return path;
}


val min_spanning_tree(void) {
    igraph_t mst;

    // TODO: check for weights
    igraph_minimum_spanning_tree_unweighted(&igraphGlobalGraph, &mst);

    // TODO: convert graph to GraphData and return
    igraph_vector_int_t edges;
    igraph_integer_t num_edges = igraph_ecount(&mst);

    igraph_vector_int_init(&edges, num_edges * 2);
    igraph_get_edgelist(&mst, &edges, 0);

    //std::vector<VecInt> edges_list(num_edges);
    val edges_list = val::array();

    std::cout << "Edges:" << std::endl;
    for (int i = 0; i < num_edges; ++i) {
        //VecInt v;
        val v = val::array();

        v.set(0, VECTOR(edges)[2 * i]);
        v.set(1, VECTOR(edges)[2 * i + 1]);

        std::cout << VECTOR(edges)[2 * i] << ", " << VECTOR(edges)[2 * i + 1] << std::endl;
        //edges_list[i] = v;
        edges_list.set(i, v);
    }

    igraph_vector_int_destroy(&edges);
    igraph_destroy(&mst);

    return edges_list;
}
