import { Paper, Box, Dialog, DialogTitle, Divider, DialogContent, Typography, useTheme } from "@mui/material";
import { ErasBold, ErasMedium } from "./Eras";
import { useState } from "react";
import Carousel from "react-material-ui-carousel";

const images = [
  {
    label: "1. Graph Layout",
    img: "./default-graph.png",
    text: "A default graph consisting of European cities will be displayed initially."
  },
  {
    label: "2. Algorithms",
    img: "./graph-algorithms.png",
    text: "The sidebar on the right contains various graph algorithms that can be applied to the current graph."
  },
  {
    label: "3. Algorithm Results",
    img: "./algorithm-output.png",
    text: "After running an algorithm, the graph will be updated to show the results. Further details can be found underneath the graph."
  },
  {
    label: "4. Moving Nodes",
    img: "./simulation.png",
    text: "Buttons on the left can control the movement of nodes in the graph including fitting all the nodes in the view."
  },
  {
    label: "5. Graph Options",
    img: "./graph-options.png",
    text: "Buttons on the right control the appearance of the graph which can be useful for displaying large graphs."
  },
  {
    label: "6. Import Graph",
    img: "./import.png",
    text: "The Import button allows you to load a graph from a file or generate a random graph."
  },
  {
    label: "7. Export Graph",
    img: "./export.png",
    text: "The Export button allows you to save the results of the current algorithm to a file."
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
        <ErasMedium>How to use Novagraph</ErasMedium>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box sx={{ textAlign: 'center' }} mb={1}>
          <ErasBold>{images[activeStep].label}</ErasBold>
        </Box>
        <Carousel
          animation='slide'
          autoPlay
          duration={500}
          index={activeStep}
          onChange={(index, active) => handleStepChange(index)}
          cycleNavigation
          navButtonsAlwaysVisible
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
        <Box sx={{ textAlign: 'center' }} p={2}>
          <Typography variant='body1' sx={{ mt: 1 }}>
            {images[activeStep].text}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default HelperCarousel;