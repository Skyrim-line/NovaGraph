#include "../graph.h"
#include <iostream>
#include <string>

/* Community Algorithms future change:
    - instead of a table where each vertex is a row,
    - have a table where each community is a row and vertices are shown in an array
*/ 

val louvain(igraph_real_t resolution) {
    IGraphVectorInt membership;
    IGraphVector modularity;
    igraph_real_t modularity_metric;

    igraph_community_multilevel(&igraphGlobalGraph, NULL /*todo*/, resolution, membership.vec(), NULL, modularity.vec());
    igraph_modularity(&igraphGlobalGraph, membership.vec(), NULL /*todo*/, resolution, IGRAPH_UNDIRECTED, &modularity_metric);

    val result = val::object();
    val colorMap = val::object();
    std::string msg = "Louvain Community Detection Algorithm\n";

    msg += "Modularity: " + std::to_string(modularity_metric) + "\n";
    msg += "Number of communities: " + std::to_string(membership.max() + 1) + "\n";

    msg += "Vertex ID\tCommunity ID\n";
    for (igraph_integer_t v = 0; v < membership.size(); ++v) {
        igraph_integer_t community = membership.at(v);
        colorMap.set(v, community);
        msg += std::to_string(v) + "\t\t" + std::to_string(community) + "\n";
    }

    result.set("colorMap", colorMap);
    result.set("message", msg);
    result.set("mode", MODE_RAINBOW);
    return result;
}

val leiden(igraph_real_t resolution) {
    igraph_integer_t n_iterations = 10; // TODO: Might need to modify this value in future?
    IGraphVectorInt membership;
    igraph_integer_t nb_clusters;
    igraph_real_t quality;

    igraph_community_leiden(&igraphGlobalGraph, NULL /*todo*/, NULL, resolution, 0.01, false, n_iterations, membership.vec(), &nb_clusters, &quality);

    val result = val::object();
    val colorMap = val::object();
    std::string msg = "Leiden Community Detection Algorithm\n";

    msg += "Number of communities: " + std::to_string(nb_clusters) + "\n";
    msg += "Partition quality: " + std::to_string(quality) + "\n";

    msg += "Vertex ID\tCommunity ID\n";
    for (igraph_integer_t v = 0; v < membership.size(); ++v) {
        igraph_integer_t community = membership.at(v);
        colorMap.set(v, community);
        msg += std::to_string(v) + "\t\t" + std::to_string(community) + "\n";
    }

    result.set("colorMap", colorMap);
    result.set("message", msg);
    result.set("mode", MODE_RAINBOW);
    return result;
}

val fast_greedy(void) {
    IGraphVectorInt membership;
    IGraphVector modularity;

    igraph_community_fastgreedy(&igraphGlobalGraph, NULL /*todo: weights*/, NULL, modularity.vec(), membership.vec());

    val result = val::object();
    val colorMap = val::object();
    std::string msg = "Community Detection Greedy Algorithm\n";

    msg += "Modularity: " + std::to_string(modularity.max()) + "\n";
    msg += "Number of communities: " + std::to_string(membership.max() + 1) + "\n";

    msg += "Vertex ID\tCommunity ID\n";
    for (igraph_integer_t v = 0; v < membership.size(); ++v) {
        igraph_integer_t community = membership.at(v);
        colorMap.set(v, community);
        msg += std::to_string(v) + "\t\t" + std::to_string(community) + "\n";
    }
    
    result.set("colorMap", colorMap);
    result.set("message", msg);
    result.set("mode", MODE_RAINBOW);
    return result;
}
