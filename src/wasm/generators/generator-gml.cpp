#include "generator.h"

val graph_from_gml(const std::string& filename) {
    igraph_t graph;
    FILE *file = fopen(filename.c_str(), "r");
    if (file == NULL) {
        throw std::runtime_error("File not found: " + filename);
    }

    if (igraph_read_graph_gml(&graph, file) == IGRAPH_SUCCESS) {
        igraph_destroy(&igraphGlobalGraph);
        igraphGlobalGraph = graph;
    }
    fclose(file);

    printf("The graph is %s.\n", igraph_is_directed(&graph) ? "directed" : "undirected");

    /* Output as edge list */
    printf("\n-----------------\n");
    igraph_write_graph_edgelist(&graph, stdout);

    // Output as GML
    printf("\n-----------------\n");
    igraph_write_graph_gml(&graph, stdout, IGRAPH_WRITE_GML_DEFAULT_SW, 0, "");

    igraph_destroy(&graph);
    return val::null();
}