import csv

nodes = set()

with open('edges.csv') as f:
    reader = csv.reader(f)
    next(reader)
    for row in reader:
        nodes.add(row[0])
        nodes.add(row[1])

# output to file with each node on a new line
with open('nodes.csv', 'w') as f:
    writer = csv.writer(f)
    writer.writerow(['id'])
    for node in nodes:
        writer.writerow([node])
