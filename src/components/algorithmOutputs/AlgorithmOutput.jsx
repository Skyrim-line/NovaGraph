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