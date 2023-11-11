import './App.css';
import APITester from './components/APITester.jsx';
import Map from './components/Map.jsx'
import React from 'react';
import AppBanner from './components/AppBanner.jsx'
import LoginScreen from './components/LoginScreen.jsx'
import RegisterScreen from './components/RegisterScreen.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material';
import ForgetPswdScreen from './components/ForgetPswdScreen.jsx'

const theme = createTheme({
  typography: {
    fontFamily: [
      'Inter',
    ].join(','),
  },
});

const App = () => {
  return (
    <BrowserRouter>
      {/* <AuthContextProvider> */}
      {/* <GlobalStoreContextProvider> */}
      <ThemeProvider theme={theme}>
        <AppBanner />
        <Routes>
          <Route path="/login/" element={<LoginScreen />} />
          <Route path="/register/" element={<RegisterScreen />} />
          <Route path="/forget/" element={<ForgetPswdScreen />} />
        </Routes>
      </ThemeProvider>

      {/* </GlobalStoreContextProvider> */}
      {/* </AuthContextProvider> */}
    </BrowserRouter>
  )
}

export default App;
