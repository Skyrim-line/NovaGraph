import { Paper, Box, Dialog, DialogTitle, Divider, DialogContent, Typography, useTheme } from "@mui/material";
import { ErasMedium } from "./Eras";
import { useState } from "react";
import Carousel from "react-material-ui-carousel";

const images = [
  {
    label: "Label1",
    img: "./logo.png"
  },
  {
    label: "Label2",
    img: "./logo.png"
  }
];

const HelperCarousel = ({ open, handleClose }) => {
  const [activeStep, setActiveStep] = useState(0);

  const handleStepChange = (step) => {
    setActiveStep(step);
  }  

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth='lg'
    >
      <DialogTitle>
        <ErasMedium>Help</ErasMedium>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Paper height={50} sx={{ p: 1 }}>
          <Typography>{images[activeStep].label}</Typography>
        </Paper>
        <Carousel
          animation='slide'
          autoPlay
          duration={500}
          index={activeStep}
          onChange={(index, active) => handleStepChange(index)}
          cycleNavigation
          sx={{
            '.MuiPaper-root': {
              backgroundColor: 'transparent',
              boxShadow: 'none'
            }
          }}
          height='60vh'
        >
          {images.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                height: '60vh'
              }}>
              <Box
                component='img'
                sx={{
                  display: 'block',
                  maxWidth: '100%',
                  overflow: 'hidden',
                }}
                src={item.img}
                alt={item.label}
              />

            </Box>
          ))}
        </Carousel>
      </DialogContent>
    </Dialog>
  );
}

export default HelperCarousel;