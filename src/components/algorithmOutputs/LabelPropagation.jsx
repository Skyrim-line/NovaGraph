import { Button, Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { RTableCell as Cell, RTableRow as Row } from './ResultsTable';
import { ErasBold } from '../Eras';
import OutputDialog from './OutputDialog';

const LabelPropagation = ({ data }) => {
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
        <ErasBold fontSize={20} mb={1}>Label Propagation Algorithm</ErasBold>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Typography fontSize={15}>Number of Communities: {data.communities ? data.communities.length : 0}</Typography>
            <Button variant='contained' color='info' onClick={handleClick}>Details</Button>
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

export default LabelPropagation;