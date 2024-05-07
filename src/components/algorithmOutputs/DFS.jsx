import { Button, Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { RTableCell as Cell, RTableRow as Row } from './ResultsTable';
import { ErasBold } from '../Eras';
import OutputDialog from './OutputDialog';

const DFS = ({ data }) => {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        console.log(data);
    }, [data]);

    const handleClick = () => {
        setOpen(!open);
    }

    const loadItems = (subtrees, records) => {
        return subtrees.slice(0, records).map((tree, index) => (
            <Row key={index}>
                <Cell>{index + 1}</Cell>
                <Cell style={{ wordWrap: 'break-word', maxWidth: 450 }}>{tree.join(' → ')}</Cell>
            </Row>
        ));
    }

    return (<>
        <ErasBold fontSize={20} mb={1}>Depth-First Search from [{data.source}]</ErasBold>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Box>
                <Typography fontSize={15}>Number of subtrees: {data.subtrees.length}</Typography>
                <Typography fontSize={15}>Nodes Found: {data.nodesFound}</Typography>
            </Box>
            <Button variant='contained' color='info' onClick={handleClick}>More Details</Button>
            <OutputDialog
                title='DFS Details'
                columns={['Subtree', 'Nodes']}
                open={open}
                handleClick={handleClick}
                dataArray={data.subtrees}
                loadItems={loadItems}
                explanation='Each row contains the list of nodes found during each subtree. Each time the search needs to "backtrack" to recurse over a node at a previous depth, a new subtree will begin.'
            />
        </Box>
    </>);
}

export default DFS;