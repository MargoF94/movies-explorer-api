const routerUsers = require('express').Router();
const { getCurrentUser, updateUser } = require('../controllers/users');
const { validateUpdateUser } = require('../middlewares/validators');
const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');
const { validateSignUp, validateLogin } = require('../middlewares/validators');

routerUsers.post('/api/signin', validateLogin, login);
routerUsers.post('/api/signup', validateSignUp, createUser);

routerUsers.get('/api/users/me', auth, getCurrentUser);
routerUsers.patch('/api/users/me', auth, validateUpdateUser, updateUser);

module.exports = routerUsers;
