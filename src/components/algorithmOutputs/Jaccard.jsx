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
            <Box>
                <Typography fontSize={15}>[{data.maxSimilarity.node1}] and [{data.maxSimilarity.node2}] are the most similar</Typography>
                <Typography fontSize={15}>
                    Similarity: {data.maxSimilarity.similarity ? Math.round(data.maxSimilarity.similarity * 100) : 0}%
                </Typography>
            </Box>
            <Button variant='contained' color='info' onClick={handleClick}>More Details</Button>
            <OutputDialog
                title='Jaccard Similarity Matrix'
                columns={['', ...data.nodes]} // top left cell is empty
                open={open}
                handleClick={handleClick}
                dataArray={data.similarityMatrix}
                loadItems={loadItems}
                explanation="This matrix shows the Jaccard similarity between each pair of nodes. Similarity values range from 0 to 1, with 1 indicating the highest similarity."
            />
        </Box>
    </>);
}

export default Jaccard;