import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Autocomplete, Box, Typography } from '@mui/material';
import { ErasBold, ErasMedium } from './Eras';

const AlgorithmInput = ({ wasmFunction, postState, algorithmName, desc, inputs, nodes, setHoveredAlgorithm, hoveredAlgorithm }) => {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({});

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (name, type) => (event, newValue) => {
    if (type === 'number') {
      const v = event.target.value === '' ? null : +event.target.value;
      setValues({ ...values, [name]: v });
    } else {
      setValues({ ...values, [name]: newValue ? newValue.id : null });
    }
  };

  const handleSubmit = () => {
    const args = inputs.map(input => values[input.label])
    const response = wasmFunction(...args);
    postState(response);
    handleClose();
  };

  return (
    <>
      <Button 
        size='small'
        onClick={handleClickOpen}
        onMouseEnter={() => setHoveredAlgorithm(hoveredAlgorithm)}
        onMouseLeave={() => setHoveredAlgorithm(null)}
      >
        {algorithmName}
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          <ErasBold>{algorithmName}</ErasBold>
        </DialogTitle>
        <DialogContent>
          {desc.map((line, index) => (
            <Typography key={index} variant='body2' mb={2}>{line}</Typography>
          ))}
          {inputs.map((input, index) => (
            <Box key={index} mt={2}>
              {input.type === 'number' ? (
                <TextField
                  key={index}
                  autoFocus={index === 0}
                  margin="dense"
                  id={input.label}
                  label={input.label}
                  color='secondary'
                  type={input.type}
                  defaultValue={input.defaultValue}
                  onChange={handleChange(input.label, input.type)}
                  helperText={input.explanation}
                  inputProps={{
                    step: input.step,
                  }}
                />
              ) : (
                <Autocomplete
                  key={index}
                  id={input.label}
                  options={nodes}
                  color='info'
                  getOptionLabel={(option) => option.name}
                  style={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label={input.label} variant="outlined" color='secondary' />}
                  onChange={handleChange(input.label, input.type)}
                  autoSelect
                />
              )}
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="info" variant='contained'>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AlgorithmInput;