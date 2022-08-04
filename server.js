const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require('path');
const absPath = path.resolve();
const PORT = process.env.PORT || 3001
const allowList = ['http://localhost:3000'];
require('dotenv').config();

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {useNewUrlParser: true,
    useUnifiedTopology: true});

  } catch (err) {
    console.error(err);
  }
}

dbConnect() // connect to MongoDB 

app.use((req, res, next) => {
  if(allowList.includes(req.headers.origin)) {
    res.header('Access-Control-Allow-Credentials', true);
  }
  next();

})

const corsOptionsDelegate = (req, callback) => {
  let corsOptions;
  if (allowList.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } 
  } else {
    corsOptions = { origin: false } 
  }
  callback(null, corsOptions) 
}

app.use(cors(corsOptionsDelegate)); // enable requests from client

app.use(express.json());

app.use(cookieParser()); 

app.use('/signup', require('./routes/signup'));

app.use('/login', require('./routes/login'));

app.use('/questions', require('./routes/question'));

app.use('/score', require('./routes/score'));

app.use('/rankings', require('./routes/rankings'));

app.use('/refresh', require('./routes/refresh'));

app.use('/logout', require('./routes/logout'));

// for deploying to heroku
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(absPath, '/client/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(absPath, 'client', 'build', 'index.html'))
  );
} 

// error handling
app.use((err, req, res, next) => {
  res.status(500).send(err.message);
})

mongoose.connection.once('open', () => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
  });

});





