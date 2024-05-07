import { Button, Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { RTableCell as Cell, RTableRow as Row } from './ResultsTable';
import { ErasBold } from '../Eras';
import OutputDialog from './OutputDialog';

const BellmanFordSinglePath = ({ data }) => {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        console.log(data);
    }, [data]);

    const handleClick = () => {
        setOpen(!open);
    }

    const loadItems = (path, records) => {
        return path.slice(0, records).map((node, index) => (
            <Row key={index}>
                <Cell>{node.from}</Cell>
                <Cell>{node.to}</Cell>
                {data.weighted && <Cell>{node.weight}</Cell>}
            </Row>
        ));
    }

    return (<>
        <ErasBold fontSize={20} mb={1}>Bellman-Ford Shortest Path from [{data.source}] to [{data.target}]</ErasBold>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Box>
                <Typography fontSize={15}>Path Length: {data.path.length}</Typography>
                {data.weighted && <Typography fontSize={15}>Path Weight: {data.totalWeight}</Typography>}
            </Box>
            <Button variant='contained' color='info' onClick={handleClick}>More Details</Button>
            <OutputDialog
                title='Bellman-Ford Path Details'
                columns={data.weighted ? ['From', 'To', 'Weight'] : ['From', 'To']}
                open={open}
                handleClick={handleClick}
                dataArray={data.path}
                loadItems={loadItems}
            />
        </Box>
    </>);
}

export default BellmanFordSinglePath;