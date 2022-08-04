import {
  useState,
  useEffect,
  useContext } from 'react';
import {
  Button,
  Box,
  Typography,
  CircularProgress,
  createTheme,
  ThemeProvider
  } from '@mui/material';
import { Link } from 'react-router-dom';
import { TokenContext } from '../context/tokencontext';
import axios from 'axios';
import useAxiosJWT from '../hooks/axiosjwt';

const theme = createTheme({
  typography : {
    fontFamily: 'monospace',
    h1: {
      marginTop: 5,
      fontSize: 32,
      color: '#0B0B45',
      '@media (max-width: 900px)' : {
        marginTop: 2,
        fontSize: 26
      },
      '@media (max-width: 480px)' : {
        marginTop: 1,
        fontSize: 19
      },        
    },
    h2: {
      fontSize: 24,
      color: '#0B0B45',
      marginTop: 8,
      textAlign: 'center',
      '@media (max-width: 900px)' : {
        fontSize: 19,
        marginTop: 6
      },
      '@media (max-width: 480px)' : {
        fontSize: 13,
        marginTop: 4
      }, 
  
    },     
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#0B0B45',
          color: '#63b5cf',
          borderRadius: 15,
          '&:hover': {
              backgroundColor: '#63b5cf',
              color: '#0B0B45',
          },
          marginTop: 26,
          width: 283,
          fontSize: 18,
          '@media (max-width: 900px)' : {
            fontSize: 16,
            width: 245,
            marginTop: 22
          },
          '@media (max-width: 480px)' : {
            fontSize: 12,
            width: 176,
            marginTop: 16
          },            
        }
      }
    }  
  }
});

const instance = axios.create({ baseURL: 'https://japanese-culture-quiz.herokuapp.com' });

const Play = () => {
  const [questions, setQuestions] = useState([]); // set of quiz questions
  const [questionIndex, setQuestionIndex] = useState(0); // current question user is on
  const [choices, setChoices] = useState([]); // answer choices of current question user is on
  const [numCorrect, setNumCorrect] = useState(0); // number of questions user currently has correct
  const [isLoading, setIsLoading] = useState(true);
  const { accessToken, setAccessToken } = useContext(TokenContext); // to determine if quiz score should be sent to server
  const axiosJWT = useAxiosJWT(); // an axios instance with interceptors added for jwt handling
  const [resultText, setResultText] = useState(''); // quiz results

  // Fisher-Yates shuffle
  const shuffle = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i+1));
          [array[i], array[j]] = [array[j], array[i]];
      }
  };

  useEffect(() => {
    let isMounted = true;
    // persistent login
    const refresh = async () => {
      try {
        const response = await instance.get('/refresh');
        if (isMounted) {
          setAccessToken(response.data.accessToken);
        }
      } catch (err) {
        console.error(err);
      }
    }
    // get a set of questions from server
    const getQuestions = async () => {
        try {
            const response = await instance.get('/questions');
            setQuestions(response.data);
        } catch (err) {
            alert('Internal Server Error');
        }
        setIsLoading(false);
    }
    refresh();
    getQuestions();
    return () => isMounted = false;
  }, []);

  // shuffle answer choices for current question
  useEffect(() => {
    if(questions.length) {
      let tempChoices = [...questions[questionIndex].incorrectAnswers, questions[questionIndex].correctAnswer];
      shuffle(tempChoices);
      setChoices(tempChoices);
    }      
  }, [questions, questionIndex]);

  const sendScore = async finalScore => {
    try {
      setIsLoading(true);
      const response = await axiosJWT.put('/score', { score: finalScore });
      setResultText(response.data.message);
    } catch (err) {
      setResultText(`Hey guest user, your score is ${finalScore}/12`);
    }
    setIsLoading(false);
  }

  const handleClick = e => {
    // quiz has a total of 12 questions
    if (questionIndex === 11) {
      let finalScore = numCorrect;
      if (e.target.innerText.textContent === questions[questionIndex].correctAnswer) {
        finalScore += 1; // useState hook is asynchronous
      }
      // if user is logged in, send quiz score to server for server 
      // to check if the score is higher than user's current high score
      if(accessToken){
        sendScore(finalScore);
      }
      else {
        setResultText(`Hey guest user, your score is ${finalScore}/12`);
      }
    }
    else {
      if (e.target.textContent === questions[questionIndex].correctAnswer) {
        setNumCorrect(numCorrect + 1);
      }
      // move on to next question
      setQuestionIndex(questionIndex + 1);
    }
  };

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
            </Box>
            )
          : resultText
            ? (<ThemeProvider theme={theme}>
                <Box sx={{
                  display:'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  mt: 7,
                }}>
                  <Typography variant='h2'>{resultText}</Typography>
                  <Button onClick={() => window.location.reload()}>Play Again</Button>
                  <Link style={{textDecoration: 'none'}} to='/'>
                    <Button>Home</Button>
                  </Link>
                </Box>
              </ThemeProvider>)
            : questions.length ? (<ThemeProvider theme={theme}>
                  <Box sx={{
                    display:'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 7,
                  }}>
                    <Typography variant='h1'>
                      Question {questionIndex+1}/12:
                    </Typography>
                    <Typography variant='h2'>
                        {questions[questionIndex].question}
                      </Typography>
                    {choices.map((choice) => (
                      <Button key={questions[questionIndex] + choice} onClick={handleClick}>{choice}</Button>
                    ))}
                  </Box>
              </ThemeProvider>) : (null)
        }
      </>
    );
}
export default Play