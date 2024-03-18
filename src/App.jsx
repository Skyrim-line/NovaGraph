import { useState, useEffect } from 'react'
import createModule from './graph'
import './App.css'
import { GraphRenderer } from './components/GraphRenderer';
import { Box, Button, ButtonGroup, Typography } from '@mui/material';
import { Accordion, AccordionDetails, AccordionSummary } from './components/Accordion';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FDF7FF'
    }
    // secondary (green #67baa7)
  },
});



function App() {
  const [wasmModule, setWasmModule] = useState();
  const [expanded, setExpanded] = useState('panel1');

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [colorMap, setColorMap] = useState({});
  const [sizeMap, setSizeMap] = useState({});
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

  const handleAccordianChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const postAlgorithmState = (response, unreachable) => {
    if (response.colorMap) {
      setSizeMap(response.sizeMap ? response.sizeMap : {})
      setColorMap(response.colorMap)
    } else if (response.sizeMap) {
      setSizeMap(response.sizeMap)
      setColorMap({})
    } else {
      setColorMap({})
      setSizeMap({})
    }
    setText(response.message)
    setRed(unreachable)
  }

  const doAreConnected = () => {
    const source = prompt("Enter source vertex", "0");
    const target = prompt("Enter target vertex", "0");
    const response = wasmModule.vertices_are_connected(parseInt(source), parseInt(target))
    postAlgorithmState(response, false)
  }
  const doDijkstraSingle = () => {
    const source = prompt("Enter source vertex", "0");
    const target = prompt("Enter target vertex", "0");
    const response = wasmModule.dijkstra_source_to_target(parseInt(source), parseInt(target));
    postAlgorithmState(response, false)
  }
  const doDijkstraMulti = () => {
    const source = prompt("Enter source vertex", "0");
    const response = wasmModule.dijkstra_source_to_all(parseInt(source));
    postAlgorithmState(response, true)
  }
  const doYen = () => {
    const source = prompt("Enter source vertex", "0");
    const target = prompt("Enter target vertex", "0");
    const kInput = prompt("Enter k (number of paths)");
    const k = parseInt(kInput) || 1;
    const response = wasmModule.yens_algorithm(parseInt(source), parseInt(target), k);
    postAlgorithmState(response, true)
  }
  const doBFSingle = () => {
    const source = prompt("Enter source vertex", "0");
    const target = prompt("Enter target vertex", "0");
    const response = wasmModule.bellman_ford_source_to_target(parseInt(source), parseInt(target));
    postAlgorithmState(response, false)
  }
  const doBFMulti = () => {
    const source = prompt("Enter source vertex", "0");
    const response = wasmModule.bellman_ford_source_to_all(parseInt(source));
    postAlgorithmState(response, true)
  }
  const doBFS = () => {
    const source = prompt("Enter source vertex", "0");
    const response = wasmModule.bfs(parseInt(source));
    postAlgorithmState(response, true)
  }
  const doDFS = () => {
    const source = prompt("Enter source vertex", "0");
    const response = wasmModule.dfs(parseInt(source));
    postAlgorithmState(response, true)
  }
  const doRW = () => {
    const start = prompt("Enter starting vertex", "0");
    const steps = prompt("Enter step count", "0");
    const response = wasmModule.random_walk(parseInt(start), parseInt(steps));
    postAlgorithmState(response, true)
  }
  const doMST = () => {
    const response = wasmModule.min_spanning_tree();
    postAlgorithmState(response, true)
  }

  const doBetweennessCentrality = () => {
    const response = wasmModule.betweenness_centrality();
    postAlgorithmState(response, false)
  }
  const doClosenessCentrality = () => {
    const response = wasmModule.closeness_centrality();
    postAlgorithmState(response, false)
  }
  const doDegreeCentrality = () => {
    const response = wasmModule.degree_centrality();
    postAlgorithmState(response, false)
  }
  const doEigenCentrality = () => {
    const response = wasmModule.eigenvector_centrality();
    postAlgorithmState(response, false)
  }
  const doStrength = () => {
    const response = wasmModule.strength_centrality();
    postAlgorithmState(response, false)
  }

  return (
    <ThemeProvider theme={darkTheme}>
      {/*<CssBaseline /> changes backgroundColor to black */}
      <Typography variant='h3'>NovaGraph</Typography>
      
      <Box sx={{ display: 'flex', gap: 1 }}>
        <GraphRenderer nodes={nodes} links={edges} colors={colorMap} sizes={sizeMap} colorAll={red} />

        <Box>
          <Accordion expanded={expanded === 'panel1'} onChange={handleAccordianChange('panel1')}>
            <AccordionSummary aria-controls="panel1-content" id="panel1-header">
              <Typography variant='body2' pl='5px'>Path Finding & Search Algorithms</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ButtonGroup orientation='vertical' variant='text'>
                {/* Have on hover options for buttons as well (render descriptions)
                  e.g. onHover={() => renderDescription(<DijkstraDesc />)}
                */}
                <Button onClick={doAreConnected}>Neighbour Status?</Button>
                <Button onClick={doDijkstraSingle}>Dijkstra &#40;A to B&#41;</Button>
                <Button onClick={doDijkstraMulti}>Dijkstra &#40;A to all&#41;</Button>
                <Button onClick={doYen}>Yen's Shortest Path</Button>
                <Button onClick={doBFSingle}>Bellman-Ford &#40;A to B&#41;</Button>
                <Button onClick={doBFMulti}>Bellman-Ford &#40;A to all&#41;</Button>
                <Button onClick={doBFS}>Breadth First Search</Button>
                <Button onClick={doDFS}>Depth First Search</Button>
                <Button onClick={doRW}>Random Walk</Button>
                <Button onClick={doMST}>Minimum Spanning Tree</Button>
              </ButtonGroup>
            </AccordionDetails>
          </Accordion>

          <Accordion expanded={expanded === 'panel2'} onChange={handleAccordianChange('panel2')}>
            <AccordionSummary aria-controls="panel2-content" id="panel2-header">
              <Typography variant='body2' pl='5px'>Centrality</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ButtonGroup orientation='vertical' variant='text'>
                <Button onClick={doBetweennessCentrality}>Betweenness Centrality</Button>
                <Button onClick={doClosenessCentrality}>Closeness Centrality</Button>
                <Button onClick={doDegreeCentrality}>Degree Centrality</Button>
                <Button onClick={doEigenCentrality}>Eigenvector Centrality</Button>
                <Button onClick={doStrength}>Node Strength</Button>
              </ButtonGroup>
            </AccordionDetails>
          </Accordion>

        </Box>

      </Box>
      
      <h2>Output</h2>
      <hr />
      <pre>{text}</pre>
    </ThemeProvider>
  )
}

export default App
