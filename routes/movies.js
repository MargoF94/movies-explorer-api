const routerMovies = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { validateMovieId, validateCreateMovie } = require('../middlewares/validators');
const auth = require('../middlewares/auth');

routerMovies.get('/api/movies', auth, getMovies);
routerMovies.post('/api/movies', auth, validateCreateMovie, createMovie);
routerMovies.delete('/api/movies/:movieId', auth, validateMovieId, deleteMovie);

module.exports = routerMovies;
