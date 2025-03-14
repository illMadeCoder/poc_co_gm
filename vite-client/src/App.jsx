import "./App.css";
import SuggestionsPage from "./pages/SuggestionsPage.jsx";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./theme.js";
import { SocketProvider } from "./providers/SocketProvider.jsx";
import { SuggestionsProvider } from "./providers/SuggestionsProvider.jsx";

function App() {
  return (
    <SocketProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SuggestionsProvider>
          <SuggestionsPage />
        </SuggestionsProvider>
      </ThemeProvider>
    </SocketProvider>
  );
}

export default App;
