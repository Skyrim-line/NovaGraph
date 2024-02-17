#include "graph.h"
#include <iostream>
#include <emscripten/bind.h>

using namespace emscripten;

igraph_t globalGraph;


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

void cleanupGraph(void) {
    igraph_destroy(&globalGraph);
}

int sum(int a, int b) {
    std::cout << "Test" << std::endl << a+b << std::endl;
    return a + b;
}

EMSCRIPTEN_BINDINGS(graph) {
  // Register the vector type
  register_vector<int>("vector<int>");
  register_vector<VecInt>("VectorInt");

  value_object<GraphData>("Graph")
    .field("nodes", &GraphData::nodes)
    .field("edges", &GraphData::edges);

  // Expose the functions
  function("generateGraph", &generateGraph);
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
}

// emcc demo.cpp -O3 -s WASM=1 -s -sEXPORTED_FUNCTIONS=_sum,_subtract --no-entry -o demo.wasm
// em++ -Os graph.cpp -s WASM=1 -o graph.js -s EXPORTED_RUNTIME_METHODS='["cwrap"]' -I./igraph/build/include -I./igraph/include ./igraph/build/src/libigraph.a -lembind --no-entry
// em++ -Os graph.cpp -s WASM=1 -o graph.js -s -I./igraph/build/include -I./igraph/include ./igraph/build/src/libigraph.a -lembind --no-entry -s EXPORT_ES6=1 -s MODULARIZE=1