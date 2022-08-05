import {
  useState, 
  useEffect, 
  useContext } from 'react';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  CircularProgress,
  createTheme,
  ThemeProvider
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom';
import { TokenContext } from '../context/tokencontext';
import axios from 'axios';

const instance = axios.create({ baseURL: 'https://japanese-culture-quiz.herokuapp.com' });

const theme = createTheme({
  palette: {
      primary: {
          main: '#0B0B45',
      },
      secondary: {
          main: '#63b5cf',
      },
  },
  typography: {
    fontFamily: 'monospace',
    h3: {
      fontSize: 40,
      '@media (max-width: 900px)' : {
        fontSize: 29

      },
      '@media (max-width: 480px)' : {
        fontSize: 22

      },
    },
    h4: {
      fontSize: 32,
      '@media (max-width: 900px)' : {
        fontSize: 23
  
      },
      '@media (max-width: 480px)' : {
        fontSize: 15
      } 
    }    
  },
});

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(''); // message to show user if login wasn't successful
  const { accessToken, setAccessToken } = useContext(TokenContext);
  const [isLoading , setIsLoading] = useState(true);
  
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

  useEffect(() => {
    setErrorMsg(''); // erase error message if username or password has changed
  },[username, password])  

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await instance.post('/login', { username, password });
      setAccessToken(response.data.accessToken);
    } catch (err) {
      if(err.response.status === 401){
        setErrorMsg('Incorrect username or password');
      }
      else {
        alert('Login has failed');
      }
    }
    setIsLoading(false);
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
      : accessToken
        ? (<ThemeProvider theme={theme}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              mt: 8,                          
            }}>
              <Typography color='primary.main' variant='h3' align='center'>
                You're logged in!
              </Typography>
              <Link component={RouterLink} to='/' variant='h4' align='center'>
                Let's go back to the home page
              </Link>
            </Box>

        </ThemeProvider>)
        :             
          (<ThemeProvider theme={theme}>
            <Container component='main' maxWidth='xs'>
              <CssBaseline />
              <Box
                sx={{
                  marginTop: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: 'primary.main', color: 'secondary.main' }}>
                </Avatar>
                <Typography color='primary.main' component='h1' variant='h5'>
                  Login
                </Typography>
                <Box component='form' noValidate sx={{ mt: 1 }} onSubmit={handleSubmit}>
                  <TextField
                    margin='normal'
                    required
                    fullWidth
                    id='username'
                    label='Username'
                    name='username'
                    autoComplete='off'
                    autoFocus
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <TextField
                    margin='normal'
                    required
                    fullWidth
                    name='password'
                    label='Password'
                    type='password'
                    id='password'
                    autoComplete='current-password'
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    type='submit'
                    fullWidth
                    variant='contained'
                    sx={{ mt: 3, mb: 2, color: 'secondary.main' }}
                  >
                    Login
                  </Button>
                  <Grid container>
                    <Grid item>
                      <Typography color='red' variant='body2'>{errorMsg}</Typography>
                    </Grid>
                    <Grid item>
                      <Link component={RouterLink} to='/signup' variant='body2'>
                        Don't have an account? Sign Up
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Container>
          </ThemeProvider>)}
    </>
  );
}
export default Login
