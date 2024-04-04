import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableContainer, TableHead, Paper, Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { RTableCell, RTableRow } from './ResultsTable';
import { ErasBold, ErasMedium } from '../Eras';

const SpanningTree = ({ data }) => {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        console.log(data);
    }, [data]);

    const handleClick = () => {
        setOpen(!open);
    }

    return (<>
        <ErasBold fontSize={20} mb={1}>Minimum Spanning Tree</ErasBold>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Box>
                <Typography fontSize={15}>Edges in MST: {data.edges.length} </Typography>
                <Typography fontSize={15}>Max edges in Spanning Tree: {data.maxEdges}</Typography>
            </Box>
            {data.weighted && <Typography fontSize={15}>MST Total Weight: {data.totalWeight}</Typography>}
            <Button variant='contained' color='info' onClick={handleClick}>More Details</Button>
            <Dialog open={open} onClose={handleClick} fullWidth>
                <DialogTitle>
                    <ErasMedium>Minimum Spanning Tree Edge Details</ErasMedium>
                </DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper} style={{ maxWidth: 'auto', margin: 'auto' }}>
                        <Table size='small' sx={{ tableLayout: 'auto' }}>
                            <TableHead>
                                <RTableRow>
                                    <RTableCell>From</RTableCell>
                                    <RTableCell>To</RTableCell>
                                    {data.weighted && <RTableCell>Weight</RTableCell>}
                                </RTableRow>
                            </TableHead>
                            <TableBody>
                                {data && data.edges.map((edge, index) => (
                                    <RTableRow key={index}>
                                        <RTableCell>{edge.from}</RTableCell>
                                        <RTableCell>{edge.to}</RTableCell>
                                        {data.weighted && <RTableCell>{edge.weight}</RTableCell>}
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

export default SpanningTree;