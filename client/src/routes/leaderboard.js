import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    Typography,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
 } from '@mui/material';
 import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    typography : {
        fontFamily: 'monospace',
        h1: {
          fontSize: 56,
          color: '#0B0B45',
          textAlign: 'center',
          marginTop: 35,
          marginBottom: 22,
          '@media (max-width: 900px)' : {
            fontSize: 49
          },
          '@media (max-width: 480px)' : {
            fontSize: 39
          },        
        },
    },
    components: {
        MuiTableContainer: {
            styleOverrides: {
                root: {
                    margin: 'auto',
                    backgroundColor: '#0B0B45',
                    width: 367,
                    '@media (max-width: 900px)' : {
                        width: 320
                      },
                      '@media (max-width: 480px)' : {
                        width: 255
                      },                     
                }
            }
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    color: '#63b5cf',
                    fontSize: 18,
                    '@media (max-width: 900px)' : {
                        fontSize: 15
                      },
                    '@media (max-width: 480px)' : {
                        fontSize: 11
                    }, 
                },           
            }
        },
      
    }
})

const instance = axios.create({ baseURL: 'http://localhost:3001' });

function Leaderboard() {
    const [users, setUsers] = useState([]); // top 5 users with highest scores
    const [rows, setRows] = useState([]); // rows of leaderboard table
    const [isLoading, setIsLoading] = useState(false);

    function createData(ranking, username, score) {
        return { ranking, username, score }
    }
    // retrieve top 5 scoring users from server and set users to them
    useEffect(() => {
        let isMounted = true;
        const getUsers = async () => {
            try {
                setIsLoading(true);
                const response = await instance.get('/rankings');
                if (isMounted) {
                    setUsers(response.data);
                }
            } catch(err) {
                console.error(err);
            }
            setIsLoading(false);
        }
        getUsers();
        
        return () => isMounted = false;
    }, []);

    useEffect(() => {
        if(users.length){
            let tempRows = [];
            for (let i = 0; i < users.length; i++) {
                tempRows.push(createData(i+1, users[i].username, users[i].highestScore));
            }
            setRows(tempRows);
        }
    }, [users])

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
        : rows.length
            ? (<ThemeProvider theme={theme}>
                    <Typography variant='h1'>Leaderboard</Typography>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                            <TableCell>Rank</TableCell>
                            <TableCell align="center">Username</TableCell>
                            <TableCell align="right">Score</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                            <TableRow
                                key={row.ranking}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 },
                                      height: 60 }}
                            >
                                <TableCell component="th" scope="row">
                                {row.ranking}
                                </TableCell>
                                <TableCell align="center">{row.username}</TableCell>
                                <TableCell align="right">{row.score}</TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </TableContainer>
            </ThemeProvider>)
            : (null)
          }
        </>   

    );
}
export default Leaderboard