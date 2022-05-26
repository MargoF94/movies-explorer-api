const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError'); // 401
require('dotenv').config();

// const { JWT_SECRET = 'super-strong-secret' } = process.env;
const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  // const token = req.headers.authorization;
  if (!authorization) {
    next(new UnauthorizedError('Пожалуйста, сначала авторизуйтесь.'));
  }
  console.log(`Authorization in backend auth: ${authorization}`);
  console.log(`JWT_SECRET in backend auth: ${JWT_SECRET}`);
  // const token = authorization.replace('Bearer ', '');

  // console.log(`Token: ${token}`);

  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(
      authorization,
      NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret',
    );
  } catch (err) {
    // отправим ошибку, если не получилось
    console.log(`In jwt.varify: ${err}`);
    next(new UnauthorizedError('Необходима авторизация.'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
