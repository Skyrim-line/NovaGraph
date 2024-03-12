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
            colorMap.set(linkId, N);
            msg += " -> ";
        }
        colorMap.set(nodeId, N / 2);
        msg += "[" + nodeId + "]";
    }

    colorMap.set(src, N);
    colorMap.set(tar, N);
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

    val result = val::object();
    val colorMap = val::object();
    std::string msg =
        "Dijkstra's Shortest Paths from ["
        + std::to_string(src)
        + "] to all:";

    //val vss = val::array();
    for (long i = 0; i < igraph_vector_int_list_size(&paths); ++i) {
        igraph_vector_int_t p = VECTOR(paths)[i];
        int pLength = igraph_vector_int_size(&p);
        igraph_integer_t dest = VECTOR(p)[pLength - 1];

        if (dest == src) continue;

        msg += "\n[" + std::to_string(dest) + "]: ";

        for (long j = 0; j < pLength; ++j) {
            std::string nodeId = std::to_string(VECTOR(p)[j]);

            if (j > 0) {
                std::string linkId = std::to_string(VECTOR(p)[j-1]) + '-' + nodeId;
                colorMap.set(linkId, getFreq(colorMap, linkId) + 1);
                msg += " -> ";
            }
            colorMap.set(nodeId, getFreq(colorMap, nodeId) + 1);
            msg += "[" + nodeId + "]";
        }
    }

    colorMap.set(src, N);
    result.set("colorMap", colorMap);
    result.set("message", msg);

    igraph_vector_int_list_destroy(&paths);
    return result;
}


// A*
// ??

// Yen
val yen_source_to_target(igraph_integer_t src, igraph_integer_t tar, igraph_integer_t k) {
    igraph_vector_int_list_t paths;
    igraph_vector_int_list_init(&paths, 0);

    igraph_get_k_shortest_paths(&igraphGlobalGraph, NULL, &paths, NULL, k, src, tar, IGRAPH_OUT);
    int pathsLength = igraph_vector_int_list_size(&paths);

    val result = val::object();
    val colorMap = val::object();
    std::string msg =
        (pathsLength == 0) ? (
            "No paths "
        ) : (pathsLength < k) ? (
            "Only " + std::to_string(pathsLength) +
            " (from " + std::to_string(k) + ") shortest paths "
        ) : (
            std::to_string(k) + " shortest paths "
        );
    
    msg +=
        "found from [" + std::to_string(src) + "] " +
        "to [" + std::to_string(tar) + "] using Yen's algorithm";

    for (long i = 0; i < pathsLength; ++i) {
        igraph_vector_int_t p = VECTOR(paths)[i];
        msg += "\nPath " + std::to_string(i+1) + ": ";

        for (long j = 0; j < igraph_vector_int_size(&p); ++j) {
            std::string nodeId = std::to_string(VECTOR(p)[j]);

            if (j > 0) {
                std::string linkId = std::to_string(VECTOR(p)[j-1]) + '-' + nodeId;
                colorMap.set(linkId, N);
                msg += " -> ";
            }
            colorMap.set(nodeId, N / 2);
            msg += "[" + nodeId + "]";
        }
    }

    colorMap.set(src, N);
    colorMap.set(tar, N);
    result.set("colorMap", colorMap);
    result.set("message", msg);

    igraph_vector_int_list_destroy(&paths);
    return result;
}

    
// BELLMAN-FORD

val bf_source_to_target(igraph_integer_t src, igraph_integer_t tar) {
    igraph_vector_int_t vertices;

    // TODO: change final NULL to weights
    igraph_get_shortest_path_bellman_ford(&igraphGlobalGraph, &vertices, NULL, src, tar, NULL, IGRAPH_OUT);

    val result = val::object();
    val colorMap = val::object();
    std::string msg =
        "Bellman-Ford Shortest Path from [" +
        std::to_string(src) + "] to [" +
        std::to_string(tar) + "]:\n";
    
    for (int i = 0; i < igraph_vector_int_size(&vertices); ++i) {
        std::string nodeId = std::to_string(VECTOR(vertices)[i]);

        if (i > 0) {
            std::string linkId = std::to_string(VECTOR(vertices)[i-1]) + '-' + nodeId;
            colorMap.set(linkId, N);
            msg += " -> ";
        }
        colorMap.set(nodeId, N / 2);
        msg += "[" + nodeId + "]";
    }
    colorMap.set(src, N);
    colorMap.set(tar, N);
    result.set("colorMap", colorMap);
    result.set("message", msg);

    igraph_vector_int_destroy(&vertices);
    return result;
}

