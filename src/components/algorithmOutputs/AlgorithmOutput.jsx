import React from 'react';
import { Algorithm } from '../../algorithms';
import DijkstraSinglePath from './DijkstraSinglePath';

const components = {
    [Algorithm.DIJKSTRA_A_TO_B]: DijkstraSinglePath,
}

const AlgorithmOutput = ({ algorithm, response }) => {
    const Component = response && components[algorithm];
    return (
        <>
            { Component ? <Component response={response} /> : null }
        </>
    );
};

export default AlgorithmOutput;