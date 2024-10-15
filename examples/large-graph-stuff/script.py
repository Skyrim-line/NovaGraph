import networkx as nx

G = nx.DiGraph()

with open('soc-Epinions1.txt', 'r') as f:
    for line in f:
        node1, node2 = line.strip().split('\t')
        G.add_edge(int(node1), int(node2))
    
nx.write_gexf(G, 'epinions.gexf')