import networkx as nx
import pandas as pd

# Read the CSV files
nodes_df = pd.read_csv('musae_git_target.csv')
edges_df = pd.read_csv('musae_git_edges.csv')

# filter only first 15000 nodes
#nodes_df = nodes_df.head(15000)

# filter edges to only include when both nodes are in the nodes df
edges_df = edges_df[edges_df['id_1'].isin(nodes_df['id']) & edges_df['id_2'].isin(nodes_df['id'])]

G = nx.from_pandas_edgelist(edges_df, 'id_1', 'id_2')

for index, row in nodes_df.iterrows():
    if row['id'] in G:
        G.nodes[row['id']]['label'] = row['name']
    else:
        # Node not in edgelist
        # G.add_node(row['id'], label=row['name'])
        pass

# Save the graph in GEXF format
nx.write_gexf(G, 'network.gexf')

print('Graph saved in network.gexf')