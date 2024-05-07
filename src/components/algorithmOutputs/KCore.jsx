import { Button, Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { RTableCell as Cell, RTableRow as Row } from './ResultsTable';
import { ErasBold } from '../Eras';
import OutputDialog from './OutputDialog';

const KCore = ({ data }) => {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        console.log(data);
    }, [data]);

    const handleClick = () => {
        setOpen(!open);
    }

    const loadItems = (cores, records) => {
        return cores.slice(0, records).map((node, index) => (
            <Row key={index}>
                <Cell>{node.id}</Cell>
                <Cell>{node.node}</Cell>
            </Row>
        ));
    }

    return (<>
        <ErasBold fontSize={20} mb={1}>K-Core Decomposition</ErasBold>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Typography fontSize={15}>Maximum Coreness: {data.max_coreness}</Typography>
            <Button variant='contained' color='info' onClick={handleClick}>Details</Button>
            <OutputDialog
                title={`Maximum Subgraph with k=${data.k} Coreness`}
                columns={['ID', 'Node']}
                open={open}
                handleClick={handleClick}
                dataArray={data.cores}
                loadItems={loadItems}
            />
        </Box>
    </>);
}

export default KCore;