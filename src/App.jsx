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
import { algorithmConfig } from './algorithm-config';
import AlgorithmExplanation from './components/AlgorithmExplanation';
import { ErasBold, ErasMedium } from './components/Eras';
import AlgorithmOutput from './components/algorithmOutputs/AlgorithmOutput';
import AlgorithmInput from './components/AlgorithmInput';
import { SpinnerDotted } from 'spinners-react';
import AlgorithmMultiInput from './components/AlgorithmMultiInput';
import ExportMenu from './components/ExportMenu';
import HelperCarousel from './components/HelperCarousel';

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
  const [existingEdges, setExistingEdges] = useState([]); // for missing edge prediction
  const [tempEdges, setTempEdges] = useState([]); // for adding edges
  const [directed, setDirected] = useState(false);
  const [colorMap, setColorMap] = useState({});
  const [sizeMap, setSizeMap] = useState({});
  const [renderMode, setRenderMode] = useState(1);
  const [activeAlgorithm, setActiveAlgorithm] = useState(null);
  const [activeResponse, setActiveResponse] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [hoveredAlgorithm, setHoveredAlgorithm] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  const [missingEdgeDefaults, setMissingEdgeDefaults] = useState({});

  useEffect(() => {
    createModule().then(mod => {
      setWasmModule(mod)
      const graph = mod.initGraph(); // initialize the graph in C++
      setNodes(graph.nodes)
      setEdges(graph.edges)
      setExistingEdges(graph.edges)
      setMissingEdgeDefaults(mod.missing_edge_prediction_default_values());

      window.onerror = (message, source, lineno, colno, error) => {
        setLoading(null);
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
    console.log("colors")
    console.log(colorMap)
    console.log("missing edge defaults")
    console.log(missingEdgeDefaults)
  }, [colorMap])

  useEffect(() => {
    if (tempEdges.length > 0) {
      setEdges([...edges, ...tempEdges])
    } else {
      setEdges(existingEdges)
    }
  }, [tempEdges])

  const updateGraph = (nodes, edges, directed) => {
    setColorMap({});
    setSizeMap({});
    setActiveAlgorithm(null);
    setNodes(nodes);
    setEdges(edges);
    setExistingEdges(edges);
    setDirected(directed);
    setRenderMode(1);
    setLoading(null);
    setMissingEdgeDefaults(wasmModule.missing_edge_prediction_default_values());
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
    setTempEdges(response.edges ? response.edges : [])
    setRenderMode(response.mode)
    setActiveAlgorithm(alg)
    setActiveResponse(response)
    setLoading(null)
  }

  return (
    <ThemeProvider theme={darkTheme}>
      { loading &&
        <div className="loader-container">
          <SpinnerDotted size={100} thickness={150} color="#6750C6" />
          <p className="loading-text">{loading}</p>
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
            <Tooltip title='Export Algorithm Data'>
              <Button
                onClick={() => setExportOpen(true)}
                startIcon={<FileDownloadIcon />}
                variant='text'
                color='secondary'
                size='small'
                disabled={activeResponse === null}
              >
                Export
              </Button>
            </Tooltip>
            <Tooltip title='Help'>
              <IconButton
                onClick={() => setHelpOpen(!helpOpen)}
                color='secondary'
              >
                <HelpOutlineIcon />
              </IconButton>
            </Tooltip>
            <ImportMenu
              id='import-menu'
              anchorEl={anchorEl}
              setAnchorEl={setAnchorEl}
              module={wasmModule}
              updateGraph={updateGraph}
              setLoading={setLoading}
            />
            <ExportMenu
              open={exportOpen}
              setOpen={setExportOpen}
              data={activeResponse && activeResponse.data}
            />
            <HelperCarousel
              open={helpOpen}
              handleClose={() => setHelpOpen(false)}
            />
          </Box>
          <Accordion expanded={expanded === 'panel1'} onChange={handleAccordianChange('panel1')}>
            <AccordionSummary aria-controls="panel1-content" id="panel1-header">
              <Typography variant='body2' pl='5px'>Path Finding & Search</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ButtonGroup orientation='vertical' variant='text'>
                {
                  Object.values(algorithmConfig).filter(alg => alg.category === "pfs").map((alg, key) => (
                    alg.input_type === "default" && (
                      <AlgorithmInput
                        key={key}
                        wasmFunction={wasmModule && wasmModule[alg.wasm_function_name]}
                        postState={postAlgorithmState.bind(null, alg)}
                        setLoading={setLoading}
                        algorithmName={alg.button_text}
                        desc={alg.long_description_html}
                        nodes={nodes}
                        setHoveredAlgorithm={setHoveredAlgorithm}
                        hoveredAlgorithm={alg.hover_text_html}
                        inputs={alg.input_fields}
                      />
                  ))
                )}
                <AlgorithmInput
                  wasmFunction={wasmModule && wasmModule.random_walk}
                  postState={postAlgorithmState.bind(null, Algorithm.RANDOM_WALK)}
                  setLoading={setLoading}
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
                  setLoading={setLoading}
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
                  setLoading={setLoading}
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
                  setLoading={setLoading}
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
                  setLoading={setLoading}
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
                  setLoading={setLoading}
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
                  setLoading={setLoading}
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
                  setLoading={setLoading}
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
                  setLoading={setLoading}
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
                  setLoading={setLoading}
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
                  setLoading={setLoading}
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
                  setLoading={setLoading}
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
                <AlgorithmInput
                  wasmFunction={wasmModule && wasmModule.label_propagation}
                  postState={postAlgorithmState.bind(null, Algorithm.LABEL_PROPAGATION)}
                  setLoading={setLoading}
                  algorithmName="Label Propagation"
                  desc={[
                    "The Label Propagation algorithm is a simple community detection algorithm that assigns nodes to communities based on their labels. In the event of a tie, the algorithm will randomly assign a label.",
                    "Due to the randomness of the algorithm, the results may vary between runs.",
                    "This version extends the original algorithm to take edge weights into account.",
                    "Raghavan, U. N., Albert, R., & Kumara, S. (2007). Near linear time algorithm to detect community structures in large-scale networks. Physical Review E, 76(3), 036106. https://doi.org/10.1103/PhysRevE.76.036106"
                  ]}
                  nodes={nodes}
                  setHoveredAlgorithm={setHoveredAlgorithm}
                  hoveredAlgorithm={Algorithm.LABEL_PROPAGATION}
                  inputs={[]}
                />
                <AlgorithmInput
                  wasmFunction={wasmModule && wasmModule.local_clustering_coefficient}
                  postState={postAlgorithmState.bind(null, Algorithm.LOCAL_CLUSTERING_COEFFICIENT)}
                  setLoading={setLoading}
                  algorithmName="Local Clustering Coefficient"
                  desc={[
                    "The local clustering coefficient measures the number of triangles that pass through a node.",
                    "Any nodes with a clustering coefficient of 0 are not part of any triangles.",
                    "D. J. Watts and S. Strogatz: Collective dynamics of small-world networks. Nature 393(6684):440-442 (1998)"
                  ]}
                  nodes={nodes}
                  setHoveredAlgorithm={setHoveredAlgorithm}
                  hoveredAlgorithm={Algorithm.LOCAL_CLUSTERING_COEFFICIENT}
                  inputs={[]}
                />
                <AlgorithmInput
                  wasmFunction={wasmModule && wasmModule.k_core}
                  postState={postAlgorithmState.bind(null, Algorithm.K_CORE)}
                  setLoading={setLoading}
                  algorithmName="K-Core Decomposition"
                  desc={[
                    "The k-core decomposition algorithm finds the k-core of a graph.",
                    "The k-core is a subgraph in which all nodes have a degree (number of outgoing edges) of at least k."
                  ]}
                  nodes={nodes}
                  setHoveredAlgorithm={setHoveredAlgorithm}
                  hoveredAlgorithm={Algorithm.K_CORE}
                  inputs={[
                    { label: 'Enter k', explanation: 'The minimum degree of the k-core', type: 'number', step: '1', defaultValue: 1 }
                  ]}
                />
                <AlgorithmInput
                  wasmFunction={wasmModule && wasmModule.triangle_count}
                  postState={postAlgorithmState.bind(null, Algorithm.TRIANGLE_COUNT)}
                  setLoading={setLoading}
                  algorithmName="Triangle Count"
                  desc={["The triangle count algorithm counts the number of triangles (groups of 3 connected nodes) in a graph."]}
                  nodes={nodes}
                  setHoveredAlgorithm={setHoveredAlgorithm}
                  hoveredAlgorithm={Algorithm.TRIANGLE_COUNT}
                  inputs={[]}
                />
                <AlgorithmInput
                  wasmFunction={wasmModule && wasmModule.strongly_connected_components}
                  postState={postAlgorithmState.bind(null, Algorithm.STRONGLY_CONNECTED_COMPONENTS)}
                  setLoading={setLoading}
                  algorithmName="Strongly Connected Components"
                  buttonLabel="Strongly Connected (SCC)"
                  desc={[
                    "This algorithm finds the strongly connected components in a graph.",
                    "For undirected graphs, this algorithm will return all connected components."
                  ]}
                  nodes={nodes}
                  setHoveredAlgorithm={setHoveredAlgorithm}
                  hoveredAlgorithm={Algorithm.STRONGLY_CONNECTED_COMPONENTS}
                  inputs={[]}
                />
                <AlgorithmInput
                  wasmFunction={wasmModule && wasmModule.weakly_connected_components}
                  postState={postAlgorithmState.bind(null, Algorithm.WEAKLY_CONNECTED_COMPONENTS)}
                  setLoading={setLoading}
                  algorithmName="Weakly Connected Components"
                  buttonLabel="Weakly Connected (WCC)"
                  desc={[
                    "This algorithm finds the weakly connected components in a directed graph.",
                    "Note: This algorithm can only be performed on directed graphs."
                  ]}
                  nodes={nodes}
                  setHoveredAlgorithm={setHoveredAlgorithm}
                  hoveredAlgorithm={Algorithm.WEAKLY_CONNECTED_COMPONENTS}
                  inputs={[]}
                />
              </ButtonGroup>
            </AccordionDetails>
          </Accordion>

          <Accordion expanded={expanded === 'panel4'} onChange={handleAccordianChange('panel4')}>
            <AccordionSummary aria-controls="panel4-content" id="panel4-header">
              <Typography variant='body2' pl='5px'>Other Algorithms</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ButtonGroup orientation='vertical' variant='text'>
                <AlgorithmInput
                  wasmFunction={wasmModule && wasmModule.vertices_are_adjacent}
                  postState={postAlgorithmState.bind(null, Algorithm.NEIGHBOR_JOINING)}
                  setLoading={setLoading}
                  algorithmName="Check Adjacency"
                  desc={["This algorithm checks to see if two nodes are connected by a single edge."]}
                  nodes={nodes}
                  setHoveredAlgorithm={setHoveredAlgorithm}
                  hoveredAlgorithm={Algorithm.NEIGHBOR_JOINING}
                  inputs={[
                    { label: 'Enter source vertex', explanation: 'Select the source vertex', type: 'text' },
                    { label: 'Enter target vertex', explanation: 'Select the target vertex', type: 'text' }
                  ]}
                />
                <AlgorithmMultiInput
                  wasmFunction={wasmModule && wasmModule.jaccard_similarity}
                  postState={postAlgorithmState.bind(null, Algorithm.JACCARD_SIMILARITY)}
                  setLoading={setLoading}
                  algorithmName="Jaccard Similarity"
                  desc={["The Jaccard similarity algorithm measures the similarity between two sets of nodes. Enter at least 2 nodes to compare."]}
                  nodes={nodes}
                  setHoveredAlgorithm={setHoveredAlgorithm}
                  hoveredAlgorithm={Algorithm.JACCARD_SIMILARITY}
                />
                <AlgorithmInput
                  wasmFunction={wasmModule && wasmModule.topological_sort}
                  postState={postAlgorithmState.bind(null, Algorithm.TOPOLOGICAL_SORT)}
                  setLoading={setLoading}
                  algorithmName="Topological Sort"
                  desc={["The topological sort algorithm arranges the nodes in a directed acyclic graph in a linear order."]}
                  nodes={nodes}
                  setHoveredAlgorithm={setHoveredAlgorithm}
                  hoveredAlgorithm={Algorithm.TOPOLOGICAL_SORT}
                  inputs={[]}
                />
                <AlgorithmInput
                  wasmFunction={wasmModule && wasmModule.diameter}
                  postState={postAlgorithmState.bind(null, Algorithm.DIAMETER)}
                  setLoading={setLoading}
                  algorithmName="Graph Diameter"
                  desc={["The graph diameter algorithm calculates the longest shortest path between any two nodes."]}
                  nodes={nodes}
                  setHoveredAlgorithm={setHoveredAlgorithm}
                  hoveredAlgorithm={Algorithm.DIAMETER}
                  inputs={[]}
                />
                <AlgorithmInput
                  wasmFunction={wasmModule && wasmModule.eulerian_path}
                  postState={postAlgorithmState.bind(null, Algorithm.EULERIAN_PATH)}
                  setLoading={setLoading}
                  algorithmName="Eulerian Path"
                  desc={["The Eulerian path algorithm finds a path that visits every edge exactly once."]}
                  nodes={nodes}
                  setHoveredAlgorithm={setHoveredAlgorithm}
                  hoveredAlgorithm={Algorithm.EULERIAN_PATH}
                  inputs={[]}
                />
                <AlgorithmInput
                  wasmFunction={wasmModule && wasmModule.eulerian_circuit}
                  postState={postAlgorithmState.bind(null, Algorithm.EULERIAN_CIRCUIT)}
                  setLoading={setLoading}
                  algorithmName="Eulerian Circuit"
                  desc={["The Eulerian circuit (or Eulerian cycle) algorithm finds a path that visits every edge exactly once and returns to the starting node."]}
                  nodes={nodes}
                  setHoveredAlgorithm={setHoveredAlgorithm}
                  hoveredAlgorithm={Algorithm.EULERIAN_CIRCUIT}
                  inputs={[]}
                />
                <AlgorithmInput
                  wasmFunction={wasmModule && wasmModule.missing_edge_prediction}
                  postState={postAlgorithmState.bind(null, Algorithm.MISSING_EDGE_PREDICTION)}
                  setLoading={setLoading}
                  algorithmName="Missing Edge Prediction"
                  desc={[
                    "The missing edge prediction algorithm predicts missing edges in a graph. It fits a Hierarchical Random Graph (HRG) model to the graph and predicts missing edges based on the model.",
                    "A. Clauset, C. Moore, and M.E.J. Newman. Hierarchical structure and the prediction of missing links in networks. Nature 453, 98 - 101 (2008)", 
                    `For a ${missingEdgeDefaults.graphSize} sized graph, this uses the default values of ${missingEdgeDefaults.numSamples} samples and ${missingEdgeDefaults.numBins} bins.`
                  ]}
                  nodes={nodes}
                  setHoveredAlgorithm={setHoveredAlgorithm}
                  hoveredAlgorithm={Algorithm.MISSING_EDGE_PREDICTION}
                  inputs={[
                    { label: 'Enter Sample Size', explanation: 'How many times missing edges are predicted (accuracy)', type: 'number', step: '1', defaultValue: missingEdgeDefaults.numSamples },
                    { label: 'Enter Bin Size', explanation: 'Number of bins for the histogram model (precision)', type: 'number', step: '1', defaultValue: missingEdgeDefaults.numBins },
                  ]}
                />
              </ButtonGroup>
            </AccordionDetails>
          </Accordion>
          <AlgorithmExplanation text={hoveredAlgorithm} />
        </Box>

      </Box>
    </ThemeProvider>
  )
}

export default App
