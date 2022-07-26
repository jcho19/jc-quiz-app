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
} from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import { TokenContext } from '../context/tokencontext';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3001';

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
    h4: {
      '@media (max-width: 900px)' : {
        fontSize: 24

      },
      '@media (max-width: 700px)' : {
        fontSize: 16

      },
    },
    h5: {
      '@media (max-width: 900px)' : {
        fontSize: 20
  
      },
      '@media (max-width: 700px)' : {
        fontSize: 14
  
      }, 

    },    
  },
});

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { setAccessToken } = useContext(TokenContext);
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.post('/login', { username, password }, { withCredentials: true });
      console.log(response);
      setLoggedIn(true);
      setAccessToken(response.data.accessToken);
  
    } catch (err) {
      console.log(err);
      if(err.response.status === 401){
        setErrorMsg('Incorrect username or password');
      }
      else {
        alert('Login has failed');
      }
    }
  
  }
  useEffect(() => {
    setErrorMsg('');
  },[username, password])

  return (
    <>
    {loggedIn
      ? (<ThemeProvider theme={theme}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 8,                          
          }}>
            <Typography color='primary.main' variant='h4'>
              You have succesfully logged in!
            </Typography>
            <Link component={RouterLink} to='/' variant='h5'>
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
