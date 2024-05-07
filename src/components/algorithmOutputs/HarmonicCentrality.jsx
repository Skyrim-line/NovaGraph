import { Button, Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { RTableCell as Cell, RTableRow as Row } from './ResultsTable';
import { ErasBold } from '../Eras';
import OutputDialog from './OutputDialog';

const HarmonicCentrality = ({ data }) => {
    const [open, setOpen] = useState(false);
    const [centralities, setCentralities] = useState([]);
    useEffect(() => {
        console.log(data);
        data && setCentralities([...data.centralities].sort((a, b) => b.centrality - a.centrality));
    }, [data]);

    const handleClick = () => {
        setOpen(!open);
    }

    const loadItems = (centralities, records) => {
        return centralities.slice(0, records).map((c, index) => (
            <Row key={index}>
                <Cell>{c.id}</Cell>
                <Cell>{c.node}</Cell>
                <Cell>{c.centrality}</Cell>
            </Row>
        ));
    }

    return (<>
        <ErasBold fontSize={20} mb={1}>Harmonic Centrality</ErasBold>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Box>
                <Typography fontSize={15}>Maximum Centrality Node:</Typography>
                <Typography fontSize={15}>[{centralities[0] && centralities[0].node}]</Typography>
            </Box>
            <Button variant='contained' color='info' onClick={handleClick}>More Details</Button>
            <OutputDialog
                title='Harmonic Centrality Details'
                columns={['ID', 'Node', 'Centrality']}
                open={open}
                handleClick={handleClick}
                dataArray={centralities}
                loadItems={loadItems}
            />
        </Box>
    </>);
}

export default HarmonicCentrality;