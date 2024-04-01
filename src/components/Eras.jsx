import { Typography } from "@mui/material";
import { styled } from '@mui/material/styles';

export const ErasMedium = styled((props) => (
    <Typography {...props} />
  ))(({ theme, fontSize }) => ({
    fontFamily: '"ITC Eras Book", sans-serif',
    fontSize: fontSize || '1.25rem',
}));

export const ErasBold = styled((props) => (
    <Typography {...props} />
  ))(({ theme, fontSize }) => ({
    fontFamily: '"ITC Eras Demi", sans-serif',
    fontSize: fontSize || '1.25rem',
}));
