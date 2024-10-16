import { Button, Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { RTableCell as Cell, RTableRow as Row } from './ResultsTable';
import { ErasBold } from '../Eras';
import OutputDialog from './OutputDialog';

const GenericAlgorithmOutput = ({ algorithm, data }) => {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        console.log(data);
    }, [data]);

    const handleClick = () => {
        setOpen(!open);
    }

    const loadItems = (arr, records) => {
        return arr.slice(0, records).map((p, index) => (
            <Row key={index}>
                {algorithm.data_array_keys(data).map((key, i) => (
                    <Cell key={i}>{p[key]}</Cell>
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
                title={algorithm.modal_title}
                columns={algorithm.modal_columns(data)}
                open={open}
                handleClick={handleClick}
                dataArray={algorithm.data_array(data)}
                loadItems={loadItems}
            />
        </Box>
    </>);
}

export default GenericAlgorithmOutput;