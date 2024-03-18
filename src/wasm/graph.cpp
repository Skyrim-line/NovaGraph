#include "graph.h"
#include <iostream>
#include <emscripten/bind.h>

using namespace emscripten;

int globalGraph[N][N];
igraph_t igraphGlobalGraph;

/*
GraphData generateGraph(void) {
    igraph_empty(&globalGraph, 0, IGRAPH_UNDIRECTED);

    // manipulate
    igraph_add_vertices(&globalGraph, 11, 0);
    igraph_add_edge(&globalGraph, 0, 1);
    igraph_add_edge(&globalGraph, 0, 2);
    igraph_add_edge(&globalGraph, 0, 9);
    igraph_add_edge(&globalGraph, 2, 5);
    igraph_add_edge(&globalGraph, 2, 7);
    igraph_add_edge(&globalGraph, 3, 1);
    igraph_add_edge(&globalGraph, 3, 4);
    igraph_add_edge(&globalGraph, 4, 5);
    igraph_add_edge(&globalGraph, 6, 1);
    igraph_add_edge(&globalGraph, 8, 1);

    // Get the number of vertices and edges
    igraph_integer_t num_vertices = igraph_vcount(&globalGraph);
    igraph_integer_t num_edges = igraph_ecount(&globalGraph);

    // Get the list of nodes
    igraph_vs_t vertices;
    igraph_vs_all(&vertices);
    igraph_vector_int_t nodes;
    igraph_vector_int_init(&nodes, num_vertices);
    igraph_vs_as_vector(&globalGraph, vertices, &nodes); // convert to iterator
    igraph_vs_destroy(&vertices);


    // Get the list of edges
    igraph_vector_int_t edges;
    igraph_vector_int_init(&edges, num_edges * 2);
    igraph_get_edgelist(&globalGraph, &edges, 0);

    // Convert igraph vectors to C++ vectors
    VecInt nodes_list(num_vertices);
    std::vector<VecInt> edges_list(num_edges);

    for (int i = 0; i < num_vertices; ++i) {
        nodes_list[i] = VECTOR(nodes)[i];
    }

    for (int i = 0; i < num_edges; ++i) {
        VecInt v;

        v.push_back(VECTOR(edges)[2 * i]);
        v.push_back(VECTOR(edges)[2 * i + 1]);
        edges_list[i] = v;
    }

    // Free igraph vectors and destroy the graph
    igraph_vector_int_destroy(&nodes);
    igraph_vector_int_destroy(&edges);
    //igraph_destroy(&globalGraph);

    GraphData gr;
    gr.edges = edges_list;
    gr.nodes = nodes_list;

    return gr;
}
*/

// Initialize the graph with some edges
void initGraph(void) {
    // Create an empty graph with 11 vertices
    igraph_empty(&igraphGlobalGraph, 11, IGRAPH_UNDIRECTED);

    // Create a vector of integers to store the edge list
    igraph_vector_int_t edges;
    igraph_vector_int_init(&edges, 20); // 20 elements for 10 edges

    // Add the edges to the vector
    igraph_vector_int_set(&edges, 0, 0); // first edge: (0, 1)
    igraph_vector_int_set(&edges, 1, 1);
    igraph_vector_int_set(&edges, 2, 0); // second edge: (0, 2)
    igraph_vector_int_set(&edges, 3, 2);
    igraph_vector_int_set(&edges, 4, 0); // third edge: (0, 9)
    igraph_vector_int_set(&edges, 5, 9);
    igraph_vector_int_set(&edges, 6, 2); // fourth edge: (2, 5)
    igraph_vector_int_set(&edges, 7, 5);
    igraph_vector_int_set(&edges, 8, 2); // fifth edge: (2, 7)
    igraph_vector_int_set(&edges, 9, 7);
    igraph_vector_int_set(&edges, 10, 3); // sixth edge: (3, 1)
    igraph_vector_int_set(&edges, 11, 1);
    igraph_vector_int_set(&edges, 12, 3); // seventh edge: (3, 4)
    igraph_vector_int_set(&edges, 13, 4);
    igraph_vector_int_set(&edges, 14, 4); // eighth edge: (4, 5)
    igraph_vector_int_set(&edges, 15, 5);
    igraph_vector_int_set(&edges, 16, 6); // ninth edge: (6, 1)
    igraph_vector_int_set(&edges, 17, 1);
    igraph_vector_int_set(&edges, 18, 8); // tenth edge: (8, 1)
    igraph_vector_int_set(&edges, 19, 1);

    // Add the edges to the graph using the vector
    igraph_add_edges(&igraphGlobalGraph, &edges, NULL);

    // Destroy the vector
    igraph_vector_int_destroy(&edges);

    // Create the adjacency matrix from the graph
    igraph_matrix_t mat;
    igraph_matrix_init(&mat, N, N);
    igraph_get_adjacency(&igraphGlobalGraph, &mat, IGRAPH_GET_ADJACENCY_BOTH, NULL, IGRAPH_LOOPS);

    // Copy the matrix elements to the globalGraph array
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            globalGraph[i][j] = igraph_matrix_get(&mat, i, j);
        }
    }

    // Destroy the matrix
    igraph_matrix_destroy(&mat);
}

