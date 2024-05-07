import { Button, Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { RTableCell as Cell, RTableRow as Row } from './ResultsTable';
import { ErasBold } from '../Eras';
import OutputDialog from './OutputDialog';

const Triangles = ({ data }) => {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        console.log(data);
    }, [data]);

    const handleClick = () => {
        setOpen(!open);
    }

    const loadItems = (ts, records) => {
        return ts.slice(0, records).map((t, index) => (
            <Row key={index}>
                <Cell>{t.id}</Cell>
                <Cell>{t.node1} → {t.node2} → {t.node3} →</Cell>
            </Row>
        ));
    }

    return (<>
        <ErasBold fontSize={20} mb={1}>Triangles in Graph</ErasBold>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Typography fontSize={15}>Triangle Count: {data.triangles.length}</Typography>
            <Button variant='contained' color='info' onClick={handleClick}>More Details</Button>
            <OutputDialog
                title='Triangles'
                columns={['Triangle ID', 'Node Triple']}
                open={open}
                handleClick={handleClick}
                dataArray={data.triangles}
                loadItems={loadItems}
            />
        </Box>
    </>);
}

export default Triangles;