import "./App.css";
import AppBanner from "./components/AppBanner.jsx";
import LoginScreen from "./components/LoginScreen.jsx";
import RegisterScreen from "./components/RegisterScreen.jsx";
import { BrowserRouter, Route, Routes, Router, Switch, Navigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";
import ForgetPswdScreen from "./components/ForgetPswdScreen.jsx";
import ProfileScreen from "./components/ProfileScreen.jsx";
import BrowsePage from "./components/BrowsePage.jsx";
import MapViewingPage from "./components/MapViewingPage.jsx";
import { useState, useEffect, useContext } from "react";
import { GlobalStoreContextProvider } from "./store";
import { AuthContextProvider } from "./auth";
import AuthContext from "./auth";
import { GlobalStoreContext } from "./store";

// Define your color palette
const colors = {
  primary: {
    100: "#00CED1",
    200: "#00b0b3",
    300: "#006d72",
  },
  accent: {
    100: "#20B2AA",
    200: "#00544f",
  },
  text: {
    100: "#333333",
    200: "#5c5c5c",
  },
  background: {
    100: "#E0FFFF",
    200: "#d6f5f5",
    300: "#aecccc",
  },
};

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary[100],
      light: colors.primary[200],
      dark: colors.primary[300],
    },
    secondary: {
      main: colors.accent[100],
      dark: colors.accent[200],
    },
    text: {
      primary: colors.text[100],
      secondary: colors.text[200],
    },
    background: {
      default: colors.background[100],
      paper: colors.background[200],
      dark: colors.background[300],
    },
  },
  typography: {
    fontFamily: "Inter",
  },
});

const App = () => {
  const auth = useContext(AuthContext);
  const { store } = useContext(GlobalStoreContext);
  const [guest, setGuest] = useState(true);

  useEffect(() => {}, [guest]);

  return (
    <ThemeProvider theme={theme}>
      <AuthContextProvider>
        <GlobalStoreContextProvider>
          <BrowserRouter>
            <AppBanner guest={guest} />
            <Routes>
              <Route
                path="/"
                element={<LoginScreen handleGuest={setGuest} />}
              />
              <Route
                path="/login/"
                element={<LoginScreen handleGuest={setGuest} />}
              />
              <Route path="/register/" element={<RegisterScreen />} />
              <Route path="/forget/" element={<ForgetPswdScreen />} />
              <Route path="/profile/" element={<ProfileScreen />} />
              <Route path="/browsepage/" element={<BrowsePage />} />
              <Route path="/mapview/:id" element={<MapViewingPage />} />
              <Route path="/mapview" element={<Navigate to="/browsepage"/>} />
              <Route path="/*" element={<Navigate to="/browsepage"/>} />
            </Routes>
          </BrowserRouter>
        </GlobalStoreContextProvider>
      </AuthContextProvider>
    </ThemeProvider>
  );
};

export default App;
