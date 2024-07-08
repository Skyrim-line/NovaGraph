import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, FormControlLabel, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import React, { useState } from "react";
import { ErasBold, ErasMedium } from "../Eras";

const ImportCSV = ({ open, onClose, module, updateGraph, setLoading }) => {
  const [tableView, setTableView] = useState(false);
  const [nodesFile, setNodesFile] = useState(null);
  const [edgesFile, setEdgesFile] = useState(null);
  const [directed, setDirected] = useState(false);

  const handleFileUpload = (event, setFile) => {
    const file = event.target.files[0];
    if (file && ['text/csv', 'application/vnd.ms-excel'].includes(file.type)) {
      setFile(file)
    } else {
      alert('Please upload a .csv file');
    }
  };

  const handleSubmit = async () => {
    if (!nodesFile || !edgesFile) return;

    setLoading("Loading graph from CSV files...");
    const reader1 = new FileReader();
    const reader2 = new FileReader();
    const nodesFilename = "nodes.csv"
    const edgesFilename = "edges.csv"
    module.FS.unlink(nodesFilename);
    module.FS.unlink(edgesFilename);

    reader1.onload = e => {
      const nodesData = new Uint8Array(e.target.result);

      reader2.onload = e => {
        const edgesData = new Uint8Array(e.target.result);
        
        module.FS.writeFile(nodesFilename, nodesData);
        module.FS.writeFile(edgesFilename, edgesData);
        const startTime = performance.now();
        const response = module.generate_graph_from_csv(nodesFilename, edgesFilename, directed);
        const endTime = performance.now();
        console.log(`Time taken for generate_graph_from_csv: ${endTime - startTime}ms`);
        if (response && response.nodes) updateGraph(response.nodes, response.edges, directed);
        setNodesFile(null);
        setEdgesFile(null);
      }
      reader2.readAsArrayBuffer(edgesFile);
    }
    reader1.readAsArrayBuffer(nodesFile);
  }

  return(
  <Dialog open={open} onClose={onClose} fullWidth>
    <DialogTitle>
        <ErasMedium>Import CSV Files</ErasMedium>
    </DialogTitle>
    <Divider  />
      <DialogContent>
        <Typography>
            Select <code>nodes.csv</code> and <code>edges.csv</code> files from your computer 
            in the format shown in this example:
        </Typography>
          
        <Box pt={2} sx={{ display: 'flex' }} gap={2}>
          <Box sx={{ flex: "1 1 0", width: 0 }}>
            {tableView ? (
              <TableContainer>
                <Table size="small" sx={{ maxWidth: '100px'}}>
                  <TableHead>
                    <TableRow>
                      <TableCell>node</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {["John", "Michael", "Sarah", "Tina"].map((row => (
                      <TableRow
                        key={row}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell>
                          {row}
                        </TableCell>
                      </TableRow>
                    )))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <SyntaxHighlighter style={dracula} language="text">
                {["node", "John", "Michael", "Sarah", "Tina"].join('\n')}
              </SyntaxHighlighter>
            )}
            <Box pt={2} sx={{ textAlign: 'center' }}><i>nodes.csv</i></Box>
          </Box>
          <Box sx={{ flex: "1 1 0", width: 0 }}>
            {tableView ? (
              <TableContainer>
                <Table size="small" sx={{ maxWidth: '250px'}}>
                  <TableHead>
                    <TableRow>
                      <TableCell>source</TableCell>
                      <TableCell>target</TableCell>
                      <TableCell>weight</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      ["John", "Michael", 1],
                      ["John", "Sarah", 1],
                      ["Sarah", "Tina", 2],
                      ["Sarah", "Michael", 2]
                    ].map(((row, i) => (
                      <TableRow
                        key={i}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell>{row[0]}</TableCell>
                        <TableCell>{row[1]}</TableCell>
                        <TableCell>{row[2]}</TableCell>
                      </TableRow>
                    )))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <SyntaxHighlighter style={dracula} language="csv">
                {[
                  "source,target,weight",
                  "John,Michael,1",
                  "John,Sarah,1",
                  "Sarah,Tina,2",
                  "Sarah,Michael,2"
                ].join('\n')}
              </SyntaxHighlighter>
            )}
            <Box pt={2} sx={{ textAlign: 'center' }}><i>edges.csv</i></Box>
          </Box>
        </Box>
          <Box sx={{ textAlign: 'center' }}>
            <FormControlLabel
              control={<Switch checked={tableView} color="info" onChange={() => setTableView(!tableView)} />}
              label="Table View"
            />
          </Box>
          <Box pt={2} sx={{ display: 'flex' }}>
            <Box sx={{ flex: "1 1 0", width: 0, textAlign:'center' }}>
              <input
                accept=".csv"
                style={{ display: "none" }}
                id="nodes-csv"
                type="file"
                onChange={event => handleFileUpload(event, setNodesFile)}
              />
              <label htmlFor="nodes-csv">
                <Button
                  variant="outlined"
                  color="secondary"
                  component="span"
                  size="small"
                  startIcon={<CloudUploadIcon />}
                >
                  Nodes
                </Button>
              </label>
              {nodesFile && <Typography color='limegreen'>{nodesFile.name}</Typography>}
            </Box>
            <Box sx={{ flex: "1 1 0", width: 0, textAlign:'center' }}>
              <input
                accept=".csv"
                style={{ display: "none" }}
                id="edges-csv"
                type="file"
                onChange={event => handleFileUpload(event, setEdgesFile)}
              />
              <label htmlFor="edges-csv">
                <Button
                  variant="outlined"
                  color="secondary"
                  component="span"
                  size="small"
                  startIcon={<CloudUploadIcon />}
                >
                  Edges
                </Button>
              </label>
              {edgesFile && <Typography color='limegreen'>{edgesFile.name}</Typography>}
            </Box>
          </Box>
          <Box p={2} sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
            <Box>
              <FormControlLabel
                control={<Switch checked={directed} color="info" onChange={() => setDirected(!directed)} />}
                label="Directed Graph"
              />
            </Box>
            <Box>
              <Button
                variant="contained"
                color="secondary"
                disabled={!nodesFile || !edgesFile}
                onClick={handleSubmit}
              >
                Create Graph!
              </Button>
            </Box>
          </Box>
          <Divider />
          <Typography variant="caption">
            Note: The "weight" column in <code>edges.csv</code> is OPTIONAL!
            Novagraph assumes the presence of "weight" signifies a <i>weighted</i> graph.<br />
            Note 2: Edges in a directed graph have directions. Edges in an undirected graph are bi-directional.
          </Typography>
      </DialogContent>
    </Dialog>
  )
}

export default ImportCSV;