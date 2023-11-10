import './App.css';
import APITester from './components/APITester.jsx';
import Map from './components/Map.jsx'
import React from 'react';
import AppBanner from './components/AppBanner.jsx'
import LoginScreen from './components/LoginScreen.jsx'
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
  typography: {
    fontFamily: [
      'Inter',
    ].join(','),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LoginScreen />

    </ThemeProvider>
  );
}

export default App;
