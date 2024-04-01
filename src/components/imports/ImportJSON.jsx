import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, Typography } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import React, { useState } from 'react';
import { ErasMedium } from "../Eras";

const ImportJSON = ({ open, onClose, module, updateGraph }) => {
  const [file, setFile] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
      setFile(file);
    } else {
      alert(`Please upload a .json file (${file && file.type})`);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    const reader = new FileReader();
    const filename = "graph.json";
    module.FS.unlink(filename);

    reader.onload = e => {
      const data = new Uint8Array(e.target.result);
      module.FS.writeFile(filename, data);
      const response = module.generate_graph_from_json(filename);
      if (response && response.nodes) updateGraph(response.nodes, response.edges, response.directed);
      setFile(null);
    }
    reader.readAsArrayBuffer(file);
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        <ErasMedium>Import JSON File</ErasMedium>
      </DialogTitle>
      <Divider  />
      <DialogContent>
        <Typography>
          Select a JSON file from your computer in the format shown in this example:
        </Typography>
        <Box pt={1}>
          <Box fontSize="12px">
            <SyntaxHighlighter language="json" style={dracula}>
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
            </SyntaxHighlighter>
          </Box>
          <Box sx={{ textAlign: 'center' }}><i>graph.json</i></Box>
        </Box>
        <Box p={2} sx={{ textAlign: 'center' }}>
          <input
            accept=".json"
            style={{ display: "none" }}
            id="graph-json"
            type="file"
            onChange={handleFileUpload}
          />
          <label htmlFor="graph-json">
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

export default ImportJSON;