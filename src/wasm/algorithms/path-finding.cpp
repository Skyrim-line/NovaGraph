#include "../graph.h"
#include <iostream>
#include <string>

// Check connection
val vertices_are_connected(igraph_integer_t src, igraph_integer_t tar) {
    val result = val::object();
    val colorMap = val::object();
    std::string msg = "[" + std::to_string(src) + "] and [" + std::to_string(tar) + "] are ";
    igraph_bool_t res;
    igraph_are_connected(&igraphGlobalGraph, src, tar, &res);
    if (res) {
        msg += "neighbours!";
        colorMap.set(src, 1);
        colorMap.set(tar, 1);
        std::string linkId = std::to_string(src) + '-' + std::to_string(tar);
        colorMap.set(linkId, 1);
    } else {
        msg += "NOT neighbours!";
        colorMap.set(src, -1);
        colorMap.set(tar, -1);
    }
    result.set("colorMap", colorMap);
    result.set("message", msg);
    result.set("mode", MODE_COLOR_IMPORTANT);
    return result;
}


// DIJKSTRA

val dijkstra_source_to_target(igraph_integer_t src, igraph_integer_t tar) {
    IGraphVectorInt vertices, edges;
    bool hasWeights = VECTOR(globalWeights) != NULL;
    int edges_count = 0;
    int total_weight = 0;

    igraph_get_shortest_path_dijkstra(&igraphGlobalGraph, vertices.vec(), edges.vec(), src, tar, hasWeights ? &globalWeights : NULL, IGRAPH_OUT);

    val result = val::object();
    val colorMap = val::object();
    val data = val::object();

    data.set("source", igraph_get_name(src));
    data.set("target", igraph_get_name(tar));
    data.set("weighted", hasWeights);

    val path = val::array();
    for (int i = 0; i < vertices.size(); ++i) {
        int node = vertices.at(i);
        std::string nodeId = std::to_string(node);
        colorMap.set(nodeId, 0.5);

        if (i > 0) {
            std::string linkId = std::to_string(vertices.at(i-1)) + '-' + nodeId;
            colorMap.set(linkId, 1);

            val link = val::object();
            link.set("from", igraph_get_name(vertices.at(i-1)));
            link.set("to", igraph_get_name(node));

            int weight_index = edges.at(edges_count++);
            if (hasWeights) {
                link.set("weight", VECTOR(globalWeights)[weight_index]);
                total_weight += VECTOR(globalWeights)[weight_index];
            };

            path.set(i-1, link);
        }
    }
    colorMap.set(src, 1);
    colorMap.set(tar, 1);

    result.set("colorMap", colorMap);
    result.set("mode", MODE_COLOR_SHADE_DEFAULT);
    data.set("path", path);
    if (hasWeights) data.set("totalWeight", total_weight);
    result.set("data", data);
    return result;
}

val dijkstra_source_to_all(igraph_integer_t src) {
    IGraphVectorIntList paths, edges;
    bool hasWeights = VECTOR(globalWeights) != NULL;

    igraph_get_shortest_paths_dijkstra(&igraphGlobalGraph, paths.vec(), edges.vec(), src, igraph_vss_all(), hasWeights ? &globalWeights : NULL, IGRAPH_OUT, NULL, NULL);

    val result = val::object();
    val colorMap = val::object();
    val data = val::object();

    data.set("source", igraph_get_name(src));
    data.set("weighted", hasWeights);

    val pathsArray = val::array();
    int paths_count = 0;
    std::unordered_map<int, int> fm;
    for (long i = 0; i < paths.size(); ++i) {
        igraph_vector_int_t p = paths.at(i);
        igraph_vector_int_t e = edges.at(i);
        int edges_count = 0;
        int path_weight = 0;
        val pathDetails = val::object();

        int pLength = igraph_vector_int_size(&p);
        igraph_integer_t dest = VECTOR(p)[pLength - 1];

        // skip if path is to itself or if unreachable
        if (dest == src || pLength == 0) continue;

        pathDetails.set("target", igraph_get_name(dest));
        val pathArray = val::array();
        for (long j = 0; j < pLength; ++j) {
            int node = VECTOR(p)[j];
            std::string nodeId = std::to_string(node);

            if (j > 0) {
                std::string linkId = std::to_string(VECTOR(p)[j-1]) + '-' + nodeId;
                colorMap.set(linkId, 1);
                
                int weight_index = VECTOR(e)[edges_count++];
                if (hasWeights) {
                    path_weight += VECTOR(globalWeights)[weight_index];
                }
                
            }
            if (node != src) fm[node]++;
            pathArray.set(j, igraph_get_name(node));
        }

        if (hasWeights) pathDetails.set("weight", path_weight);
        pathDetails.set("path", pathArray);
        pathsArray.set(paths_count++, pathDetails);
    }
    frequenciesToColorMap(fm, colorMap);
    colorMap.set(src, 1);
    result.set("colorMap", colorMap);
    result.set("mode", MODE_COLOR_SHADE_ERROR);

    data.set("paths", pathsArray);
    result.set("data", data);
    return result;
}


