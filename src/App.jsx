import { useState, useEffect } from 'react'
import createModule from './graph'
import './App.css'
import { GraphRenderer } from './components/GraphRenderer';
import { Box, Button, ButtonGroup, Menu, MenuItem, Typography } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Accordion, AccordionDetails, AccordionSummary } from './components/Accordion';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ImportMenu from './components/imports/ImportMenu';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FDF7FF'
    },
    secondary: {
      main: '#67baa7'
    },
    info: {
      main: '#6750c6'
    }
    // secondary (green #67baa7)
  },
});



function App() {
  const [wasmModule, setWasmModule] = useState();
  const [expanded, setExpanded] = useState('panel1');

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [directed, setDirected] = useState(false);
  const [colorMap, setColorMap] = useState({});
  const [sizeMap, setSizeMap] = useState({});
  const [renderMode, setRenderMode] = useState(1);
  const [text, setText] = useState("");

  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    createModule().then(mod => {
      setWasmModule(mod)
      const graph = mod.initGraph(); // initialize the graph in C++
      setNodes(graph.nodes)
      setEdges(graph.edges)

      window.onunload = () => {
        console.log("Cleanup")
        mod.cleanupGraph()
      }
    })
  }, []);

  useEffect(() => {
    console.log(colorMap)
  }, [colorMap])

  const updateGraph = (nodes, edges, directed) => {
    setColorMap({});
    setSizeMap({});
    setNodes(nodes);
    setEdges(edges);
    setDirected(directed);
  }

  const handleAccordianChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const postAlgorithmState = response => {
    console.log(`Mode: ${response.mode}`)
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
    setRenderMode(response.mode)
  }

  const doAreConnected = () => {
    const source = prompt("Enter source vertex", "0");
    const target = prompt("Enter target vertex", "0");
    const response = wasmModule.vertices_are_connected(parseInt(source), parseInt(target))
    postAlgorithmState(response)
  }
  const doDijkstraSingle = () => {
    const source = prompt("Enter source vertex", "0");
    const target = prompt("Enter target vertex", "0");
    const response = wasmModule.dijkstra_source_to_target(parseInt(source), parseInt(target));
    console.log(response)
    postAlgorithmState(response)
  }
  const doDijkstraMulti = () => {
    const source = prompt("Enter source vertex", "0");
    const response = wasmModule.dijkstra_source_to_all(parseInt(source));
    postAlgorithmState(response)
  }
  const doYen = () => {
    const source = prompt("Enter source vertex", "0");
    const target = prompt("Enter target vertex", "0");
    const kInput = prompt("Enter k (number of paths)");
    const k = parseInt(kInput) || 1;
    const response = wasmModule.yens_algorithm(parseInt(source), parseInt(target), k);
    postAlgorithmState(response)
  }
  const doBFSingle = () => {
    const source = prompt("Enter source vertex", "0");
    const target = prompt("Enter target vertex", "0");
    const response = wasmModule.bellman_ford_source_to_target(parseInt(source), parseInt(target));
    postAlgorithmState(response)
  }
  const doBFMulti = () => {
    const source = prompt("Enter source vertex", "0");
    const response = wasmModule.bellman_ford_source_to_all(parseInt(source));
    postAlgorithmState(response)
  }
  const doBFS = () => {
    const source = prompt("Enter source vertex", "0");
    const response = wasmModule.bfs(parseInt(source));
    postAlgorithmState(response)
  }
  const doDFS = () => {
    const source = prompt("Enter source vertex", "0");
    const response = wasmModule.dfs(parseInt(source));
    postAlgorithmState(response)
  }
  const doRW = () => {
    const start = prompt("Enter starting vertex", "0");
    const steps = prompt("Enter step count", "0");
    const response = wasmModule.random_walk(parseInt(start), parseInt(steps));
    postAlgorithmState(response)
  }
  const doMST = () => {
    const response = wasmModule.min_spanning_tree();
    postAlgorithmState(response)
  }

  const doBetweennessCentrality = () => {
    const response = wasmModule.betweenness_centrality();
    postAlgorithmState(response)
  }
  const doClosenessCentrality = () => {
    const response = wasmModule.closeness_centrality();
    postAlgorithmState(response)
  }
  const doDegreeCentrality = () => {
    const response = wasmModule.degree_centrality();
    postAlgorithmState(response)
  }
  const doEigenCentrality = () => {
    const response = wasmModule.eigenvector_centrality();
    postAlgorithmState(response)
  }
  const doStrength = () => {
    const response = wasmModule.strength_centrality();
    postAlgorithmState(response)
  }
  const doHarmonicCentrality = () => {
    const response = wasmModule.harmonic_centrality();
    postAlgorithmState(response)
  }
  const doPageRank = () => {
    const response = wasmModule.pagerank(0.85);
    postAlgorithmState(response)
  }

  const doLouvain = () => {
    const resolution = prompt("Enter resolution", "1.0");
    const response = wasmModule.louvain(parseFloat(resolution));
    postAlgorithmState(response)
  }
  const doLeiden = () => {
    const resolution = prompt("Enter resolution (Start at 1)", "1.0");
    const response = wasmModule.leiden(parseFloat(resolution));
    postAlgorithmState(response)
  }
  const doFastGreedy = () => {
    const response = wasmModule.fast_greedy();
    postAlgorithmState(response);
  }


  return (
    <ThemeProvider theme={darkTheme}>
      {/*<CssBaseline /> changes backgroundColor to black */}
      <Typography variant='h3'>Novagraph</Typography>     
      
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              aria-controls='import-menu'
              aria-haspopup='true'
              onClick={event => setAnchorEl(event.currentTarget)}
              startIcon={<UploadIcon />}
              color='secondary'
            >
              Import Graph
            </Button>
            <Button
              aria-controls='export-menu'
              aria-haspopup='true'
              startIcon={<FileDownloadIcon />}
              color='secondary'
              disabled
            >
              Export Graph
            </Button>

            <ImportMenu
              id='import-menu'
              anchorEl={anchorEl}
              setAnchorEl={setAnchorEl}
              module={wasmModule}
              updateGraph={updateGraph}
            />
          </Box>
          <GraphRenderer
            nodes={nodes}
            links={edges}
            directed={directed}
            colors={colorMap}
            sizes={sizeMap}
            mode={renderMode}
          />
        </Box>

        <Box flexShrink={0}>
          <Accordion expanded={expanded === 'panel1'} onChange={handleAccordianChange('panel1')}>
            <AccordionSummary aria-controls="panel1-content" id="panel1-header">
              <Typography variant='body2' pl='5px'>Path Finding & Search</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ButtonGroup orientation='vertical' variant='text'>
                {/* Have on hover options for buttons as well (render descriptions)
                  e.g. onHover={() => renderDescription(<DijkstraDesc />)}
                */}
                <Button size='small' onClick={doAreConnected}>Neighbour Status?</Button>
                <Button size='small' onClick={doDijkstraSingle}>Dijkstra &#40;A to B&#41;</Button>
                <Button size='small' onClick={doDijkstraMulti}>Dijkstra &#40;A to all&#41;</Button>
                <Button size='small' onClick={doYen}>Yen's Shortest Path</Button>
                <Button size='small' onClick={doBFSingle}>Bellman-Ford &#40;A to B&#41;</Button>
                <Button size='small' onClick={doBFMulti}>Bellman-Ford &#40;A to all&#41;</Button>
                <Button size='small' onClick={doBFS}>Breadth First Search</Button>
                <Button size='small' onClick={doDFS}>Depth First Search</Button>
                <Button size='small' onClick={doRW}>Random Walk</Button>
                <Button size='small' onClick={doMST}>Minimum Spanning Tree</Button>
              </ButtonGroup>
            </AccordionDetails>
          </Accordion>

          <Accordion expanded={expanded === 'panel2'} onChange={handleAccordianChange('panel2')}>
            <AccordionSummary aria-controls="panel2-content" id="panel2-header">
              <Typography variant='body2' pl='5px'>Centrality</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ButtonGroup orientation='vertical' variant='text'>
                <Button size='small' onClick={doBetweennessCentrality}>Betweenness Centrality</Button>
                <Button size='small' onClick={doClosenessCentrality}>Closeness Centrality</Button>
                <Button size='small' onClick={doDegreeCentrality}>Degree Centrality</Button>
                <Button size='small' onClick={doEigenCentrality}>Eigenvector Centrality</Button>
                <Button size='small' onClick={doStrength}>Node Strength</Button>
                <Button size='small' onClick={doHarmonicCentrality}>Harmonic Centrality</Button>
                <Button size='small' onClick={doPageRank}>Page Rank</Button>
              </ButtonGroup>
            </AccordionDetails>
          </Accordion>

          <Accordion expanded={expanded === 'panel3'} onChange={handleAccordianChange('panel3')}>
            <AccordionSummary aria-controls="panel3-content" id="panel3-header">
              <Typography variant='body2' pl='5px'>Community Detection</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ButtonGroup orientation='vertical' variant='text'>
                <Button size='small' onClick={doLouvain}>Louvain Algorithm</Button>
                <Button size='small' onClick={doLeiden}>Leiden Algorithm</Button>
                <Button size='small' onClick={doFastGreedy}>Fast-Greedy Algorithm</Button>
              </ButtonGroup>
              {/*
                <p>Clustering Coefficient / Transitivity</p>
                <p>K-Core Decomposition</p>
                <p>Label Propagation</p>
                <p>Triangle Count</p>
                <p>Strongly Connected Components</p>
                <p>Weakly Connected Components</p>
              */}
              
            </AccordionDetails>
          </Accordion>

          <Accordion expanded={expanded === 'panel4'} onChange={handleAccordianChange('panel4')}>
            <AccordionSummary aria-controls="panel4-content" id="panel4-header">
              <Typography variant='body2' pl='5px'>Other Algorithms</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ButtonGroup orientation='vertical' variant='text'>
                <Button size='small' onClick={doFastGreedy} disabled>so empty...</Button>
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
