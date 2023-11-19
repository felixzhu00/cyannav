import './App.css';
import APITester from './components/APITester.jsx';
import Map from './components/Map.jsx'
import AppBanner from './components/AppBanner.jsx'
import LoginScreen from './components/LoginScreen.jsx'
import RegisterScreen from './components/RegisterScreen.jsx'
import { BrowserRouter, Route, Routes, Router, Switch } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material';
import ForgetPswdScreen from './components/ForgetPswdScreen.jsx'
import ProfileScreen from './components/ProfileScreen.jsx';
import MUIChangeUsernameModal from './components/modals/MUIChangeUsernameModal.jsx';
import MUIChangeEmailModal from './components/modals/MUIChangeEmailModal.jsx';
import MUIChangePasswordModal from './components/modals/MUIChangePasswordModal.jsx';
import MUIDeleteAccountModal from './components/modals/MUIDeleteAccountModal.jsx';
import MUICreateMapModal from './components/modals/MUICreateMapModal.jsx'
import MUIDeleteMapModal from './components/modals/MUIDeleteMapModal.jsx';
import MUIPublishMapModal from './components/modals/MUIPublishMapModal.jsx';
import MUIAddFieldModal from './components/modals/MUIAddFieldModal.jsx';
import MUIExportMapModal from './components/modals/MUIExportMapModal.jsx';
import MUICommentModal from './components/modals/MUICommentModal.jsx';
import MUIAddTagModal from './components/modals/MUIAddTagModal.jsx';
import AppBannerwithRouter from './components/AppBanner.jsx';
import BrowsePage from './components/BrowsePage.jsx';
import MapViewingPage from './components/MapViewingPage.jsx';
import React, { useState, useRef, useEffect } from 'react';
import { useState, useRef, useEffect } from 'react';
import { GlobalStoreContextProvider } from './store'
import { AuthContextProvider } from './auth';

// Define your color palette
const colors = {
  primary: {
    100: '#00CED1',
    200: '#00b0b3',
    300: '#006d72',
  },
  accent: {
    100: '#20B2AA',
    200: '#00544f',
  },
  text: {
    100: '#333333',
    200: '#5c5c5c',
  },
  background: {
    100: '#E0FFFF',
    200: '#d6f5f5',
    300: '#aecccc',
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
    fontFamily: 'Inter',
  },
});

const App = () => {

  const [guest, setGuest] = useState(true);

  useEffect(() => {
  }, [guest]);

  return (
    <AuthContextProvider>
    <GlobalStoreContextProvider>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <AppBanner guest={guest} />
        <Routes>
          <Route path="/" element={<LoginScreen handleGuest={setGuest} />} />
          <Route path="/login/" element={<LoginScreen handleGuest={setGuest} />} />
          <Route path="/register/" element={<RegisterScreen />} />
          <Route path="/forget/" element={<ForgetPswdScreen />} />
          <Route path="/profile/" element={<ProfileScreen />} />
          <Route path="/browsepage/" element={<BrowsePage />} />
          <Route path="/mapview/" element={<MapViewingPage />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
    </GlobalStoreContextProvider>
    </AuthContextProvider>
  );
}

// const App = () => {



// return (
//   <BrowserRouter>
{/* <AuthContextProvider> */ }
{/* <GlobalStoreContextProvider> */ }
// <ThemeProvider theme={theme}>


{/* <ProfileScreen /> */ }
{/* <MUIChangeUsernameModal /> */ }
{/* <MUIChangeEmailModal /> */ }
{/* <MUIChangePasswordModal /> */ }
{/* <MUIDeleteAccountModal /> */ }
{/* <MUICreateMapModal /> */ }
{/* <MUIDeleteMapModal /> */ }
{/* <MUIPublishMapModal /> */ }
{/* <MUIAddFieldModal /> */ }
{/* <MUIExportMapModal /> */ }
{/* <MUICommentModal /> */ }
{/* <MUIAddTagModal /> */ }


//   <Routes>
//   <AppBanner />
//   <Route path="/" element={<LoginScreen />} />
//     <Route path="/login/" element={<LoginScreen />} />
//     <Route path="/register/" element={<RegisterScreen />} />
//     <Route path="/forget/" element={<ForgetPswdScreen />} />
//   </Routes>
// </ThemeProvider>

{/* </GlobalStoreContextProvider> */ }
{/* </AuthContextProvider> */ }
//     </BrowserRouter>
//   )
// }

export default App;
