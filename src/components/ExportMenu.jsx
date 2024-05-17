import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Typography } from '@mui/material';
import React, { useRef } from 'react';
import { ErasMedium } from './Eras';
import yaml from 'js-yaml';

const ExportMenu = ({ open, setOpen, data }) => {
    const downloadRef = useRef();

    const handleExportJson = () => {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        downloadRef.current.href = url;
        downloadRef.current.download = 'data.json';
        downloadRef.current.click();
    }

    const handleExportYaml = () => {
        const yamlData = yaml.dump(data);
        const blob = new Blob([yamlData], { type: 'appliction/x-yaml' });
        const url = URL.createObjectURL(blob);
        downloadRef.current.href = url;
        downloadRef.current.download = 'data.yaml';
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
                    Export the results of the algorithm.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button onClick={handleExportJson} variant='contained' color='info'>Export to JSON</Button>
                    <Button onClick={handleExportYaml} variant='contained' color='info'>Export to YAML</Button>
                </Box>
                <a ref={downloadRef} style={{ display: 'none' }} />
            </DialogActions>
        </Dialog>
    );
};

export default ExportMenu;