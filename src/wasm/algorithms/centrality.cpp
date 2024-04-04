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
    bool hasWeights = VECTOR(globalWeights) != NULL;

    igraph_betweenness(&globalGraph, betweenness.vec(), igraph_vss_all(), true, hasWeights ? &globalWeights : NULL);

    double max_centrality = betweenness.max();
    val result = val::object();
    val sizeMap = val::object();
    val data = val::object();

    int highestCentralityNode = 0;
    double highestCentrality = 0;
    val centralities = val::array();
    for (igraph_integer_t v = 0; v < igraph_vcount(&globalGraph); ++v) {
        val c = val::object();
        double centrality = betweenness.at(v);
        double scaled_centrality = scaleCentrality(centrality, max_centrality);

        if (centrality > highestCentrality) {
            highestCentrality = centrality;
            highestCentralityNode = v;
        }

        std::stringstream stream;
        stream << std::fixed << std::setprecision(2) << centrality;

        sizeMap.set(v, scaled_centrality);
        c.set("node", igraph_get_name(v));
        c.set("centrality", stream.str());
        centralities.set(v, c);
    }
    data.set("maxCentralityNode", igraph_get_name(highestCentralityNode));
    data.set("maxCentrality", highestCentrality);
    data.set("centralities", centralities);

    result.set("sizeMap", sizeMap);
    result.set("mode", MODE_SIZE_SCALAR);
    result.set("data", data);
    return result;
}

val closeness_centrality(void) {
    IGraphVector closeness;
    bool hasWeights = VECTOR(globalWeights) != NULL;

    igraph_closeness(&globalGraph, closeness.vec(), NULL, NULL, igraph_vss_all(), IGRAPH_OUT, hasWeights ? &globalWeights : NULL, true);

    val result = val::object();
    val sizeMap = val::object();
    val data = val::object();

    int highestCentralityNode = -1;
    double highestCentrality = closeness.max_nonan();
    val centralities = val::array();

    for (igraph_integer_t v = 0; v < igraph_vcount(&globalGraph); ++v) {
        val c = val::object();
        double centrality = closeness.at(v);
        double scaled_centrality = scaleCentrality(isnan(centrality) ? 0 : centrality, highestCentrality);

        if (centrality == highestCentrality && highestCentralityNode == -1) {
            highestCentralityNode = v;
        }

        std::stringstream stream;
        stream << std::fixed << std::setprecision(2) << centrality;

        sizeMap.set(v, scaled_centrality);
        c.set("node", igraph_get_name(v));
        c.set("centrality", stream.str());
        centralities.set(v, c);
    }
    data.set("maxCentralityNode", igraph_get_name(highestCentralityNode));
    data.set("maxCentrality", highestCentrality);
    data.set("centralities", centralities);

    result.set("sizeMap", sizeMap);
    result.set("mode", MODE_SIZE_SCALAR);
    result.set("data", data);
    return result;
}

val degree_centrality(void) {
    IGraphVectorInt degrees;

    igraph_degree(&globalGraph, degrees.vec(), igraph_vss_all(), IGRAPH_OUT, IGRAPH_NO_LOOPS);

    val result = val::object();
    val sizeMap = val::object();
    val data = val::object();

    int highestCentralityNode = -1;
    double highestCentrality = degrees.max();
    val centralities = val::array();

    for (igraph_integer_t v = 0; v < degrees.size(); ++v) {
        val c = val::object();
        double centrality = degrees.at(v);
        double scaled_centrality = scaleCentrality(centrality, highestCentrality);
        
        if (centrality == highestCentrality && highestCentralityNode == -1) {
            highestCentralityNode = v;
        }

        std::stringstream stream;
        stream << std::fixed << std::setprecision(2) << centrality;

        sizeMap.set(v, scaled_centrality);
        c.set("node", igraph_get_name(v));
        c.set("centrality", stream.str());
        centralities.set(v, c);
    }
    data.set("maxCentralityNode", igraph_get_name(highestCentralityNode));
    data.set("maxCentrality", highestCentrality);
    data.set("centralities", centralities);

    result.set("sizeMap", sizeMap);
    result.set("mode", MODE_SIZE_SCALAR);
    result.set("data", data);
    return result;
}

val eigenvector_centrality(void) {
    IGraphVector evs;
    igraph_real_t value;
    bool hasWeights = VECTOR(globalWeights) != NULL;

    igraph_eigenvector_centrality(&globalGraph, evs.vec(), &value, IGRAPH_DIRECTED, false, hasWeights ? &globalWeights : NULL, NULL);

    val result = val::object();
    val sizeMap = val::object();
    val data = val::object();

    int highestCentralityNode = -1;
    double highestCentrality = evs.max();
    val centralities = val::array();

    //std::cout << "Max eigenvector centrality: " << max_centrality << std::endl;
    //std::string msg = "Eigenvector Centrality (scaled such that \"|max| = 1\"):\n";
    //msg += "(eigenvalue = " + std::to_string(value) + ")\n";
    data.set("eigenvalue", value);

    for (igraph_integer_t v = 0; v < evs.size(); ++v) {
        val c = val::object();
        double centrality = evs.at(v);
        double scaled_centrality = scaleCentrality(centrality, highestCentrality);
        
        if (centrality == highestCentrality && highestCentralityNode == -1) {
            highestCentralityNode = v;
        }

        std::stringstream stream;
        stream << std::fixed << std::setprecision(2) << centrality;
        
        sizeMap.set(v, scaled_centrality);
        c.set("node", igraph_get_name(v));
        c.set("centrality", stream.str());
        centralities.set(v, c);
    }
    data.set("maxCentralityNode", igraph_get_name(highestCentralityNode));
    data.set("maxCentrality", highestCentrality);
    data.set("centralities", centralities);
    
    result.set("sizeMap", sizeMap);
    result.set("mode", MODE_SIZE_SCALAR);
    result.set("data", data);
    return result;
}

