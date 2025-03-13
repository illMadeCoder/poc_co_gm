import {createTheme} from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      light: "#abeded",
      main: "#57dbdb",
      dark: "#24a8a8",
      contrastText: "#041515",
    },
    background: {
      // default: darken("#012020", 0.3),
      default: "#0d2020",
      paper: "rgb(30, 30, 30)",
      // paper: darken("#272b2b", 0.5),
    }
  },
  typography: {
    h5: {
      // fontFamily: "Work Sans"
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: (theme) => theme.palette.background.default,
          backgroundImage: `linear-gradient(135deg, #112a2a 10%, #091717 75%, #060f0f)`,
        },
      },
    },
  }
});