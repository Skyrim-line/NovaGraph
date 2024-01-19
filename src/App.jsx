import { useState, useEffect } from 'react'
import createModule from './graph'
import './App.css'
import { CosmographProvider } from '@cosmograph/react'
import { GraphRenderer } from './components/GraphRenderer';
import { alg } from './algorithms';

function App() {
  const [count, setCount] = useState(0)

  const [wasmModule, setWasmModule] = useState();
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [colorMap, setColorMap] = useState({});
  const [red, setRed] = useState(false);

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

  const doDijkstra = () => {
    alg.dijkstra_source_to_target(wasmModule, setColorMap)
    setRed(false)
  }
  const doDijkstra2 = () => {
    alg.dijkstra_source_to_all(wasmModule, setColorMap)
    setRed(true)
  }

  return (
    <>
      <h1>NovaGraph</h1>
      
      <button onClick={doDijkstra}>Dijkstra &#40;A to B&#41;</button>
      <button onClick={doDijkstra2}>Dijkstra &#40;A to all&#41;</button>
      <CosmographProvider nodes={nodes} links={edges} id="hicosmos">
        <GraphRenderer colors={colorMap} nodes={nodes} colorAll={red} />
      </CosmographProvider>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  )
}

export default App
