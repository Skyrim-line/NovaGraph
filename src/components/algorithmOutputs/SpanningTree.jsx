import { Button, Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { RTableCell as Cell, RTableRow as Row } from './ResultsTable';
import { ErasBold } from '../Eras';
import OutputDialog from './OutputDialog';

const SpanningTree = ({ data }) => {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        console.log(data);
    }, [data]);

    const handleClick = () => {
        setOpen(!open);
    }

    const loadItems = (es, records) => {
        return es.slice(0, records).map((e, index) => (
            <Row key={index}>
                <Cell>{e.from}</Cell>
                <Cell>{e.to}</Cell>
                {data.weighted && <Cell>{e.weight}</Cell>}
            </Row>
        ));
    }

    return (<>
        <ErasBold fontSize={20} mb={1}>Minimum Spanning Tree</ErasBold>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Box>
                <Typography fontSize={15}>Edges in MST: {data.edges.length} </Typography>
                <Typography fontSize={15}>Total edges: {data.maxEdges}</Typography>
            </Box>
            {data.weighted && <Typography fontSize={15}>MST Total Weight: {data.totalWeight}</Typography>}
            <Button variant='contained' color='info' onClick={handleClick}>More Details</Button>
            <OutputDialog
                title='Minimum Spanning Tree Details'
                columns={data.weighted ? ['From', 'To', 'Weight'] : ['From', 'To']}
                open={open}
                handleClick={handleClick}
                dataArray={data.edges}
                loadItems={loadItems}
            />
        </Box>
    </>);
}

export default SpanningTree;