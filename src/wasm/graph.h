#ifndef GRAPH_H
#define GRAPH_H

#include "igraph/include/igraph.h"
#include <vector>

extern igraph_t globalGraph;

typedef std::vector<int> VecInt;

struct GraphData {
    VecInt nodes;
    std::vector<VecInt> edges;
};

GraphData generateGraph(void);
void cleanupGraph(void);


struct ShortestPath {
    // related fields for shortest path return
};

VecInt dijkstra_source_to_target(igraph_integer_t src, igraph_integer_t tar);
std::vector<VecInt> dijkstra_source_to_all(igraph_integer_t src);

#endif