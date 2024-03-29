import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, Typography } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import React, { useState } from 'react';

const ImportGEXF = ({ open, onClose, module, updateGraph }) => {
  const [file, setFile] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    console.log(file)
    if (file && file.name.endsWith('.gexf')) {
        setFile(file);
    } else {
        alert('Please upload a .gexf file');
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    const reader = new FileReader();
    const filename = "graph.gexf";
    module.FS.unlink(filename);

    reader.onload = e => {
      const data = new Uint8Array(e.target.result);
      module.FS.writeFile(filename, data);
      const response = module.generate_graph_from_gexf(filename);
      if (response && response.nodes) updateGraph(response.nodes, response.edges, response.directed);
      setFile(null);
    }
    reader.readAsArrayBuffer(file);
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        <Typography>Import Graph Exchange XML Format (GEXF) File</Typography>
      </DialogTitle>
      <Divider  />
      <DialogContent>
        <Typography>
          Select a GEXF file from your computer in the format shown in this example:
        </Typography>
        <Box pt={1} fontSize="12px">
          <SyntaxHighlighter style={dracula} language="xml">
{`<?xml version="1.0" encoding="UTF-8"?>
<gexf xmlns="http://gexf.net/1.2" version="1.2">
TODO`}

          </SyntaxHighlighter>
          <Box sx={{ textAlign: 'center' }}><i>graph.gexf</i></Box>
        </Box>
        <Box pt={2} sx={{ textAlign: 'center' }}>
          <input
            accept=".gexf"
            style={{ display: "none" }}
            id="graph-gexf"
            type="file"
            onChange={handleFileUpload}
          />
          <label htmlFor="graph-gexf">
            <Button
              variant="outlined"
              color="secondary"
              component="span"
              size="small"
              startIcon={<CloudUploadIcon />}
            >
              File
            </Button>
          </label>
          {file && <Typography color='limegreen'>{file.name}</Typography>}
        </Box>
        <Box p={2} sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            color="secondary"
            disabled={!file}
            onClick={handleSubmit}
          >
            Create Graph!
          </Button>
          </Box>
        <Typography variant="caption">
          Note: Top level attributes are ignored but GML files from most applications 
          (e.g. Cytoscape, Gephi, NetworkX) can still be imported without any issues.
        </Typography>
      </DialogContent>
    </Dialog>
  );
}

export default ImportGEXF;