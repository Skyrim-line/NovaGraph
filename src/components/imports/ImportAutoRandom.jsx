import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, FormControlLabel, Switch, TextField, Typography } from "@mui/material";
import React, { useState } from 'react';
import { ErasMedium } from "../Eras";

const ImportAutoRandom = ({ open, onClose, module, updateGraph, setLoading }) => {
  const [n, setN] = useState('');
  const [p, setP] = useState('');
  const [directed, setDirected] = useState(false);
  const [error, setError] = useState({ n: '', p: '' });

  const validateInput = () => {
    let nError = '';
    let pError = '';

    if (!n || n <= 0) {
      nError = 'Number of nodes must be greater than 0';
    } else if (!Number.isInteger(Number(n))) {
      nError = 'Number of nodes must be an integer';
    }

    if (!p || p < 0 || p > 1) {
      pError = 'Probability must be between 0 and 1';
    } else if (isNaN(p)) {
      pError = 'Probability must be a number';
    }

    if (nError || pError) {
      setError({ n: nError, p: pError });
      return false;
    }

    return true;
  };


  const handleSubmit = async () => {
    if (!validateInput()) return;
    
    setLoading(true);
    const response = module.generate_graph_from_n_nodes(n, p, directed);
    if (response && response.nodes) updateGraph(response.nodes, response.edges, response.directed);
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        <ErasMedium>Generate Random Graph</ErasMedium>
      </DialogTitle>
      <Divider  />
      <DialogContent>
        <Typography>
          This function will generate a random graph based on the Erdős-Rényi model. 
          Enter the number of nodes and a probability value between 0 and 1 to generate a graph. 
          The probability value represents the likelihood of an edge existing between two nodes.
        </Typography>
        <Box pt={2} fontSize="12px" sx={{ display: 'flex', textAlign: 'center', gap: 3 }}>
          {/* MUI Form (n must be > 0 and 0 <= p <= 1)  */}
          <TextField
            label="Number of Nodes (n)"
            variant="standard"
            value={n}
            onChange={(e) => setN(e.target.value)}
            error={!!error.n}
            helperText={error.n}
          />
          <TextField
            label="Probability (p)"
            variant="standard"
            value={p}
            onChange={(e) => setP(e.target.value)}
            error={!!error.p}
            helperText={error.p}
          />
        </Box>
        <Box p={2} sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <FormControlLabel
                control={<Switch checked={directed} color="info" onChange={() => setDirected(!directed)} />}
                label="Directed Graph"
              />
            </Box>
          <Button
            variant="contained"
            color="secondary"
            disabled={!n || !p}
            onClick={handleSubmit}
          >
            Create Graph!
          </Button>
          </Box>
        <Typography variant="caption">
          Note: Entering an extremely large value for nodes will result in a very large graph which will cause the application to run slower.
        </Typography>
      </DialogContent>
    </Dialog>
  );
}

export default ImportAutoRandom;