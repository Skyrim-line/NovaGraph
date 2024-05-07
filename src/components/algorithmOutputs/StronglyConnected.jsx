import { Button, Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { RTableCell as Cell, RTableRow as Row } from './ResultsTable';
import { ErasBold } from '../Eras';
import OutputDialog from './OutputDialog';

const StronglyConnected = ({ data }) => {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        console.log(data);
    }, [data]);

    const handleClick = () => {
        setOpen(!open);
    }

    const loadItems = (components, records) => {
        return components.slice(0, records).map((comp, index) => (
            <Row key={index}>
                <Cell>{index}</Cell>
                <Cell style={{ wordWrap: 'break-word', maxWidth: 400 }}>{comp.join(', ')}</Cell>
            </Row>
        ));
    }

    return (<>
        <ErasBold fontSize={20} mb={1}>Strongly Connected Components</ErasBold>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Typography fontSize={15}>Component Count: {data.components.length}</Typography>
            <Button variant='contained' color='info' onClick={handleClick}>More Details</Button>
            <OutputDialog
                title='Component Details'
                columns={['Component', 'Nodes']}
                open={open}
                handleClick={handleClick}
                dataArray={data.components}
                loadItems={loadItems}
                explanation='Each row contains the list of nodes in the corresponding component.'
            />
        </Box>
    </>);
}

export default StronglyConnected;