val getGraph(void) {
    val graph = val::array();
    for (int i = 0; i < N; i++) {
        val row = val::array();
        for (int j = 0; j < N; j++) {
            row.set(j, globalGraph[i][j]);
        }
        graph.set(i, row);
    }
    return graph;
}


void cleanupGraph(void) {
    igraph_destroy(&igraphGlobalGraph);
}

val sum(int a, int b) {
    std::cout << "Test" << std::endl << a+b << std::endl;
    val obj = val::object();
    obj.set("sum", a+b);
    return obj;
}

EMSCRIPTEN_BINDINGS(graph) {
  // Register the vector type
  register_vector<int>("vector<int>");
  register_vector<VecInt>("VectorInt");

  value_object<GraphData>("Graph")
    .field("nodes", &GraphData::nodes)
    .field("edges", &GraphData::edges);

  value_object<PathData>("PathData")
    .field("path", &PathData::path)
    .field("distance", &PathData::distance)
    .field("colorMap", &PathData::colorMap);


  // Expose the functions
  function("initGraph", &initGraph);
  function("getGraph", &getGraph);
  function("sum", &sum);

  function("vertices_are_connected", &vertices_are_connected);
  function("dijkstra_source_to_target", &dijkstra_source_to_target);
  function("dijkstra_source_to_all", &dijkstra_source_to_all);
  function("yens_algorithm", &yen_source_to_target);
  function("bellman_ford_source_to_target", &bf_source_to_target);
  function("bellman_ford_source_to_all", &bf_source_to_all);
  function("cleanupGraph", &cleanupGraph);
  function("bfs", &bfs);
  function("dfs", &dfs);
  function("random_walk", &randomWalk);
  function("min_spanning_tree", &min_spanning_tree);

  function("betweenness_centrality", &betweenness_centrality);
  function("closeness_centrality", &closeness_centrality);
  function("degree_centrality", &degree_centrality);
  function("eigenvector_centrality", &eigenvector_centrality);
  function("strength_centrality", &strength);
}

// emcc demo.cpp -O3 -s WASM=1 -s -sEXPORTED_FUNCTIONS=_sum,_subtract --no-entry -o demo.wasm
// em++ -Os graph.cpp -s WASM=1 -o graph.js -s EXPORTED_RUNTIME_METHODS='["cwrap"]' -I./igraph/build/include -I./igraph/include ./igraph/build/src/libigraph.a -lembind --no-entry
// em++ -Os graph.cpp -s WASM=1 -o graph.js -s -I./igraph/build/include -I./igraph/include ./igraph/build/src/libigraph.a -lembind --no-entry -s EXPORT_ES6=1 -s MODULARIZE=1