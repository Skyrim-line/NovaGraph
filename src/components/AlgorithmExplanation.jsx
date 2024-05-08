import React from 'react';
import { Algorithm } from '../algorithms';
import { Box, Paper, Typography } from '@mui/material';

function AlgorithmExplanation({ algorithm }) {
    const hoverText = {
        [Algorithm.DIJKSTRA_A_TO_B]:
            <>The shortest path (or smallest sum of weights) from one node to another using 
            <strong> Dijkstra's Algorithm</strong>.</>,
        [Algorithm.DIJKSTRA_ALL]:
            <>The shortest path from one node to <strong>all other nodes</strong> using 
            Dijkstra's Algorithm. Node shades are based their frequency of being visited.</>,
        [Algorithm.YEN]: <>The <code>k</code> shortest paths from one node to another.</>,
        [Algorithm.BELLMAN_FORD_A_TO_B]: <>The shortest path (or smallest sum of weights) from one node to another using 
            the <strong>Bellman-Ford Algorithm</strong>.</>,
        [Algorithm.BELLMAN_FORD_ALL]:
            <>The shortest path from one node to <strong>all other nodes</strong> using the
            Bellman-Ford Algorithm. Node shades are based their frequency of being visited.</>,
        [Algorithm.BFS]: 
            <>Traverses the graph from a source by exploring its neighbours (1st layer) <i>first </i>
            followed by the next layer. The result will segment each layer based on node shades.</>,
        [Algorithm.DFS]:
            <>Traverses the graph from a source by exploring as far as possible along each branch 
            before <i>backtracking</i>. Node shades represent the "depth" of each node from the source.
            </>,
        [Algorithm.RANDOM_WALK]: 
            <>Traverses along a random path from a source node while considering edge directions.
            </>,
        [Algorithm.MINIMAL_SPANNING_TREE]:
            <>Find the subset of edges that connects all nodes in the graph with the minimum possible total edge weight (ignoring edge directions).
            The result may show multiple trees.
        </>,
        [Algorithm.NEIGHBOR_JOINING]: <>Check if two nodes are connected by a single edge.</>,
        [Algorithm.BETWEENNESS_CENTRALITY]:
            <>Measures how often a node appears on the shortest path <strong>between</strong> two other nodes. 
            The graph will show the centrality of each node based on their size.</>,
        [Algorithm.CLOSENESS_CENTRALITY]: 
            <>Uses the sum of the shortest paths to all other nodes to measures a node's <strong>closeness</strong>. 
            The graph will show the centrality of each node based on their size.</>,
        [Algorithm.DEGREE_CENTRALITY]:
            <>Counts the <strong>number of edges (degree)</strong> connected to a node to determine its centrality.
            The graph will show the centrality of each node based on their size.</>,
        [Algorithm.EIGENVECTOR_CENTRALITY]: 
            <>The centrality of a node is proportional to the sum of the centrality of its neighbours. 
            The graph will show the centrality of each node based on their size.</>,
        [Algorithm.STRENGTH_CENTRALITY]: 
            <>Uses the sum of the weights of the edges connected to a node to determine its <strong>strength</strong>. 
            In a non-weighted graph, this is equivalent to degree centrality.</>,
        [Algorithm.HARMONIC_CENTRALITY]: 
            <>Measures the <strong>average</strong> distance between a node and all other nodes in the graph.
            The graph will show the centrality of each node based on their size.</>,
        [Algorithm.PAGERANK]:
            <>Measures the importance of a node based on the number of incoming edges and the importance of neighbouring nodes.
            This is a simplified version of the <strong>PageRank Algorithm</strong> used by <strong>Google</strong>.</>,
        [Algorithm.LOUVAIN]: 
            <>Groups the nodes into <b>communities</b> with higher resolutions resulting in more (and smaller) communities. 
            Each community is represented by a different colour.</>,
        [Algorithm.LEIDEN]:
            <>A faster version of the Louvain algorithm which uses a different optimisation method.
            Each community is represented by a different colour.</>,
        [Algorithm.FAST_GREEDY]:
            <>Uses a <b>greedy algorithm</b> to find the best community structure for a given graph without requiring a resolution parameter.
            Each community is represented by a different colour.</>,
        [Algorithm.LABEL_PROPAGATION]:
            <>Groups nodes into communities where each node is assigned the <b>label</b> most common among its neighbours.
            Each community is represented by a different colour.</>,
        [Algorithm.LOCAL_CLUSTERING_COEFFICIENT]:
            <>Quantifies how densely connected a specific node's neighbours are to each other.
            Nodes with greater <b>coefficients</b> are shown in darker shades.</>,
        [Algorithm.K_CORE]:
            <>Finds the <b>largest subgraph</b> where each node has at least <code>k</code> connections.</>,
        [Algorithm.TRIANGLE_COUNT]:
            <>Counts the number of <b>triangles</b> (interconnected nodes triples) in the graph.</>,
        [Algorithm.STRONGLY_CONNECTED_COMPONENTS]:
            <>Partitions the graph into <b>strongly connected components</b> where each node is reachable from every other node.</>,
        [Algorithm.WEAKLY_CONNECTED_COMPONENTS]:
            <>Partitions a directed graph into <b>weakly connected components</b> where each node is reachable from every other node regardless of edge direction.</>,
        [Algorithm.JACCARD_SIMILARITY]:
            <>Measures the <b>similarity</b> between pairs of nodes based on the number of shared neighbours.</>,
    };

    return (
        algorithm && hoverText[algorithm] && (
            <Paper elevation={0}
                sx={{
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    p: '0.5rem',
                    m: '2rem 0.25rem 0 0.25rem',
                    backgroundColor: theme => theme.palette.secondary.main,
                    color: 'black',
                    textAlign: 'left',
                }}
            >
                <Typography variant='subtitle2'>
                    {hoverText[algorithm]}
                </Typography>
            </Paper>
        )
    );
}


export default AlgorithmExplanation;
