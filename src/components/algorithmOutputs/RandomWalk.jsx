import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableContainer, TableHead, Paper, Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { RTableCell, RTableRow } from './ResultsTable';
import { ErasBold, ErasMedium } from '../Eras';

const RandomWalk = ({ data }) => {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        console.log(data);
    }, [data]);

    const handleClick = () => {
        setOpen(!open);
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
                                <RTableRow>
                                    <RTableCell>Step</RTableCell>
                                    <RTableCell>From</RTableCell>
                                    <RTableCell>To</RTableCell>
                                    {data.weighted && <RTableCell>Weight</RTableCell>}
                                </RTableRow>
                            </TableHead>
                            <TableBody>
                                {data && data.path.map((edge, index) => (
                                    <RTableRow key={index}>
                                        <RTableCell>{index + 1}</RTableCell>
                                        <RTableCell>{edge.from}</RTableCell>
                                        <RTableCell>{edge.to}</RTableCell>
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

export default RandomWalk;