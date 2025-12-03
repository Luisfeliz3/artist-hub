import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8A2BE2', // Vibrant purple
      light: '#9D4EDD',
      dark: '#7B1FA2',
    },
    secondary: {
      main: '#00D4FF', // Cyan
      light: '#33DDFF',
      dark: '#0099CC',
    },
    background: {
      default: '#0A0A0F',
      paper: '#141420',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0D0',
    },
    error: {
      main: '#FF4D4D',
    },
    success: {
      main: '#00CC88',
    },
    warning: {
      main: '#FFAA00',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '3.5rem',
      background: 'linear-gradient(45deg, #8A2BE2, #00D4FF)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #8A2BE2 30%, #00D4FF 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #7B1FA2 30%, #0099CC 90%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          background: 'linear-gradient(145deg, #1A1A2E 0%, #16213E 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default theme;