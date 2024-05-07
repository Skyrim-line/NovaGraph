import { Button, Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { RTableCell as Cell, RTableRow as Row } from './ResultsTable';
import { ErasBold } from '../Eras';
import OutputDialog from './OutputDialog';

const Louvain = ({ data }) => {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        console.log(data);
    }, [data]);

    const handleClick = () => {
        setOpen(!open);
    }

    const loadItems = (communities, records) => {
        return communities.slice(0, records).map((community, index) => (
            <Row key={index}>
                <Cell>{index + 1}</Cell>
                <Cell style={{ wordWrap: 'break-word', maxWidth: 400 }}>{community.join(', ')}</Cell>
            </Row>
        ));
    }

    return (<>
        <ErasBold fontSize={20} mb={1}>Louvain (Multi-Level Modularity Optimisation) Algorithm</ErasBold>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Box>
                <Typography fontSize={15}>Modularity: {data.modularity}</Typography>
                <Typography fontSize={15}>Number of Communities: {data.communities ? data.communities.length : 0}</Typography>
            </Box>
            <Button variant='contained' color='info' onClick={handleClick}>More Details</Button>
            <OutputDialog
                title='Community Details'
                columns={['Community', 'Nodes']}
                open={open}
                handleClick={handleClick}
                dataArray={data.communities}
                loadItems={loadItems}
                explanation='Each row contains the list of nodes in the corresponding community.'
            />
        </Box>
    </>);
}

export default Louvain;