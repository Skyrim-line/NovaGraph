import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableContainer, TableHead, Paper, Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { RTableCell, RTableRow } from './ResultsTable';
import { ErasBold, ErasMedium } from '../Eras';

const DFS = ({ data }) => {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        console.log(data);
    }, [data]);

    const handleClick = () => {
        setOpen(!open);
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
                                <RTableRow>
                                    <RTableCell>Subtree</RTableCell>
                                    <RTableCell>Nodes</RTableCell>
                                </RTableRow>
                            </TableHead>
                            <TableBody>
                                {data && data.subtrees.map((tree, index) => (
                                    <RTableRow key={index}>
                                        <RTableCell>{index + 1}</RTableCell>
                                        <RTableCell style={{ wordWrap: 'break-word', maxWidth: 450 }}>{tree.join(' → ')}</RTableCell>
                                    </RTableRow>
                                ))}
                            </TableBody>
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