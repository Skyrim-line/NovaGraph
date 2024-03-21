#include "graph.h"
#include <iostream>
#include <fstream>

void graph_from_csv(std::string filename) {
    // Convert bytes vector to a string
    std::ifstream file(filename);

    std::string line;
    std::cout << "Printing all csv lines" << std::endl;
    while (std::getline(file, line)) {
        std::cout << ": " << line << std::endl;
    }
}
