import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Typography } from '@mui/material';
import React, { useRef } from 'react';
import { ErasMedium } from './Eras';

const ExportMenu = ({ open, setOpen, data }) => {
    const downloadRef = useRef();

    const handleExport = () => {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        downloadRef.current.href = url;
        downloadRef.current.download = 'data.json';
        downloadRef.current.click();
    }

    return (
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
            <DialogTitle>
                <ErasMedium>Export Data</ErasMedium>
            </DialogTitle>
            <Divider />
            <DialogContent>
                <Typography>
                    Export the graph data in a JSON format.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleExport} variant='contained' color='info' sx={{ mt: 2 }}>Export</Button>
                <a ref={downloadRef} style={{ display: 'none' }} />
            </DialogActions>
        </Dialog>
    );
};

export default ExportMenu;