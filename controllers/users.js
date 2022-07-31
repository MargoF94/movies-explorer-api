const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user');

const BadRequestError = require('../errors/BadRequestError'); // 400
const UnauthorizedError = require('../errors/UnauthorizedError'); // 401
const NotFoundError = require('../errors/NotFoundError'); // 404
const ConflictError = require('../errors/ConflictError'); // 409

// const { JWT_SECRET = 'super-strong-secret' } = process.env;
const { NODE_ENV, JWT_SECRET } = process.env;

// # возвращает информацию о пользователе (email и имя)
// GET /users/me

module.exports.getCurrentUser = (req, res, next) => {
  console.log(`In middleware getCurrentUser: user _id: ${req.user._id}`);

  // const { authorization } = req.headers;
  // if (!authorization) {
  //   next(new UnauthorizedError('Нет доступа.'));
  // }

  return User.findById(req.user._id)
    .then((user) => {
      console.log(user);
      res.send(user);
    })
    .catch(next);
};

// # обновляет информацию о пользователе (email и имя)
// PATCH /users/me
module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      } else {
        res.send({
          name: user.name,
          _id: user._id,
        });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный id.'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже зарегестрирован.'));
      } else {
        next(err);
      }
    })
    .catch(next);
};

// # создаёт пользователя с переданными в теле
// # email, password и name
// POST /signup
module.exports.createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => res.send({
      name: user.name,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      } else if (err.code === 11000) {
        next(new ConflictError('Введенный email уже зарегестрирован.'));
      } else {
        next(err);
      }
    })
    .catch(next);
};

// # проверяет переданные в теле почту и пароль
// # и возвращает JWT
// POST /signin
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new UnauthorizedError('Пожалуйста, зарегестрируйтесь.'));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const id = user._id;
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'qwsqwsqwsqws-secret',
        { expiresIn: '7d' },
      );
      console.log(`JWT in Login Controller: ${token}`);
      console.log(`user id in Login Controller: ${id}`);
      console.log(`JWT_SECRET in Login Controller: ${JWT_SECRET}`);
      return res.send({ jwt: token, _id: id });
    })
    .catch((err) => {
      console.log(`In User controllers: error: ${err}`);
      next(new UnauthorizedError('Не удалось войти в систему.'));
    })
    .catch(next);
};
