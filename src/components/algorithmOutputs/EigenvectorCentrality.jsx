import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableContainer, TableHead, Paper, Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { RTableCell, RTableRow } from './ResultsTable';
import { ErasBold, ErasMedium } from '../Eras';

const EigenvectorCentrality = ({ data }) => {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        console.log(data);
    }, [data]);

    const handleClick = () => {
        setOpen(!open);
    }

    return (<>
        <ErasBold fontSize={20} mb={1}>Eigenvector Centrality</ErasBold>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Box>
                <Typography fontSize={15}>Maximum Centrality found: {data.maxCentrality}</Typography>
                <Typography fontSize={15}>Node with centrality of {data.maxCentrality}: {data.maxCentralityNode}</Typography>
            </Box>
            <Typography fontSize={15}>Eigenvalue: {data.eigenvalue}</Typography>
            <Button variant='contained' color='info' onClick={handleClick}>More Details</Button>
            <Dialog open={open} onClose={handleClick} fullWidth>
                <DialogTitle>
                    <ErasMedium>Eigenvector Centrality Details</ErasMedium>
                </DialogTitle>
                <DialogContent>
                    <Typography variant='body2' pb={1}>All centrality values have been scaled such that their maximum value is 1.</Typography>
                    <TableContainer component={Paper} style={{ maxWidth: 'auto', margin: 'auto' }}>
                        <Table size='small' sx={{ tableLayout: 'auto' }}>
                            <TableHead>
                                <RTableRow>
                                    <RTableCell>ID</RTableCell>
                                    <RTableCell>Node</RTableCell>
                                    <RTableCell>Centrality</RTableCell>
                                </RTableRow>
                            </TableHead>
                            <TableBody>
                                {data && data.centralities.map((c, index) => (
                                    <RTableRow key={index}>
                                        <RTableCell>{index}</RTableCell>
                                        <RTableCell>{c.node}</RTableCell>
                                        <RTableCell>{c.centrality}</RTableCell>
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

export default EigenvectorCentrality;