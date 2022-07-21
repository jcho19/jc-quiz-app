import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const theme = createTheme({
  typography : {
    fontFamily: 'monospace',     
    h1: {
      fontSize: 48,
      color: '#0B0B45',
      '@media (max-width: 900px)' : {
        fontSize: 38

      },
      '@media (max-width: 700px)' : {
        fontSize: 22

      },        
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#0B0B45',
          color: '#63b5cf',
          marginTop: 35,
          width: 391,
          fontSize: 27,
          '@media (max-width: 900px)' : {
            fontSize: 21,
            width: 310
    
          },
          '@media (max-width: 700px)' : {
            fontSize: 12,
            width: 179
    
          },
          
        }
      }
    }
  }
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: 7,
       
      }}>
        <Typography variant='h1'
       >
          Japanese Culture Quiz
        </Typography>
        <Link style={{textDecoration: 'none'}} to='/play'>
        <Button>Play</Button>
        </Link> 
        <Link style={{textDecoration: 'none'}} to='/leaderboard'>
        <Button>Leaderboard</Button>
        </Link>        
        <Link style={{textDecoration: 'none'}} to='/login'>
        <Button>Login</Button>
        </Link>
        <Link style={{textDecoration: 'none'}} to='/signup'>
        <Button>No account? Sign up</Button>
        </Link>        
      
      
      </Box>
    </ThemeProvider>
   
    
  );
}

export default App;