val bf_source_to_all(igraph_integer_t src) {
    igraph_vector_int_list_t paths;
    igraph_vector_int_list_init(&paths, 0);
    igraph_vs_t targets = igraph_vss_all(); // list of all vertices

    igraph_get_shortest_paths_bellman_ford(&igraphGlobalGraph, &paths, NULL, src, targets, /* TODO*/ NULL, IGRAPH_OUT, NULL, NULL);

    val result = val::object();
    val colorMap = val::object();
    std::string msg =
        "Bellman-Ford Shortest Paths from ["
        + std::to_string(src)
        + "] to all:";

    //val vss = val::array();
    for (long i = 0; i < igraph_vector_int_list_size(&paths); ++i) {
        igraph_vector_int_t p = VECTOR(paths)[i];
        int pLength = igraph_vector_int_size(&p);
        igraph_integer_t dest = VECTOR(p)[pLength - 1];

        if (dest == src) continue;

        msg += "\n[" + std::to_string(dest) + "]: ";

        for (long j = 0; j < pLength; ++j) {
            std::string nodeId = std::to_string(VECTOR(p)[j]);

            if (j > 0) {
                std::string linkId = std::to_string(VECTOR(p)[j-1]) + '-' + nodeId;
                colorMap.set(linkId, getFreq(colorMap, linkId) + 1);
                msg += " -> ";
            }
            colorMap.set(nodeId, getFreq(colorMap, nodeId) + 1);
            msg += "[" + nodeId + "]";
        }
    }
    colorMap.set(src, N);
    result.set("colorMap", colorMap);
    result.set("message", msg);

    igraph_vector_int_list_destroy(&paths);
    return result;
}


// BFS
val bfs(igraph_integer_t src) {
    igraph_vector_int_t order, layers;
    igraph_vector_int_init(&order, 0);
    igraph_vector_int_init(&layers, 0);

    igraph_bfs_simple(&igraphGlobalGraph, src, IGRAPH_OUT, &order, &layers, NULL);

    val result = val::object();
    val colorMap = val::object();
    std::string msg = "BFS from [" + std::to_string(src) + "]:\n";

    int nodes_remaining = N;
    bool new_iteration = true;
    int orderLength = igraph_vector_int_size(&order);
    igraph_integer_t current_layer = 1;

    for (igraph_integer_t i = 0; i < orderLength; ++i) {
        if (new_iteration) {
            msg += "Iteration " + std::to_string(current_layer) + ": [";
            new_iteration = false;
        }

        std::string nodeId = std::to_string(VECTOR(order)[i]);
        msg += nodeId;
        colorMap.set(nodeId, nodes_remaining);

        //int vertex = VECTOR(order)[i];
        int layer = VECTOR(layers)[current_layer];
        std::cout << "Current layer: " << layer << "; i: " << i << "Node: " << nodeId << std::endl;

    
        if (i + 1 == layer || i + 1 == orderLength) {
            msg += "]\n";
            nodes_remaining = N - i - 1;
            ++current_layer;
            new_iteration = true;
        } else {
            msg += ", ";
        }
    }
    result.set("colorMap", colorMap);
    result.set("message", msg);

    igraph_vector_int_destroy(&order);
    igraph_vector_int_destroy(&layers);
    return result;
}


