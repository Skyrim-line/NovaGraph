import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableContainer, TableHead, Paper, Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { RTableCell as Cell, RTableRow as Row } from './ResultsTable';
import InfiniteScroll from 'react-infinite-scroller';
import { ErasBold, ErasMedium } from '../Eras';

const RandomWalk = ({ data }) => {
    const itemsPerPage = 20;
    const [open, setOpen] = useState(false);
    const [records, setRecords] = useState(itemsPerPage);

    const hasMore = records < data.path.length;

    useEffect(() => {
        console.log(data);
    }, [data]);

    const handleClick = () => {
        setOpen(!open);
    }

    const loadMore = () => {
        if (records === data.path.length) {
        } else {
            setTimeout(() => {
                setRecords(records + itemsPerPage);
            }, 500);
        }
    }

    const loadItems = (path) => {
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
            <Dialog open={open} onClose={handleClick} fullWidth>
                <DialogTitle>
                    <ErasMedium>Random Walk Details</ErasMedium>
                </DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper} style={{ maxWidth: 'auto', margin: 'auto' }}>
                        <Table size='small' sx={{ tableLayout: 'auto' }}>
                            <TableHead>
                                <Row>
                                    <Cell>Step</Cell>
                                    <Cell>From</Cell>
                                    <Cell>To</Cell>
                                    {data.weighted && <Cell>Weight</Cell>}
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
                                {loadItems(data.path)}
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

export default RandomWalk;