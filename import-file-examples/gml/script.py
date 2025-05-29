import networkx as nx

graph = nx.read_gml('dolphins.gml')
nx.write_graphml(graph, 'dolphins.graphml')
