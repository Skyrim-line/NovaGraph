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
      mod.initGraph(); // initialize the graph in C++
      const graph = mod.getGraph(); // get the graph as a JS array

      let nodesTmp = []
      let edgesTmp = []

      for (var i = 0; i < graph.length; i++) {
          nodesTmp.push({ id: i }) // create a node for each index
          for (var j = 0; j < graph[i].length; j++) {
              if (graph[i][j] === 1) { // if there is an edge
                  edgesTmp.push({
                      source: i,
                      target: j
                  })
              }
          }
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
    const source = prompt("Enter source vertex", "0");
    const target = prompt("Enter target vertex", "0");
    const response = wasmModule.dijkstra_source_to_target(parseInt(source), parseInt(target));
    setColorMap(response.colorMap)
    setText(response.message)
    setRed(false)
  }
  const doDijkstraMulti = () => {
    const source = prompt("Enter source vertex", "0");
    const response = wasmModule.dijkstra_source_to_all(parseInt(source));
    setColorMap(response.colorMap)
    setText(response.message)
    setRed(true)
  }
  const doYen = () => {
    const source = prompt("Enter source vertex", "0");
    const target = prompt("Enter target vertex", "0");
    const kInput = prompt("Enter k (number of paths)");
    const k = parseInt(kInput) || 1;
    const response = wasmModule.yens_algorithm(parseInt(source), parseInt(target), k);
    setColorMap(response.colorMap)
    setText(response.message)
    setRed(true)
  }
  const doBFSingle = () => {
    const source = prompt("Enter source vertex", "0");
    const target = prompt("Enter target vertex", "0");
    const response = wasmModule.bellman_ford_source_to_target(parseInt(source), parseInt(target));
    setColorMap(response.colorMap)
    setText(response.message)
    setRed(false)
  }
  const doBFMulti = () => {
    const source = prompt("Enter source vertex", "0");
    const response = wasmModule.bellman_ford_source_to_all(parseInt(source));
    setColorMap(response.colorMap)
    setText(response.message)
    setRed(true)
  }
  const doBFS = () => {
    const source = prompt("Enter source vertex", "0");
    const response = wasmModule.bfs(parseInt(source));
    setColorMap(response.colorMap)
    setText(response.message)
    setRed(true)
  }
  const doDFS = () => {
    const source = prompt("Enter source vertex", "0");
    const response = wasmModule.dfs(parseInt(source));
    setColorMap(response.colorMap)
    setText(response.message)
    setRed(true)
  }
  const doRW = () => {
    const start = prompt("Enter starting vertex", "0");
    const steps = prompt("Enter step count", "0");
    const response = wasmModule.random_walk(parseInt(start), parseInt(steps));
    setColorMap(response.colorMap)
    setText(response.message)
    setRed(true)
  }
  const doMST = () => {
    const response = wasmModule.min_spanning_tree();
    setColorMap(response.colorMap)
    setText(response.message)
    setRed(true)
  }

  return (
    <>
      <h1>NovaGraph</h1>
      
      
      <CosmographProvider nodes={nodes} links={edges} id="hicosmos">
        <GraphRenderer colors={colorMap} nodes={nodes} colorAll={red} />
      </CosmographProvider>

      <div className="card">
        <h3>Path Finding & Search Algorithms</h3>
        <button onClick={doAreConnected}>Connection?</button>
        <button onClick={doDijkstraSingle}>Dijkstra &#40;A to B&#41;</button>
        <button onClick={doDijkstraMulti}>Dijkstra &#40;A to all&#41;</button>
        <button onClick={doYen}>Yen's Shortest &#40;A to B&#41;</button>
        <button onClick={doBFSingle}>Bellman-Ford &#40;A to B&#41;</button>
        <button onClick={doBFMulti}>Bellman-Ford &#40;A to all&#41;</button>
        <button onClick={doBFS}>BFS</button>
        <button onClick={doDFS}>DFS</button>
        <button onClick={doRW}>Random Walk</button>
        <button onClick={doMST}>Min Spanning Tree</button>
      </div>
      
      <pre>{text}</pre>
    </>
  )
}

export default App
