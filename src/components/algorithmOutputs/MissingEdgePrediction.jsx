import { Button, Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { RTableCell as Cell, RTableRow as Row } from './ResultsTable';
import { ErasBold } from '../Eras';
import OutputDialog from './OutputDialog';

const MissingEdgePrediction = ({ data }) => {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        console.log(data);
    }, [data]);

    const handleClick = () => {
        setOpen(!open);
    }

    const loadItems = (es, records) => {
        return es.slice(0, records).map((e, index) => (
            <Row key={index}>
                <Cell>{index + 1}</Cell>
                <Cell>{e.from}</Cell>
                <Cell>{e.to}</Cell>
                <Cell>{e.probability}</Cell>
            </Row>
        ));
    }

    return (<>
        <ErasBold fontSize={20} mb={1}>Missing Edge Prediction</ErasBold>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            {
                data.predictedEdges.length > 0 ?
                    <>
                        <Typography fontSize={15}>Found {data.predictedEdges.length} likely edges</Typography>
                        <Button variant='contained' color='info' onClick={handleClick}>More Details</Button>
                        <OutputDialog
                            title='Missing Edges'
                            columns={['Edge #', 'From', 'To', 'Probability']}
                            open={open}
                            handleClick={handleClick}
                            dataArray={data.predictedEdges}
                            loadItems={loadItems}
                            description='The table below shows the edges that are likely to be missing in the graph.'
                        />
                    </>
                : <Typography fontSize={15}>Couldn't find any edges likely to be missing</Typography>
            }
            
        </Box>
    </>);
}

export default MissingEdgePrediction;