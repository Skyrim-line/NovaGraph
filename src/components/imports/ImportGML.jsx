import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, Typography } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
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
    if (file) {
      const reader = new FileReader();
      const filename = "graph.gml";
      module.FS.unlink(filename);
      reader.onload = e => {
        const data = new Uint8Array(e.target.result);
        module.FS.writeFile(filename, data);
        const response = module.generate_graph_from_gml(filename);
        if (response && response.nodes) updateGraph(response.nodes, response.edges, response.directed);
      }
      reader.readAsArrayBuffer(file);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        <Typography>Import GML File</Typography>
      </DialogTitle>
      <Divider  />
      <DialogContent>
        <Typography>
          Select a GML file from your computer in the format shown in this example:
        </Typography>
        <Box pt={1}>
          <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
{`{
  "nodes": ["Elizabeth", "Charles", "Camilla", "William", "Andrew", "Harry"],
  "edges": [
    {"source": "Elizabeth", "target": "Charles", "weight": 1},
    {"source": "Charles", "target": "Camilla", "weight": 2},
    {"source": "Charles", "target": "William", "weight": 3},
    {"source": "Charles", "target": "Harry", "weight": 4},
    {"source": "Elizabeth", "target": "Andrew", "weight": 5}
  ],
  "directed": false
}`}
          </pre>
          <Box sx={{ textAlign: 'center' }}><i>graph.json</i></Box>
        </Box>
        <Box p={2} sx={{ textAlign: 'center' }}>
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
        <Typography variant="body2">
          You can also use "vertices" instead of "nodes" and "links" instead of "edges".
        </Typography>
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
          Note: The "weight" field in <i>"edges"</i> is OPTIONAL!
          Novagraph assumes the presence of "weight" signifies a <i>weighted</i> graph.
        </Typography>
      </DialogContent>
    </Dialog>
  );
}

export default ImportGML;