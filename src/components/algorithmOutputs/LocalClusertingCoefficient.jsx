import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableContainer, TableHead, Paper, Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { RTableCell as Cell, RTableRow as Row } from './ResultsTable';
import InfiniteScroll from 'react-infinite-scroller';
import { ErasBold, ErasMedium } from '../Eras';

const LocalClusertingCoefficient = ({ data }) => {
    const itemsPerPage = 20;
    const [open, setOpen] = useState(false);
    const [records, setRecords] = useState(itemsPerPage);

    const hasMore = records < data.coefficients.length;

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

    const loadItems = (ts) => {
        return ts.slice(0, records).map((t, index) => (
            <Row key={index}>
                <Cell>{t.id}</Cell>
                <Cell>{t.node}</Cell>
                <Cell>{t.value}</Cell>
            </Row>
        ));
    }

    return (<>
        <ErasBold fontSize={20} mb={1}>Local Cluserting Coefficient</ErasBold>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Typography fontSize={15}>Global Clustering Coefficient: {data.global_coefficient}</Typography>
            <Button variant='contained' color='info' onClick={handleClick}>Details</Button>
            <Dialog open={open} onClose={handleClick} fullWidth>
                <DialogTitle>
                    <ErasMedium>Local Clustering Coefficient</ErasMedium>
                </DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper} style={{ maxWidth: 'auto', margin: 'auto' }}>
                        <Table size='small' sx={{ tableLayout: 'auto' }}>
                            <TableHead>
                                <Row>
                                    <Cell>Id</Cell>
                                    <Cell>Node</Cell>
                                    <Cell>Local Clustering Coefficient</Cell>
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
                                {loadItems(data.coefficients)}
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

export default LocalClusertingCoefficient;