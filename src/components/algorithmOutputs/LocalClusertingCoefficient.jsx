import { Button, Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { RTableCell as Cell, RTableRow as Row } from './ResultsTable';
import { ErasBold } from '../Eras';
import OutputDialog from './OutputDialog';

const LocalClusertingCoefficient = ({ data }) => {
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
                <Cell>{t.node}</Cell>
                <Cell>{t.value}</Cell>
            </Row>
        ));
    }

    return (<>
        <ErasBold fontSize={20} mb={1}>Local Cluserting Coefficient</ErasBold>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Typography fontSize={15}>Global Clustering Coefficient: {data.global_coefficient}</Typography>
            <Button variant='contained' color='info' onClick={handleClick}>Details</Button>
            <OutputDialog
                title='Local Cluserting Coefficient Details'
                columns={['ID', 'Node', 'Local Clustering Coefficient']}
                open={open}
                handleClick={handleClick}
                dataArray={data.coefficients}
                loadItems={loadItems}
            />
        </Box>
    </>);
}

export default LocalClusertingCoefficient;