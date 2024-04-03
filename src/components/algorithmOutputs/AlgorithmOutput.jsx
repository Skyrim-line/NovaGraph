import React from 'react';
import { Algorithm } from '../../algorithms';
import DijkstraSinglePath from './DijkstraSinglePath';
import DijkstraSingleSource from './DijkstraSingleSource';

const components = {
    [Algorithm.DIJKSTRA_A_TO_B]: DijkstraSinglePath,
    [Algorithm.DIJKSTRA_ALL]: DijkstraSingleSource,
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