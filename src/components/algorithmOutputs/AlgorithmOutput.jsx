import React, { useEffect } from 'react';
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
import LabelPropagation from './LabelPropagation';
import Triangles from './Triangles';
import StronglyConnected from './StronglyConnected';
import WeaklyConnected from './WeaklyConnected';
import AreNeighbouring from './AreNeighbouring';
import Jaccard from './Jaccard';
import TopologicalSort from './TopologicalSort';
import Diameter from './Diameter';
import EulerianPath from './EulerianPath';
import EulerianCircuit from './EulerianCircuit';
import MissingEdgePrediction from './MissingEdgePrediction';
import GenericAlgorithmOutput from './GenericAlgorithmOutput';

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
    [Algorithm.LABEL_PROPAGATION]: LabelPropagation,
    [Algorithm.LOCAL_CLUSTERING_COEFFICIENT]: LocalClusertingCoefficient,
    [Algorithm.K_CORE]: KCore,
    [Algorithm.TRIANGLE_COUNT]: Triangles,
    [Algorithm.STRONGLY_CONNECTED_COMPONENTS]: StronglyConnected,
    [Algorithm.WEAKLY_CONNECTED_COMPONENTS]: WeaklyConnected,
    [Algorithm.NEIGHBOR_JOINING]: AreNeighbouring,
    [Algorithm.JACCARD_SIMILARITY]: Jaccard,
    [Algorithm.TOPOLOGICAL_SORT]: TopologicalSort,
    [Algorithm.DIAMETER]: Diameter,
    [Algorithm.EULERIAN_PATH]: EulerianPath,
    [Algorithm.EULERIAN_CIRCUIT]: EulerianCircuit,
    [Algorithm.MISSING_EDGE_PREDICTION]: MissingEdgePrediction,
}

const AlgorithmOutput = ({ algorithm, response }) => {

    useEffect(() => {
        console.log("algorithm output");
        console.log(algorithm);
    }, [algorithm]);

    const Component = response && response.data && components[algorithm];
    const genericComponent = response && response.data;
    return (
        <>
            {
                Component ? <Component data={response.data} /> :
                genericComponent ? <GenericAlgorithmOutput algorithm={algorithm} data={response.data} /> :
                null
            }
        </>
    );
};

export default AlgorithmOutput;