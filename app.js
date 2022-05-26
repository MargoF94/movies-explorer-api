require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const limiter = require('./middlewares/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routerUsers = require('./routes/users');
const routerMovies = require('./routes/movies');
const NotFoundError = require('./errors/NotFoundError'); // 404
// const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const { validateSignUp, validateLogin } = require('./middlewares/validators');

const app = express();

const {
  PORT = 3000,
  MONGO_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb',
} = process.env;

app.use(helmet());
app.use(limiter);

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
});

const corsOptions = {
  origin: [
    'https://localhost:3001',
    'http://localhost:3001',
  ],
};

app.use(express.json());

app.use(cors(corsOptions));

app.use(requestLogger);

app.post('/api/signin', validateLogin, login);
app.post('/api/signup', validateSignUp, createUser);

// app.use(auth);

app.use('/api/', routerUsers);
app.use('/api/', routerMovies);
app.use('*', () => {
  throw new NotFoundError('Указан неверный путь');
});

app.use(errorLogger);

app.listen(PORT, () => {
  console.log("I'm working!");
});
