import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, Typography } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import React, { useState } from 'react';

const ImportGML = ({ open, onClose, module, updateGraph }) => {
  const [file, setFile] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.gml')) {
        setFile(file);
    } else {
        alert('Please upload a .gml file');
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    const reader = new FileReader();
    const filename = "graph.gml";
    module.FS.unlink(filename);

    reader.onload = e => {
      const data = new Uint8Array(e.target.result);
      module.FS.writeFile(filename, data);
      const response = module.generate_graph_from_gml(filename);
      if (response && response.nodes) updateGraph(response.nodes, response.edges, response.directed);
      setFile(null);
    }
    reader.readAsArrayBuffer(file);
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        <Typography>Import Graph Modelling Language (GML) File</Typography>
      </DialogTitle>
      <Divider  />
      <DialogContent>
        <Typography>
          Select a GML file from your computer in the format shown in this example:
        </Typography>
        <Box pt={1} fontSize="12px">
          <SyntaxHighlighter style={dracula} language="c">
{`graph
[
  directed 0
  node
  [
    id 0
    label "Romeo"
  ]
  node
  [
    id 1
    label "Juliet"
  ]
  edge
  [
    source 0
    target 1
  ]
]`}

          </SyntaxHighlighter>
          <Box sx={{ textAlign: 'center' }}><i>graph.gml</i></Box>
        </Box>
        <Box pt={2} sx={{ textAlign: 'center' }}>
          <input
            accept=".gml"
            style={{ display: "none" }}
            id="graph-gml"
            type="file"
            onChange={handleFileUpload}
          />
          <label htmlFor="graph-gml">
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

export default ImportGML;