val harmonic_centrality(void) {
    IGraphVector scores;
    bool hasWeights = VECTOR(globalWeights) != NULL;

    igraph_harmonic_centrality(&globalGraph, scores.vec(), igraph_vss_all(), IGRAPH_OUT, hasWeights ? &globalWeights : NULL, true);

    val result = val::object();
    val sizeMap = val::object();
    val data = val::object();

    int highestCentralityNode = -1;
    double highestCentrality = scores.max();

    val centralities = val::array();
    for (igraph_integer_t v = 0; v < igraph_vcount(&globalGraph); ++v) {
        val c = val::object();
        double centrality = scores.at(v);
        double scaled_centrality = scaleCentrality(isnan(centrality) ? 0 : centrality, highestCentrality);

        if (centrality == highestCentrality && highestCentralityNode == -1) {
            highestCentralityNode = v;
        }

        std::stringstream stream;
        stream << std::fixed << std::setprecision(2) << centrality;
        
        sizeMap.set(v, scaled_centrality);
        c.set("node", igraph_get_name(v));
        c.set("centrality", stream.str());
        centralities.set(v, c);
    }
    data.set("maxCentralityNode", igraph_get_name(highestCentralityNode));
    data.set("maxCentrality", highestCentrality);
    data.set("centralities", centralities);

    result.set("sizeMap", sizeMap);
    result.set("mode", MODE_SIZE_SCALAR);
    result.set("data", data);
    return result;
}

val strength(void) {
    IGraphVector strengths;
    bool hasWeights = VECTOR(globalWeights) != NULL;

    igraph_strength(&globalGraph, strengths.vec(), igraph_vss_all(), IGRAPH_OUT, IGRAPH_NO_LOOPS, hasWeights ? &globalWeights : NULL);

    val result = val::object();
    val sizeMap = val::object();
    val data = val::object();

    int highestCentralityNode = -1;
    double highestCentrality = strengths.max();
    val centralities = val::array();
    
    for (igraph_integer_t v = 0; v < strengths.size(); ++v) {
        val c = val::object();
        double centrality = strengths.at(v);
        double scaled_centrality = scaleCentrality(centrality, highestCentrality);
        
        if (centrality == highestCentrality && highestCentralityNode == -1) {
            highestCentralityNode = v;
        }

        std::stringstream stream;
        stream << std::fixed << std::setprecision(2) << centrality;
        
        sizeMap.set(v, scaled_centrality);
        c.set("node", igraph_get_name(v));
        c.set("centrality", stream.str());
        centralities.set(v, c);
    }
    data.set("maxCentralityNode", igraph_get_name(highestCentralityNode));
    data.set("maxCentrality", highestCentrality);
    data.set("centralities", centralities);

    result.set("sizeMap", sizeMap);
    result.set("mode", MODE_SIZE_SCALAR);
    result.set("data", data);
    return result;
} 

val pagerank(igraph_real_t damping) {
    igraph_real_t value;
    IGraphVector vec;
    bool hasWeights = VECTOR(globalWeights) != NULL;

    std::stringstream stream;
    stream << std::fixed << std::setprecision(2) << damping;

    igraph_pagerank(&globalGraph, IGRAPH_PAGERANK_ALGO_PRPACK, vec.vec(), &value, igraph_vss_all(), IGRAPH_DIRECTED, damping, hasWeights ? &globalWeights : NULL, NULL);

    val result = val::object();
    val sizeMap = val::object();
    val data = val::object();

    data.set("damping", stream.str());

    int highestCentralityNode = -1;
    double highestCentrality = vec.max();
    val centralities = val::array();
    for (igraph_integer_t v = 0; v < vec.size(); ++v) {
        val c = val::object();
        double centrality = vec.at(v);
        double scaled_centrality = scaleCentrality(centrality, highestCentrality);
        
        if (centrality == highestCentrality && highestCentralityNode == -1) {
            highestCentralityNode = v;
        }

        std::stringstream stream;
        stream << std::fixed << std::setprecision(2) << centrality;

        sizeMap.set(v, scaled_centrality);
        c.set("node", igraph_get_name(v));
        c.set("centrality", stream.str());
        centralities.set(v, c);
    }
    data.set("maxCentralityNode", igraph_get_name(highestCentralityNode));
    data.set("maxCentrality", highestCentrality);
    data.set("centralities", centralities);

    result.set("sizeMap", sizeMap);
    result.set("mode", MODE_SIZE_SCALAR);
    result.set("data", data);
    return result;
}
