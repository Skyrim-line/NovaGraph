import { useState, useEffect } from 'react'
import createModule from './graph'
import './App.css'
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
import AlgorithmOutput from './components/algorithmOutputs/AlgorithmOutput';
import AlgorithmInput from './components/AlgorithmInput';

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
  const [activeAlgorithm, setActiveAlgorithm] = useState(null);
  const [activeResponse, setActiveResponse] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const [hoveredAlgorithm, setHoveredAlgorithm] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
        console.log("error ", error)
        setError(error_message);
        setLoading(false);
      }

      window.onunload = () => {
        console.log("Cleanup")
        mod.cleanupGraph()
      }

      window.onbeforeunload = () => {
        console.log("Before unload")
      }

      window.onpagehide = () => {
        console.log("Page hide")
      }

      document.onvisibilitychange = () => {
        console.log("Visibility change")
      }
    })
  }, []);

  useEffect(() => {
    console.log(colorMap)
  }, [colorMap])

  const updateGraph = (nodes, edges, directed) => {
    setColorMap({});
    setSizeMap({});
    setActiveAlgorithm(null);
    setNodes(nodes);
    setEdges(edges);
    setDirected(directed);
    setRenderMode(1);
    setLoading(false);
  }

  const handleAccordianChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const postAlgorithmState = (alg, response) => {
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
    setActiveAlgorithm(alg)
    setActiveResponse(response)
  }

  const toId = name => {
    const node = nodes.find(node => node.name === name)
    if (node) return node.id
    const node2 = nodes.find(node => node.id === parseInt(name))
    return node2 ? node2.id : null
  }

  return (
    <ThemeProvider theme={darkTheme}>
      { loading &&
        <div className="loader-container">
          <span className="loader"></span>
          <p className="loading-text">Importing graph...</p>
        </div>
      }
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
            <img src="./logo.png" alt='logo' width={50} style={{ paddingBottom: 10, paddingLeft: 10 }} />
            <ErasMedium fontSize={36}>ova</ErasMedium>
            <ErasBold fontSize={36} mb={0.2}>graph</ErasBold>
          </Box>
          <GraphRenderer
            nodes={nodes}
            links={edges}
            directed={directed}
            colors={colorMap}
            sizes={sizeMap}
            mode={renderMode}
          />
          <AlgorithmOutput algorithm={activeAlgorithm} response={activeResponse} />

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
            {/*<Tooltip title='Export Graph'>*/}
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
            {/*<Tooltip title='Help'>*/}
            <IconButton color='info' disabled>
              <HelpOutlineIcon />
            </IconButton>
            <ImportMenu
              id='import-menu'
              anchorEl={anchorEl}
              setAnchorEl={setAnchorEl}
              module={wasmModule}
              updateGraph={updateGraph}
              setLoading={setLoading}
            />
          </Box>
          <Accordion expanded={expanded === 'panel1'} onChange={handleAccordianChange('panel1')}>
            <AccordionSummary aria-controls="panel1-content" id="panel1-header">
              <Typography variant='body2' pl='5px'>Path Finding & Search</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ButtonGroup orientation='vertical' variant='text'>
                <AlgorithmInput
                  wasmFunction={wasmModule && wasmModule.dijkstra_source_to_target}
                  postState={postAlgorithmState.bind(null, Algorithm.DIJKSTRA_A_TO_B)}
                  algorithmName="Dijkstra (A to B)"
                  desc={["Dijkstra's algorithm finds the shortest path from one node to another."]}
                  nodes={nodes}
                  setHoveredAlgorithm={setHoveredAlgorithm}
                  hoveredAlgorithm={Algorithm.DIJKSTRA_A_TO_B}
                  inputs={[
                    { label: 'Enter source vertex', explanation: 'Select the source vertex', type: 'text' },
                    { label: 'Enter target vertex', explanation: 'Select the target vertex', type: 'text' }
                  ]}
                />
                <AlgorithmInput
                  wasmFunction={wasmModule && wasmModule.dijkstra_source_to_all}
                  postState={postAlgorithmState.bind(null, Algorithm.DIJKSTRA_ALL)}
                  algorithmName="Dijkstra (A to all)"
                  desc={["Dijkstra's algorithm finds the shortest path from one node to all other nodes."]}
                  nodes={nodes}
                  setHoveredAlgorithm={setHoveredAlgorithm}
                  hoveredAlgorithm={Algorithm.DIJKSTRA_ALL}
                  inputs={[
                    { label: 'Enter source vertex', explanation: 'Select the source vertex', type: 'text' }
                  ]}
                />
                <AlgorithmInput
                  wasmFunction={wasmModule && wasmModule.yens_algorithm}
                  postState={postAlgorithmState.bind(null, Algorithm.YEN)}
                  algorithmName="Yen's Shortest Path"
                  desc={["Yen's algorithm finds the top 'k' shortest paths between two nodes."]}
                  nodes={nodes}
                  setHoveredAlgorithm={setHoveredAlgorithm}
                  hoveredAlgorithm={Algorithm.YEN}
                  inputs={[
                    { label: 'Enter source vertex', explanation: 'Select the source vertex', type: 'text' },
                    { label: 'Enter target vertex', explanation: 'Select the target vertex', type: 'text' },
                    { label: 'Enter k', explanation: 'Number of paths to find', type: 'number', step: '1', defaultValue: 3 }
                  ]}
                />
                <AlgorithmInput
                  wasmFunction={wasmModule && wasmModule.bellman_ford_source_to_target}
                  postState={postAlgorithmState.bind(null, Algorithm.BELLMAN_FORD_A_TO_B)}
                  algorithmName="Bellman-Ford (A to B)"
                  desc={["Bellman-Ford algorithm finds the shortest path from one node to another. It works similarly to Dijkstra's algorithm."]}
                  nodes={nodes}
                  setHoveredAlgorithm={setHoveredAlgorithm}
                  hoveredAlgorithm={Algorithm.BELLMAN_FORD_A_TO_B}
                  inputs={[
                    { label: 'Enter source vertex', explanation: 'Select the source vertex', type: 'text' },
                    { label: 'Enter target vertex', explanation: 'Select the target vertex', type: 'text' }
                  ]}
                />
                <AlgorithmInput
                  wasmFunction={wasmModule && wasmModule.bellman_ford_source_to_all}
                  postState={postAlgorithmState.bind(null, Algorithm.BELLMAN_FORD_ALL)}
                  algorithmName="Bellman-Ford (A to all)"
                  desc={["Bellman-Ford algorithm finds the shortest path from one node to all other nodes."]}
                  nodes={nodes}
                  setHoveredAlgorithm={setHoveredAlgorithm}
                  hoveredAlgorithm={Algorithm.BELLMAN_FORD_ALL}
                  inputs={[
                    { label: 'Enter source vertex', explanation: 'Select the source vertex', type: 'text' }
                  ]}
                />
                <AlgorithmInput
                  wasmFunction={wasmModule && wasmModule.bfs}
                  postState={postAlgorithmState.bind(null, Algorithm.BFS)}
                  algorithmName="Breadth First Search"
                  desc={["Breadth First Search algorithm traverses the graph from a source by exploring all neighbors before moving on to the next level. It continues until all nodes are visited."]}
                  nodes={nodes}
                  setHoveredAlgorithm={setHoveredAlgorithm}
                  hoveredAlgorithm={Algorithm.BFS}
                  inputs={[
                    { label: 'Enter source vertex', explanation: 'Select the source vertex', type: 'text' }
                  ]}
                />
                <AlgorithmInput
                  wasmFunction={wasmModule && wasmModule.dfs}
                  postState={postAlgorithmState.bind(null, Algorithm.DFS)}
                  algorithmName="Depth First Search"
                  desc={["Depth First Search algorithm traverses the graph from a source by exploring as far as possible along each branch before backtracking. It continues until all nodes are visited."]}
                  nodes={nodes}
                  setHoveredAlgorithm={setHoveredAlgorithm}
                  hoveredAlgorithm={Algorithm.DFS}
                  inputs={[
                    { label: 'Enter source vertex', explanation: 'Select the source vertex', type: 'text' }
                  ]}
                />
                <AlgorithmInput
                  wasmFunction={wasmModule && wasmModule.random_walk}
                  postState={postAlgorithmState.bind(null, Algorithm.RANDOM_WALK)}
                  algorithmName="Random Walk"
                  desc={["The algorithm will randomly walk through the graph starting from a source node for a specified number of steps."]}
                  nodes={nodes}
                  setHoveredAlgorithm={setHoveredAlgorithm}
                  hoveredAlgorithm={Algorithm.RANDOM_WALK}
                  inputs={[
                    { label: 'Enter starting vertex', explanation: 'Select the starting vertex', type: 'text' },
                    { label: 'Enter step count', explanation: 'Number of steps to take', type: 'number', step: '1', defaultValue: 1 }
                  ]}
                />
                <AlgorithmInput
                  wasmFunction={wasmModule && wasmModule.min_spanning_tree}
                  postState={postAlgorithmState.bind(null, Algorithm.MINIMAL_SPANNING_TREE)}
                  algorithmName="Minimum Spanning Tree"
                  desc={["The algorithm finds the minimum spanning tree of the graph."]}
                  nodes={nodes}
                  setHoveredAlgorithm={setHoveredAlgorithm}
                  hoveredAlgorithm={Algorithm.MINIMAL_SPANNING_TREE}
                  inputs={[]}
                />
              </ButtonGroup>
            </AccordionDetails>
          </Accordion>

          <Accordion expanded={expanded === 'panel2'} onChange={handleAccordianChange('panel2')}>
            <AccordionSummary aria-controls="panel2-content" id="panel2-header">
              <Typography variant='body2' pl='5px'>Centrality</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ButtonGroup orientation='vertical' variant='text'>
                <AlgorithmInput
                  wasmFunction={wasmModule && wasmModule.betweenness_centrality}
                  postState={postAlgorithmState.bind(null, Algorithm.BETWEENNESS_CENTRALITY)}
                  algorithmName="Betweenness Centrality"
                  desc={["Betweenness centrality measures the number of shortest paths that pass through a node."]}
                  nodes={nodes}
                  setHoveredAlgorithm={setHoveredAlgorithm}
                  hoveredAlgorithm={Algorithm.BETWEENNESS_CENTRALITY}
                  inputs={[]}
                />
                <AlgorithmInput
                  wasmFunction={wasmModule && wasmModule.closeness_centrality}
                  postState={postAlgorithmState.bind(null, Algorithm.CLOSENESS_CENTRALITY)}
                  algorithmName="Closeness Centrality"
                  desc={["Closeness centrality measures the average shortest path between a node and all other nodes."]}
                  nodes={nodes}
                  setHoveredAlgorithm={setHoveredAlgorithm}
                  hoveredAlgorithm={Algorithm.CLOSENESS_CENTRALITY}
                  inputs={[]}
                />
                <AlgorithmInput
                  wasmFunction={wasmModule && wasmModule.degree_centrality}
                  postState={postAlgorithmState.bind(null, Algorithm.DEGREE_CENTRALITY)}
                  algorithmName="Degree Centrality"
                  desc={["Degree centrality measures the number of edges connected to a node."]}
                  nodes={nodes}
                  setHoveredAlgorithm={setHoveredAlgorithm}
                  hoveredAlgorithm={Algorithm.DEGREE_CENTRALITY}
                  inputs={[]}
                />
                <AlgorithmInput
                  wasmFunction={wasmModule && wasmModule.eigenvector_centrality}
                  postState={postAlgorithmState.bind(null, Algorithm.EIGENVECTOR_CENTRALITY)}
                  algorithmName="Eigenvector Centrality"
                  desc={["Eigenvector centrality measures the influence of a node in a network."]}
                  nodes={nodes}
                  setHoveredAlgorithm={setHoveredAlgorithm}
                  hoveredAlgorithm={Algorithm.EIGENVECTOR_CENTRALITY}
                  inputs={[]}
                />
                <AlgorithmInput
                  wasmFunction={wasmModule && wasmModule.strength_centrality}
                  postState={postAlgorithmState.bind(null, Algorithm.STRENGTH_CENTRALITY)}
                  algorithmName="Node Strength"
                  desc={["Node strength measures the sum of the weights of the edges connected to a node."]}
                  nodes={nodes}
                  setHoveredAlgorithm={setHoveredAlgorithm}
                  hoveredAlgorithm={Algorithm.STRENGTH_CENTRALITY}
                  inputs={[]}
                />
                <AlgorithmInput
                  wasmFunction={wasmModule && wasmModule.harmonic_centrality}
                  postState={postAlgorithmState.bind(null, Algorithm.HARMONIC_CENTRALITY)}
                  algorithmName="Harmonic Centrality"
                  desc={["Harmonic centrality is a variant of closeness centrality that measures the average harmonic mean of the shortest paths between a node and all other nodes."]}
                  nodes={nodes}
                  setHoveredAlgorithm={setHoveredAlgorithm}
                  hoveredAlgorithm={Algorithm.HARMONIC_CENTRALITY}
                  inputs={[]}
                />
                <AlgorithmInput
                  wasmFunction={wasmModule && wasmModule.pagerank}
                  postState={postAlgorithmState.bind(null, Algorithm.PAGERANK)}
                  algorithmName="Page Rank"
                  desc={[
                    "Page Rank is an algorithm that measures the importance of a node in a network.",
                    "Sergey Brin and Larry Page: The Anatomy of a Large-Scale Hypertextual Web Search Engine. Proceedings of the 7th World-Wide Web Conference, Brisbane, Australia, April 1998. https://doi.org/10.1016/S0169-7552(98)00110-X"
                  ]}
                  nodes={nodes}
                  setHoveredAlgorithm={setHoveredAlgorithm}
                  hoveredAlgorithm={Algorithm.PAGERANK}
                  inputs={[
                    { label: 'Enter damping factor', explanation: 'The probability of following a link', type: 'number', step: '0.01', defaultValue: 0.85 }
                  ]}
                />
              </ButtonGroup>
            </AccordionDetails>
          </Accordion>

          <Accordion expanded={expanded === 'panel3'} onChange={handleAccordianChange('panel3')}>
            <AccordionSummary aria-controls="panel3-content" id="panel3-header">
              <Typography variant='body2' pl='5px'>Community Detection</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ButtonGroup orientation='vertical' variant='text'>
                <AlgorithmInput
                  wasmFunction={wasmModule && wasmModule.louvain}
                  postState={postAlgorithmState.bind(null, Algorithm.LOUVAIN)}
                  algorithmName="Louvain Algorithm"
                  desc={[
                    "The Louvain algorithm uses a hierarchical approach to find communities in a network.",
                    "The resolution parameter determines the size of the communities. A higher resolution will result in smaller communities.",
                    "Blondel, V. D., Guillaume, J.-L., Lambiotte, R., & Lefebvre, E. (2008). Fast unfolding of communities in large networks. Journal of Statistical Mechanics: Theory and Experiment, 10008(10), 6. https://doi.org/10.1088/1742-5468/2008/10/P10008",
                    "Note: This algorithm cannot be performed on directed graphs."
                  ]}
                  nodes={nodes}
                  setHoveredAlgorithm={setHoveredAlgorithm}
                  hoveredAlgorithm={Algorithm.LOUVAIN}
                  inputs={[
                    { label: 'Enter resolution', explanation: 'The resolution parameter (must be a positive number)', type: 'number', step: '0.01', defaultValue: 1.0 }
                  ]}
                />
                <AlgorithmInput
                  wasmFunction={wasmModule && wasmModule.leiden}
                  postState={postAlgorithmState.bind(null, Algorithm.LEIDEN)}
                  algorithmName="Leiden Algorithm"
                  desc={[
                    "The Leiden algorithm uses a hierarchical approach to find communities in a network.",
                    "The resolution parameter determines the size of the communities. A higher resolution will result in smaller communities.",
                    "Traag, V. A., Waltman, L., & van Eck, N. J. (2019). From Louvain to Leiden: guaranteeing well-connected communities. Scientific Reports, 9(1), 5233. https://doi.org/10.1038/s41598-019-41695-z",
                    "Note: This algorithm cannot be performed on directed graphs."
                  ]}
                  nodes={nodes}
                  setHoveredAlgorithm={setHoveredAlgorithm}
                  hoveredAlgorithm={Algorithm.LEIDEN}
                  inputs={[
                    { label: 'Enter resolution', explanation: 'The resolution parameter', type: 'number', step: '0.01', defaultValue: 0.25 }
                  ]}
                />
                <AlgorithmInput
                  wasmFunction={wasmModule && wasmModule.fast_greedy}
                  postState={postAlgorithmState.bind(null, Algorithm.FAST_GREEDY)}
                  algorithmName="Fast-Greedy Algorithm"
                  desc={[
                    "The Fast-Greedy algorithm uses the fast greedy modularity optimisation to find communities in a network.",
                    "Clauset, A., Newman, M. E. J., & Moore, C. (2004). Finding community structure in very large networks. Physical Review E, 70(6), 066111. https://doi.org/10.1103/PhysRevE.70.066111",
                    "Note: This algorithm cannot be performed on directed graphs."
                  ]}
                  nodes={nodes}
                  setHoveredAlgorithm={setHoveredAlgorithm}
                  hoveredAlgorithm={Algorithm.FAST_GREEDY}
                  inputs={[]}
                />
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
                <AlgorithmInput
                  wasmFunction={wasmModule && wasmModule.vertices_are_connected}
                  postState={postAlgorithmState.bind(null, Algorithm.NEIGHBOR_JOINING)}
                  algorithmName="Neighbour Status?"
                  desc={["This algorithm checks to see if two nodes are connected by a single edge."]}
                  nodes={nodes}
                  setHoveredAlgorithm={setHoveredAlgorithm}
                  hoveredAlgorithm={Algorithm.NEIGHBOR_JOINING}
                  inputs={[
                    { label: 'Enter source vertex', explanation: 'Select the source vertex', type: 'text' },
                    { label: 'Enter target vertex', explanation: 'Select the target vertex', type: 'text' }
                  ]}
                />
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
