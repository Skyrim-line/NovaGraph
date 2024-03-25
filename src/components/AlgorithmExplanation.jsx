import React from 'react';
import { Algorithm } from '../algorithms';
import { Box, Paper } from '@mui/material';

function AlgorithmExplanation({ algorithm }) {
    const hoverText = {
        [Algorithm.DIJKSTRA_A_TO_B]: 'Dijkstra\'s algorithm from node A to node B',
        [Algorithm.DIJKSTRA_ALL]: 'Dijkstra\'s algorithm from node A to all other nodes',
        [Algorithm.YEN]: 'Yen\'s algorithm for k shortest paths',
        [Algorithm.BELLMAN_FORD_A_TO_B]: 'Bellman-Ford algorithm from node A to node B',
        [Algorithm.BELLMAN_FORD_ALL]: 'Bellman-Ford algorithm from node A to all other nodes',
        [Algorithm.BFS]: 'Breadth-first search',
        [Algorithm.DFS]: 'Depth-first search',
        [Algorithm.RANDOM_WALK]: 'Random walk',
        [Algorithm.MINIMAL_SPANNING_TREE]: 'Minimal spanning tree',
        [Algorithm.NEIGHBOR_JOINING]: 'Neighbor joining',
        [Algorithm.BETWEENNESS_CENTRALITY]: 'Betweenness centrality',
        [Algorithm.CLOSENESS_CENTRALITY]: 'Closeness centrality',
        [Algorithm.DEGREE_CENTRALITY]: 'Degree centrality',
        [Algorithm.EIGENVECTOR_CENTRALITY]: 'Eigenvector centrality',
        [Algorithm.STRENGTH_CENTRALITY]: 'Strength centrality',
        [Algorithm.HARMONIC_CENTRALITY]: 'Harmonic centrality',
        [Algorithm.PAGERANK]: 'PageRank',
        [Algorithm.LOUVAIN]: 'Louvain method',
        [Algorithm.LEIDEN]: 'Leiden method',
        [Algorithm.FAST_GREEDY]: 'Fast greedy method'
    };

    return (
        algorithm && hoverText[algorithm] && (
            <Paper elevation={0}
                sx={{
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    p: '0.25rem',
                    m: '2rem 0.25rem 0 0.25rem',
                    backgroundColor: theme => theme.palette.secondary.main,
                    color: 'black'
                }}
            >{hoverText[algorithm]}
            </Paper>
        )
    );
}


export default AlgorithmExplanation;
