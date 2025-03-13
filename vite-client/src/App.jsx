import "./App.css";
import SuggestionsPage from "./pages/SuggestionsPage.jsx";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./theme.js";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SuggestionsPage />
    </ThemeProvider>
  );
}

export default App;
