import { Button, Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { RTableCell as Cell, RTableRow as Row } from './ResultsTable';
import { ErasBold } from '../Eras';
import OutputDialog from './OutputDialog';

const Diameter = ({ data }) => {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        console.log(data);
    }, [data]);

    const handleClick = () => {
        setOpen(!open);
    }

    const loadItems = (ps, records) => {
        return ps.slice(0, records).map((p, index) => (
            <Row key={index}>
                <Cell>{p.from}</Cell>
                <Cell>{p.to}</Cell>
                {data.weighted && <Cell>{p.weight}</Cell>}
            </Row>
        ));
    }

    return (<>
        <ErasBold fontSize={20} mb={1}>Diameter (Longest Geodesic) [{data.source}] to [{data.target}]</ErasBold>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Box>
                <Typography fontSize={15}>Source: [{data.source}]</Typography>
                <Typography fontSize={15}>Target: [{data.target}]</Typography>
            </Box>
            <Typography fontSize={15}>Diameter: {data.diameter}</Typography>
            <Button variant='contained' color='info' onClick={handleClick}>More Details</Button>
            <OutputDialog
                title='Diameter Path Details'
                columns={data.weighted ? ['From', 'To', 'Weight'] : ['From', 'To']}
                open={open}
                handleClick={handleClick}
                dataArray={data.path}
                loadItems={loadItems}
            />
        </Box>
    </>);
}

export default Diameter;