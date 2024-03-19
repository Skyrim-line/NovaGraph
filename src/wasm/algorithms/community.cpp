#include "../graph.h"
#include <iostream>
#include <string>


void louvain(igraph_real_t resolution) {
    igraph_vector_int_t membership;
    igraph_vector_t modularity;
    igraph_vector_int_init(&membership, 0);
    igraph_vector_init(&modularity, 0);

    igraph_community_multilevel(&igraphGlobalGraph, NULL /*todo*/, resolution, &membership, NULL, &modularity);

    // Print the community membership
    std::cout << "Vertex ID\tCommunity ID\n";
    for (long int i = 0; i < igraph_vector_int_size(&membership); ++i) {
        std::cout << i << "\t\t" << VECTOR(membership)[i] << "\n";
    }

    // TODO: color scale (colourful theme?)

    // Modularity
    igraph_real_t modularity_value;
    igraph_modularity(&igraphGlobalGraph, &membership, NULL /*todo*/, resolution, IGRAPH_UNDIRECTED, &modularity_value);
    std::cout << "Modularity: " << modularity_value << std::endl;
    std::cout << "Number of communities: " << igraph_vector_int_max(&membership) + 1 << std::endl;

    igraph_vector_int_destroy(&membership);
    igraph_vector_destroy(&modularity);

}

void leiden(igraph_real_t resolution) {
    igraph_integer_t n_iterations = 10; // TODO: Might need to modify this value in future?
    igraph_vector_int_t membership;
    igraph_vector_int_init(&membership, 0);
    igraph_integer_t nb_clusters;
    igraph_real_t quality;

    igraph_community_leiden(&igraphGlobalGraph, NULL /*todo*/, NULL, resolution, 0.01, false, n_iterations, &membership, &nb_clusters, &quality);

    // Print the community membership for each vertex
    std::cout << "Vertex ID\tCommunity ID\n";
    for (long int i = 0; i < igraph_vector_int_size(&membership); ++i) {
        std::cout << i << "\t\t" << VECTOR(membership)[i] << "\n";
    }

    // TODO: color scale (colourful theme?)

    // other prints
    std::cout << "Number of communities: " << nb_clusters << std::endl;
    std::cout << "Partition quality: " << quality << std::endl;

    igraph_vector_int_destroy(&membership);
}

void fast_greedy(void) {
    igraph_vector_int_t membership;
    igraph_vector_t modularity;
    igraph_vector_int_init(&membership, 0);
    igraph_vector_init(&modularity, 0);

    igraph_community_fastgreedy(&igraphGlobalGraph, NULL /*todo: weights*/, NULL, &modularity, &membership);

    // Print the community membership for each vertex
    std::cout << "Vertex ID\tCommunity ID\n";
    for (long int i = 0; i < igraph_vector_int_size(&membership); ++i) {
        std::cout << i << "\t\t" << VECTOR(membership)[i] << "\n";
    }
    
    std::cout << "Modularity: " << igraph_vector_max(&modularity) << std::endl;
    std::cout << "Number of communities: " << igraph_vector_int_max(&membership) + 1 << std::endl;

    igraph_vector_int_destroy(&membership);
    igraph_vector_destroy(&modularity);

}
