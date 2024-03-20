import { Box, Divider, ListItemIcon, ListItemText, Menu, MenuItem, MenuList } from "@mui/material";
import BackupTableIcon from '@mui/icons-material/BackupTable';
import DataObjectIcon from '@mui/icons-material/DataObject';
import CodeIcon from '@mui/icons-material/Code';
import DataArrayIcon from '@mui/icons-material/DataArray';
import AutoModeIcon from '@mui/icons-material/AutoMode';
import React, { useState } from "react";
import ImportCSV from "./ImportCSV";

const ImportMenu = ({anchorEl, setAnchorEl}) => {
    const [openDialog, setOpenDialog] = useState({
        csv: false,
        json: false,
        graphml: false,
        gml: false,
        auto: false
    });

    const handleOpenDialog = (type) => {
        setOpenDialog({ ...openDialog, [type]: true });
        setAnchorEl(null)
    };
    
    const handleCloseDialog = (type) => {
        setOpenDialog({ ...openDialog, [type]: false });
    };

    return(<>
        
        <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            sx={{ width: 320, maxWidth: '100%' }}
        >
            <Box sx={{ width: 320, maxWidth: '100%' }} elevation={10}>
                <MenuList sx={{ padding: 0 }}>
                    <MenuItem onClick={() => handleOpenDialog('csv')}>
                        <ListItemIcon><BackupTableIcon /></ListItemIcon>
                        <ListItemText>Import CSV</ListItemText>
                    </MenuItem>

                    <MenuItem onClick={() => handleOpenDialog('json')}>
                        <ListItemIcon><DataObjectIcon /></ListItemIcon>
                        <ListItemText>Import JSON</ListItemText>
                    </MenuItem>

                    <MenuItem onClick={() => handleOpenDialog('graphml')}>
                        <ListItemIcon><CodeIcon /></ListItemIcon>
                        <ListItemText>Import GraphML</ListItemText>
                    </MenuItem>

                    <MenuItem onClick={() => handleOpenDialog('gml')}>
                        <ListItemIcon><DataArrayIcon /></ListItemIcon>
                        <ListItemText>Import GML</ListItemText>
                    </MenuItem>

                    <Divider />

                    <MenuItem onClick={() => handleOpenDialog('auto')}>
                        <ListItemIcon><AutoModeIcon /></ListItemIcon>
                        <ListItemText>Generate Graph</ListItemText>
                    </MenuItem>
                </MenuList>
            </Box>
        </Menu>
        <ImportCSV open={openDialog.csv} onClose={() => handleCloseDialog('csv')} />
        {/* Include more import components when completed */}
    </>)
}

export default ImportMenu;