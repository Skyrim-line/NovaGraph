import React from 'react';
import { Algorithm } from '../../algorithms';
import DijkstraSinglePath from './DijkstraSinglePath';
import DijkstraSingleSource from './DijkstraSingleSource';
import Yen from './Yen';
import BellmanFordSinglePath from './BellmanFordSinglePath';
import BellmanFordSingleSource from './BellmanFordSingleSource';
import BFS from './BFS';
import DFS from './DFS';
import RandomWalk from './RandomWalk';
import SpanningTree from './SpanningTree';
import BetweennessCentrality from './BetweennessCentrality';
import ClosenessCentrality from './ClosenessCentrality';
import DegreeCentrality from './DegreeCentrality';
import EigenvectorCentrality from './EigenvectorCentrality';
import HarmonicCentrality from './HarmonicCentrality';
import Strength from './Strength';
import PageRank from './PageRank';
import Louvain from './Louvain';
import Leiden from './Leiden';
import FastGreedy from './FastGreedy';
import LocalClusertingCoefficient from './LocalClusertingCoefficient';
import KCore from './KCore';

const components = {
    [Algorithm.DIJKSTRA_A_TO_B]: DijkstraSinglePath,
    [Algorithm.DIJKSTRA_ALL]: DijkstraSingleSource,
    [Algorithm.YEN]: Yen,
    [Algorithm.BELLMAN_FORD_A_TO_B]: BellmanFordSinglePath,
    [Algorithm.BELLMAN_FORD_ALL]: BellmanFordSingleSource,
    [Algorithm.BFS]: BFS,
    [Algorithm.DFS]: DFS,
    [Algorithm.RANDOM_WALK]: RandomWalk,
    [Algorithm.MINIMAL_SPANNING_TREE]: SpanningTree,
    [Algorithm.BETWEENNESS_CENTRALITY]: BetweennessCentrality,
    [Algorithm.CLOSENESS_CENTRALITY]: ClosenessCentrality,
    [Algorithm.DEGREE_CENTRALITY]: DegreeCentrality,
    [Algorithm.EIGENVECTOR_CENTRALITY]: EigenvectorCentrality,
    [Algorithm.HARMONIC_CENTRALITY]: HarmonicCentrality,
    [Algorithm.STRENGTH_CENTRALITY]: Strength,
    [Algorithm.PAGERANK]: PageRank,
    [Algorithm.LOUVAIN]: Louvain,
    [Algorithm.LEIDEN]: Leiden,
    [Algorithm.FAST_GREEDY]: FastGreedy,
    [Algorithm.LOCAL_CLUSTERING_COEFFICIENT]: LocalClusertingCoefficient,
    [Algorithm.K_CORE]: KCore,
}

const AlgorithmOutput = ({ algorithm, response }) => {
    const Component = response && response.data && components[algorithm];
    return (
        <>
            { Component ? <Component data={response.data} /> : null }
        </>
    );
};

export default AlgorithmOutput;