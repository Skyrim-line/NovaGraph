import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Autocomplete, Box, Typography, Grid } from '@mui/material';
import { ErasBold } from './Eras';
import ListboxComponent from './Listbox';

const AlgorithmMultiInput = ({ wasmFunction, postState, setLoading, algorithmName, buttonLabel, desc, nodes, setHoveredAlgorithm, hoveredAlgorithm }) => {
  const [open, setOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState([null]);
  const [errors, setErrors] = useState([false]);

  useEffect(() => {
    if (selectedValues.length > 1) {
      handleReset();
    }
  }, [open]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelect = (node, index) => {
    if (selectedValues.includes(node.id)) {
      const newErrors = [...errors];
      newErrors[index] = true;
      setErrors(newErrors);
      return;
    }

    let newValues = [...selectedValues];
    newValues[index] = node.id;
    if (index === selectedValues.length - 1) {
      newValues = [...newValues, null];
    }
    setSelectedValues(newValues);

    if (errors[index]) {
      const newErrors = [...errors];
      newErrors[index] = false;
      setErrors(newErrors);
    }
  };

  const handleReset = () => {
    setSelectedValues([]);
    // yes this needs to be done to completely remove all the values...
    setTimeout(() => {
      setSelectedValues([null]);
    }, 0);
  };

  const handleSubmit = () => {
    setLoading("Running algorithm...");
    handleClose();

    setTimeout(() => {
      const values = selectedValues.slice(0, -1);

      const startTime = performance.now();
      let response;
      try {
        response = wasmFunction(values);
      } catch (e) {
        const endTime = performance.now();
        console.log(`Time taken for ${algorithmName}: ${endTime - startTime}ms`);
        throw e;
      }
      const endTime = performance.now();
      console.log(`Time taken for ${algorithmName}: ${endTime - startTime}ms`);

      postState(response);
    }, 0);
  };

  return (
    <>
      <Button
        size='small'
        onClick={handleClickOpen}
        onMouseEnter={() => setHoveredAlgorithm(hoveredAlgorithm)}
        onMouseLeave={() => setHoveredAlgorithm(null)}
      >
        {buttonLabel ? buttonLabel : algorithmName}
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          <ErasBold>{algorithmName}</ErasBold>
        </DialogTitle>
        <DialogContent>
          {desc.map((line, index) => (
            <Typography key={index} variant='body2' mb={4}>{line}</Typography>
          ))}
          <Grid container spacing={2} mb={2}>
            {selectedValues.map((node, index) => (
              <Grid item xs={6} key={index}>
                <Autocomplete
                  options={nodes}
                  color='info'
                  getOptionLabel={(option) => option.name ? option.name : String(option.id)}
                  fullWidth
                  renderInput={(params) => <TextField {...params} label={`Select Node ${index + 1}`} variant="outlined" color='secondary' error={errors[index]} helperText={errors[index] && 'This node has already been selected'} />}
                  onChange={(event, newValue) => handleSelect(newValue, index)}
                  ListboxComponent={ListboxComponent}
                  autoSelect
                />
              </Grid>
            ))}
          </Grid>
          {selectedValues.length > 1 &&
            <Button onClick={() => handleReset()} color='warning' variant='contained'>Reset</Button>
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="info" variant='contained' disabled={errors.includes(true) || selectedValues.length < 3}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AlgorithmMultiInput;