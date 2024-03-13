#ifndef GRAPH_H
#define GRAPH_H

#include "igraph/include/igraph.h"
#include <emscripten/val.h>
#include <emscripten/bind.h>
#include <vector>
#include <string>

#define N 11 // number of nodes
extern int globalGraph[N][N]; // adjacency matrix
extern igraph_t igraphGlobalGraph; // igraph structure


typedef std::vector<int> VecInt;

struct GraphData {
    VecInt nodes;
    std::vector<VecInt> edges;
};


// Define a struct to hold the shortest path information
struct PathData {
    VecInt path; // the shortest path as a vector of ints
    double distance; // the distance of the shortest path
    int colorMap[N][N]; // the color map as a two-dimensional array of ints
};

using namespace emscripten;

val igraph_vector_int_to_val(igraph_vector_int_t* vec);
val igraph_vector_int_list_to_val(igraph_vector_int_list_t* v);
int getFreq(const val& map, std::string key);

val vertices_are_connected(igraph_integer_t src, igraph_integer_t tar);
val dijkstra_source_to_target(igraph_integer_t src, igraph_integer_t tar);
val dijkstra_source_to_all(igraph_integer_t src);
val yen_source_to_target(igraph_integer_t src, igraph_integer_t tar, igraph_integer_t k);
val bf_source_to_target(igraph_integer_t src, igraph_integer_t tar);
val bf_source_to_all(igraph_integer_t src);
val bfs(igraph_integer_t src);
val dfs(igraph_integer_t src);
val randomWalk(igraph_integer_t start, int steps);
val min_spanning_tree(void);

val betweenness_centrality(void);


#endif