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
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const { validateSignUp, validateLogin } = require('./middlewares/validators');

const app = express();

const { NODE_ENV, PORT, MONGO_URL } = process.env;

app.use(helmet());
app.use(limiter);

mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : 'mongodb://127.0.0.1:27017/bitfilmsdb', {
  useNewUrlParser: true,
});

const corsOptions = {
  origin: [
    'https://localhost:3001',
    'http://localhost:3001',
    'http://yourlocalmovieexplorer.nomoredomains.xyz',
    'https://yourlocalmovieexplorer.nomoredomains.xyz',
  ],
};

app.use(express.json());

app.use(cors(corsOptions));

app.use(requestLogger);

app.post('/api/signin', validateLogin, login);
app.post('/api/signup', validateSignUp, createUser);

// app.use(auth);

app.use('/api/', auth, routerUsers);
app.use('/api/', auth, routerMovies);
app.use('*', () => {
  throw new NotFoundError('Указан неверный путь');
});

app.use(errorLogger);

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(NODE_ENV === 'production' ? PORT : 3000, () => {
  console.log("I'm working!");
});
