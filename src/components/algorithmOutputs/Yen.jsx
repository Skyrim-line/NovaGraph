import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableContainer, TableHead, Paper, Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { RTableCell, RTableRow } from './ResultsTable';
import { ErasBold, ErasMedium } from '../Eras';

const Yen = ({ data }) => {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        console.log(data);
    }, [data]);

    const handleClick = () => {
        setOpen(!open);
    }

    return (<>
        <ErasBold fontSize={20} mb={1}>Yens's k Shortest Paths from [{data.source}] to [{data.target}]</ErasBold>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Typography fontSize={15}>Paths found: {data.paths ? data.paths.length : 0}/{data.k}</Typography>
            <Button variant='contained' color='info' onClick={handleClick}>Details</Button>
            <Dialog open={open} onClose={handleClick} fullWidth>
                <DialogTitle>
                    <ErasMedium>k={data.k} paths from [{data.source}] to [{data.target}]</ErasMedium>
                </DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper} style={{ maxWidth: 'auto', margin: 'auto' }}>
                        <Table size='small' sx={{ tableLayout: 'auto' }}>
                            <TableHead>
                                <RTableRow>
                                    <RTableCell>#</RTableCell>
                                    <RTableCell>Path</RTableCell>
                                    <RTableCell>{data.weighted ? "Weight" : "Length"}</RTableCell>
                                </RTableRow>
                            </TableHead>
                            <TableBody>
                                {data.paths.map((path, index) => (
                                    <RTableRow key={index}>
                                        <RTableCell>{index + 1}</RTableCell>
                                        <RTableCell style={{ wordWrap: 'break-word', maxWidth: 300 }}>{path.path.join(' → ')}</RTableCell>
                                        <RTableCell>{data.weighted ? path.weight : path.path.length}</RTableCell>
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

export default Yen;