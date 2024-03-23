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

std::unordered_map<std::string, int> process_nodes_csv(const std::string& filename) {
    std::unordered_map<std::string, int> nodes;
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
        std::istringstream fileStream(trim(line));
        if (fileStream >> name) {
            // insert into the set and if it doesn't exist, the second elem of the pair returns true
            if (nodeSet.insert(name).second) {
                nodes[name] = id++;
            }
        }
    }

    std::cout << "Nodes list: " << std::endl;
    for (const auto& [key1, value1] : nodes) {
        std::cout << key1 << " " << value1 << std::endl;
    }

    return nodes;
}

void graph_from_csv(const std::string& nodesFilename, const std::string& edgesFilename, bool directed) {
    try {
        process_nodes_csv(nodesFilename);
    } catch(const std::exception& e) {
        std::cerr << e.what() << std::endl;
    }
    
}
