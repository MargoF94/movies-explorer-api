const routerMovies = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { validateMovieId, validateCreateMovie } = require('../middlewares/validators');

routerMovies.get('/api/movies', getMovies);
routerMovies.post('/api/movies', validateCreateMovie, createMovie);
routerMovies.delete('/api/movies/:movieId', validateMovieId, deleteMovie);

module.exports = routerMovies;
