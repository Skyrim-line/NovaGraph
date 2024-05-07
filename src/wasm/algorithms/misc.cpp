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