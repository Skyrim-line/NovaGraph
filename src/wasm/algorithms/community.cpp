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

    // TODO: color scale them

    // Modularity
    igraph_real_t modularity_value;
    igraph_modularity(&igraphGlobalGraph, &membership, NULL /*todo*/, resolution, IGRAPH_UNDIRECTED, &modularity_value);
    std::cout << "Modularity: " << modularity_value << std::endl;
    std::cout << "Number of communities: " << igraph_vector_int_max(&membership) + 1 << std::endl;

}
