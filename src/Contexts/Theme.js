import { createTheme } from '@mui/material/styles'

const Theme = createTheme({
    palette: {
      primary:{
          main: "#502cec",
      },
      temp: {
        main: "#fff"
      }
    },
    typography:{
      fontFamily: "Readex Pro"
    }
});

export default Theme