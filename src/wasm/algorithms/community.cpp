#include "../graph.h"
#include <iostream>
#include <string>

/* Community Algorithms future change:
    - instead of a table where each vertex is a row,
    - have a table where each community is a row and vertices are shown in an array
*/ 

val louvain(igraph_real_t resolution) {
    igraph_vector_int_t membership;
    igraph_vector_t modularity;
    igraph_vector_int_init(&membership, 0);
    igraph_vector_init(&modularity, 0);

    igraph_community_multilevel(&igraphGlobalGraph, NULL /*todo*/, resolution, &membership, NULL, &modularity);

    igraph_real_t modularity_metric;
    igraph_modularity(&igraphGlobalGraph, &membership, NULL /*todo*/, resolution, IGRAPH_UNDIRECTED, &modularity_metric);

    val result = val::object();
    val colorMap = val::object();
    std::string msg = "Louvain Community Detection Algorithm\n";

    msg += "Modularity: " + std::to_string(modularity_metric) + "\n";
    msg += "Number of communities: " + std::to_string(igraph_vector_int_max(&membership) + 1) + "\n";

    msg += "Vertex ID\tCommunity ID\n";
    for (igraph_integer_t v = 0; v < igraph_vector_int_size(&membership); ++v) {
        igraph_integer_t community = VECTOR(membership)[v];
        colorMap.set(v, community);
        msg += std::to_string(v) + "\t\t" + std::to_string(community) + "\n";
    }

    result.set("colorMap", colorMap);
    result.set("message", msg);
    result.set("mode", MODE_RAINBOW);

    igraph_vector_int_destroy(&membership);
    igraph_vector_destroy(&modularity);
    return result;
}

val leiden(igraph_real_t resolution) {
    igraph_integer_t n_iterations = 10; // TODO: Might need to modify this value in future?
    igraph_vector_int_t membership;
    igraph_vector_int_init(&membership, 0);
    igraph_integer_t nb_clusters;
    igraph_real_t quality;

    igraph_community_leiden(&igraphGlobalGraph, NULL /*todo*/, NULL, resolution, 0.01, false, n_iterations, &membership, &nb_clusters, &quality);

    val result = val::object();
    val colorMap = val::object();
    std::string msg = "Leiden Community Detection Algorithm\n";

    msg += "Number of communities: " + std::to_string(nb_clusters) + "\n";
    msg += "Partition quality: " + std::to_string(quality) + "\n";

    msg += "Vertex ID\tCommunity ID\n";
    for (igraph_integer_t v = 0; v < igraph_vector_int_size(&membership); ++v) {
        igraph_integer_t community = VECTOR(membership)[v];
        colorMap.set(v, community);
        msg += std::to_string(v) + "\t\t" + std::to_string(community) + "\n";
    }

    result.set("colorMap", colorMap);
    result.set("message", msg);
    result.set("mode", MODE_RAINBOW);

    igraph_vector_int_destroy(&membership);
    return result;
}

val fast_greedy(void) {
    igraph_vector_int_t membership;
    igraph_vector_t modularity;
    igraph_vector_int_init(&membership, 0);
    igraph_vector_init(&modularity, 0);

    igraph_community_fastgreedy(&igraphGlobalGraph, NULL /*todo: weights*/, NULL, &modularity, &membership);

    val result = val::object();
    val colorMap = val::object();
    std::string msg = "Community Detection Greedy Algorithm\n";

    msg += "Modularity: " + std::to_string(igraph_vector_max(&modularity)) + "\n";
    msg += "Number of communities: " + std::to_string(igraph_vector_int_max(&membership) + 1) + "\n";

    msg += "Vertex ID\tCommunity ID\n";
    for (igraph_integer_t v = 0; v < igraph_vector_int_size(&membership); ++v) {
        igraph_integer_t community = VECTOR(membership)[v];
        colorMap.set(v, community);
        msg += std::to_string(v) + "\t\t" + std::to_string(community) + "\n";
    }
    
    result.set("colorMap", colorMap);
    result.set("message", msg);
    result.set("mode", MODE_RAINBOW);

    igraph_vector_int_destroy(&membership);
    igraph_vector_destroy(&modularity);
    return result;
}
