import { useState, useEffect } from 'react'
import createModule from './graph'
import './App.css'
import logo from './assets/logo.png'
import { GraphRenderer } from './components/GraphRenderer';
import { Alert, Box, Button, ButtonGroup, Collapse, Divider, IconButton, Menu, MenuItem, Snackbar, Tooltip, Typography } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Accordion, AccordionDetails, AccordionSummary } from './components/Accordion';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import ImportMenu from './components/imports/ImportMenu';
import { Algorithm } from './algorithms';
import AlgorithmExplanation from './components/AlgorithmExplanation';
import { ErasBold, ErasMedium } from './components/Eras';

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
  const [hoveredAlgorithm, setHoveredAlgorithm] = useState(null);
  const [activeAlgorithm, setActiveAlgorithm] = useState(null); // TODO: implement for conditional rendering
  const [error, setError] = useState(null);

  useEffect(() => {
    createModule().then(mod => {
      setWasmModule(mod)
      const graph = mod.initGraph(); // initialize the graph in C++
      setNodes(graph.nodes)
      setEdges(graph.edges)

      window.onerror = (message, source, lineno, colno, error) => {
        if (typeof error != 'number') return;
        const pointer = error;
        const error_message = mod.what_to_stderr(pointer);
        setError(error_message);
      }

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
    setRenderMode(1);
  }

  const handleAccordianChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const postAlgorithmState = response => {
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

  const toId = name => {
    const node = nodes.find(node => node.name === name)
    return node ? node.id : null
  }

  const doAreConnected = () => {
    const source = prompt("Enter source vertex");
    const target = prompt("Enter target vertex");
    const response = wasmModule.vertices_are_connected(toId(source), toId(target))
    postAlgorithmState(response)
  }
  const doDijkstraSingle = () => {
    const source = prompt("Enter source vertex");
    const target = prompt("Enter target vertex");
    const response = wasmModule.dijkstra_source_to_target(toId(source), toId(target));
    postAlgorithmState(response)
  }
  const doDijkstraMulti = () => {
    const source = prompt("Enter source vertex");
    const response = wasmModule.dijkstra_source_to_all(toId(source));
    postAlgorithmState(response)
  }
  const doYen = () => {
    const source = prompt("Enter source vertex");
    const target = prompt("Enter target vertex");
    const k = prompt("Enter k (number of paths)", "1");
    const response = wasmModule.yens_algorithm(toId(source), toId(target), parseInt(k));
    postAlgorithmState(response)
  }
  const doBFSingle = () => {
    const source = prompt("Enter source vertex");
    const target = prompt("Enter target vertex");
    const response = wasmModule.bellman_ford_source_to_target(toId(source), toId(target));
    postAlgorithmState(response)
  }
  const doBFMulti = () => {
    const source = prompt("Enter source vertex");
    const response = wasmModule.bellman_ford_source_to_all(toId(source));
    postAlgorithmState(response)
  }
  const doBFS = () => {
    const source = prompt("Enter source vertex");
    const response = wasmModule.bfs(toId(source));
    postAlgorithmState(response)
  }
  const doDFS = () => {
    const source = prompt("Enter source vertex");
    const response = wasmModule.dfs(toId(source));
    postAlgorithmState(response)
  }
  const doRW = () => {
    const start = prompt("Enter starting vertex");
    const steps = prompt("Enter step count", "1");
    const response = wasmModule.random_walk(toId(start), parseInt(steps));
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

      <Snackbar
        open={error !== null}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" variant='filled' onClose={() => setError(null)}>{error}</Alert>
      </Snackbar>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt='logo' width={60} style={{ paddingBottom: 10, paddingLeft: 10 }} />
            <ErasMedium fontSize={40}>ova</ErasMedium>
            <ErasBold fontSize={40} mb={0.2}>graph</ErasBold>
          </Box>
          <GraphRenderer
            nodes={nodes}
            links={edges}
            directed={directed}
            colors={colorMap}
            sizes={sizeMap}
            mode={renderMode}
          />
          <Typography variant='h4'>Output</Typography>
          <Divider />
          <pre>{text}</pre>
        </Box>

        <Box width={{ xs: '15rem', sm: '20rem' }}>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }} p={1}>
            <Tooltip title='Import Graph'>
              <Button
                aria-controls='import-menu'
                aria-haspopup='true'
                onClick={event => setAnchorEl(event.currentTarget)}
                startIcon={<UploadIcon />}
                variant='text'
                color='secondary'
                size='small'
              >
                Import
              </Button>
            </Tooltip>
            <Tooltip title='Export Graph'>
              <Button
                aria-controls='export-menu'
                aria-haspopup='true'
                startIcon={<FileDownloadIcon />}
                variant='text'
                color='secondary'
                size='small'
                disabled
              >
                Export
              </Button>
            </Tooltip>
            <Tooltip title='Help'>
              <IconButton color='info' disabled>
                <HelpOutlineIcon />
              </IconButton>
            </Tooltip>
            <ImportMenu
              id='import-menu'
              anchorEl={anchorEl}
              setAnchorEl={setAnchorEl}
              module={wasmModule}
              updateGraph={updateGraph}
            />
          </Box>
          <Accordion expanded={expanded === 'panel1'} onChange={handleAccordianChange('panel1')}>
            <AccordionSummary aria-controls="panel1-content" id="panel1-header">
              <Typography variant='body2' pl='5px'>Path Finding & Search</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ButtonGroup orientation='vertical' variant='text'>
                <Button size='small' onClick={doAreConnected}
                  onMouseEnter={() => setHoveredAlgorithm(Algorithm.NEIGHBOR_JOINING)}
                  onMouseLeave={() => setHoveredAlgorithm(null)}
                >Neighbour Status?</Button>
                <Button size='small' onClick={doDijkstraSingle}
                  onMouseEnter={() => setHoveredAlgorithm(Algorithm.DIJKSTRA_A_TO_B)}
                  onMouseLeave={() => setHoveredAlgorithm(null)}
                >Dijkstra &#40;A to B&#41;</Button>
                <Button size='small' onClick={doDijkstraMulti}
                  onMouseEnter={() => setHoveredAlgorithm(Algorithm.DIJKSTRA_ALL)}
                  onMouseLeave={() => setHoveredAlgorithm(null)}
                >Dijkstra &#40;A to all&#41;</Button>
                <Button size='small' onClick={doYen}
                  onMouseEnter={() => setHoveredAlgorithm(Algorithm.YEN)}
                  onMouseLeave={() => setHoveredAlgorithm(null)}
                >Yen's Shortest Path</Button>
                <Button size='small' onClick={doBFSingle}
                  onMouseEnter={() => setHoveredAlgorithm(Algorithm.BELLMAN_FORD_A_TO_B)}
                  onMouseLeave={() => setHoveredAlgorithm(null)}
                >Bellman-Ford &#40;A to B&#41;</Button>
                <Button size='small' onClick={doBFMulti}
                  onMouseEnter={() => setHoveredAlgorithm(Algorithm.BELLMAN_FORD_ALL)}
                  onMouseLeave={() => setHoveredAlgorithm(null)}
                >Bellman-Ford &#40;A to all&#41;</Button>
                <Button size='small' onClick={doBFS}
                  onMouseEnter={() => setHoveredAlgorithm(Algorithm.BFS)}
                  onMouseLeave={() => setHoveredAlgorithm(null)}
                >Breadth First Search</Button>
                <Button size='small' onClick={doDFS}
                  onMouseEnter={() => setHoveredAlgorithm(Algorithm.DFS)}
                  onMouseLeave={() => setHoveredAlgorithm(null)}
                >Depth First Search</Button>
                <Button size='small' onClick={doRW}
                  onMouseEnter={() => setHoveredAlgorithm(Algorithm.RANDOM_WALK)}
                  onMouseLeave={() => setHoveredAlgorithm(null)}
                >Random Walk</Button>
                <Button size='small' onClick={doMST}
                  onMouseEnter={() => setHoveredAlgorithm(Algorithm.MINIMAL_SPANNING_TREE)}
                  onMouseLeave={() => setHoveredAlgorithm(null)}
                >Minimum Spanning Tree</Button>
              </ButtonGroup>
            </AccordionDetails>
          </Accordion>

          <Accordion expanded={expanded === 'panel2'} onChange={handleAccordianChange('panel2')}>
            <AccordionSummary aria-controls="panel2-content" id="panel2-header">
              <Typography variant='body2' pl='5px'>Centrality</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ButtonGroup orientation='vertical' variant='text'>
                <Button size='small' onClick={doBetweennessCentrality}
                  onMouseEnter={() => setHoveredAlgorithm(Algorithm.BETWEENNESS_CENTRALITY)}
                  onMouseLeave={() => setHoveredAlgorithm(null)}
                >Betweenness Centrality</Button>
                <Button size='small' onClick={doClosenessCentrality}
                  onMouseEnter={() => setHoveredAlgorithm(Algorithm.CLOSENESS_CENTRALITY)}
                  onMouseLeave={() => setHoveredAlgorithm(null)}
                >Closeness Centrality</Button>
                <Button size='small' onClick={doDegreeCentrality}
                  onMouseEnter={() => setHoveredAlgorithm(Algorithm.DEGREE_CENTRALITY)}
                  onMouseLeave={() => setHoveredAlgorithm(null)}
                >Degree Centrality</Button>
                <Button size='small' onClick={doEigenCentrality}
                  onMouseEnter={() => setHoveredAlgorithm(Algorithm.EIGENVECTOR_CENTRALITY)}
                  onMouseLeave={() => setHoveredAlgorithm(null)}
                >Eigenvector Centrality</Button>
                <Button size='small' onClick={doStrength}
                  onMouseEnter={() => setHoveredAlgorithm(Algorithm.STRENGTH_CENTRALITY)}
                  onMouseLeave={() => setHoveredAlgorithm(null)}
                >Node Strength</Button>
                <Button size='small' onClick={doHarmonicCentrality}
                  onMouseEnter={() => setHoveredAlgorithm(Algorithm.HARMONIC_CENTRALITY)}
                  onMouseLeave={() => setHoveredAlgorithm(null)}
                >Harmonic Centrality</Button>
                <Button size='small' onClick={doPageRank}
                  onMouseEnter={() => setHoveredAlgorithm(Algorithm.PAGERANK)}
                  onMouseLeave={() => setHoveredAlgorithm(null)}
                >Page Rank</Button>
              </ButtonGroup>
            </AccordionDetails>
          </Accordion>

          <Accordion expanded={expanded === 'panel3'} onChange={handleAccordianChange('panel3')}>
            <AccordionSummary aria-controls="panel3-content" id="panel3-header">
              <Typography variant='body2' pl='5px'>Community Detection</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ButtonGroup orientation='vertical' variant='text'>
                <Button size='small' onClick={doLouvain}
                  onMouseEnter={() => setHoveredAlgorithm(Algorithm.LOUVAIN)}
                  onMouseLeave={() => setHoveredAlgorithm(null)}
                >Louvain Algorithm</Button>
                <Button size='small' onClick={doLeiden}
                  onMouseEnter={() => setHoveredAlgorithm(Algorithm.LEIDEN)}
                  onMouseLeave={() => setHoveredAlgorithm(null)}
                >Leiden Algorithm</Button>
                <Button size='small' onClick={doFastGreedy}
                  onMouseEnter={() => setHoveredAlgorithm(Algorithm.FAST_GREEDY)}
                  onMouseLeave={() => setHoveredAlgorithm(null)}
                >Fast-Greedy Algorithm</Button>
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
          <AlgorithmExplanation algorithm={hoveredAlgorithm} />
        </Box>

      </Box>
    </ThemeProvider>
  )
}

export default App
