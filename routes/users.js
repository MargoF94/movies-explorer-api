const routerUsers = require('express').Router();
const { getCurrentUser, updateUser } = require('../controllers/users');
const { validateUpdateUser } = require('../middlewares/validators');

routerUsers.get('/users/me', getCurrentUser);
routerUsers.patch('/users/me', validateUpdateUser, updateUser);

module.exports = routerUsers;
