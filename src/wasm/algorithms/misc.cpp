#include "../graph.h"
#include <iostream>

val vertices_are_adjacent(igraph_integer_t src, igraph_integer_t tar) {
    igraph_bool_t res;
    bool hasWeights = VECTOR(globalWeights) != NULL;

    igraph_are_connected(&globalGraph, src, tar, &res);

    val result = val::object();
    val colorMap = val::object();
    val data = val::object();

    data.set("source", igraph_get_name(src));
    data.set("target", igraph_get_name(tar));
    colorMap.set(src, 1);
    colorMap.set(tar, 1);

    if (res) {
        std::string linkId = std::to_string(src) + '-' + std::to_string(tar);
        colorMap.set(linkId, 1);
        if (hasWeights) {
            igraph_integer_t eid;
            igraph_get_eid(&globalGraph, &eid, src, tar, true, 0);
            double weight = VECTOR(globalWeights)[eid];
            data.set("weight", weight);
        }
    }

    data.set("adjacent", res);
    result.set("colorMap", colorMap);
    result.set("mode", MODE_COLOR_SHADE_DEFAULT);
    result.set("data", data);
    return result;
}

val jaccard_similarity(val js_vs_list) {
    IGraphVectorInt vs_list;
    IGraphMatrix m;
    igraph_vs_t vs;

    val result = val::object();
    val colorMap = val::object();
    val data = val::object();
    val nodes = val::array();
    for (size_t i = 0; i < js_vs_list["length"].as<size_t>(); i++) {
        igraph_integer_t nodeId = js_vs_list[i].as<igraph_integer_t>();
        nodes.set(i, igraph_get_name(nodeId));
        colorMap.set(nodeId, 1);
        vs_list.push_back(nodeId);
    }

    igraph_vs_vector(&vs, vs_list.vec());
    igraph_similarity_jaccard(&globalGraph, m.mat(), vs, IGRAPH_OUT, false);
    igraph_matrix_printf(m.mat(), "%.2f");

    val rows = val::array();
    double max_similarity = -1.0;
    val max_pair = val::object();
    for (long int i = 0; i < m.nrows(); i++) {
        val row = val::array();
        for (long int j = 0; j < m.ncols(); j++) {
            std::stringstream stream;
            stream << std::fixed << std::setprecision(2) << m.get(i, j);
            double similarity = atof(stream.str().c_str());
            row.set(j, similarity);

            if (similarity > max_similarity && i != j) {
                max_similarity = similarity;
                int nodeId1 = vs_list.at(i);
                int nodeId2 = vs_list.at(j);
                max_pair.set("node1", igraph_get_name(nodeId1));
                max_pair.set("node2", igraph_get_name(nodeId2));
                max_pair.set("similarity", similarity);
            }
        }
        rows.set(i, row);
    }

    result.set("colorMap", colorMap);
    result.set("mode", MODE_COLOR_SHADE_DEFAULT);
    data.set("similarityMatrix", rows);
    data.set("maxSimilarity", max_pair);
    data.set("nodes", nodes);
    result.set("data", data);
    return result;    
}