val dfs(igraph_integer_t src) {
    igraph_vector_int_t order, dist;
    igraph_vector_int_init(&order, 0);
    igraph_vector_int_init(&dist, 0);

    igraph_dfs(&igraphGlobalGraph, src, IGRAPH_OUT, false, &order, NULL, NULL, &dist, NULL, NULL, NULL);

    int orderLength = igraph_vector_int_size(&order);
    int maxDist = igraph_vector_int_max(&dist);

    val result = val::object();
    val colorMap = val::object();
    //val exported = val::object(); // for user export on frontend
    std::string msg = "DFS order from [" + std::to_string(src) + "]\n";

    for (long int i = 0; i < orderLength; ++i) {
        std::string nodeId = std::to_string(VECTOR(order)[i]);
        if (VECTOR(order)[i] == -1) continue;

        msg += nodeId;
        if (i < orderLength - 1) msg += " -> ";
        // TODO: push nodeId to exported
    }

    // get scaled distance for colour map
    for (long int i = 0; i < igraph_vector_int_size(&dist); ++i) {
        int distance_from_src = VECTOR(dist)[i];

        if (distance_from_src < 0) {
            colorMap.set(i, 0);
        } else {
            double tmp = (double)(maxDist - VECTOR(dist)[i] + 1)/(double)maxDist * orderLength;
            colorMap.set(i, tmp);
        }
    }

    result.set("colorMap", colorMap);
    result.set("message", msg);

    igraph_vector_int_destroy(&order);
    igraph_vector_int_destroy(&dist);
    return result;
}


val randomWalk(igraph_integer_t start, int steps) {
    igraph_vector_int_t vertices;
    igraph_vector_int_init(&vertices, 0);

    igraph_random_walk(&igraphGlobalGraph, NULL, &vertices, NULL, start, IGRAPH_OUT, steps, IGRAPH_RANDOM_WALK_STUCK_RETURN);

    val result = val::object();
    val colorMap = val::object();
    std::string msg =
        "Random Walk from [" +
        std::to_string(start) + "] with " +
        std::to_string(steps) + " steps:\n";

    std::map<int, int> M;

    for (int i = 0; i < igraph_vector_int_size(&vertices); ++i) {
        int node = VECTOR(vertices)[i];
        if (M.find(node) == M.end()) {
            M[node] = 2;
        } else {
            M[node] += 2;
        }

        std::string nodeId = std::to_string(node);

        if (i > 0) {
            std::string linkId = std::to_string(VECTOR(vertices)[i-1]) + '-' + nodeId;
            colorMap.set(linkId, N);
            msg += " -> ";
        }
        msg += "[" + nodeId + "]";
    }
    M[start] = N;

    for (const auto& entry : M) {
        std::cout << "[" << entry.first << "]: " << entry.second << std::endl;
        colorMap.set(entry.first, entry.second);
    }
    result.set("colorMap", colorMap);
    result.set("message", msg);

    igraph_vector_int_destroy(&vertices);
    return result;
}


val min_spanning_tree(void) {
    igraph_t mst;

    // TODO: check for weights
    igraph_minimum_spanning_tree_unweighted(&igraphGlobalGraph, &mst);

    igraph_vector_int_t edges;
    igraph_integer_t num_edges = igraph_ecount(&mst);

    igraph_vector_int_init(&edges, num_edges * 2);
    igraph_get_edgelist(&mst, &edges, 0);

    val result = val::object();
    val colorMap = val::object();
    std::string msg = "";
    //val exported = val::array(); (or return entire tree as json?)

    for (int i = 0; i < num_edges; ++i) {
        //val link = val::object();
        int n1 = VECTOR(edges)[2 * i];
        int n2 = VECTOR(edges)[2 * i + 1];
        std::string linkId = std::to_string(n1) + '-' + std::to_string(n2);
        
        colorMap.set(n1, N);
        colorMap.set(n2, N);
        colorMap.set(linkId, N);

        //link.set("from", VECTOR(edges)[2 * i]);
        //link.set("to", VECTOR(edges)[2 * i + 1]);
        //exported.set(i, v);
    }
    result.set("colorMap", colorMap);
    result.set("message", msg);

    igraph_vector_int_destroy(&edges);
    igraph_destroy(&mst);
    return result;
}
