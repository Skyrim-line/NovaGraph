import { Button, Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import { RTableCell as Cell, RTableRow as Row } from './ResultsTable';
import { ErasBold } from '../Eras';
import OutputDialog from './OutputDialog';

const GenericAlgorithmOutput = ({ algorithm, data }) => {

    const runArrayFn = (arr, method, ...args) => {
        if (typeof arr[method] === 'function') {
            // runs this function on the method and args
            // e.g. method = 'join', args = [','] will run arr.join(',')
            return arr[method](...args);
        } else if (method) {
            return arr[method];
        } else {
            return arr; // not an array but a value
        }
    }

    const processOutput = (array, data_array_key) => {
        const { key, fn, args = [] } = data_array_key;
        if (array[key] === undefined) throw new Error(`Key '${key}' not found in result`);
        return runArrayFn(array[key], fn, ...args);
    }

    const [open, setOpen] = useState(false);

    const handleClick = () => setOpen(!open);

    const loadItems = (arr, records) => {
        {/* Future improvement? Change this to a sortable table */}
        return arr.slice(0, records).map((p, index) => (
            <Row key={index}>
                {algorithm.data_array_keys(data).map((data_array_key, i) => (
                    <Cell key={i}>{processOutput(p, data_array_key)}</Cell>
                ))}
            </Row>
        ));
    }

    return (<>
        <ErasBold fontSize={20} mb={1}>{algorithm.result_heading(data)}</ErasBold>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Box>
                {algorithm.result_summary.map((summary, i) => (
                    <Typography key={i} fontSize={15}>{summary.label}: {summary.value(data)}</Typography>
                ))}
            </Box>
            <Button variant='contained' color='info' onClick={handleClick}>More Details</Button>
            <OutputDialog
                title={algorithm.modal_title(data)}
                columns={algorithm.modal_columns(data)}
                open={open}
                handleClick={handleClick}
                dataArray={algorithm.data_array(data)}
                loadItems={loadItems}
                explanation={algorithm.modal_explanation}
            />
        </Box>
    </>);
}

export default GenericAlgorithmOutput;