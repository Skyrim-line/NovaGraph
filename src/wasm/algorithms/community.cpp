#include "../graph.h"
#include <iostream>
#include <string>

void throw_error_if_directed(const std::string& algorithm) {
    if (igraph_is_directed(&globalGraph)) {
        std::string message = "The " + algorithm + " algorithm does not support directed graphs";
        throw std::runtime_error(message);
    }
}

val louvain(igraph_real_t resolution) {
    IGraphVectorInt membership;
    IGraphVector modularity;
    igraph_real_t modularity_metric;
    std::stringstream stream;

    throw_error_if_directed("Louvain");
    igraph_community_multilevel(&globalGraph, igraph_weights(), resolution, membership.vec(), NULL, modularity.vec());
    igraph_modularity(&globalGraph, membership.vec(), igraph_weights(), resolution, IGRAPH_DIRECTED, &modularity_metric);

    val result = val::object();
    val colorMap = val::object();
    val data = val::object();

    stream << std::fixed << std::setprecision(2) << modularity_metric;
    data.set("modularity", std::stod(stream.str()));
    
    std::map<int, std::vector<std::string>> communityMap;
    for (igraph_integer_t v = 0; v < membership.size(); ++v) {
        igraph_integer_t community = membership.at(v);
        colorMap.set(v, community);
        communityMap[community].push_back(igraph_get_name(v));
    }

    val communities = val::array();
    for (const auto& [community, vertices] : communityMap) {
        communities.set(community, val::array(vertices));
    }

    result.set("colorMap", colorMap);
    result.set("mode", MODE_RAINBOW);
    data.set("communities", communities);
    result.set("data", data);
    return result;
}

val leiden(igraph_real_t resolution) {
    igraph_integer_t n_iterations = 100;
    IGraphVectorInt membership;
    igraph_real_t quality, modularity_metric;
    std::stringstream stream, stream2;

    throw_error_if_directed("Leiden");
    igraph_community_leiden(&globalGraph, igraph_weights(), NULL, resolution, 0.01, false, n_iterations, membership.vec(), NULL, &quality);
    igraph_modularity(&globalGraph, membership.vec(), igraph_weights(), resolution, IGRAPH_DIRECTED, &modularity_metric);

    val result = val::object();
    val colorMap = val::object();
    val data = val::object();

    stream << std::fixed << std::setprecision(2) << modularity_metric;
    data.set("modularity", std::stod(stream.str()));

    stream2 << std::fixed << std::setprecision(2) << quality;
    data.set("quality", std::stod(stream2.str()));

    std::map<int, std::vector<std::string>> communityMap;
    for (igraph_integer_t v = 0; v < membership.size(); ++v) {
        igraph_integer_t community = membership.at(v);
        colorMap.set(v, community);
        communityMap[community].push_back(igraph_get_name(v));
    }

    val communities = val::array();
    for (const auto& [community, vertices] : communityMap) {
        communities.set(community, val::array(vertices));
    }

    result.set("colorMap", colorMap);
    result.set("mode", MODE_RAINBOW);
    data.set("communities", communities);
    result.set("data", data);
    return result;
}

val fast_greedy(void) {
    IGraphVectorInt membership;
    IGraphVector modularity;
    std::stringstream stream;

    throw_error_if_directed("Fast-Greedy");
    igraph_community_fastgreedy(&globalGraph, igraph_weights(), NULL, modularity.vec(), membership.vec());

    val result = val::object();
    val colorMap = val::object();
    val data = val::object();

    stream << std::fixed << std::setprecision(2) << modularity.max();
    data.set("modularity", std::stod(stream.str()));

    std::map<int, std::vector<std::string>> communityMap;
    for (igraph_integer_t v = 0; v < membership.size(); ++v) {
        igraph_integer_t community = membership.at(v);
        colorMap.set(v, community);
        communityMap[community].push_back(igraph_get_name(v));
    }

    val communities = val::array();
    for (const auto& [community, vertices] : communityMap) {
        communities.set(community, val::array(vertices));
    }
    
    result.set("colorMap", colorMap);
    result.set("mode", MODE_RAINBOW);
    data.set("communities", communities);
    result.set("data", data);
    return result;
}
