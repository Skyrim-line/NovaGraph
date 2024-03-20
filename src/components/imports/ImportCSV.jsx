import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import React from "react";

const ImportCSV = ({open, onClose}) => {
    return(
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Import CSV Files</DialogTitle>
            <DialogContent>
                Hello! Import your files here!
            </DialogContent>
        </Dialog>
    )
}

export default ImportCSV;