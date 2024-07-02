import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Autocomplete, Box, Typography } from '@mui/material';
import { ErasBold } from './Eras';
import ListboxComponent from './Listbox';

const AlgorithmInput = ({ wasmFunction, postState, setLoading, algorithmName, buttonLabel, desc, inputs, nodes, setHoveredAlgorithm, hoveredAlgorithm }) => {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState(
    inputs.reduce((acc, input) => ({ ...acc, [input.label]: false }), {})
  )

  useEffect(() => {
    inputs.forEach(input => {
      setValues({ ...values, [input.label]: input.defaultValue });
    });
  }, [inputs]);

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
    const hasError = Object.values(values).some(value => value === null);
    if (hasError) {
      setErrors(
        Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: values[key] === null }), {})
      );
      return;
    }
    setLoading("Running algorithm...");
    handleClose();

    setErrors(
      Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: false }), {})
    );

    setTimeout(() => {
      const args = inputs.map(input => values[input.label])

      const startTime = performance.now();
      const response = wasmFunction(...args);
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
                  value={values[input.label]}
                  onChange={handleChange(input.label, input.type)}
                  helperText={input.explanation}
                  inputProps={{
                    step: input.step,
                  }}
                  error={errors[input.label]}
                />
              ) : (
                <Autocomplete
                  key={index}
                  id={input.label}
                  options={nodes}
                  color='info'
                  getOptionLabel={(option) => option.name ? option.name : String(option.id) }                  style={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label={input.label} variant="outlined" color='secondary' />}
                  onChange={handleChange(input.label, input.type)}
                  ListboxComponent={ListboxComponent}
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