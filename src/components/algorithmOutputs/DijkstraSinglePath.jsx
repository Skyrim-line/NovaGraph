import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableContainer, TableHead, Paper, Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { RTableCell, RTableRow } from './ResultsTable';
import { ErasBold, ErasMedium } from '../Eras';

const DijkstraSinglePath = ({ data }) => {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        console.log(data);
    }, [data]);

    const handleClick = () => {
        setOpen(!open);
    }

    return (<>
        <ErasBold fontSize={20} mb={1}>Dijkstra's Shortest Path from [{data.source}] to [{data.target}]</ErasBold>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Box>
                <Typography fontSize={15}>Path Length: {data.path.length}</Typography>
                {data.weighted && <Typography>Path Weight: {data.totalWeight}</Typography>}
            </Box>
            <Button variant='contained' color='info' onClick={handleClick}>More Details</Button>
            <Dialog open={open} onClose={handleClick} fullWidth>
                <DialogTitle>
                    <ErasMedium>Dijkstra Path Details</ErasMedium>
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
                                {data && data.path.map((node, index) => (
                                    <RTableRow key={index}>
                                        <RTableCell>{node.from}</RTableCell>
                                        <RTableCell>{node.to}</RTableCell>
                                        {data.weighted && <RTableCell>{node.weight}</RTableCell>}
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

export default DijkstraSinglePath;