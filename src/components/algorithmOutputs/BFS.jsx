import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableContainer, TableHead, Paper, Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { RTableCell as Cell, RTableRow as Row } from './ResultsTable';
import { ErasBold, ErasMedium } from '../Eras';
import InfiniteScroll from 'react-infinite-scroller';

const BFS = ({ data }) => {
    const itemsPerPage = 20;
    const [open, setOpen] = useState(false);
    const [records, setRecords] = useState(itemsPerPage);

    const hasMore = records < data.layers.length;

    useEffect(() => {
        console.log(data);
    }, [data]);

    const handleClick = () => {
        setOpen(!open);
    }

    const loadMore = () => {
        if (records === data.length) {
        } else {
            setTimeout(() => {
                setRecords(records + itemsPerPage);
            }, 500);
        }
    }

    const loadItems = (layers) => {
        return layers.slice(0, records).map((layer, index) => (
            <Row key={index}>
                <Cell>{index}</Cell>
                <Cell style={{ wordWrap: 'break-word', maxWidth: 450 }}>{layer.join(', ')}</Cell>
            </Row>
        ));
    }

    return (<>
        <ErasBold fontSize={20} mb={1}>Breadth-First Search from [{data.source}]</ErasBold>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Box>
                <Typography fontSize={15}>Number of layers: {data.layers.length - 1}</Typography>
                <Typography fontSize={15}>Nodes Found: {data.nodesFound}</Typography>
            </Box>
            <Button variant='contained' color='info' onClick={handleClick}>More Details</Button>
            <Dialog open={open} onClose={handleClick} fullWidth>
                <DialogTitle>
                    <ErasMedium>BFS Details</ErasMedium>
                </DialogTitle>
                <DialogContent>
                    <Typography variant='body2' mb={1}>Each row contains the list of nodes found at the corresponding depth in the breadth-first search.</Typography>
                    <TableContainer component={Paper} style={{ maxWidth: 'auto', margin: 'auto' }}>
                        <Table size='small' sx={{ tableLayout: 'auto' }}>
                            <TableHead>
                                <Row>
                                    <Cell>Depth</Cell>
                                    <Cell>Nodes</Cell>
                                </Row>
                            </TableHead>
                            <InfiniteScroll
                                pageStart={0}
                                element={TableBody}
                                loadMore={loadMore}
                                hasMore={hasMore}
                                loader={<Row key={0}><Cell /><Cell>Loading...</Cell></Row>}
                                useWindow={false}
                                style={{ width: '100%' }}
                            >
                                {loadItems(data.layers)}
                            </InfiniteScroll>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClick}>Close</Button>
                </DialogActions>
            </Dialog>
        
        </Box>
    </>);
}

export default BFS;