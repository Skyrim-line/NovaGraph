#include "../graph.h"

val igraph_vector_int_to_val(igraph_vector_int_t* v) {
    val vs = val::array();
    for (int i = 0; i < igraph_vector_int_size(v); ++i) {
        vs.set(i, VECTOR(*v)[i]);
    }
    return vs;
}

val igraph_vector_int_list_to_val(igraph_vector_int_list_t* v) {
    val vss = val::array();
    for (long i = 0; i < igraph_vector_int_list_size(v); ++i) {
        igraph_vector_int_t vs = VECTOR(*v)[i];
        std::vector<int> pathVector(VECTOR(vs), VECTOR(vs) + igraph_vector_int_size(&vs));
        val pathArray = val::array(pathVector);
        vss.set(i, pathArray);
    }
    return vss;
}
