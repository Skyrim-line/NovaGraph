import { Button, Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { RTableCell as Cell, RTableRow as Row } from './ResultsTable';
import { ErasBold } from '../Eras';
import OutputDialog from './OutputDialog';

const TopologicalSort = ({ data }) => {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        console.log(data);
    }, [data]);

    const handleClick = () => {
        setOpen(!open);
    }

    const loadItems = (nodes, records) => {
        return nodes.slice(0, records).map((n, index) => (
            <Row key={index}>
                <Cell>{index + 1}</Cell>
                <Cell>{n.id}</Cell>
                <Cell>{n.node}</Cell>
            </Row>
        ));
    }

    return (<>
        <ErasBold fontSize={20} mb={1}>Topological Sort</ErasBold>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Button variant='contained' color='info' onClick={handleClick}>Order Details</Button>
            <OutputDialog
                title='Topological Sort Order'
                columns={['Position', 'ID', 'Name']}
                open={open}
                handleClick={handleClick}
                dataArray={data.order}
                loadItems={loadItems}
            />
        </Box>
    </>);
}

export default TopologicalSort;