import { useState, useEffect } from 'react'
import createModule from './graph'
import './App.css'
import { CosmographProvider } from '@cosmograph/react'
import { GraphRenderer } from './components/GraphRenderer';
import { alg } from './algorithms';

function App() {
  const [wasmModule, setWasmModule] = useState();
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [colorMap, setColorMap] = useState({});
  const [red, setRed] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    createModule().then(mod => {
      setWasmModule(mod)
      const graph = mod.generateGraph();

      let nodesTmp = []
      let edgesTmp = []

      for (var i = 0; i < graph.nodes.size(); i++) {
          nodesTmp.push({ id: graph.nodes.get(i) })
      } 

      for (var i = 0; i < graph.edges.size(); i++) {
          const pair = graph.edges.get(i);
          edgesTmp.push({
            source: pair.get(0),
            target: pair.get(1)
          })
      }

      setNodes(nodesTmp)
      setEdges(edgesTmp)

      window.onunload = () => {
        mod.cleanupGraph()
      }
    })
  }, []);

  useEffect(() => {
    console.log(colorMap)
  }, [colorMap])

  const doAreConnected = () => {
    // single edge?
    let test = wasmModule.vertices_are_connected(2,9)
    console.log(test)
  }

  const doDijkstraSingle = () => {
    setText(alg.dijkstra_source_to_target(wasmModule, setColorMap))
    setRed(false)
  }
  const doDijkstraMulti = () => {
    setText(alg.dijkstra_source_to_all(wasmModule, setColorMap))
    setRed(true)
  }
  const doYen = () => {
    setText(alg.yens_shortest_paths_algorithm(wasmModule, setColorMap))
    setRed(true)
  }
  const doBFSingle = () => {
    setText(alg.bf_source_to_target(wasmModule, setColorMap))
    setRed(false)
  }
  const doBFMulti = () => {
    setText(alg.bf_source_to_all(wasmModule, setColorMap))
    setRed(true)
  }
  const doBFS = () => {
    setText(alg.bfs(wasmModule, setColorMap, nodes.length))
    setRed(true)
  }
  const doDFS = () => {
    setText(alg.dfs(wasmModule, setColorMap, nodes.length))
    setRed(true)
  }

  return (
    <>
      <h1>NovaGraph</h1>
      
      
      <CosmographProvider nodes={nodes} links={edges} id="hicosmos">
        <GraphRenderer colors={colorMap} nodes={nodes} colorAll={red} />
      </CosmographProvider>

      <div className="card">
        <h3>Path Finding Algorithms</h3>
        <button onClick={doAreConnected}>Connection?</button>
        <button onClick={doDijkstraSingle}>Dijkstra &#40;A to B&#41;</button>
        <button onClick={doDijkstraMulti}>Dijkstra &#40;A to all&#41;</button>
        <button onClick={doYen}>Yen's Shortest &#40;A to B&#41;</button>
        <button onClick={doBFSingle}>Bellman-Ford &#40;A to B&#41;</button>
        <button onClick={doBFMulti}>Bellman-Ford &#40;A to all&#41;</button>
        <button onClick={doBFS}>BFS</button>
        <button onClick={doDFS}>DFS</button>
      </div>
      
      <pre>{text}</pre>
    </>
  )
}

export default App
