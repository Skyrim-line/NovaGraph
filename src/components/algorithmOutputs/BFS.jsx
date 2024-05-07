import { Button, Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { RTableCell as Cell, RTableRow as Row } from './ResultsTable';
import { ErasBold } from '../Eras';
import OutputDialog from './OutputDialog';

const BFS = ({ data }) => {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        console.log(data);
    }, [data]);

    const handleClick = () => {
        setOpen(!open);
    }

    const loadItems = (layers, records) => {
        return layers.slice(0, records).map((layer, index) => (
            <Row key={index}>
                <Cell>{index}</Cell>
                <Cell style={{ wordWrap: 'break-word', maxWidth: 450 }}>{layer.join(', ')}</Cell>
            </Row>
        ));
    }

    return (<>
        <ErasBold fontSize={20} mb={1}>Breadth-First Search from [{data.source}]</ErasBold>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Box>
                <Typography fontSize={15}>Number of layers: {data.layers.length - 1}</Typography>
                <Typography fontSize={15}>Nodes Found: {data.nodesFound}</Typography>
            </Box>
            <Button variant='contained' color='info' onClick={handleClick}>More Details</Button>
            <OutputDialog
                title='BFS Details'
                columns={['Depth', 'Nodes']}
                open={open}
                handleClick={handleClick}
                dataArray={data.layers}
                loadItems={loadItems}
                explanation='Each row contains the list of nodes found at the corresponding depth in the breadth-first search.'
            />
        </Box>
    </>);
}

export default BFS;