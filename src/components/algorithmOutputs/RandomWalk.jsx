import { Button, Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { RTableCell as Cell, RTableRow as Row } from './ResultsTable';
import { ErasBold } from '../Eras';
import OutputDialog from './OutputDialog';

const RandomWalk = ({ data }) => {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        console.log(data);
    }, [data]);

    const handleClick = () => {
        setOpen(!open);
    }

    const loadItems = (path, records) => {
        return path.slice(0, records).map((edge, index) => (
            <Row key={index}>
                <Cell>{index + 1}</Cell>
                <Cell>{edge.from}</Cell>
                <Cell>{edge.to}</Cell>
                {data.weighted && <Cell>{edge.weight}</Cell>}
            </Row>
        ));
    }

    return (<>
        <ErasBold fontSize={20} mb={1}>Random Walk of {data.steps} steps from [{data.source}]</ErasBold>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Box>
                <Typography fontSize={15}>Most frequented node: [{data.maxFrequencyNode}]</Typography>
                <Typography fontSize={15}>[{data.maxFrequencyNode}] was visited {data.maxFrequency} times</Typography>
            </Box>
            <Button variant='contained' color='info' onClick={handleClick}>More Details</Button>
            <OutputDialog
                title='Random Walk Details'
                columns={data.weighted ? ['Step', 'From', 'To', 'Weight'] : ['Step', 'From', 'To']}
                open={open}
                handleClick={handleClick}
                dataArray={data.path}
                loadItems={loadItems}
            />
        </Box>
    </>);
}

export default RandomWalk;