const routerMovies = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { validateMovieId, validateCreateMovie } = require('../middlewares/validators');

routerMovies.get('/movies', getMovies);
routerMovies.post('/movies', validateCreateMovie, createMovie);
routerMovies.delete('/movies/:movieId', validateMovieId, deleteMovie);

module.exports = routerMovies;