// A*
// ??

// Yen
val yen_source_to_target(igraph_integer_t src, igraph_integer_t tar, igraph_integer_t k) {
    IGraphVectorIntList paths, edges;
    bool hasWeights = VECTOR(globalWeights) != NULL;
    val result = val::object();
    val colorMap = val::object();
    val data = val::object();
    
    igraph_get_k_shortest_paths(&igraphGlobalGraph, hasWeights ? &globalWeights : NULL, paths.vec(), edges.vec(), k, src, tar, IGRAPH_OUT);

    data.set("source", igraph_get_name(src));
    data.set("target", igraph_get_name(tar));
    data.set("k", k);
    data.set("weighted", hasWeights);
    
    val pathsArray = val::array();
    for (long i = 0; i < paths.size(); ++i) {
        igraph_vector_int_t p = paths.at(i);
        igraph_vector_int_t e = edges.at(i);
        int path_weight = 0;

        val pathDetails = val::object();
        val pathArray = val::array();
        for (long j = 0; j < igraph_vector_int_size(&p); ++j) {
            int node = VECTOR(p)[j];
            std::string nodeId = std::to_string(node);

            if (j > 0) {
                std::string linkId = std::to_string(VECTOR(p)[j-1]) + '-' + nodeId;
                colorMap.set(linkId, 1);
                
                int weight_index = VECTOR(e)[j-1];
                if (hasWeights) {
                    path_weight += VECTOR(globalWeights)[weight_index];
                }
            }
            colorMap.set(nodeId, 0.5);
            pathArray.set(j, igraph_get_name(node));
        }
        if (hasWeights) pathDetails.set("weight", path_weight);
        pathDetails.set("path", pathArray);
        pathsArray.set(i, pathDetails);
    }

    colorMap.set(src, 1);
    colorMap.set(tar, 1);
    result.set("colorMap", colorMap);
    result.set("mode", MODE_COLOR_SHADE_DEFAULT);

    data.set("paths", pathsArray);
    result.set("data", data);
    return result;
}

    
// BELLMAN-FORD

val bf_source_to_target(igraph_integer_t src, igraph_integer_t tar) {
    IGraphVectorInt vertices, edges;
    bool hasWeights = VECTOR(globalWeights) != NULL;
    int edges_count = 0;
    int total_weight = 0;

    igraph_get_shortest_path_bellman_ford(&igraphGlobalGraph, vertices.vec(), edges.vec(), src, tar, hasWeights ? &globalWeights : NULL, IGRAPH_OUT);

    val result = val::object();
    val colorMap = val::object();
    val data = val::object();

    data.set("source", igraph_get_name(src));
    data.set("target", igraph_get_name(tar));
    data.set("weighted", hasWeights);
    
    val path = val::array();
    for (int i = 0; i < vertices.size(); ++i) {
        int node = vertices.at(i);
        std::string nodeId = std::to_string(node);
        colorMap.set(nodeId, 0.5);

        if (i > 0) {
            std::string linkId = std::to_string(vertices.at(i-1)) + '-' + nodeId;
            colorMap.set(linkId, 1);
            
            val link = val::object();
            link.set("from", igraph_get_name(vertices.at(i-1)));
            link.set("to", igraph_get_name(node));

            int weight_index = edges.at(edges_count++);
            if (hasWeights) {
                link.set("weight", VECTOR(globalWeights)[weight_index]);
                total_weight += VECTOR(globalWeights)[weight_index];
            };

            path.set(i-1, link);
        }
    }
    colorMap.set(src, 1);
    colorMap.set(tar, 1);

    result.set("colorMap", colorMap);
    result.set("mode", MODE_COLOR_SHADE_DEFAULT);
    data.set("path", path);
    if (hasWeights) data.set("totalWeight", total_weight);
    result.set("data", data);
    return result;
}

