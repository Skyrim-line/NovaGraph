#include "graph.h"

void frequenciesToColorMap(std::unordered_map<int, int> fm, val &colorMap) {
    auto max_it = std::max_element(fm.begin(), fm.end(), [](const std::pair<int, int>& p1, const std::pair<int, int>& p2) {
        return p1.second < p2.second;
    });
    int max_freq = max_it->second;

    // Scale frequencies and add them to colorMap
    for (auto& pair : fm) {
        int node = pair.first;
        int freq = pair.second;
        double scaled = static_cast<double>(freq) / max_freq;
        colorMap.set(node, scaled);
    }
}