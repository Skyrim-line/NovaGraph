const dijkstra_source_to_target = (wasmModule, setColorMap) => {
    const source = prompt("Enter source vertex", "0");
    const target = prompt("Enter target vertex", "0");
    setColorMap({})

    const path = wasmModule.dijkstra_source_to_target(parseInt(source), parseInt(target));
    for (let i = 0; i < path.size(); i++) {
      const nodeId = path.get(i);
      const linkId = i > 0 && `${path.get(i - 1)}-${nodeId}` // e.g. "0-1" or "1-2"

      setColorMap(map => ({
        ...map,
        [nodeId]: (map[nodeId] || 0) + 1,
        ...(linkId && { [linkId]: (map[linkId] || 0) + 1 })
      }))
    }
}

const dijkstra_source_to_all = (wasmModule, setColorMap) => {
    const source = prompt("Enter source vertex", "0");
    setColorMap({})


    // TODO: do something cool with frequencies
    const paths = wasmModule.dijkstra_source_to_all(parseInt(source));
    for (let i = 0; i < paths.size(); i++) {
      const path = paths.get(i);
      for (let j = 0; j < path.size(); j++) {
        const nodeId = path.get(j);
        const linkId = j > 0 && `${path.get(j - 1)}-${nodeId}`;

        setColorMap(map => ({
            ...map,
            [nodeId]: (map[nodeId] || 0) + 1,
            ...(linkId && { [linkId]: (map[linkId] || 0) + 1 })
          }))
      }
    }
}

export const alg = {
    dijkstra_source_to_target,
    dijkstra_source_to_all
    // add more here when implemented
}