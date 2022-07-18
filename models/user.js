const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
    validate: [isEmail, 'Неправильный формат email.'],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
});

// добавим метод findUserByCredentials схеме пользователя
// у него будет два параметра — почта и пароль
userSchema.statics.findUserByCredentials = function (email, password) {
  // попытаемся найти пользователя по почте
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Юзер с таким email не найден. Пожалуйста зарегистрируйтесь.'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль.'));
          }
          console.log(`In findUserByCredentials: user: ${user}`);
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
