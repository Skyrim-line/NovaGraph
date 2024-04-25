import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableContainer, TableHead, Paper, Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { RTableCell as Cell, RTableRow as Row } from './ResultsTable';
import { ErasBold, ErasMedium } from '../Eras';
import InfiniteScroll from 'react-infinite-scroller';

const DFS = ({ data }) => {
    const itemsPerPage = 20;
    const [open, setOpen] = useState(false);
    const [records, setRecords] = useState(itemsPerPage);

    const hasMore = records < data.subtrees.length;

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

    const loadItems = (subtrees) => {
        return subtrees.slice(0, records).map((tree, index) => (
            <Row key={index}>
                <Cell>{index + 1}</Cell>
                <Cell style={{ wordWrap: 'break-word', maxWidth: 450 }}>{tree.join(' → ')}</Cell>
            </Row>
        ));
    }

    return (<>
        <ErasBold fontSize={20} mb={1}>Depth-First Search from [{data.source}]</ErasBold>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Box>
                <Typography fontSize={15}>Number of subtrees: {data.subtrees.length}</Typography>
                <Typography fontSize={15}>Nodes Found: {data.nodesFound}</Typography>
            </Box>
            <Button variant='contained' color='info' onClick={handleClick}>More Details</Button>
            <Dialog open={open} onClose={handleClick} fullWidth>
                <DialogTitle>
                    <ErasMedium>DFS Details</ErasMedium>
                </DialogTitle>
                <DialogContent>
                    <Typography variant='body2' mb={1}>
                        Each row contains the list of nodes found during each subtree. 
                        Each time the search needs to "backtrack" to recurse over a node at a previous depth, 
                        a new subtree will begin.
                    </Typography>
                    <TableContainer component={Paper} style={{ maxWidth: 'auto', margin: 'auto' }}>
                        <Table size='small' sx={{ tableLayout: 'auto' }}>
                            <TableHead>
                                <Row>
                                    <Cell>Subtree</Cell>
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
                                {loadItems(data.subtrees)}
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

export default DFS;