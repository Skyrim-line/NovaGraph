import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableContainer, TableHead, Paper, Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { RTableCell as Cell, RTableRow as Row } from './ResultsTable';
import InfiniteScroll from 'react-infinite-scroller';
import { ErasBold, ErasMedium } from '../Eras';

const HarmonicCentrality = ({ data }) => {
    const itemsPerPage = 20;
    const [open, setOpen] = useState(false);
    const [centralities, setCentralities] = useState([]);
    const [records, setRecords] = useState(itemsPerPage);

    const hasMore = records < centralities.length;

    useEffect(() => {
        console.log(data);
        data && setCentralities([...data.centralities].sort((a, b) => b.centrality - a.centrality));
    }, [data]);

    const handleClick = () => {
        setOpen(!open);
    }

    const loadMore = () => {
        if (records === centralities.length) {
        } else {
            setTimeout(() => {
                setRecords(records + itemsPerPage);
            }, 500);
        }
    }

    const loadItems = (centralities) => {
        return centralities.slice(0, records).map((c, index) => (
            <Row key={index}>
                <Cell>{c.id}</Cell>
                <Cell>{c.node}</Cell>
                <Cell>{c.centrality}</Cell>
            </Row>
        ));
    }

    return (<>
        <ErasBold fontSize={20} mb={1}>Harmonic Centrality</ErasBold>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Box>
                <Typography fontSize={15}>Maximum Centrality Node:</Typography>
                <Typography fontSize={15}>[{centralities[0] && centralities[0].node}]</Typography>
            </Box>
            <Button variant='contained' color='info' onClick={handleClick}>More Details</Button>
            <Dialog open={open} onClose={handleClick} fullWidth>
                <DialogTitle>
                    <ErasMedium>Harmonic Centrality Details</ErasMedium>
                </DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper} style={{ maxWidth: 'auto', margin: 'auto' }}>
                        <Table size='small' sx={{ tableLayout: 'auto' }}>
                            <TableHead>
                                <Row>
                                    <Cell>ID</Cell>
                                    <Cell>Node</Cell>
                                    <Cell>Centrality</Cell>
                                </Row>
                            </TableHead>
                            <InfiniteScroll
                                pageStart={0}
                                element={TableBody}
                                loadMore={loadMore}
                                hasMore={hasMore}
                                loader={<Row key={0}><Cell /><Cell>Loading...</Cell><Cell /></Row>}
                                useWindow={false}
                                style={{ width: '100%' }}
                            >
                                {loadItems(centralities)}
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

export default HarmonicCentrality;