import pandas as pd
import networkx as nx

meta_df = pd.read_csv('reachability-meta.csv', usecols=['node_id', 'name'])

G = nx.DiGraph()
for _, row in meta_df.iterrows():
    G.add_node(row['node_id'], label=row['name'])

with open('reachability.txt') as edges:
    for edge in edges:
        if edge.startswith('#'):
            continue
        from_node, to_node, weight = edge.strip().split()
        if G.has_node(int(from_node)) and G.has_node(int(to_node)):
            G.add_edge(int(from_node), int(to_node), weight=abs(int(weight)))


nx.write_gexf(G, 'reachability-out.gexf')

print('Graph saved in reachability-out.gexf')