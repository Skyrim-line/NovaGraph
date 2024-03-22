#include "graph.h"
#include <iostream>
#include <fstream>
#include <unordered_set>

inline void ltrim(std::string& s) {
    s.erase(s.begin(), std::find_if(s.begin(), s.end(), [](unsigned char ch) {
        return !std::isspace(ch);
    }));
}
inline void rtrim(std::string& s) {
    s.erase(std::find_if(s.rbegin(), s.rend(), [](unsigned char ch) {
        return !std::isspace(ch);
    }).base(), s.end());
}

std::string trim(std::string &s) {
    rtrim(s);
    ltrim(s);
    return s;
}

std::unordered_map<std::string, int> process_nodes_csv(const std::string& filename) {
    std::unordered_map<std::string, int> nodes;
    std::unordered_set<std::string> nodeSet;

    std::ifstream file(filename);
    std::string line, name;
    int id = 0;

    std::cout << "line1" << std::endl;


    // check file
    if (!file.is_open()) throw std::runtime_error("Could not open file " + filename);

    // header check
    if (!std::getline(file, line)) throw std::runtime_error("Could not read the Nodes CSV file");
    // TODO: match "Nodes" ??
    if (trim(line) != "nodes") throw std::runtime_error("Incorrect header in nodes file");

    // read nodes file
    /*
    while (std::getline(file, line)) {
        trim(line);
        std::istringstream 
    }
    */
    std::cout << "Success! The line came up as " << line << std::endl;


    return nodes;
}

void graph_from_csv(const std::string& nodesFilename, const std::string& edgesFilename, bool directed) {
    try {
        process_nodes_csv(nodesFilename);
    } catch(const std::exception& e) {
        std::cerr << e.what() << std::endl;
    }
    
}
