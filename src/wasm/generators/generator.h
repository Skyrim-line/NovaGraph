#ifndef GENERATOR_H
#define GENERATOR_H

#include "../igraph/include/igraph.h"
#include <emscripten/val.h>
#include <string>
#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>
#include <unordered_map>


inline void ltrim(std::string& s);
inline void rtrim(std::string& s);
std::string trim(std::string &s);

std::unordered_map<std::string, int> process_nodes_csv(const std::string& filename);


using namespace emscripten;
void graph_from_csv(const std::string& nodesFilename, const std::string& edgesFilename, bool directed);

#endif