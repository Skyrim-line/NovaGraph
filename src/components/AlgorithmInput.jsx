import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Autocomplete, Box, Typography } from '@mui/material';
import { ErasMedium } from './Eras';

const AlgorithmInput = ({ wasmFunction, postState, algorithmName, desc, inputs, nodes, setHoveredAlgorithm, hoveredAlgorithm }) => {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({});

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (name) => (event, newValue) => {
    setValues({ ...values, [name]: newValue ? newValue.id : '' });
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
          <ErasMedium>{algorithmName}</ErasMedium>
        </DialogTitle>
        <DialogContent>
          <Typography variant='body2'>{desc}</Typography>
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
                        fullWidth
                        value={values[input.label]}
                        onChange={handleChange(input.label)}
                        helperText={input.explanation}
                        inputProps={{ step: input.step }}
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
                        onChange={handleChange(input.label)}
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