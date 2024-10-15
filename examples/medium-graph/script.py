import csv

input_file = 'lastfm_asia_edges.csv'
output_file = 'lastfm_asia_nodes.csv'

nodes = set()
with open(input_file, 'r') as f:
    reader = csv.reader(f)
    next(reader)
    for row in reader:
        source, target = row
        nodes.add(source)
        nodes.add(target)

with open(output_file, 'w') as f:
    writer = csv.writer(f)
    writer.writerow(['nodes'])
    for node in sorted(nodes, key=int):
        writer.writerow([node])