val bf_source_to_all(igraph_integer_t src) {
    IGraphVectorIntList paths, edges;
    bool hasWeights = VECTOR(globalWeights) != NULL;

    igraph_get_shortest_paths_bellman_ford(&igraphGlobalGraph, paths.vec(), edges.vec(), src, igraph_vss_all(), hasWeights ? &globalWeights : NULL, IGRAPH_OUT, NULL, NULL);

    val result = val::object();
    val colorMap = val::object();
    val data = val::object();

    data.set("source", igraph_get_name(src));
    data.set("weighted", hasWeights);

    val pathsArray = val::array();
    int paths_count = 0;
    std::unordered_map<int, int> fm;
    for (long i = 0; i < paths.size(); ++i) {
        igraph_vector_int_t p = paths.at(i);
        igraph_vector_int_t e = edges.at(i);
        int edges_count = 0;
        int path_weight = 0;
        val pathDetails = val::object();

        int pLength = igraph_vector_int_size(&p);
        igraph_integer_t dest = VECTOR(p)[pLength - 1];

        if (dest == src || pLength == 0) continue;

        pathDetails.set("target", igraph_get_name(dest));
        val pathArray = val::array();
        for (long j = 0; j < pLength; ++j) {
            int node = VECTOR(p)[j];
            std::string nodeId = std::to_string(node);

            if (j > 0) {
                std::string linkId = std::to_string(VECTOR(p)[j-1]) + '-' + nodeId;
                colorMap.set(linkId, 1);
                
                int weight_index = VECTOR(e)[edges_count++];
                if (hasWeights) {
                    path_weight += VECTOR(globalWeights)[weight_index];
                }
            }
            if (node != src) fm[node]++;
            pathArray.set(j, igraph_get_name(node));
        }
        if (hasWeights) pathDetails.set("weight", path_weight);
        pathDetails.set("path", pathArray);
        pathsArray.set(paths_count++, pathDetails);
    }
    frequenciesToColorMap(fm, colorMap);
    colorMap.set(src, 1);
    result.set("colorMap", colorMap);
    result.set("mode", MODE_COLOR_SHADE_ERROR);

    data.set("paths", pathsArray);
    result.set("data", data);
    return result;
}


// BFS
val bfs(igraph_integer_t src) {
    IGraphVectorInt order, layers;
    int N, nodes_remaining, orderLength;

    igraph_bfs_simple(&igraphGlobalGraph, src, IGRAPH_OUT, order.vec(), layers.vec(), NULL);

    val result = val::object();
    val colorMap = val::object();
    std::string msg = "BFS from [" + std::to_string(src) + "]:\n";

    N = igraph_vcount(&igraphGlobalGraph);
    nodes_remaining = N;
    bool new_iteration = true;
    orderLength = order.size();
    igraph_integer_t current_layer = 1;

    std::unordered_map<int, int> fm;
    for (igraph_integer_t i = 0; i < orderLength; ++i) {
        if (new_iteration) {
            msg += "Iteration " + std::to_string(current_layer) + ": [";
            new_iteration = false;
        }

        int nodeId = order.at(i);
        msg += std::to_string(nodeId);
        fm[nodeId] = nodes_remaining;

        int layer = layers.at(current_layer);    
        if (i + 1 == layer || i + 1 == orderLength) {
            msg += "]\n";
            nodes_remaining = N - i - 1;
            ++current_layer;
            new_iteration = true;
        } else {
            msg += ", ";
        }
    }

    frequenciesToColorMap(fm, colorMap);
    result.set("colorMap", colorMap);
    result.set("message", msg);
    result.set("mode", MODE_COLOR_SHADE_ERROR);
    return result;
}


