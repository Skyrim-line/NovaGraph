#include "../graph.h"
#include <iostream>
#include <string>
#include <sstream>
#include <iomanip>

// For rendering on the frontend
#define MIN_SCALE 5
#define MAX_SCALE 30

double scaleCentrality(double centrality, double max_centrality) {
    double scaled = MIN_SCALE + (MAX_SCALE - MIN_SCALE) * (centrality / max_centrality);
    return scaled;
}


val betweenness_centrality(void) {
    IGraphVector betweenness;

    igraph_betweenness(&igraphGlobalGraph, betweenness.vec(), igraph_vss_all(), true, NULL);

    double max_centrality = betweenness.max();
    val result = val::object();
    val sizeMap = val::object();
    std::string msg = "Betweenness Centrality:\n";

    for (igraph_integer_t v = 0; v < igraph_vcount(&igraphGlobalGraph); ++v) {
        double centrality = betweenness.at(v);
        double scaled_centrality = scaleCentrality(centrality, max_centrality);

        sizeMap.set(v, scaled_centrality);

        std::stringstream stream;
        stream << std::fixed << std::setprecision(2) << centrality;
        msg += std::to_string(v) + "\t" + stream.str() + "\n";
    }
    result.set("sizeMap", sizeMap);
    result.set("message", msg);
    result.set("mode", MODE_SIZE_SCALAR);
    return result;
}

val closeness_centrality(void) {
    IGraphVector closeness;

    igraph_closeness(&igraphGlobalGraph, closeness.vec(), NULL, NULL, igraph_vss_all(), IGRAPH_OUT, NULL, true);

    double max_centrality = closeness.max_nonan();
    std::cout << "Max closeness centrality: " << max_centrality << std::endl;
    val result = val::object();
    val sizeMap = val::object();
    std::string msg = "Closeness Centrality:\n";

    for (igraph_integer_t v = 0; v < igraph_vcount(&igraphGlobalGraph); ++v) {
        double centrality = closeness.at(v);
        double scaled_centrality = scaleCentrality(isnan(centrality) ? 0 : centrality, max_centrality);

        sizeMap.set(v, scaled_centrality);

        std::stringstream stream;
        stream << std::fixed << std::setprecision(2) << centrality;
        msg += std::to_string(v) + "\t" + stream.str() + "\n";
    }
    result.set("sizeMap", sizeMap);
    result.set("message", msg);
    result.set("mode", MODE_SIZE_SCALAR);
    return result;
}

val degree_centrality(void) {
    IGraphVectorInt degrees;

    igraph_degree(&igraphGlobalGraph, degrees.vec(), igraph_vss_all(), IGRAPH_OUT, IGRAPH_NO_LOOPS);

    double max_centrality = degrees.max();
    val result = val::object();
    val sizeMap = val::object();
    std::string msg = "Degree Centrality:\n";

    for (igraph_integer_t v = 0; v < degrees.size(); ++v) {
        double centrality = degrees.at(v);
        double scaled_centrality = scaleCentrality(centrality, max_centrality);
        sizeMap.set(v, scaled_centrality);

        std::stringstream stream;
        stream << std::fixed << std::setprecision(2) << centrality;
        msg += std::to_string(v) + "\t" + stream.str() + "\n";

    }

    result.set("sizeMap", sizeMap);
    result.set("message", msg);
    result.set("mode", MODE_SIZE_SCALAR);
    return result;
}

val eigenvector_centrality(void) {
    IGraphVector evs;
    igraph_real_t value;

    igraph_eigenvector_centrality(&igraphGlobalGraph, evs.vec(), &value, IGRAPH_DIRECTED, false, NULL /*todo weights*/, NULL);

    double max_centrality = evs.max();
    std::cout << "Max eigenvector centrality: " << max_centrality << std::endl;
    val result = val::object();
    val sizeMap = val::object();
    std::string msg = "Eigenvector Centrality (scaled such that \"|max| = 1\"):\n";
    msg += "(eigenvalue = " + std::to_string(value) + ")\n";

    for (igraph_integer_t v = 0; v < evs.size(); ++v) {
        double centrality = evs.at(v);
        double scaled_centrality = scaleCentrality(centrality, max_centrality);
        sizeMap.set(v, scaled_centrality);

        std::stringstream stream;
        stream << std::fixed << std::setprecision(2) << centrality;
        msg += std::to_string(v) + "\t" + stream.str() + "\n";
    }
    
    result.set("sizeMap", sizeMap);
    result.set("message", msg);
    result.set("mode", MODE_SIZE_SCALAR);
    return result;
}

val harmonic_centrality(void) {
    IGraphVector scores;

    igraph_harmonic_centrality(&igraphGlobalGraph, scores.vec(), igraph_vss_all(), IGRAPH_OUT, NULL /*TODO: weights*/, true);

    double max_centrality = scores.max();
    val result = val::object();
    val sizeMap = val::object();
    std::string msg = "Harmonic Centrality:\n";

    for (igraph_integer_t v = 0; v < igraph_vcount(&igraphGlobalGraph); ++v) {
        double centrality = scores.at(v);
        double scaled_centrality = scaleCentrality(isnan(centrality) ? 0 : centrality, max_centrality);

        sizeMap.set(v, scaled_centrality);

        std::stringstream stream;
        stream << std::fixed << std::setprecision(2) << centrality;
        msg += std::to_string(v) + "\t" + stream.str() + "\n";
    }

    result.set("sizeMap", sizeMap);
    result.set("message", msg);
    result.set("mode", MODE_SIZE_SCALAR);
    return result;

}

val strength(void) {
    IGraphVector strengths;

    igraph_strength(&igraphGlobalGraph, strengths.vec(), igraph_vss_all(), IGRAPH_OUT, IGRAPH_NO_LOOPS, NULL /*TODO: weights*/);

    double max_centrality = strengths.max();
    val result = val::object();
    val sizeMap = val::object();
    std::string msg = "List of node strengths:\n";

    for (igraph_integer_t v = 0; v < strengths.size(); ++v) {
        double centrality = strengths.at(v);
        double scaled_centrality = scaleCentrality(centrality, max_centrality);
        sizeMap.set(v, scaled_centrality);

        std::stringstream stream;
        stream << std::fixed << std::setprecision(2) << centrality;
        msg += std::to_string(v) + "\t" + stream.str() + "\n";
    }

    result.set("sizeMap", sizeMap);
    result.set("message", msg);
    result.set("mode", MODE_SIZE_SCALAR);
    return result;
} 

val pagerank(igraph_real_t damping) {
    igraph_real_t value;
    IGraphVector vec;

    std::stringstream stream;
    stream << std::fixed << std::setprecision(2) << damping;

    igraph_pagerank(&igraphGlobalGraph, IGRAPH_PAGERANK_ALGO_PRPACK, vec.vec(), &value, igraph_vss_all(), IGRAPH_DIRECTED, damping, NULL /*TODO*/, NULL);

    double max_centrality = vec.max();
    val result = val::object();
    val sizeMap = val::object();
    std::string msg = "PageRank with damping = " + stream.str() + ":\n";\

    for (igraph_integer_t v = 0; v < vec.size(); ++v) {
        double centrality = vec.at(v);
        double scaled_centrality = scaleCentrality(centrality, max_centrality);
        sizeMap.set(v, scaled_centrality);

        std::stringstream stream;
        stream << std::fixed << std::setprecision(2) << centrality;
        msg += std::to_string(v) + "\t" + stream.str() + "\n";
    }

    result.set("sizeMap", sizeMap);
    result.set("message", msg);
    result.set("mode", MODE_SIZE_SCALAR);
    return result;
}
