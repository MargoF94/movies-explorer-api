const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError'); // 400
const ForbiddenError = require('../errors/ForbiddenError'); // 403
const NotFoundError = require('../errors/NotFoundError'); // 404

// # возвращает все сохранённые текущим  пользователем фильмы
// GET /movies
module.exports.getMovies = (req, res, next) => {
  console.log('AAAAAAA');
  Movie.find({})
    .then((movies) => {
      res.status(200).send(movies);
    })
    .catch(next);
};

// # создаёт фильм с переданными в теле
// POST /movies
module.exports.createMovie = (req, res, next) => {
  console.log('HELP');
  console.log('HELP');
  console.log(`Owner: ${req.user}`);
  console.log('HELP');
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  // console.log(`Owner: ${owner}`);

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
      console.log(`In sendind movie: ${movie}`);
      res.send({ movie });
    })
    .catch((err) => {
      console.dir(`ERROR ON SERVER${err}`);
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании фильма.'));
      } else {
        console.log('IM STUK');
        next(err);
      }
    })
    .catch(next);
};

// # удаляет сохранённый фильм по id
// DELETE /movies/_id
module.exports.deleteMovie = (req, res, next) => {
  const id = req.params.movieId;
  Movie.findOne({ movieId: id })
    .then((movie) => {
      if (movie) {
      // if (movie.owner.toString().equals(req.user._id.toString())) {
        movie.remove()
          .then(() => {
            res.send({ message: 'Фильм успешно удален' });
          });
      } else {
        throw ForbiddenError('Вы не можете удлить чужой фильм.');
      }
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        next(new NotFoundError('Передан несуществующий _id фильма.'));
      } else {
        next(err);
      }
    })
    .catch(next);
};