val dfs(igraph_integer_t src) {
    IGraphVectorInt order, dist;

    igraph_dfs(&igraphGlobalGraph, src, IGRAPH_OUT, false, order.vec(), NULL, NULL, dist.vec(), NULL, NULL, NULL);

    int orderLength = order.size();
    int maxDist = dist.max();

    val result = val::object();
    val colorMap = val::object();
    //val exported = val::object(); // for user export on frontend
    std::string msg = "DFS order from [" + std::to_string(src) + "]\n";

    for (long int i = 0; i < orderLength; ++i) {
        std::string nodeId = std::to_string(order.at(i));
        if (order.at(i) == -1) continue;

        msg += nodeId;
        if (i < orderLength - 1) msg += " -> ";
        // TODO: push nodeId to exported
    }

    // get scaled distance for colour map
    std::unordered_map<int, int> fm;
    for (long int i = 0; i < dist.size(); ++i) {
        int distance_from_src = dist.at(i);

        if (distance_from_src >= 0) {
            fm[i] = maxDist - distance_from_src + 1;
        }
    }

    frequenciesToColorMap(fm, colorMap);
    result.set("colorMap", colorMap);
    result.set("message", msg);
    result.set("mode", MODE_COLOR_SHADE_ERROR);
    return result;
}


val randomWalk(igraph_integer_t start, int steps) {
    IGraphVectorInt vertices;

    igraph_random_walk(&igraphGlobalGraph, NULL, vertices.vec(), NULL, start, IGRAPH_OUT, steps, IGRAPH_RANDOM_WALK_STUCK_RETURN);

    val result = val::object();
    val colorMap = val::object();
    std::string msg =
        "Random Walk from [" +
        std::to_string(start) + "] with " +
        std::to_string(steps) + " steps:\n";

    std::unordered_map<int, int> fm;
    for (int i = 0; i < vertices.size(); ++i) {
        int node = vertices.at(i);
        fm[node]++;

        std::string nodeId = std::to_string(node);

        if (i > 0) {
            std::string linkId = std::to_string(vertices.at(i-1)) + '-' + nodeId;
            colorMap.set(linkId, 1);
            msg += " -> ";
        }
        msg += "[" + nodeId + "]";
    }

    frequenciesToColorMap(fm, colorMap);
    result.set("colorMap", colorMap);
    result.set("message", msg);
    result.set("mode", MODE_COLOR_SHADE_ERROR);
    return result;
}


val min_spanning_tree(void) {
    igraph_t mst;

    // TODO: check for weights
    igraph_minimum_spanning_tree_unweighted(&igraphGlobalGraph, &mst);

    IGraphVectorInt edges;
    igraph_get_edgelist(&mst, edges.vec(), 0);

    val result = val::object();
    val colorMap = val::object();
    std::string msg = "";
    //val exported = val::array(); (or return entire tree as json?)

    for (int i = 0; i < igraph_ecount(&mst); ++i) {
        //val link = val::object();
        int n1 = edges.at(2 * i);
        int n2 = edges.at(2 * i + 1);
        std::string linkId = std::to_string(n1) + '-' + std::to_string(n2);
        
        colorMap.set(n1, 1);
        colorMap.set(n2, 1);
        colorMap.set(linkId, 1);

        //link.set("from", VECTOR(edges)[2 * i]);
        //link.set("to", VECTOR(edges)[2 * i + 1]);
        //exported.set(i, v);
    }
    result.set("colorMap", colorMap);
    result.set("message", msg);
    result.set("mode", MODE_COLOR_SHADE_ERROR); // TODO: test with larger disconnection?

    igraph_destroy(&mst);
    return result;
}
