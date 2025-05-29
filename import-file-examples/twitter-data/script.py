import networkx as nx

# Read user_list.txt and create a mapping from old user id to new id
old_to_new_id = {}
with open('user_list.txt') as f:
    for old_id, line in enumerate(f):
        old_to_new_id[int(old_id)] = int(line.strip())

# Read user_map.txt and create a mapping from new user id to username
new_id_to_username = {}
with open('user_map.txt') as f:
    for line in f:
        new_id, username = line.strip().split()
        new_id_to_username[int(new_id)] = username

# Create graph and add nodes
G = nx.DiGraph()
for new_id, username in new_id_to_username.items():
    G.add_node(int(new_id), label=username)

# Read graph_cb.txt and add edges
with open('graph_cb.txt') as f:
    for line in f:
        old_source, old_target, _ = line.strip().split()
        new_source = int(old_to_new_id[int(old_source)])
        new_target = int(old_to_new_id[int(old_target)])

        if G.has_node(new_source) and G.has_node(new_target):
            G.add_edge(new_source, new_target)

# combine nodes with the same username
combined_nodes = {}
for new_id, username in new_id_to_username.items():
    if username not in combined_nodes:
        combined_nodes[username] = new_id
    else:
        print(f'Combining {new_id} and {combined_nodes[username]} which have the same username {username}')
        G = nx.contracted_nodes(G, combined_nodes[username], new_id, self_loops=False)

# Write graph to file
nx.write_gexf(G, 'twitter.gexf')