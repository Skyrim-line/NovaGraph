
const dijkstra_source_to_target = (wasmModule, setColorMap) => {
  const source = prompt("Enter source vertex", "0");
  const target = prompt("Enter target vertex", "0");
  setColorMap({})

  const path = wasmModule.dijkstra_source_to_target(parseInt(source), parseInt(target));
  let msg = `Dijkstra's Shortest Path from [${source}] to [${target}]:\n`;

  for (let i = 0; i < path.size(); i++) {
    const nodeId = path.get(i);
    const linkId = i > 0 && `${path.get(i - 1)}-${nodeId}` // e.g. "0-1" or "1-2"
    msg += i > 0 ? ` -> [${nodeId}]` : `[${nodeId}]`

    setColorMap(map => ({
      ...map,
      [nodeId]: (map[nodeId] || 0) + 1,
      ...(linkId && { [linkId]: (map[linkId] || 0) + 1 })
    }))
  }
  return msg;
}

const dijkstra_source_to_all = (wasmModule, setColorMap) => {
  const source = prompt("Enter source vertex", "0");
  setColorMap({})
  const paths = wasmModule.dijkstra_source_to_all(parseInt(source));
  let msg = `Dijkstra's Shortest Paths from [${source}] to all:`;
  
  for (let i = 0; i < paths.size(); i++) {
    const path = paths.get(i);
    const dest = path.get(path.size() - 1);
    if (dest == source) continue;

    msg += `\n[${dest}]: `

    for (let j = 0; j < path.size(); j++) {
      const nodeId = path.get(j);
      const linkId = j > 0 && `${path.get(j - 1)}-${nodeId}`;
      msg += (j > 0) ? ` -> [${nodeId}]` : `[${nodeId}]`

      setColorMap(map => ({
          ...map,
          [nodeId]: (map[nodeId] || 0) + 1,
          ...(linkId && { [linkId]: (map[linkId] || 0) + 1 })
        }))
    }
  }
  return msg;
}

const yens_shortest_paths_algorithm = (wasmModule, setColorMap) => {
  const source = prompt("Enter source vertex", "0");
  const target = prompt("Enter target vertex", "0");
  const kInput = prompt("Enter k (number of paths)");
  const k = parseInt(kInput) || 1;
  setColorMap({})

  const paths = wasmModule.yens_algorithm(parseInt(source), parseInt(target), k);

  let msg = (paths.size() == 0) ?
    `No paths found from [${source}] to [${target}] using Yen's algorithm` :
    (paths.size() < k) ?
    `Only ${paths.size()} (from ${k}) shortest paths found from [${source}] to [${target}] using Yen's algorithm` :
    `${k} shortest paths from [${source}] to [${target}] using Yen's algorithm`;

  for (let i = 0; i < paths.size(); i++) {
    const path = paths.get(i);
    msg += `\nPath ${i+1}: `
    for (let j = 0; j < path.size(); j++) {
      const nodeId = path.get(j);
      const linkId = j > 0 && `${path.get(j - 1)}-${nodeId}`;
      msg += (j > 0) ? ` -> [${nodeId}]` : `[${nodeId}]`

      setColorMap(map => ({
          ...map,
          [nodeId]: (map[nodeId] || 0) + 1,
          ...(linkId && { [linkId]: (map[linkId] || 0) + 1 })
        }))
    }
  }
  return msg;
}

const bf_source_to_target = (wasmModule, setColorMap) => {
  const source = prompt("Enter source vertex", "0");
  const target = prompt("Enter target vertex", "0");
  setColorMap({})

  const path = wasmModule.bellman_ford_source_to_target(parseInt(source), parseInt(target));
  let msg = `Bellman-Ford Shortest Path from [${source}] to [${target}]:\n`;

  for (let i = 0; i < path.size(); i++) {
    const nodeId = path.get(i);
    const linkId = i > 0 && `${path.get(i - 1)}-${nodeId}` // e.g. "0-1" or "1-2"
    msg += i > 0 ? ` -> [${nodeId}]` : `[${nodeId}]`

    setColorMap(map => ({
      ...map,
      [nodeId]: (map[nodeId] || 0) + 1,
      ...(linkId && { [linkId]: (map[linkId] || 0) + 1 })
    }))
  }
  return msg;
}

const bf_source_to_all = (wasmModule, setColorMap) => {
  const source = prompt("Enter source vertex", "0");
  setColorMap({})
  const paths = wasmModule.bellman_ford_source_to_all(parseInt(source));
  let msg = `Dijkstra's Shortest Paths from [${source}] to all:`;
  
  for (let i = 0; i < paths.size(); i++) {
    const path = paths.get(i);
    const dest = path.get(path.size() - 1);
    if (dest == source) continue;

    msg += `\n[${dest}]: `

    for (let j = 0; j < path.size(); j++) {
      const nodeId = path.get(j);
      const linkId = j > 0 && `${path.get(j - 1)}-${nodeId}`;
      msg += (j > 0) ? ` -> [${nodeId}]` : `[${nodeId}]`

      setColorMap(map => ({
          ...map,
          [nodeId]: (map[nodeId] || 0) + 1,
          ...(linkId && { [linkId]: (map[linkId] || 0) + 1 })
        }))
    }
  }
  return msg;
}

const bfs = (wasmModule, setColorMap, numNodes) => {
  const source = prompt("Enter source vertex", "0");
  let newCMap = {}
  let nodesRemaining = numNodes

  const layers = wasmModule.bfs(parseInt(source));
  let msg = `BFS from [${source}]\n`

  for (let i = 0; i < layers.size(); i++) {
    const layer = layers.get(i)
    msg += `Iteration ${i}: [`
    for (let j = 0; j < layer.size(); j++) {
      let nodeId = layer.get(j)
      newCMap[nodeId] = nodesRemaining,

      msg += `${layer.get(j)}`
      if (j != layer.size() - 1) {
        msg += ', '
      }
    }
    msg += ']\n'
    nodesRemaining -= layer.size()
  }

  setColorMap(newCMap)
  return msg;

}

export const alg = {
    dijkstra_source_to_target,
    dijkstra_source_to_all,
    yens_shortest_paths_algorithm,
    bf_source_to_target,
    bf_source_to_all,
    bfs
    // add more here when implemented
}