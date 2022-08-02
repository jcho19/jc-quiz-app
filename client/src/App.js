import { useState, useContext, useEffect } from 'react';
import { TokenContext } from './context/tokencontext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import useAxiosJWT from './hooks/axiosjwt';

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

const instance = axios.create({ baseURL: 'http://localhost:3001', withCredentials: true });

const App = () => {
  const { accessToken, setAccessToken } = useContext(TokenContext); // enables logout feature
  const axiosJWT = useAxiosJWT(); // an axios instance with interceptors added for jwt handling
  const [isLoading, setIsLoading] = useState(true);

  // persistent login 
  useEffect(() => {
    let isMounted = true;
    const refresh = async () => {
      try {
        const response = await instance.get('/refresh'); // gets access token if refresh token hasn't expired
        if (isMounted) {
          setAccessToken(response.data.accessToken);
        }
      } catch (err) {
        console.error(err);
      }
      setIsLoading(false);
    }
    refresh();
    
    return () => isMounted = false;
  }, []);

  const handleLogout = async e => {
    try {
      const response = await axiosJWT.get('/logout');
      setAccessToken('');
    } catch (err) {
      alert('Logout has failed');
    }
  }
  
  return (
    <>
    {isLoading
      ? (<Box sx={{
           display:'flex',
           flexDirection: 'column',
           alignItems: 'center',
           mt: 15,
        }}>
         <CircularProgress />
        </Box>)
    : (<ThemeProvider theme={theme}>
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
          {accessToken 
          ? (<>
              <Button onClick={handleLogout}>Logout</Button>
            </>)
          : (<>
              <Link style={{textDecoration: 'none'}} to='/login'>
              <Button>Login</Button>
              </Link>
              <Link style={{textDecoration: 'none'}} to='/signup'>
              <Button>No account? Sign up</Button>
              </Link>  
            </>)
          }
        </Box>
    </ThemeProvider>)
    }
    </>
  );
}

export default App;

