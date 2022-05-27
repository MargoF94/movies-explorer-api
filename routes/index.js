const router = require('express').Router();
const routerUsers = require('./users');
const routerMovies = require('./movies');
const NotFoundError = require('../errors/NotFoundError'); // 404

router.use(routerUsers);
router.use(routerMovies);
router.use('*', () => {
  throw new NotFoundError('Указан неверный путь');
});

module.exports = router;
