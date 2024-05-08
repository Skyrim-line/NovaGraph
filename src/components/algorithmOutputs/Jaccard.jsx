import { Button, Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { RTableCell as Cell, RTableRow as Row } from './ResultsTable';
import { ErasBold } from '../Eras';
import OutputDialog from './OutputDialog';

const Jaccard = ({ data }) => {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        console.log(data);
    }, [data]);

    const handleClick = () => {
        setOpen(!open);
    }

    const loadItems = (rows, records) => {
        return rows.slice(0, records).map((row, index) => (
            <Row key={index}>
                <Cell sx={{ backgroundColor: theme => theme.palette.info.main }}>{data.nodes[index]}</Cell>
                {row.map((cell, i) => (
                    <Cell key={i}>{cell}</Cell>
                ))}
            </Row>
        ));
    }

    return (<>
        <ErasBold fontSize={20} mb={1}>Jaccard Similarity</ErasBold>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Button variant='contained' color='info' onClick={handleClick}>Details</Button>
            <OutputDialog
                title='Jaccard Similarity Matrix'
                columns={['', ...data.nodes]}
                open={open}
                handleClick={handleClick}
                dataArray={data.similarityMatrix}
                loadItems={loadItems}
            />
        </Box>
    </>);
}

export default Jaccard;