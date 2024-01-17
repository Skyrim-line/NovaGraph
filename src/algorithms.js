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
        [nodeId]: '#fff',
        ...(linkId && { [linkId]: '#fff' })
      }))
    }
}

export const alg = {
    dijkstra_source_to_target,
    // add more here when implemented
}