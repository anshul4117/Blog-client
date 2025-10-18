// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx"
// import { ThemeProvider } from "./components/ui";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>

    <BrowserRouter>
      <AuthProvider>
        {/* <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme"> */}
          <App />
        {/* </ThemeProvider> */}
      </AuthProvider>
    </BrowserRouter>

  </React.StrictMode>
);
