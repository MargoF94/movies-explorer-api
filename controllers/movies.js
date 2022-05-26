const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError'); // 400
const ForbiddenError = require('../errors/ForbiddenError'); // 403
const NotFoundError = require('../errors/NotFoundError'); // 404

// # возвращает все сохранённые текущим  пользователем фильмы
// GET /movies
module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      res.status(200).send({ data: movies });
    })
    .catch(next);
};

// # создаёт фильм с переданными в теле
// POST /movies
module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => {
      res.send({
        country: movie.country,
        director: movie.director,
        duration: movie.duration,
        year: movie.year,
        description: movie.description,
        image: movie.image,
        trailerLink: movie.trailerLink,
        nameRU: movie.nameRU,
        nameEN: movie.nameEN,
        thumbnail: movie.thumbnail,
        movieId: movie._id,
        owner: movie.owner,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        console.log(err);
        next(new BadRequestError('Переданы некорректные данные при создании фильма.'));
      } else {
        next(err);
      }
    })
    .catch(next);
};

// # удаляет сохранённый фильм по id
// DELETE /movies/_id
module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        next(new NotFoundError('Передан несуществующий _id фильма.'));
      } else {
        if (!movie.owner._id.equals(req.user._id)) {
          next(new ForbiddenError('Вы не можете удлить чужой фильм.'));
          return;
        }
        movie.remove()
          .then(() => {
            res.send({ message: 'Фильм успешно удален' });
          });
      }
    })
    .catch(next);
};
