import { useState, useEffect } from 'react';
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
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000';

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

const USERNAME_REGEX = /^[[A-z0-9_]{0,16}$/; // username requirements 
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[0-9]).{8,}$/; // password requirements

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validUsername, setValidUsername] = useState(false); // whether username meets requirements
  const [validPassword, setValidPassword] = useState(false); // whether password meets requirements
  const [userCreated, setUserCreated] = useState(false); // whether sign up has succeeded (user has been created)
  const [userTaken, setUserTaken] = useState(''); // whether username is already taken
  const pwdErrorMsg = 'Invalid password. Make sure the password is at least 8 characters including a lowercase letter and a number.' 
  const unErrorMsg = 'Invalid username. Make sure the username is at most 16 characters and only contains alphanumeric characters and underscores.';

  // when the sign up button is clicked
  const handleSubmit = async e => {
    e.preventDefault();

    // if username or password doesn't meet requirements, don't send post request to backend
    if (!USERNAME_REGEX.test(username) || !PASSWORD_REGEX.test(password)){
      return
    }
    
    try{
      const response = await axios.post('/signup', {username, password});
      console.log(response);
      setUserCreated(true);
      setUsername('');
      setPassword('');

    } catch(err) {
      console.log(err);
      if (err.response.status === 500) {
        alert('Internal server error');
      }
      else if (err.response.status === 409){
        setUserTaken(true);
      }
      else {
        alert('Sign up has failed')
      }
      
    }
  }

  // check if username inputted meets requirements
  useEffect(() => {
    setValidUsername(USERNAME_REGEX.test(username));
    setUserTaken(false);

  },[username])

  // check if password inputted meets requirements
  useEffect(() => {
    
    setValidPassword(PASSWORD_REGEX.test(password));

  },[password])

  
  return (
    <>
      {userCreated
        ? (<ThemeProvider theme={theme}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              mt: 8,
       
            }}>
              <Typography color='primary.main' variant='h4'>
                You have succesfully signed up!
              </Typography>
              <Link component={RouterLink} to='/login' variant='h5'>
                Let's login now
              </Link>

            </Box>

        </ThemeProvider>)
        : (<ThemeProvider theme={theme}>
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
                  Sign up
                </Typography>
                <Box component='form' noValidate sx={{ mt: 3 }} onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        name='username'
                        required
                        fullWidth
                        id='username'
                        label='Username'
                        autoComplete='off'
                        onChange={(e) => setUsername(e.target.value)}
                        error={username !== '' && !validUsername}
                        helperText={username !== '' && !validUsername ? unErrorMsg: ''}
                        autoFocus
                      />
                    {userTaken ? <Typography color='red' variant='body2'>This username is already taken</Typography>: null}
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name='password'
                        label='Password'
                        type='password'
                        id='password'
                        autoComplete='new-password'
                        onChange={(e) => setPassword(e.target.value)}
                        error={password !== '' && !validPassword}
                        helperText={password !== '' && !validPassword ? pwdErrorMsg: ''}
                      />
                    </Grid>
                  </Grid>
                  <Button
                    type='submit'
                    fullWidth
                    variant='contained'
                    sx={{ mt: 3, mb: 2, color: 'secondary.main' }}
                  >
                    Sign Up
                  </Button>
                  <Grid container>
                    <Grid item>
                      <Link component={RouterLink} to='/login' variant='body2'>
                        Already have an account? Login
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Container>
          </ThemeProvider>)
      }
    </>

  );
}
export default Signup