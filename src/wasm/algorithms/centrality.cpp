#include "../graph.h"
#include <iostream>
#include <string>
#include <sstream>
#include <iomanip>

// For rendering on the frontend
#define MIN_SCALE 1
#define MAX_SCALE 50

double scaleCentrality(double centrality, double max_centrality) {
    double scaled = MIN_SCALE + (MAX_SCALE - MIN_SCALE) * (centrality / max_centrality);
    return scaled;
}

val betweenness_centrality(void) {
    igraph_vector_t betweenness;
    igraph_vector_init(&betweenness, 0);

    igraph_betweenness(&igraphGlobalGraph, &betweenness, igraph_vss_all(), true, NULL);

    double max_centrality = igraph_vector_max(&betweenness);
    val result = val::object();
    val sizeMap = val::object();
    std::string msg = "Betweenness Centrality:\n";

    std::cout << "Vertex\tBetweenness Centrality" << std::endl;
    for (igraph_integer_t v = 0; v < igraph_vcount(&igraphGlobalGraph); ++v) {
        double centrality = VECTOR(betweenness)[v];
        double scaled_centrality = scaleCentrality(centrality, max_centrality);

        std::cout << v << "\t" << scaled_centrality << std::endl;
        sizeMap.set(v, scaled_centrality);

        std::stringstream stream;
        stream << std::fixed << std::setprecision(2) << centrality;
        msg += std::to_string(v) + "\t" + stream.str() + "\n";
    }
    result.set("sizeMap", sizeMap);
    result.set("message", msg);

    igraph_vector_destroy(&betweenness);
    return result;
}