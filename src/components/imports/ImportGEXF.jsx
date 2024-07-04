import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, Typography } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import React, { useState } from 'react';
import { ErasMedium } from "../Eras";

const ImportGEXF = ({ open, onClose, module, updateGraph, setLoading }) => {
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

    setLoading("Loading graph from GEXF file...");
    const reader = new FileReader();
    const filename = "graph.gexf";
    module.FS.unlink(filename);

    reader.onload = e => {
      const data = new Uint8Array(e.target.result);
      module.FS.writeFile(filename, data);
      const startTime = performance.now();
      const response = module.generate_graph_from_gexf(filename);
      const endTime = performance.now();
      console.log(`Time taken for generate_graph_from_gexf: ${endTime - startTime}ms`);
      if (response && response.nodes) updateGraph(response.nodes, response.edges, response.directed);
      setFile(null);
    }
    reader.readAsArrayBuffer(file);
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        <ErasMedium>Import Graph Exchange XML Format (GEXF) File</ErasMedium>
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
    <graph mode="static" defaultedgetype="directed">
        <nodes>
            <node id="0" label="CEO" />
            <node id="1" label="Board of Directors" />
            <node id="2" label="IT Director" />
            <node id="3" label="HR Director" />
            <node id="4" label="Team Leader" />
            <node id="5" label="Intern" />
        </nodes>
        <edges>
            <edge id="0" source="0" target="1" />
            <edge id="1" source="1" target="2" />
            <edge id="2" source="1" target="3" />
            <edge id="3" source="2" target="4" />
            <edge id="4" source="4" target="5" />
        </edges>
    </graph>
</gexf>`}

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
          Note: Meta tags can be included but will be ignored, allowing GEXF from most applications 
          (e.g. Gephi, NetworkX) to be imported without any issues.
        </Typography>
      </DialogContent>
    </Dialog>
  );
}

export default ImportGEXF;