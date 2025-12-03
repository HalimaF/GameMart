import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#00ffe7' },
    secondary: { main: '#ff00c8' },
    background: { default: '#111827', paper: '#0b1220' },
    text: { primary: '#e5e7eb', secondary: '#9ca3af' },
  },
  shape: { borderRadius: 10 },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
