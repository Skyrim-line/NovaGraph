import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableContainer, TableHead, Paper, Typography } from '@mui/material';
import React, { useState } from 'react';
import { RTableCell as Cell, RTableRow as Row } from './ResultsTable';
import InfiniteScroll from 'react-infinite-scroller';
import { ErasMedium } from '../Eras';

const OutputDialog = ({ title, columns, open, handleClick, dataArray, loadItems, explanation }) => {
    const itemsPerPage = 20;
    const [records, setRecords] = useState(itemsPerPage);
    const hasMore = records < dataArray.length;

    const loadMore = () => {
        if (records < dataArray.length) {
            setTimeout(() => {
                setRecords(records + itemsPerPage);
            }, 500);
        }
    }

    return (
        <Dialog open={open} onClose={handleClick} fullWidth>
            <DialogTitle>
                <ErasMedium>{title}</ErasMedium>
            </DialogTitle>
            <DialogContent>
                {explanation && <Typography variant='body2' mb={1}>{explanation}</Typography>}
                <TableContainer component={Paper} style={{ maxWidth: 'auto', margin: 'auto' }}>
                    <Table size='small' sx={{ tableLayout: 'auto' }}>
                        <TableHead>
                            <Row>
                                {columns.map((col, index) => (
                                    <Cell key={index}>{col}</Cell>
                                ))}
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
                            {loadItems(dataArray, records)}
                        </InfiniteScroll>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClick}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default OutputDialog;