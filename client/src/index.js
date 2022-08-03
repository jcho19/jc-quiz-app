import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import App from './App';
import Play from './routes/play';
import Leaderboard from './routes/leaderboard';
import Login from './routes/login';
import Signup from './routes/signup';
import { TokenProvider } from './context/tokencontext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <TokenProvider>
    <Routes>
      <Route path='/' element={<App />} />
      <Route path='play' element={<Play />} />
      <Route path='leaderboard' element={<Leaderboard />} />
      <Route path='login' element={<Login />} />
      <Route path='signup' element={<Signup />} />
    </Routes>
    </TokenProvider>
  </BrowserRouter>
);


