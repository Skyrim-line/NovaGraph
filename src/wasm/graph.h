#ifndef GRAPH_H
#define GRAPH_H

#include "igraph/include/igraph.h"
#include <emscripten/val.h>
#include <emscripten/bind.h>
#include <vector>

extern igraph_t globalGraph;

typedef std::vector<int> VecInt;

struct GraphData {
    VecInt nodes;
    std::vector<VecInt> edges;
};

GraphData generateGraph(void);
void cleanupGraph(void);

struct PathData {
    int* data;
    size_t size;
};


bool vertices_are_connected(igraph_integer_t src, igraph_integer_t tar);
VecInt dijkstra_source_to_target(igraph_integer_t src, igraph_integer_t tar);
std::vector<VecInt> dijkstra_source_to_all(igraph_integer_t src);
std::vector<VecInt> yen_source_to_target(igraph_integer_t src, igraph_integer_t tar, igraph_integer_t k);
VecInt bf_source_to_target(igraph_integer_t src, igraph_integer_t tar);
std::vector<VecInt> bf_source_to_all(igraph_integer_t src);
std::vector<VecInt> bfs(igraph_integer_t src);
std::vector<VecInt> dfs(igraph_integer_t src);

#endif