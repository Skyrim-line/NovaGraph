#include "generator.h"
#include <algorithm>
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

std::vector<std::string> split(const std::string& s, char delimiter) {
    std::vector<std::string> tokens;
    std::string token;
    std::istringstream tokenStream(s);
    while (std::getline(tokenStream, token, delimiter)) {
        tokens.push_back(token);
    }
    return tokens;
}


NodeMap process_nodes_csv(const std::string& filename) {
    NodeMap nodes;
    std::unordered_set<std::string> nodeSet;

    std::ifstream file(filename);
    std::string line, name;
    int id = 0;

    // check file
    if (!file.is_open()) throw std::runtime_error("Could not open file " + filename);

    // header check
    if (!std::getline(file, line)) throw std::runtime_error("Could not read the Nodes CSV file");
    std::string header = trim(line);
    if (header != "nodes" && header != "Nodes") throw std::runtime_error("Incorrect header in nodes file");

    // read the nodes
    while (std::getline(file, line)) {
        std::vector<std::string> tokens = split(trim(line), ',');
        if (tokens.size() < 1) continue;
        name = tokens[0];
        if (nodeSet.insert(name).second) {
            nodes[name] = id++;
        }
    }

    if (nodes.empty()) throw std::runtime_error("No nodes found in the file");

    // print nodes
    std::cout << "Nodes:" << std::endl;
    for (auto &pair : nodes) {
        std::cout << pair.first << " -> " << pair.second << std::endl;
    }

    return nodes;
}

void process_edges_csv(const std::string &edgesFilename, std::unordered_map<std::string, int> &nodeMap, bool directed) {
    std::ifstream file(edgesFilename);
    std::string line, src, tar, weight;
    igraph_vector_int_t edges;
    igraph_vector_t weights;
    bool weighted = false;

    // check if file is open
    std::cout << "checking file..." << std::endl;
    if (!file.is_open()) throw std::runtime_error("Could not open file " + edgesFilename);

    // read the csv file and check columns
    std::cout << "reading csv..." << std::endl;

    if (std::getline(file, line)) {
        std::vector<std::string> tokens = split(trim(line), ',');
        if (tokens.size() < 2 || tokens[0] != "source" || tokens[1] != "target") {
            throw std::runtime_error("Incorrect header in edges file");
        } else if (tokens.size() >= 3 && tokens[2] == "weight") {
            weighted = true;
        }        
    }

    igraph_vector_int_init(&edges, 0);
    igraph_vector_init(&weights, 0);

    // read the edges
        std::cout << "reading edges..." << std::endl;

    while (std::getline(file, line)) {
        std::vector<std::string> tokens = split(trim(line), ',');
        if (tokens.size() < 2) continue; // skip lines with less than 2 columns
        src = tokens[0];
        tar = tokens[1];
        if (nodeMap.find(src) == nodeMap.end() || nodeMap.find(tar) == nodeMap.end()) {
            std::cout << "Invalid node in edge: " + src + " -> " + tar << std::endl;
            igraph_vector_int_destroy(&edges);
            igraph_vector_destroy(&weights);
            throw std::runtime_error("Invalid node in edge: " + src + " -> " + tar);
        }

        // add edge to igraph vector using the node id
        igraph_vector_int_push_back(&edges, nodeMap[src]);
        igraph_vector_int_push_back(&edges, nodeMap[tar]);

        if (weighted) {
            if (tokens.size() < 3) {
                igraph_vector_push_back(&weights, 1); // default weight
            } else {
                weight = tokens[2];
                try {
                    igraph_vector_push_back(&weights, std::stod(weight));
                } catch (const std::exception& e) {
                    igraph_vector_int_destroy(&edges);
                    igraph_vector_destroy(&weights);
                    throw std::runtime_error("Invalid weight in edge: " + src + " -> " + tar);
                }
            }
        }
    }

    // remove existing graph and create new
    igraph_destroy(&igraphGlobalGraph);
    igraph_create(&igraphGlobalGraph, &edges, nodeMap.size(), directed);   

    // add node names as attributes
    std::cout << "reading node names..." << std::endl;

    for (auto &pair : nodeMap) {
        std::cout << pair.first << ": " << pair.second << std::endl;
        SETVAS(&igraphGlobalGraph, "name", pair.second, pair.first.c_str());
    }

    // store weights in global variable
    igraph_vector_destroy(&globalWeights);
    if (weighted) {
        std::cout << "test1" << std::endl;

        igraph_vector_init_copy(&globalWeights, &weights);

                std::cout << "test2" << std::endl;

    }

    igraph_vector_int_destroy(&edges);
    igraph_vector_destroy(&weights);
}

val graph_from_csv(const std::string& nodesFilename, const std::string& edgesFilename, bool directed) {
    val result = val::object();
    try {
        std::unordered_map<std::string, int> nodeMap = process_nodes_csv(nodesFilename);
        process_edges_csv(edgesFilename, nodeMap, directed);
            std::cout << "test" << std::endl;

        result.set("nodes", graph_nodes());
        result.set("edges", graph_edges());
    } catch(const std::exception& e) {
        std::cerr << e.what() << std::endl;
        result.set("error", e.what());
    }
    return result;
}
